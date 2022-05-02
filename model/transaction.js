var connection = require("../config/database")
let { generatePassword } = require("../config/main")






let Transaction = function (transaction) {
    this.amount = transaction.amount;
    this.user = transaction.user;
    this.transaction_type = transaction.status;
    this.status = "awaiting"
}



Transaction.add = (Data, callback) => {
    console.log(Data)
    connection.query('INSERT INTO transactions (user_id,amount,transaction_type,status) VALUES ($1,$2,$3,$4)', [Data.user, Data.amount, Data.transaction_type, Data.status], (error, result) => {
        if (error) {
            callback(error, null)
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
            callback(error,null)
        }
        else {
            callback(null, result.rows)
        }
    })
}





Transaction.findById =(TransactionId,callback)=>{
    connection.query("select * from transactions where (id) =($1) ",[TransactionId],(error, result)=>{

        if (error) {

            callback( error,null)

        }
        else {

            callback(null, result.rows)
        }
    })
}



Transaction.update = (data, callback) => {

    connection.query("UPDATE  transactions SET amount=($3),status=($2) WHERE (id)=($1)", [data.id, data.status, data.balance], (error, result) => {
  
        if (error) {
            
            callback(error, null)
            console.log(error)

        } else {
            callback(null, result)

        }
    })

}









Transaction.findByUserId = (Userid, callback) => {

    connection.query("select * from transactions where (user_id) =($1) ORDER BY id DESC  ", [Userid], (error, result) => {
        if (error) {

            callback(error,null)

        }
        else {

            callback(null, result.rows)
        }
    })
}






module.exports = Transaction 