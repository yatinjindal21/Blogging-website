const mysql = require('mysql2');
// require('dotenv').config();

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Penguin@2004",
    database: "youandme",
    dateStrings: true
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
    } else {
      console.log('Connected to MySQL');
    }
});
  
module.exports = connection;