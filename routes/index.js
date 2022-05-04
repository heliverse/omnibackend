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
// router.get("/auth/admin/transaction", auth, transaction.transaction)
router.post("/admin/login", Admin.Login)

router.post("/admin/auth/transaction/",auth, Admin.updateTransaction)

router.post("/admin/auth/createtransaction/",auth, Admin.createTransacction)
router.get("/admin/auth/getuser",auth, user.GetAllUser)

// router.get("/admin/auth/getuser",auth, user.GetOneUser)

router.get("/admin/auth/transaction", auth, Admin.transactionOneUser)
router.get("/admin/auth/getnotification", auth, Admin.getnotification)





//users login  api
router.post('/registration', user.Registration)
router.post("/login", user.Login)
router.get("/auth/user", auth, user.getUser)



//transaction apis
router.post("/auth/transaction", auth, transaction.createTransaction)
router.get("/auth/transaction", auth, transaction.transaction)


//users services
router.get('/verify-otp/:id/:otp', user.verifyOtp)
router.post("/forgotPassword", user.forgotPassword);
router.post("/resetPassword", user.resetPassword);




//google login apis
router.get('/login/google', user.loginWithGoogle)
router.get('/google/callback', user.getAccessToken);


module.exports = router;


