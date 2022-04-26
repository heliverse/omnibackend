const { generateOTP, generateAccessToken } = require("../config/main")
const Admin = require("../model/admin")
const Users = require("../model/user")
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
                console.log(result)
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
        console.log(error)
        res.json({ message: error, status: false })
    }

}


module.exports = { create ,Login}