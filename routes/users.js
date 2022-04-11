
let bcrypt = require("bcrypt")
var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');
let { generateAccessToken } = require("../config/main")
let Users = require("../model/model");

let Registration = async (req, res) => {

  try {
    let data = await new Users(req.body)
    Users.findByEmail(data.email, function (err, result) {
      if (err) {
        res.status(404).json({ message: err, status: false })
      }
      else {
        if (result.length > 0) {
          console.log(result)
          res.status(409).json({ message: "user already exist", status: false })
        }
        else {
          Users.create(data, function (err, result) {
            if (err) {
              res.send({ message: err, status: false })
            }
            res.status(200).json({ message: "user registration successfull", status: true })

          })
        }
      }
    })
  } catch (error) {
    throw error
  }
}
let Login = async (req, res) => {


  let { email, password } = req.body
  Users.findByEmail(email, async function (err, result) {
    if (err) {
      res.status(404).json({ message: "bad reruest", status: false })
    }
    else {
      if (result.length > 0) {
        let match = await bcrypt.compare(password, result[0].password)
        if (match) {
          let accessToken = await generateAccessToken({ userId: result[0].id, email: result[0].email, password: result[0].password })
          res.status(200).json({ message: "login successfully done", status: true, token: accessToken })
        }
        else {
          res.status(200).json({ message: "pass not match", status: false })
        }
      }
      else {
        res.status(400).json({ message: "invalid email", status: false })
      }
    }
  })


}
let GoogleRegistration = async(req,res)=>{
 
let Strategy =new GoogleStrategy({
  clientID: "265770410171-q8kg4rksm8ppdp2frq9dpeel4ootrtp7.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: 'http://localhost:8080'
})
passport.use(Strategy)

}

module.exports = {
  Registration, Login,GoogleRegistration
}