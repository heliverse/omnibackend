
const bcrypt = require("bcrypt")

const { generateAccessToken } = require("../config/main")
const { Users, Transaction } = require("../model/model");
const { getToken, decodeToken } = require("../config/main")
const Registration = async (req, res) => {

  try {
    const data = await new Users(req.body)

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

module.exports = {
  Registration, Login, transaction, createTransaction, getUser
}


