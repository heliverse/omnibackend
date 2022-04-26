
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
    connection.query('INSERT INTO Admin (firstname,lastname,email,password,status,otp,role_type) VALUES ($1, $2, $3, $4,$5,$6,$7) RETURNING id,email,password', [Data.firstname, Data.lastname, Data.email, password, Data.status, Data.otp, Data.role_type], (error, result) => {
        if (error) {
            callback(null, error)
        }
        else {

            callback(null, result)
        }
    })
}


module.exports = Admin