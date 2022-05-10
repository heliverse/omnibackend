var SibApiV3Sdk = require("sib-api-v3-sdk");
const jwt = require('jsonwebtoken')
require('dotenv').config();
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

exports.generateOTP = () => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

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

    return null;
}

exports.sendEmail = (address, otp, user) => {

    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
    sendSmtpEmail = {
        sender: { email: `${process.env.SENDNBLUE_ADMIN_EMAIL}` },
        to: [
            {
                email: address,
            },
        ],
        subject: "Email Verification",
    };
    sendSmtpEmail.htmlContent = "<html><body><style>   *{    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;} </style> <div style='    background: rgb(244, 247, 255); display: block;   margin: 10px auto;  max-width: 600px;  text-align: center;      padding:40px 20px;'>      <h1>Omnifi</h1>       <h4>     Please click on the below button to verify your email</h4>   <a style='padding: 10px;  background: #3498db;color: white;   border-radius: 5px;    text-decoration: none;'href='{{params.link}}'>Verify Email</a>   </div></body> </html>";
    sendSmtpEmail.params = { "otp": otp, link: `${process.env.CLIENT_URL}/verify-otp/` + user.id + "/" + otp };
    apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
            // console.log("API called successfully. Returned data: " + data);
        },
        function (error) {
            console.error(error);
        }
    );
}

exports.sendEmailForgotpassword = async(address, otp, id, role_type,callback) => {

    switch (role_type) {

        case "user": {
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
            sendSmtpEmail.htmlContent = "<html><body><style>   *{    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;} </style> <div style='    background: rgb(244, 247, 255); display: block;   margin: 10px auto;  max-width: 600px;  text-align: center;      padding:40px 20px;'>      <h1>Omnifi</h1>       <h3 margin:'20px 0px'  >     Please click on the below button to verify your email</h3>   <a style='padding: 10px;  background: #3498db;color: white;    border-radius: 5px;    text-decoration: none;'href='{{params.link}}'>Verify Email</a>   </div></body> </html>";
            sendSmtpEmail.params = { link: `${process.env.CLIENT_URL}/reset-password/` + id + '/' + otp };
            apiInstance.sendTransacEmail(sendSmtpEmail).then(
                function (data) {

                },
                function (error) {
                    callback(error,null)
                   
                }
            );
            break;
        }
        case "admin": {
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
            sendSmtpEmail.htmlContent = "<html><body><style>   *{    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;} </style> <div style='    background: rgb(244, 247, 255); display: block;   margin: 10px auto;  max-width: 600px;  text-align: center;      padding:40px 20px;'>      <h1>Omnifi</h1>       <h3 margin:'20px 0px'  >     Please click on the below button to verify your email</h3>   <a style='padding: 10px;  background: #3498db;color: white;    border-radius: 5px;    text-decoration: none;'href='{{params.link}}'>Verify Email</a>   </div></body> </html>";
            sendSmtpEmail.params = { link: `${process.env.ADMIN_URL}/reset-password/` + id + '/' + otp };
            apiInstance.sendTransacEmail(sendSmtpEmail).then(
                function (data) {

                },
                function (error) {
                    callback(error,null)
                    
                }
            );
            break;
        }

    }


}
exports.InterestCalculate = async (request, callback) => {
    const { oldBalance, oldTime, oldInterest, newBalance, newTime, status } = request
    const CalculateInterest = (data) => {
        const date = new Date()
        const newdate = new Date(data.newTime)
        const olddate = new Date(data.oldTime); // 20th April 2021
        const time = (newdate.getTime() - olddate.getTime()) / 1000;
        const principal = parseFloat(data.amount);
        const rate = 0.00000002536783358 // sec
        const interest = (principal * rate * time) / 100

        return interest
    }
    switch (request.type) {


        case "deposit": {

            if (oldTime == null) {
                const data = await { balance: request.newBalance, interest: 0, last_transactions_time: request.newTime }
                callback(null, data)
            }
            else {

                const interest = await CalculateInterest(DATA = { amount: request.oldBalance, oldTime: request.oldTime, newTime: request.newTime })
                const Total = parseFloat(request.newBalance) + parseFloat(request.oldBalance)
                const Interest = parseFloat(interest) + parseFloat(request.oldInterest)
                const data = await { balance: Total, interest: Interest, last_transactions_time: request.newTime }

                callback(null, data)

            }

            break;
        }
        case "withdraw": {
            const interest = CalculateInterest(DATA = { amount: request.oldBalance, oldTime: request.oldTime, newTime: request.newTime })
            const Total = parseFloat(request.oldBalance) - parseFloat(request.newBalance)
            const Interest = parseFloat(interest) + parseFloat(request.oldInterest)
            const data = await { balance: Total, interest: Interest, last_transactions_time: request.newTime }

            callback(null, data)

            break;
        }

    }



}





const Users = require("../model/user");
const Transaction = require("../model/transaction");

const getLastMonth = () => {
    var month = new Date().getMonth(); // January
    var d = new Date(2022, month + 1, 1);
    console.log(d.getTime());
    return d.getTime()
}

const InterestCalculate = (data) => {
    const date = new Date()
    const olddate = new Date(data.oldTime); // 20th April 2021
    const period = (getLastMonth() - olddate.getTime()) / 1000;
    const principal = data.balance;
    const time = period;
    const rate = 0.00000002536783358 // sec
    const interest = (principal * rate * time) / 100
    const final_interest = (parseFloat(interest) + parseFloat(data.oldInterest))

    return { id: data.id, interest: final_interest, balance: (parseFloat(data.balance) + parseFloat(final_interest)) }
}




exports.monthlyInterest = async () => {

    Users.findAll(async function (err, UserResult) {
        if (err) {
            console.log(err)
        }
        else {

            for (i = 0; i < UserResult.length; i++) {
                console.log(UserResult[i])
                const interest = await InterestCalculate(data = { id: UserResult[i].id, balance: UserResult[i].balance, oldTime: UserResult[i].last_transactions_time, oldInterest: UserResult[i].interest })
                Transaction.add(data = { user: UserResult[i].id, amount: interest.interest, transaction_type: "deposit", status: "accept" }, async (err, result) => {
                    if (result) {
                        const date = new Date()
                        Users.update(data = { id: interest.id, balance: interest.balance, interest: 0, last_transactions_time: date }, async function (err, result) {

                            if (result.command == "UPDATE") {
                                // console.log(result)
                                //   res.send({ message: "Transaction successfully done", status: true })
                            }
                            else {
                                //   res.send({ message: "Transaction successfully not done", status: true })
                            }
                        })
                    }

                })

            }




        }

    })







}