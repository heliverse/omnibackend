
const bcrypt = require("bcrypt")

const { generateAccessToken, sendEmail, sendEmailForgotpassword } = require("../config/main")
const { Users, Transaction } = require("../model/model");
const { getToken, decodeToken, AVERAGETIME } = require("../config/main");
function generateOTP() {
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
const Registration = async (req, res) => {

  try {
    const otp = generateOTP()
    const data = new Users({ ...req.body, otp, status: false })
    Users.findByEmail(data.email, async function (err, result) {
      if (err) { res.json({ message: err, status: false }) }
      else {
        if (result.length > 0 && result[0].status == true) { return res.json({ message: "user already exist", status: false }) }
        if (result.length > 0 && result[0].status == false) await Users.delete(data.email)
        Users.create(data, function (err, result) {
          if (err) { return res.send({ message: err, status: false }) }
          sendEmail(data.email, otp, result.rows[0])
          res.json({ message: "user registration successfull", status: true })
        })
      }

    })

  } catch (error) {

    res.json({ message: error, status: false })
  }
}
const Login = async (req, res) => {
  try {
    const { email, password } = req.body
    Users.findByEmail(email, async function (err, result) {
      if (err) {
        res.json({ message: "bad reruest", status: false })
      }
      else {
        if (result.length > 0) {
          if (result[0].status == false) return res.json({ message: "Please verify your email.", status: false })
          const match = await bcrypt.compare(password, result[0].password)
          if (match) {
            const accessToken = await generateAccessToken({ userId: result[0].id, email: result[0].email, password: result[0].password })
            res.json({ message: "login successfully done", status: true, token: accessToken, id: result[0].id })
          }
          else {
            res.json({ message: "pass not match", status: false })
          }
        }
        else {
          res.status(400).json({ message: "invalid email", status: false })
        }
      }
    })
  } catch (error) {
    res.json({ message: error, status: false })
  }

}
const transaction = async (req, res) => {
  try {
    const token = await getToken(req)
    const TokenData = decodeToken(token)
    // console.log(TokenData.user.userId)
    if (TokenData) {
      Transaction.findByUserId(TokenData.user.userId, async function (err, result) {
        if (err) {
          res.json({ message: err, status: false })
        }
        else {
          res.send({ data: result, status: true })

        }
      })
    }

  } catch (error) {

  }

}
const createTransaction = async (req, res) => {

  try {
    const data = await new Transaction(req.body)
    const token = await getToken(req)
    const TokenData = decodeToken(token)
    data.user = TokenData.user.userId
    Transaction.add(data, function (err, result) {
      if (err) { res.send({ message: err, status: false }) }
      else {
        if (result.command == "INSERT") {

          Users.findByUserId(TokenData.user.userId, async function (err, RESULT) {
            if (RESULT.length) {

              AVERAGETIME({ oldTime: RESULT[0].average_time, oldInterest: RESULT[0].interest, oldBalance: RESULT[0].balance, newBalance: data.amount, status: data.status, id: RESULT[0].id }, async (err, result) => {
                if (result.error) {
                  res.json({ message: result.error, status: false })
                }
                else {
                  Users.update(result, async function (err, result) {

                    if (result.command == "UPDATE") {
                      res.send({ message: "transaction successfully done", status: true })
                    }
                    else {
                      res.send({ message: "transaction successfully not done", status: true })
                    }
                  })
                }

              })
            }
          })
        }
      }

    })



    // Transaction.add(data, function (err, result) {
    //   if (err) { res.send({ message: err, status: false }) }
    //   else {
    //     if (result.command == "INSERT") {
    //       Users.findByEmail(TokenData.user.email, async function (err, RESULT) {
    //         if (RESULT.length) {
    //           Transaction.findByUserId(TokenData.user.userId, async (err, result) => {
    //             if (result.length) {
    //               const LastTransactionData = result[result.length - 1]

    // AVERAGETIME({ oldTime: RESULT[0].average_time, newTime: LastTransactionData.created, oldBalance: RESULT[0].balance, newBalance: LastTransactionData.amount, status: LastTransactionData.status, id: RESULT[0].id }, async (err, result) => {

    //                 if (err) {
    //                   res.json({ message: err, status: false })

    //                 }
    //                 else {
    //                   // res.json({message:"successfully done",status:true})
    //                 }


    //               })

    //             }
    //           })


    //           // console.log(data.status)
    //           // switch (data.status) {

    //           //   case "deposit": {
    //           //     Transaction.findByUserId(TokenData.user.userId, async function (err, result) {
    //           //       if (result.length) {
    //           //         const lastTransactionData = result[result.length - 1]
    //           //      
    //           //           Users.update(result, async function (err,result) {
    //           //             if (err){
    //           //               res.json({ message: "server error",status:false })
    //           //             }
    //           //             else {
    //           //               res.json({ message: "transaction successfully done",status:true })
    //           //             }
    //           //           })
    //           //         })
    //           //       }
    //           //     })
    //           //     break;
    //           //   }
    //           //   case "WITHDRAW": {
    //           //     if (RESULT[0].balance === 0) {
    //           //       res.json({ message: "you have no balance",status:false  })
    //           //     }
    //           //     else {

    //           //       Transaction.findByUserId(TokenData.user.userId, async function (err, result) {
    //           //         if (result.length) {
    //           //           const lastTransactionData = result[result.length - 1]
    //           //           if (RESULT[0].balance - lastTransactionData.amount > 0) {
    //           //             res.json({ message: "you have no lol balance",status:false  })
    //           //           }
    //           //           else {
    //           //             AVERAGETIME({ oldTime: RESULT[0].average_time, newTime: lastTransactionData.created, oldBalance: RESULT[0].balance, newBalance: lastTransactionData.amount, status: lastTransactionData.status, id: RESULT[0].id }, async (err, result) => {

    //           //               Users.update(result, async function (err,result) {
    //           //                 if (err){
    //           //                   res.json({ message: "server error",status:false })
    //           //                 }
    //           //                 else {
    //           //                   console.log(result)

    //           //                   res.json({ message: "transaction successfully done",status:true })
    //           //                 }
    //           //               })
    //           //             })
    //           //           }

    //           //         }

    //           //       })
    //           //     }
    //           //     break;
    //           //   }
    //           //   default: {

    //           //     res.json({ message: "unauthoized" ,status:false })
    //           //     break;
    //           //   }
    //           // }


    //           // Transaction.findByUserId(TokenData.user.userId, async (error,result)=>{


    //           // })
    //           // DATA = {
    //           //   balance: result[0].balance, average_time: result[0].average_time, id: result[0].id
    //           // }

    //         }
    //       })


    //     }
    //     else {

    //       res.json({ message: "Transaction unsuccessfull", status: false, })
    //     }
    //   }
    // })

  } catch (error) {

    res.json({ message: error, status: false, })
  }
}

const getUser = async (req, res) => {
  try {
    const token = await getToken(req)
    const TokenData = decodeToken(token)
    if (TokenData) {
      Users.findByEmail(TokenData.user.email, function (err, result) {
        if (err) {
          console.log(err)
        }
        res.send(result)
      })
    }

  } catch (error) {

  }
}

const verifyOtp = async (req, res) => {
  try {
    const { id, otp } = req.params
    Users.findByUserId(id, (err, result) => {
      if (err) return res.json({ message: err, status: false })
      if (result.length == 0) return res.json({ message: "User not found", status: false })
      if (result[0].status == true) return res.json({ message: "User already verified", status: true })
      if (result[0].otp != otp) return res.json({ message: "Invalid OTP", status: false })
      Users.updateStatus(id, (err, result) => {
        if (err) return res.json({ message: "Bad request", status: false })
        console.log("-------", result, "-------")
        return res.json({ message: "OTP verified successfully", status: true })
      })
    })
  } catch (err) {
    console.log(err)
  }
}
const forgotPassword = async (req, res) => {
  const email = req.body.email
  Users.findByEmail(email, function (err, result) {

    if (err) {
      return res.json({ message: "User not found", status: false })
    }
    const otp = result[0].otp;
    const userId = result[0].id;
    sendEmailForgotpassword(email, otp, userId)
    res.send(result)
  })


}

const resetPassword = async (req, res) => {
  const { id, otp, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.json({ message: "Passwords do not match", status: false })
  }
  Users.findByUserId(id, (err, result) => {
    if (err) return res.json({ message: err, status: false })
    if (result.length == 0) return res.json({ message: "User not found", status: false })
    console.log(result[0].otp, otp, "sdf")
    if (result[0].otp != otp) return res.json({ message: "Bad request", status: false })
    Users.updatePassword(id, password, (err, result) => {
      if (err) return res.json({ message: "Bad request", status: false })
      console.log(result)
      return res.json({ message: "Password updated successfully", status: true })
    })
  })
}

module.exports = {
  Registration, Login, transaction, createTransaction, getUser, verifyOtp, forgotPassword, resetPassword
}


