const { Client } = require('pg');

const con = new Client({
  host: "localhost",
  user: "postgres",
  port: 5433, // اختاري البورت الصحيح عندك
  password: "postgres",
  database: "wasel_palestine"
});

con.connect()
  .then(() => console.log("connected"))
  .catch(err => console.error("connection error", err));

con.query("SELECT * FROM users", (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err.message);
  }
  con.end();
});