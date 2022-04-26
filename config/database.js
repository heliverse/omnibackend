// const Pool = require('pg').Pool

// const db = new Pool({
//   user: 'syxxmocrgidpah',
//   host: 'ec2-3-229-252-6.compute-1.amazonaws.com',
//   database: "d56neva7h5jtna",
//   password: '2f92eaddcc7ef565b3003feb54699a106832e56e02cd53dd4278196540585c1b',
//   port: 5432,
  
// })





// s




// const db =new Pool({


const Pool = require('pg').Pool
const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: "omifi",
  password: 'abc@123',
  port: 5432,
})

module.exports=db