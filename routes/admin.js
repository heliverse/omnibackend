const { generateOTP, generateAccessToken } = require("../config/main")
const { getToken, decodeToken, AVERAGETIME } = require("../config/main");
const Admin = require("../model/admin")
const Users = require("../model/user")
const Transaction = require("../model/transaction")
const bcrypt = require("bcrypt")



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
        console.log(error)
        res.json({ message: error, status: false })
    }

}


const createTransaction = async (req, res) => {

    try {
        const data = await new Transaction(req.body)
        data.user = parseInt(req.query.id)

        Transaction.add(data, function (err, result) {
            if (err) {
                res.send({ message: "not add", status: false })
            }
            else {

                if (result.command == "INSERT") {

                    Users.findByUserId(req.query.id, async function (err, RESULT) {
                       
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
                    res.json({ message: result, status: false })
                }
            }


        })

    } catch (error) {

        res.json({ message: error, status: false, })
    }
}

module.exports = { create, Login, createTransaction }