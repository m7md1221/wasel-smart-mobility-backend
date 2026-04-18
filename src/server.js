require("dotenv").config();
const http = require("http");
const app = require("./app");
const sequelize = require("./config/database");

<<<<<<< HEAD
// 🔹 تحديد البورت
=======
>>>>>>> 9c0a8c0 (Feature 3: Route Estimation improvements - Add better API key handling, input validation, logging, and error messages)
const port = process.env.PORT || 4000;

// 🔹 إنشاء السيرفر
const server = http.createServer(app);

// 🔹 تشغيل السيرفر
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// 🔹 الاتصال بقاعدة البيانات
sequelize.authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });