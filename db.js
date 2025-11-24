const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Frnsco18",
  database: "pixelate"
});

module.exports = db;
