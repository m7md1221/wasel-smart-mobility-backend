require("dotenv").config();
const http = require("http");
const app = require("./app");
const sequelize = require("./config/database");
const nodemailer = require("nodemailer"); // testing

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

////////////////////testing//////////////////////////////  
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const mailOptions = {
  from: process.env.EMAIL,
  to: "s12216999@stu.najah.edu",
  subject: "Test Email from Wasel Smart Mobility",
  text: "This is a test email sent from the Wasel Smart Mobility backend service."
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});