const jwt_decode = require("jwt-decode");
const bcrypt = require("bcrypt")
const Google = require('../services/Google')
const { Users, Transaction } = require("../model/model");
const { getToken, decodeToken, AVERAGETIME, generatePassword, generateOTP, generateAccessToken, sendEmail, sendEmailForgotpassword } = require("../config/main");




const Registration = async (req, res) => {

  try {
    const otp = generateOTP()
    const data = new Users({ ...req.body, otp, status: false })
    Users.findByEmail(data.email, async function (err, result) {
      if (err) { res.json({ message: err, status: false }) }
      else {

        // console.log(result)
        if (result.length > 0 && result[0].status == true) { return res.json({ message: "User already exist", status: false }) }
        if (result.length > 0 && result[0].status == false) await Users.delete(data.email)
        Users.create(data, function (err, result) {
          if (err) { return res.send({ message: err, status: false }) }
          sendEmail(data.email, otp, result.rows[0])
          res.json({ message: "User registration successfull", status: true })
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
        res.json({ message: "Bad reruest", status: false })
      }
      else {
        if (result.length > 0) {
          if (result[0].status == false) return res.json({ message: "Please verify your email.", status: false })
          const match = await bcrypt.compare(password, result[0].password)
          if (match) {
            const accessToken = await generateAccessToken({ userId: result[0].id, email: result[0].email, password: result[0].password })
            res.json({ message: "Login successfully done", status: true, token: accessToken, id: result[0].id })
          }
          else {
            res.json({ message: "Password  not match", status: false })
          }
        }
        else {
          res.status(400).json({ message: "Invalid email", status: false })
        }
      }
    })
  } catch (error) {
    res.json({ message: error, status: false })
  }

}



























const getUser = async (req, res) => {
  try {
    const token = await getToken(req)
    const TokenData = decodeToken(token)
    if (TokenData) {
      Users.findByEmail(TokenData.user.email, function (err, result) {
        if (err) {
          // 



        }
        res.json(result)
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
        // console.log("-------", result, "-------")
        return res.json({ message: "Otp verified successfully", status: true })
      })
    })
  } catch (err) {
    // console.log(err)
  }
}












const forgotPassword = async (req, res) => {
  try {
    const EMAIL = req.body.email
    Users.findByEmail(EMAIL, async function (err, result) {
      if (err) {
        res.json({ message: "User not found", status: false })
      }
      else {
        let otp = await generateOTP();
        // otp = await generatePassword(otp)
        const userId = result[0].id;
        Users.updateOTP(data = { otp, userId, status: true }, async function (err, result) {
          sendEmailForgotpassword(EMAIL, otp, userId)
          res.json({ message: "Check your email", status: true })
        })

      }

    })
  } catch (error) {
    res.json({ message: error, status: false })
  }


}












const resetPassword = async (req, res) => {
  try {
    const { id, otp, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.json({ message: "Passwords do not match", status: false })
    }
    Users.findByUserId(id, (err, result) => {

      if (result.length) {
        if ((result[0].otp == otp) && (result[0].otp_status == true)) {
          Users.updatePassword(id, password, (err, result) => {
            if (err) return res.json({ message: "Bad request", status: false })
            Users.updateOTP(data = { otp: 0, userId: id, status: false }, async function (err, result) {


              return res.json({ message: "Password updated successfully", status: true })
            })

          })

        }
        else {
          return res.json({ message: "Token expire", status: false })
        }
      }


    })

  } catch (error) {
    return res.json({ message: error, status: false })
  }
}









const loginWithGoogle = async (req, res) => {
  try {
    const goggle = new Google();
    const authUrl = goggle.login();
    res.redirect(authUrl)
  } catch (error) {
    res.json({ message: error, status: false })
  }
}








const getAccessToken = async (req, res) => {
  try {

    const google = new Google();
    const result = await google.getAccessToken(req.query);
    const googleData = jwt_decode(result.id_token);

    Users.findByEmail(googleData.email, async function (err, result) {
      if (err) { res.json({ message: err, status: false }) }
      else {
        if (result.length > 0) {
         const accessToken = await generateAccessToken({ userId: result[0].id, email: result[0].email, password: result[0].password })
          res.json({ message: "Login successfully done", status: true, token: accessToken, id: result[0].id })

        }
        else {
       
          Users.create({ firstname: googleData.given_name, lastname: googleData.family_name, email: googleData.email, password: googleData.at_hash, balance: 0, otp: 0, status: true, interest: 0, role_type: "user" }, async function (err, RESULT) {
            if (err) { res.send({ message: err, status: false }) }
            if (RESULT.command == 'INSERT') {
              Users.findByEmail(googleData.email, async (err, result) => {
                if (err) { res.send({ message: "something went wrong" }) }
                if (result.length > 0) {
                  const accessToken = await generateAccessToken({ userId: result[0].id, email: result[0].email, password: result[0].password })
                  res.json({ message: "Login successfully done", status: true, token: accessToken, id: result[0].id })
                }


              })

            }

          })
        }

      }

    })
  }
  catch (error) {

    res.json(error)
  }
}

module.exports = {
  Registration, Login, getAccessToken, loginWithGoogle, getUser, verifyOtp, forgotPassword, resetPassword
}


