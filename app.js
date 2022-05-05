
let express = require('express');
require('dotenv').config();
const {monthlyInterest} =require("./config/main")
let cors = require("cors")
let Router = require('./routes/index');
let app = express();
const session = require('express-session');
const port = process.env.port

app.set('port', port);

module.exports = app;
//middleware
app.use(cors())
// app.set('view engine', 'ejs');
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.use("/", Router)






// var CronJob = require('cron').CronJob;
// var job = new CronJob('* * * * * *', function() {
//   monthlyInterest()
//   console.log('You will see this message every second');
// }, null, true, 'America/Los_Angeles');
//  job.start();







app.listen(`${process.env.port}`, () => {
  console.log("i m on")
})
