const express = require('express');
const user = require("./users")
const transaction =require("./transaction")
const Admin =require("./admin")
const router = express.Router();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.json())
// /* GET home page. */
const auth = require("../config/middleware");
const Users = require('../model/user');




router.use(urlencodedParser)

//admin api
router.post("admin/login", Admin.Login)

router.post("/admin/registration", Admin.create)

router.get("/admin/auth/getuser", user.GetAllUser)

router.get("/admin/auth/getuser:id", user.GetOneUser)






//users api

router.get("/auth/transaction", auth, transaction.transaction)
router.get("/auth/user", auth, user.getUser)


router.post('/registration', user.Registration)
router.post("/login", user.Login)
router.get('/verify-otp/:id/:otp', user.verifyOtp)
router.post("/forgotPassword", user.forgotPassword);
router.post("/resetPassword", user.resetPassword);
router.get('/login/google', user.loginWithGoogle)
router.get('/google/callback', user.getAccessToken);





//transaction api
router.post("/auth/transaction", auth, transaction.createTransaction)




module.exports = router;


