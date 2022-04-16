
let bcrypt = require("bcrypt")

let { generateAccessToken } = require("../config/main")
let { Users, Transaction } = require("../model/model");

let Registration = async (req, res) => {

  try {
    let data = await new Users(req.body)

    Users.findByEmail(data.email, function (err, result) {
      if (err) { res.json({ message: err, status: false }) }
      else {
        if (result.length > 0) { res.json({ message: "user already exist", status: false }) }
        else {
          Users.create(data, function (err, result) {
            if (err) { res.send({ message: err, status: false }) }
            res.json({ message: "user registration successfull", status: true })

          })
        }
      }

    })

  } catch (error) {

    res.json({ message:error, status:false})
  }
}
let Login = async (req, res) => {
  try {
    let { email, password } = req.body
    Users.findByEmail(email, async function (err, result) {
      if (err) {
        res.json({ message: "bad reruest", status: false })
      }
      else {
        if (result.length > 0) {
          let match = await bcrypt.compare(password, result[0].password)
          if (match) {
            let accessToken = await generateAccessToken({ userId: result[0].id, email: result[0].email, password: result[0].password })
            res.json({ message: "login successfully done", status: true, token: accessToken,id:result[0].id})
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
const user = async (req, res) => {
  try {
    Users.findAll(async function (err, result) {
      if (err) {
        res.send(err)
      }
      else {
        res.send(result)
      }
    })
  } catch (error) {

  }

}

const transaction = async (req, res) => {

  try {
    let data = await new Transaction(req.body)

    console.log(req.body)
    Transaction.add(data, function (err, result) {
      if (err) { res.send({ message: err, status: false }) }
      res.json({ message: "Transaction successfull", status: true,})

    })

  } catch (error) {
  
    res.json({ message:error, status: true,})
  }
}

const serach = async (req,res)=>{
  try {
    const data =req.body.user
    Transaction.findByUserId(data,function(err,result){
      if(err){
        console.log(err)
      }
      res.send(result)
    })
  } catch (error) {
    
  }
}

module.exports = {
  Registration, Login, user, transaction,serach
}


