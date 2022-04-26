
const { Users, Transaction } = require("../model/model");
const { getToken, decodeToken, AVERAGETIME } = require("../config/main");



const createTransaction = async (req, res) => {

    try {
      const data = await new Transaction(req.body)
      const token = await getToken(req)
      const TokenData = decodeToken(token)
      data.user = TokenData.user.userId
      // console.log(data)
  
      Transaction.add(data, function (err, result) {
        if (err) {
          res.send({ message: "not add", status: false })
        }
        else {
  
          if (result.command == "INSERT") {
  
            Users.findByUserId(TokenData.user.userId, async function (err, RESULT) {
              if (RESULT.length) {
  
                AVERAGETIME({ oldTime: RESULT[0].last_transactions_time, oldInterest: RESULT[0].interest, oldBalance: RESULT[0].balance, newBalance: data.amount, status: data.status, id: RESULT[0].id }, async (err, result) => {
                  if (result.error) {
                    res.json({ message: result.error, status: false })
                  }
                  else {
                    Users.update(result, async function (err, result) {
  
                      if (result.command == "UPDATE") {
                        res.send({ message: "Transaction successfully done", status: true })
                      }
                      else {
                        res.send({ message: "Transaction successfully not done", status: true })
                      }
                    })
                  }
  
                })
              }
            })
          }
          else {
            console.log(result)
          }
        }
  
  
      })
  
    } catch (error) {
  
      res.json({ message: error, status: false, })
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


  module.exports={transaction,createTransaction}