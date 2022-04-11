var connection =require("../config/database")
let {generatePassword}=require("../config/main")

let Users =function(user){
 this.firstname =user.firstname;
 this.lastname =user.lastname;
 this.email= user.email;
 this.password=user.password
}

Users.create = async ( Data,callback)=>{
let password =await generatePassword(Data.password)
connection.query('INSERT INTO customer (firstname,lasttname,email,password) VALUES ($1, $2, $3, $4)', [Data.firstname, Data.lastname, Data.email, password], (error, result)=>{
if(error){
 callback(null,error)
}
else{
    callback(null,result)
}


})
}
Users.findByEmail =(Email,callback)=>{
    connection.query("select * from customer where (email) = ($1)",[Email],(error,result)=>{
        if(error){
            callback(null,error)
        }
        else{

            callback(null,result.rows)
        }
    })
    
}
Users.update =(callback)=>{

}
Users.findAll =(callback)=>{

connection.query("select * from customer",(error,result)=>{
    if(error){
        callback(null,error)
    }
    else{

        callback(null,result.rows)
    }
})


}

module.exports =Users