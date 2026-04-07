const nodemailer = require("nodemailer") ; 
const NotificationService = require("./notificationService");

class EmailService extends NotificationService {
   constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
    });
  }

    async send(userId, message) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userId.EMAIL,
      subject: "New Alert",
      text: message
    });
  }
}
module.exports = EmailService;