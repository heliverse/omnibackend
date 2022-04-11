const jwt = require('jsonwebtoken')
let bcrypt = require("bcrypt")
const jwtConfig = {
    secret: "&*()mnbvcxzqasdfghjkl;[=1234qwert67890=[;lkjhgfrde",
    refreshTokenSecret: "&*()mnbvcxzqasdfghjkl;[=1234qwert67890=[;lkjhgfrde",
    expireTime: 30*60,
    refreshTokenExpireTime: 30*60*60
}

exports.generateAccessToken = (user) => {
    const payload = {user}
    const accessToken = jwt.sign(payload,jwtConfig.secret,{expiresIn: jwtConfig.expireTime})
    return accessToken
}

// exports.generateRefreshToken = (user) => {
//     const payload = {user}
//     const refreshToken = jwt.sign(payload,jwtConfig.refreshTokenSecret,{expiresIn: jwtConfig.refreshTokenExpireTime})
//     return refreshToken
// }

// exports.verifyJWTToken = (token) => {
//     const data = jwt.verify(token,jwtConfig.secret)
//     return data
// }

// exports.verifyRefreshToken = (token) => {
//     const data = jwt.verify(token,jwtConfig.refreshTokenSecret)
//     return data
// }

exports.generatePassword = async (payload)=>{
    let salt = await bcrypt.genSaltSync(10)
    var password = await bcrypt.hashSync(payload,salt)
    return password
}
// let SecurePassword = async(payload,callback)=>{

// let salt = bcrypt.genSaltSync(10)
// console.log(salt)

// var password = await bcrypt.hashSync(payload,salt)
// callback(null,password)
// console.log(password)

// }
// module.exports={
//     SecurePassword
// }