
var connection = require("../config/database")
let { generatePassword } = require("../config/main")

const Admin = function (Admin) {
    this.firstname = Admin.firstname;
    this.lastname = Admin.lastname;
    this.email = Admin.email;
    this.password = Admin.password;
    this.otp = 0;
    this.role_type = "Admin"
}



Admin.create = async (Data, callback) => {
    const password = await generatePassword(Data.password)
    connection.query('INSERT INTO Admin (firstname,lastname,email,password,status,is_authenticated) VALUES ($1, $2, $3, $4,$5,$6) RETURNING id,email,password', [Data.firstname, Data.lastname, Data.email, password, Data.status, true], (error, result) => {
        if (error) {
            callback(error, null)
        }
        else {

            callback(null, result)
        }
    })
}


Admin.findTransaction = async (Data, callback) => {
 
    connection.query('select users.firstname,users.lastname,transactions.id,transactions.status,transactions.transaction_type,transactions.amount,transactions.user_id,transactions.created from users inner join transactions on users.id=transactions.user_id where users.id=($1) ', [Data], (error, result) => {
        if (error) {
            callback(error, null)
        }
        else {

            callback(null, result)
        }
    })
}


Admin.count = async (Data,callback)=>{
    connection.query('select count(id) from transactions where transactions.status =($1)', [Data], (error, result) => {
        if (error) {
            callback(error, null)
        }
        else {

            callback(null, result.rows)
        }
    })
}

Admin.NewTransaction = async (Data,callback)=>{
    connection.query('select * from transactions where transactions.status =($1)', [Data], (error, result) => {
        if (error) {
            callback(error, null)
        }
        else {

            callback(null, result.rows)
        }
    })
}
module.exports = Admin