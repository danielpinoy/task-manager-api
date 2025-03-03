const mysql = require("mysql2/promise");
require("dotenv").config();

// local

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME || "task_manager",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// heruko
let pool;

// Check if running on Heroku (with JAWSDB)
if (process.env.JAWSDB_URL) {
  pool = mysql.createPool(process.env.JAWSDB_URL);
} else {
  // Local development connection
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "task_manager",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

module.exports = pool;
