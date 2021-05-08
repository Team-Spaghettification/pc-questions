const mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'questions'
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    throw error;
  } else {
    console.log('mysql connected');
  }
});

module.exports = connection;