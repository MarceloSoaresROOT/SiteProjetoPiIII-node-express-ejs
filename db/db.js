const mysql = require('mysql2/promise');
const config = require('./config');

const pool = mysql.createPool({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  decimalNumbers: true // DECIMAL volta como número, não string
});

module.exports = pool;
