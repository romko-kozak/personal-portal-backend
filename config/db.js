const {Sequelize} = require('sequelize');
const dotenv = require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'dbpassword';
const DB_NAME = process.env.DB_NAME || 'portal';
const DB_PORT = process.env.DB_PORT || 3306;

/*
 * USING require('sequelize');
 */

module.exports = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: 'mysql',
  host: DB_HOST,
  port: DB_PORT
});

/*
 * USING require('mysql2');
 */

/*
  const connectDB = async () => {
    try {
      const pool = await mysql.createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: 'portal',
        waitForConnections: true,
        connectionLimit: 10
      }).promise();

      console.log('\n               🔐 DB CONNECTION WAS SUCCESSFULL! 🗄');

      return pool;
    } catch (err) {
      console.error('\n                   🔒 DB CONNECTION ERROR 🤯: \n\n', err);
    }
  }

  module.exports = connectDB
*/