var SibApiV3Sdk = require("sib-api-v3-sdk");
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
console.log(apiKey, "api key");
apiKey.apiKey =
    "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";
function SendTestEmail(address, otp, id) {
    console.log(address)
    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
    sendSmtpEmail = {
        sender: { email: "abdul@heliverse.com" },
        to: [
            {
                email: address,
                name: "Abdul",

            },
        ],
        subject: "Your One-Time-Password",
    };
    sendSmtpEmail.htmlContent = "<html><body><h1>Omnifi</h1>Please click on the below button to verify your email<br><a  href={{params.link}} >Verify Email</a></body></html>";
    sendSmtpEmail.params = { "otp": otp, link: 'http://localhost:3000/verify-otp/' + id + "/" + otp };
    apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
            console.log("API called successfully. Returned data: " + data);
        },
        function (error) {
            console.error(error);
        }
    );
}

module.exports = {
    SendTestEmail
}
//   SendTestEmail("testing address")