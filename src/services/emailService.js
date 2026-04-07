const nodemailer = require("nodemailer") ; 
const NotificationService = require("./notificationService");
const User = require("../models/userModel");
class EmailService extends NotificationService {
   constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
    });
  }

    async send(userId, message,title) {
   const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.email) {
      throw new Error("User does not have an email");
    }
    await this.transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: title,
      text: message
    });
  }
  }

module.exports = EmailService;