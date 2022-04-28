var connection = require("../config/database")
let { generatePassword } = require("../config/main")






let Transaction = function (transaction) {
    this.amount = transaction.amount;
    this.user = transaction.user;
    this.status = transaction.status;
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










Transaction.add = (Data, callback) => {
console.log({Data})
    connection.query('INSERT INTO transactions (user_id,amount,status) VALUES ($1, $2,$3) ', [Data.user, Data.amount, Data.status], (error, result) => {
        if (error) {
            callback(error, null)
            console.log(error)
        }
        else {

            console.log(result)
            callback(null, result)
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