const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const crypto = require('crypto')
const app    = express();
const port   = 3000;
app.use(express.static('public')); 

const conn = mysql.createConnection( {
  host: 'localhost',
  user: 'root', //wildemhu
  port: "3306",
  password: '',//Vw69b?(W4mmL
  database: 'wildemhu_wildem'
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.post('/login',(req, res) => {
  JSON.parse(JSON.stringify(req.body));
  conn.query("SELECT * FROM users", function (err, result, fields) {
    let encryptedpasswd = crypto.createHash('md5').update(req.body["data"]["Passwd"]).digest("hex")
    console.log(encryptedpasswd);
    if (result[0]["username"] == req.body["data"]["Uname"]){
      if (encryptedpasswd == result[0]["password"]){
        console.log("Sikeres bejelentkezés.")
      }
      else{ console.log("Felhasználónév vagy jelszó téves."); }
    }
    else{ console.log("Felhasználónév vagy jelszó téves."); }
  });
});

app.post('/registration',(req, res) => {
  JSON.parse(JSON.stringify(req.body));
  let query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?);`;
  let username = req.body["data"]["Uname"];
  let password = crypto.createHash('md5').update(req.body["data"]["Passwd"]).digest("hex");
  let email = req.body["data"]["Email"];
  conn.query("SELECT * FROM users", function (err, result, fields){
    if (!result){
      if (result[0]["username"] != username && username.length <= 32 && username.length >= 2){
        conn.query(query, [username, password, email], (err, rows) => { 
          console.log("A regisztracio sikeres volt.");
      });}
      else { console.log("A felhasználó név foglalt."); }
    }
    else{
      conn.query(query, [username, password, email], (err, rows) => { console.log("A regisztracio sikeres volt."); });
    }
    
  });
});

app.listen(port, function () { console.log(`bs app listening at http://localhost:${port}`); });
