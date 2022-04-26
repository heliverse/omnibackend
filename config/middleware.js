const jwt = require("jsonwebtoken")
const { Users } = require("../model/model")
const { getToken, verifyJWTToken, decodeToken } = require("./main")
const bcrypt = require("bcrypt")
 


//Authentification

const auth = async (req, res, next) => {

    try {
        const token = await getToken(req)

        if (token) 
        {
      
            const TokenData = await decodeToken(token)
            const { email, password } = TokenData.user
            Users.findByEmail(email, async function (err, result) {
                if (err) {
                    res.send(err)
                }
                if (result.length > 0) {
                    // let match = await bcrypt.compare(password, result[0].password)
                    // console.log(password, result[0].password, match)
                    // if (match) {
                        // res.status(200).json({ message: "authorize access", status: false })
                          next()
                    // }
                    // else {
                    //     res.status(200).json({ message: "unauthorize access", status: false })
                    // }
                }
                else {
                    res.status(400).json({ message: "unauthorize access", status: false })
                }
            })
        }
        else{
            res.status(400).json({ message: "unauthorize access", status: false })
        }
    } catch (error) {

    }


}


module.exports = auth