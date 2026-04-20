const axios = require("axios");
const NotificationService = require("./notificationService");

class TelegramService extends NotificationService {
  constructor() {
    super();
    this.token = process.env.TELEGRAM_BOT_TOKEN;

    if (!this.token) {
      throw new Error("TELEGRAM_BOT_TOKEN is missing in environment variables");
    }

    this.baseUrl = `https://api.telegram.org/bot${this.token}`;
  }

  async send(chatId, message, title = "") {
    const text = title ? `*${title}*\n\n${message}` : message;

    try {
      const response = await axios.post(`${this.baseUrl}/sendMessage`, {
        chat_id: chatId,
        text,
        parse_mode: "Markdown"
      });

      return response.data;
    } catch (error) {
      console.error("Telegram send error:", error.response?.data || error.message);
      throw new Error("Failed to send Telegram message");
    }
  }
}

module.exports = TelegramService;