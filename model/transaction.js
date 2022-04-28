var connection = require("../config/database")
let { generatePassword } = require("../config/main")






let Transaction = function (transaction) {
    this.amount = transaction.amount;
    this.user = transaction.user;
    this.transaction_type = transaction.type;
    this.status ="awaiting"
}



Transaction.add = (Data, callback) => {
console.log(Data)
    connection.query('INSERT INTO transactions (user_id,amount,transaction_type,status) VALUES ($1,$2,$3,$4)', [Data.user, Data.amount,Data.transaction_type, Data.status], (error, result) => {
        if (error) {
            callback( error,null)
            console.log(error)
        }
        else {
            callback(null, result)
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






module.exports = Transaction 