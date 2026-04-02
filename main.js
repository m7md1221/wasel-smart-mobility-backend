const { Client} = require('pg')

const con = new Client({
  host:"localhost",
  user: "postgres",
  port:5433,
  password: "",
  database:"wasel_palestine"
})


const { Client} = require('pg')

const con = new Client({
 host:"localhost",
 user: "postgres",
 port:5432,
 password: "postgres",
 database:"wasel_palestine"
})


con.connect().then(()=>console.log("connected")) 
con.query("select * from users",(err,res)=>{
 if(!err)
 {
  console.log(res.rows)
 }
 else{
  console.log(err.message)
 }
 con.end()
})


})
