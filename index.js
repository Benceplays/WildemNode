const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const crypto = require('crypto')
const bcrypt = require("bcrypt")
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

app.post('/login', (req, res) => {
  JSON.parse(JSON.stringify(req.body));
  var sql = `SELECT * FROM users WHERE username='${req.body["data"]["Uname"]}'`;
  conn.query(sql, async function (err, result, fields) {
    if(result.length == 1){
      let isValid = await bcrypt.compare(req.body["data"]["Passwd"], result[0]["password"])
      if (isValid) {
        console.log("Sikeres bejelentkezés.")
      }  
      else {
        console.log("Felhasználónév vagy jelszó téves.")
      }
    }else {
        console.log("Felhasználónév vagy jelszó téves.")
      }
  });
});

app.post('/registration',async (req, res) => { // Frontend oldalon majd, email formátumot is nézze, jelszó/felhasználó hosszt, stb.
  JSON.parse(JSON.stringify(req.body));
  let sql = `INSERT INTO users (username, password, email) VALUES (?, ?, ?);`;
  let username = req.body["data"]["Uname"];
  let salt = bcrypt.genSaltSync(12);
  let password = await bcrypt.hash(req.body["data"]["Passwd"], salt);
  let email = req.body["data"]["Email"];
  //Ha a felhasználó név nem foglalt
  conn.query(`SELECT * FROM users WHERE username='${req.body["data"]["Uname"]}'`, (err, result) =>{
    if(result.length == 0){
    //Ha az email nem foglalt
      conn.query(`SELECT * FROM users WHERE email='${req.body["data"]["Email"]}'`, (err, result) =>{
       if(result.length == 0){
        conn.query(sql, [username, password, email], (err, rows) => { 
          console.log("A regisztracio sikeres volt.");
        })
       }
       else{
         console.log("Ezzel az email címmel már regisztráltak");
       }
      })

    }
    else{
      console.log("Már létezik ilyen felhasználónév");
    }
  })
});

app.post('/createServer', (req, res) => {
  let query = `INSERT INTO servers (servername, serverip, serverdescription, servercategory) VALUES (?, ?, ?, ?);`;
  let existsql = `SELECT * FROM servers WHERE servername='${req.body["data"]["SName"]}';`;
  conn.query(existsql, function (err, result, fields) {
    if (err) {
      console.error('Adatbázis hiba: ' + err);
      res.send('Hiba történt az adatbáziskapcsolat során.');
    } else {
      if (!result.length){
        conn.query(query, [req.body["data"]["SName"], req.body["data"]["SIp"], req.body["data"]["SDescription"], req.body["data"]["SCategory"]], (err, rows)=> {
          console.log("Sikeres szerver regisztracio!");
        });
      }
      else{
        console.log("A megadott nevvel mar letezik szerver!")
      }
    }
  });
});

app.post('/ServerSearch', (req, res) => {
    let query = `SELECT * FROM servers;`;
    conn.query(query, function (err, result, fields){
      if (err) {
          console.error('Adatbázis hiba: ' + err);
          res.send('Hiba történt az adatbáziskapcsolat során.');
      } else {
          return res.send("teszt");
      }
    });
});

app.listen(port, function () { console.log(`bs app listening at http://localhost:${port}`); });
