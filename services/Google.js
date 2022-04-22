const { google } = require("googleapis");
const { default: axios } = require("axios");
var OAuth2 = google.auth.OAuth2;
require("dotenv").config();

class Google {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.scopes = ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"];
        this.oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_SECRET_ID,
            process.env.GOOGLE_REDIRECT_URL
        );
        google.options({ auth: this.oauth2Client })
    }

    login() {
        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: this.scopes
        });
        return authUrl
    }

    async getAccessToken({ code }) {
        return new Promise((resolve, reject) => {
            this.oauth2Client.getToken(code, (err, token) => {
                console.log(err, token, "dlksj")
                this.oauth2Client.credentials = token;
                resolve(token)
            })
        })
    }

    async getEmail(idToken) {
        const ticket = await this.oauth2Client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
        const { email } = ticket.getPayload();
        return email;
    }

}



module.exports = Google;