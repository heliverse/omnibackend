const express = require('express');
const user = require("./users")
const router = express.Router();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.json())
// /* GET home page. */
const auth = require("../config/middleware");




router.use(urlencodedParser)
router.get("/auth/transaction", auth, user.transaction)
router.get("/auth/user", auth, user.getUser)
router.post('/registration', user.Registration)
router.post("/login", user.Login)
router.post("/auth/transaction", auth, user.createTransaction)
router.get('/verify-otp/:id/:otp', user.verifyOtp)
router.post("/forgotPassword", user.forgotPassword);
router.post("/resetPassword", user.resetPassword);

router.get('/login/google', user.loginWithGoogle)
router.get('/google/callback', user.getAccessToken);





module.exports = router;


