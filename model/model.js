var connection = require("../config/database")
let { generatePassword } = require("../config/main")

let Users = function (user) {
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.password = user.password;
    this.balance = 0;
    this.otp = user.otp;
    this.status = user.status
    this.interest = 0;
}

let Transaction = function (transaction) {
    this.amount = transaction.amount;
    this.user = transaction.user;
    this.status = transaction.status;
}
Users.create = async (Data, callback) => {
    let password = await generatePassword(Data.password)
    connection.query('INSERT INTO users (firstname,lastname,email,password,balance,otp,status,interest) VALUES ($1, $2, $3, $4,$5,$6,$7,$8) RETURNING id', [Data.firstname, Data.lastname, Data.email, password, Data.balance, Data.otp, Data.status,Data.interest], (error, result) => {
        if (error) {
            callback(null, error)
        }
        else {

            callback(null, result)
        }


    })
}
Users.findByEmail = (Email, callback) => {
    connection.query("select * from users where (email) = ($1)", [Email], (error, result) => {
        if (error) {
            callback(null, error)
        }
        else {

            callback(null, result.rows)
        }
    })

}

// 
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
            callback(null, error)
        }
        else {

            callback(null, result.rows)
        }
    })

}
Users.updateStatus = (Id, callback) => {
    connection.query("update users set status = ($1) where id = ($2)", [true, Id], (err, result) => {
        if (err) {
            callback(err, null)
        }
        else {
            callback(null, result)
        }
    })
}

Users.updatePassword = async (Id, pass, callback) => {
    const password = await generatePassword(pass)
    console.log(password, pass, "Password")
    connection.query("update users set password = ($1) where id = ($2)", [password, Id], (err, result) => {
        if (err) {
            callback(err, null)
        }
        else {
            callback(null, result)
        }
    })
}

Users.update = (callback) => {
Users.update = (data, callback) => {
    console.log(data, "model")
    connection.query("UPDATE users SET balance=($2),average_time=($3),interest=($4) WHERE (id)=($1)", [data.id, data.balance, data.average_time, data.interest], (error, result) => {
        if (error) {
            callback(null, error)

        } else {
            callback(null, result)

        }
    })

}
Users.findAll = (callback) => {

    connection.query("select * from users", (error, result) => {
        if (error) {
            callback(null, error)
        }
        else {

            callback(null, result.rows)
        }
    })
}
Transaction.findAll = (callback) => {

    connection.query("select * from transactions", (error, result) => {
        if (error) {
            callback(null, error)
        }
        else {

            callback(null, result.rows)
        }
    })
}

Transaction.findByUserId = (Userid, callback) => {

    connection.query("select * from transactions where (user_id) =($1) ", [Userid], (error, result) => {
        if (error) {

            callback(null, error)

        }
        else {

            callback(null, result.rows)
        }
    })
}



Transaction.add = async (Data, callback) => {

    connection.query('INSERT INTO transactions (user_id,amount,status) VALUES ($1, $2,$3)', [Data.user, Data.amount, Data.status], (error, result) => {
        if (error) {
            callback(null, error)
        }
        else {
            callback(null, result)
        }
    })
}}


module.exports = { Users, Transaction }