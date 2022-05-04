const { generateOTP, generateAccessToken } = require("../config/main")
const { InterestCalculate } = require("../config/main");
const Admin = require("../model/admin")
const Users = require("../model/user")
const Transaction = require("../model/transaction")
const bcrypt = require("bcrypt");
const { assuredworkloads } = require("googleapis/build/src/apis/assuredworkloads");



const create = async (req, res) => {


    try {
        const otp = generateOTP()
        const data = new Admin({ ...req.body, otp, status: true })
        Admin.create(data, async (error, result) => {
            if (error) { return res.send({ message: err, status: false }) }
            console.log(result)
            // sendEmail(data.email, otp, result.rows[0])
            res.json({ message: "User registration successfull", status: true })
        })
    } catch (error) {
        console.log(error)
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

                if (result.length > 0 && result[0].role_type == "admin") {

                    if (result[0].status == false) return res.json({ message: "Please verify your email.", status: false })
                    const match = await bcrypt.compare(password, result[0].password)
                    if (match) {
                        const accessToken = await generateAccessToken({ userId: result[0].id, email: result[0].email, password: result[0].password, role: result[0].role_type })
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
        // console.log(error)
        res.json({ message: error, status: false })
    }

}









const transactionOneUser = async (req, res) => {
    try {
        const id = req.query.id

        Admin.findTransaction(id, async function (err, result) {
            if (err) {
                res.json({ message: err, status: false })
            }
            else {
                res.send({ data: result.rows, status: true })

            }
        })

    } catch (error) {

        res.json({ message: error, status: false })


    }

}


const createTransacction = async (req, res) => {


    try {
        const DATA = req.body
        switch (DATA.type) {
            case "deposit": {

                Users.findByUserId(DATA.userId, async (err, UserResults) => {
                    if (err) { res.json({ message: "user not find", status: true }) }
                    else {
                        if (UserResults.length > 0) {

                            InterestCalculate(data = { oldBalance: UserResults[0].balance, oldTime: UserResults[0].last_transactions_time, oldInterest: UserResults[0].interest, newBalance: DATA.balance, newTime: new Date(), type: DATA.type }, async (err, RESULT) => {
                                Users.update(data = { id: UserResults[0].id, balance: RESULT.balance, last_transactions_time: RESULT.last_transactions_time, interest: RESULT.interest }, async (err, result) => {

                                    if (result) {

                                        Transaction.add(data = { user: DATA.userId, amount: DATA.balance, transaction_type: DATA.type, status: "accept" }, async function (err, result) {
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

                                })



                            })

                        }
                    }
                })

                break;
            }
            case "withdraw": {

                Users.findByUserId(DATA.userId, async (err, UserResults) => {
                    if (err) {
                        res.json({ message: err, status: false })
                    }
                    else {
                        if (UserResults.length > 0) {

                            if (UserResults[0].balance < DATA.balance) {
                                res.json({ message: "you have no sufficient balance", status: false })
                            }
                            else {
                                InterestCalculate(data = { oldBalance: UserResults[0].balance, oldTime: UserResults[0].last_transactions_time, oldInterest: UserResults[0].interest, newBalance: DATA.balance, newTime: new Date(), type: DATA.type }, async (err, RESULT) => {
                                    Users.update(data = { id: UserResults[0].id, balance: RESULT.balance, last_transactions_time: RESULT.last_transactions_time, interest: RESULT.interest }, async (err, result) => {

                                        if (result) {

                                            Transaction.add(data = { user: DATA.userId, amount: DATA.balance, transaction_type: DATA.type, status: "accept" }, async function (err, result) {
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

                                    })



                                })

                            }

                        }
                    }
                })

                break;
            }

        }


    } catch (error) {
        res.send({ message: error, status: false })
    }

}





const updateTransaction = async (req, res) => {
    try {

        const { transactionId, userId, balance, type, status, created } = req.body
        const DATA = req.body
        switch (DATA.status) {
            case "accept": {
                Users.findByUserId(DATA.userId, async (err, UserResults) => {

                    if (err) { res.json({ message: "user not find", status: true }) }
                    else {
                        if (UserResults.length > 0) {

                            InterestCalculate(data = { oldBalance: UserResults[0].balance, oldTime: UserResults[0].last_transactions_time, oldInterest: UserResults[0].interest, newBalance: DATA.balance, newTime: DATA.created, type: DATA.type, status: DATA.status }, async (err, result) => {
                                if (result) {
                                    const data = { ...result, id: DATA.userId }
                                    Users.update(data, async (err, result) => {
                                        if (result.command == 'UPDATE' && result.rowCount == 1) {
                                            Transaction.update(payload = { status: DATA.status, balance: DATA.balance, id: DATA.transactionId }, async (err, result) => {
                                                if (result.command == "UPDATE" && result.rowCount == 1) {
                                                    res.json({ message: "Transaction Update Successfull", status: true })
                                                } else {

                                                    res.json({ message: "Transaction not Update", status: false })
                                                }
                                            })

                                        }


                                    })

                                }


                            })
                        }
                        else {
                            res.json({ message: "user not found", status: false })
                        }



                    }


                })

                break;
            }
            case "reject": {

                Transaction.update(payload = { status: DATA.status, balance: DATA.balance, id: DATA.transactionId }, async (err, result) => {
                    if (result.command == "UPDATE" && result.rowCount == 1) {
                        res.json({ message: "Transaction Update Successfull", status: true })
                    }
                    else {

                        res.json({ message: "transaction not update ", status: false })
                    }
                })

                break;


            }
        }




    } catch (error) {
        res.json({ message: error, status: false })

    }
}

const getnotification= async (req,res)=>{


Admin.count(data="awaiting", async (err,result)=>{
    if(err){
        res.json({message:err,status:false})
    }
    else{
        res.json({data:result,status:true})
    }
})

}
module.exports = { create, Login, updateTransaction, transactionOneUser, createTransacction , getnotification}

