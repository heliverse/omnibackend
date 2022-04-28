
var connection = require("../config/database")
let { generatePassword } = require("../config/main")

const Users = function (user) {
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.password = user.password;
    this.balance = 0;
    this.otp = user.otp;
    this.status = user.status
    this.interest = 0;
    this.role_type="user"
}



Users.create = async (Data, callback) => {
    const password = await generatePassword(Data.password)
    connection.query('INSERT INTO users (firstname,lastname,email,password,balance,Is_authenticated,status,interest,role_type) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9) RETURNING id', [Data.firstname, Data.lastname, Data.email, password, Data.balance, Data.otp, Data.status, Data.interest,Data.role_type], (error, result) => {
        if (error) {
            callback(error, null)
        }
        else {

            callback(null, result)
        }


    })
}












Users.findByEmail = (Email, callback) => {
    connection.query("select * from users where (email) = ($1)", [Email], (error, result) => {
        if (error) {
            callback(error, null)
        }
        else {

            callback(null, result.rows)
        }
    })

}

Users.findAdminByEmail = (Email, callback) => {
    connection.query("select * from Admin where (email) = ($1)", [Email], (error, result) => {
        if (error) {
            callback(error, null)
        }
        else {

            callback(null, result.rows)
        }
    })

}


Users.delete = (Email) => {
    return new Promise((resolve, reject) => connection.query("delete from users where (email) = ($1)", [Email], (error, result) => {
        if (error) {
            reject(err)
        }
        else {
            resolve()
        }
    }))

}










Users.findByUserId = (Id, callback) => {
    connection.query("select * from users where (id) = ($1)", [Id], (error, result) => {
        if (error) {
            callback(error, null)
        }
        else {

            callback(null, result.rows[0])
        }
    })

}










Users.updateOTP = (data, callback) => {

    connection.query("update users set is_confirmed=($3), authentication_key=($2) where id = ($1)", [data.userId, data.otp, data.status], (err, result) => {
        if (err) {
           
             callback(null,err)
        }
        else {
           
      
            callback(null, result)
        }
    })
}


Users.updateStatus = (Id, callback) => {
    connection.query("update users set status = ($1) where id = ($2)", [true, Id], (err, result) => {
        if (err) {
            
            callback(null,err)
        }
        else {
            callback(null, result)
        }
    })
}














Users.updatePassword = async (Id, pass, callback) => {
    const password = await generatePassword(pass)

    connection.query("update users set password = ($1) where id = ($2)", [password, Id], (err, result) => {
        if (err) {
            callback(err, null)
        }
        else {

            callback(null, result)
        }
    })
}













Users.update = (data, callback) => {
 
    connection.query("UPDATE users SET balance=($2),last_transactions_time=($3),interest=($4) WHERE (id)=($1)", [data.id, data.balance, data.last_transactions_time, data.interest], (error, result) => {
        console.log(data,result)
        if (error) {
            callback(error, null)

        } else {
            callback(null, result)

        }
    })

}










Users.findAll = (callback) => {

    connection.query("select * from users", (error, result) => {
        if (error) {
            callback(error, null)
        }
        else {
            callback(null, result.rows)
        }
    })
}


module.exports =  Users 