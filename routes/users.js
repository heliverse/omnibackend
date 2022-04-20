
const bcrypt = require("bcrypt")

const { generateAccessToken, sendEmail } = require("../config/main")
const { Users, Transaction } = require("../model/model");
const { getToken, decodeToken } = require("../config/main");
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
    // let emailVer = false
    // sendTestMail function call
    // if(emailVer){
    //   response send kray gay
    // }

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

    Transaction.add(data, function (err, result) {
      if (err) { res.send({ message: err, status: false }) }
      res.json({ message: "Transaction successfull", status: true, })

    })

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

module.exports = {
  Registration, Login, transaction, createTransaction, getUser, verifyOtp
}


