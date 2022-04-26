var SibApiV3Sdk = require("sib-api-v3-sdk");
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const secretKey = process.env.SECRET_KEY
const jwtConfig = {
    secret: secretKey,
    refreshTokenSecret: "clsdlwer2524t49rfekfldfsf=sd-sdsv",
    expireTime: 30 * 60,
    refreshTokenExpireTime: 30 * 60 * 60
}


const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = "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";

exports.generateAccessToken = (user) => {
    const payload = { user }
    const accessToken = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expireTime })
    return accessToken
}
exports.decodeToken = (token) => {
    const Token = jwt.decode(token, secretKey);

    return Token

}

// exports.generateRefreshToken = (user) => {
//     const payload = {user}
//     const refreshToken = jwt.sign(payload,jwtConfig.refreshTokenSecret,{expiresIn: jwtConfig.refreshTokenExpireTime})
//     return refreshToken
// }

exports.verifyJWTToken = (token) => {
    const data = jwt.verify(token, jwtConfig.secret)
    return data
}

// exports.verifyRefreshToken = (token) => {
//     const data = jwt.verify(token,jwtConfig.refreshTokenSecret)
//     return data
// }

exports.generatePassword = async (payload) => {
    const salt = await bcrypt.genSaltSync(10)
    var password = await bcrypt.hashSync(payload, salt)
    return password
}

exports.generateOTP=()=> {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }
// const SecurePassword = async(payload,callback)=>{

// const salt = bcrypt.genSaltSync(10)
// console.log(salt)

// var password = await bcrypt.hashSync(payload,salt)
// callback(null,password)
// console.log(password)

// }
// module.exports={
//     SecurePassword
// }
exports.getToken = async (req) => {

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

exports.sendEmail = (address, otp, user) => {
    console.log(address)
    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
    sendSmtpEmail = {
        sender: { email: "support@heliverse" },
        to: [
            {
                email: address,
            },
        ],
        subject: "Your One-Time-Password",
    };
    sendSmtpEmail.htmlContent = "<html><body><h1>Omnifi</h1>Please click on the below button to verify your email<br><a  href={{params.link}} >Verify Email</a></body></html>";
    sendSmtpEmail.params = { "otp": otp, link: 'http://localhost:3000/verify-otp/' + user.id + "/" + otp };
    apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
            // console.log("API called successfully. Returned data: " + data);
        },
        function (error) {
            console.error(error);
        }
    );
}

exports.sendEmailForgotpassword = (address, otp, id) => {

    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
    sendSmtpEmail = {
        sender: { email: "support@heliverse.com" },
        to: [
            {
                email: address,
            },
        ],
        subject: "Reset Password",
    };
    sendSmtpEmail.htmlContent = "<html><body><h1>Omnifi</h1>Please click on the below button to reset your password<br><a  href={{params.link}} >Reset password</a></body></html>";
    sendSmtpEmail.params = { link: 'http://localhost:3000/reset-password/' + id + '/' + otp };
    apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
            
        },
        function (error) {
            console.error(error);
        }
    );

 
}
exports.AVERAGETIME = async (req, callback) => {

    const date = new Date()
    const CalculateInterest = (data) => {
        const olddate = new Date(data.oldTime); // 20th April 2021
        const period = (date.getTime() - olddate.getTime()) / 1000;
        const principal = data.amount;
        const time = period;
        const rate = 0.00000002536783358 // sec
        const interest = (principal * rate * time) / 100

        return interest

    }
    const interest = CalculateInterest(data = { amount: req.oldBalance, oldTime: req.oldTime })

    switch (req.status) {

        case "deposit": {

            const Total = parseInt(req.newBalance) + parseInt(req.oldBalance)
            const Interest = parseFloat(interest) + parseFloat(req.oldInterest)
            Data = { balance: Total, transactions_time: date, id: req.id, interest: Interest }
            callback(null, Data)

            break;

        }
        case "withdraw": {

            if (req.oldBalance < req.newBalance) {

                callback(null, err = { error: "you have no sufficient balance" })
            } else {
                const Total = parseInt(req.oldBalance) - parseInt(req.newBalance)
                const Interest = parseFloat(interest) + parseFloat(req.oldInterest)
          
                callback(null, data = { balance: req.oldBalance - req.newBalance, transactions_time: date, id: req.id, interest: Interest, status: req.status })
            }
            break;
        }
        default: {

            callback(null, err = { error: "not support" })

        }

    }
}