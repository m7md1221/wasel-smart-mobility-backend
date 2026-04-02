<<<<<<< HEAD
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
=======
 require("dotenv").config();
>>>>>>> deema
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false
  }
);

module.exports = sequelize;
