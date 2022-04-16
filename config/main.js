const jwt = require('jsonwebtoken')
let bcrypt = require("bcrypt")
const secretKey=process.env.SECRET_KEY
const jwtConfig = {
    secret: secretKey,
    refreshTokenSecret: "clsdlwer2524t49rfekfldfsf=sd-sdsv",
    expireTime: 30*60,
    refreshTokenExpireTime: 30*60*60
}

exports.generateAccessToken = (user) => {
    const payload = {user}
    const accessToken = jwt.sign(payload,jwtConfig.secret,{expiresIn: jwtConfig.expireTime})
    return accessToken
}
exports.decodeToken =(token)=>{
const Token = jwt.decode(token,secretKey);

return Token

}

// exports.generateRefreshToken = (user) => {
//     const payload = {user}
//     const refreshToken = jwt.sign(payload,jwtConfig.refreshTokenSecret,{expiresIn: jwtConfig.refreshTokenExpireTime})
//     return refreshToken
// }

 exports.verifyJWTToken = (token) => {
     const data = jwt.verify(token,jwtConfig.secret)
     return data
}

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
exports.getToken= async (req)=> {
    
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { // Authorization: Bearer g1jipjgi1ifjioj
      // Handle token presented as a Bearer token in the Authorization header
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      // Handle token presented as URI param
      return req.query.token;
    } else if (req.cookies && req.cookies.token) {
      // Handle token presented as a cookie parameter
      return req.cookies.token;
    }
    // If we return null, we couldn't find a token.
    // In this case, the JWT middleware will return a 401 (unauthorized) to the client for this request
    return null; 
  }