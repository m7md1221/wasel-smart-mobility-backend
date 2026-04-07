
const axios = require("axios");
const NotificationService = require("./notificationService");

class TelegramService extends NotificationService {
  constructor() {
    super();
    this.token = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
  }

  async send(userId, message) {
    await axios.post(`https://api.telegram.org/bot${this.token}/sendMessage`, {
      chat_id: this.chatId, // could map userId → chatId
      text: message
    });
  }
}

module.exports = TelegramService;