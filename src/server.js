require("dotenv").config();
const http = require("http");
const app = require("./app");

// Initialize models and associations
require("./models");

const port = 4000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const sequelize = require("./config/database");
sequelize.authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });


  