
let express = require('express');
let cors =require("cors")
let Router = require('./routes/index');


let app = express();


//middleware
app.use(cors())



app.use("/",Router)


app.listen("8080",()=>{
  console.log("i m on ")
})
