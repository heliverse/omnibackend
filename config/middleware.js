const jwt = require("jsonwebtoken")
const { Users } = require("../model/model")
const { getToken, verifyJWTToken, decodeToken } = require("./main")
const bcrypt = require("bcrypt")



//Authentification

const auth = async (req, res, next) => {

    try {
        const token = await getToken(req)

        if (token) {
            const TokenData = await decodeToken(token)
            const { email, role } = TokenData.user
            console.log(email,role)
            switch (role) {

                case "admin": {
                    Users.findByEmail(email, async function (err, result) {
                        if (err) {
                            res.json({ message: err, status: false })
                        }
                        if (result.length > 0 && result[0].role_type == "admin") {

                            next()
                        }
                        else {
                            res.status(400).json({ message: "unauthorize access", status: false })
                        }
                    })
                    break;
                }
                case "user": {
                    Users.findByEmail(email, async function (err, result) {
                        if (err) {
                            console.log(err)
                            res.send(err)

                        }
                        else{
                            console.log({result})
                            if (result.length > 0 && result[0].role_type == "user") {
                 
                                next()
                           }
                           else {
                               console.log(result)
                            //    res.status(400).json({ message: "unauthorize access", status: false })
                           }
                        }
                 
                    })
                    break;
                }
                default: {
                    res.status(400).json({ message: "unauthorize access", status: false })
                }
            }

        }
        else {
            res.status(400).json({ message: "unauthorize access", status: false })
        }
    } catch (error) {

    }


}


module.exports = auth