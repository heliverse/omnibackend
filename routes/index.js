var express = require('express');
let user =require("./users")
var router = express.Router();
let bodyParser =require("body-parser");
const Users = require('../model/model');
let urlencodedParser =bodyParser.urlencoded({extended:false})
router.use(bodyParser.json())
/* GET home page. */



router.use(urlencodedParser)


router.post('/registration',user.Registration)
router.post("/login",user.Login)
module.exports = router;
