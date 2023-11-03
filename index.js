const express = require('express');
const mysql = require('mysql');
const app    = express();
const port   = 3000;
app.use(express.static('public')); 

const conn = mysql.createConnection( {
  host: 'localhost',
  user: 'wildemhu',
  port: "3306",
  password: 'Vw69b?(W4mmL',
  database: 'wildemhu_wildem'
});

app.listen(port, function () { console.log(`bs app listening at http://localhost:${port}`); });
