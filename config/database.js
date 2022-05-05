
const Pool = require('pg').Pool
require('dotenv').config();
const db = new Pool({
  user: `${process.env.Database_User}`,
  host: `${process.env.Database_Host}`,
  database: `${process.env.Database}`,
  password: `${process.env.Database_Password}`,
  port: `${process.env.Database_Port}`,
})

module.exports=db