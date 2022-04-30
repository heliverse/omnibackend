
const { Users, Transaction } = require("../model/model");
const { getToken, decodeToken, AVERAGETIME } = require("../config/main");



const createTransaction = async (req, res) => {

  try {
    const data = await new Transaction(req.body)
    const token = await getToken(req)
    const TokenData = decodeToken(token)
    data.user = TokenData.user.userId

    switch (req.body.status) {
      case "deposit": {
        Transaction.add(data, function (err, result) {
          if (err) {
            res.json({ message: err, status: false })
          }
          else {

            if (result.command == "INSERT") {

              res.send({ message: "Transaction successfully done", status: true })

            }
            else {

              res.send({ message: "Transaction not successfully done", status: false })
            }
          }

        })
        break;
      }
      case "withdraw": {

        Users.findByUserId(TokenData.user.userId, async (err, result) => {
          if (err) {
            res.json({ message: err, status: false })
          } 
          else {
            if (result.length > 0) {
             
              if (result[0].balance < req.body.amount) {
                res.json({ message: "you have no sufficient balance", status: false })
              }
              else {
                Transaction.add(data, async function (err, result) {
                  if (err) {
                    res.json({ message: err, status: false })
                  }
                  else {

                    if (result.command == "INSERT") {

                      res.send({ message: "Transaction successfully done", status: true })

                    }
                    else {

                      res.send({ message: "Transaction not successfully done", status: false })
                    }
                  }

                })

              }

            }
          }
        })
        break;
      }

    }




  } catch (error) {

    res.json({ message: error, status: false, })
  }
}


const transaction = async (req, res) => {
  try {

    const token = await getToken(req)
    const TokenData = decodeToken(token)
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


module.exports = { transaction, createTransaction }