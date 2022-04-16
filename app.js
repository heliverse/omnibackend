
let express = require('express');
require('dotenv').config();
let cors = require("cors")
let Router = require('./routes/index');
let app = express();
const session = require('express-session');
const port =process.env.port
//middleware
app.use(cors())

app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

app.use("/", Router)

// var CronJob = require('cron').CronJob;
// var job = new CronJob('* 1 * * * *', function() {
//   console.log('You will see this message every second');
// }, null, true, 'America/Los_Angeles');
// job.start();

app.listen(port, () => {
console.log("i m on")
})
