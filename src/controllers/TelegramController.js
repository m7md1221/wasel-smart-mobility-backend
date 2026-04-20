const BotMessageHandler = require("../services/botMessageHandler");

class TelegramController {
  constructor() {
    this.botMessageHandler = new BotMessageHandler();
  }

  handleWebhook = async (req, res) => {
    try {
      const update = req.body;

      if (update.message) {
        await this.botMessageHandler.handleIncomingMessage(update.message);
      }

      return res.sendStatus(200);
    } catch (error) {
      console.error("Telegram webhook error:", error.message);
      return res.status(500).json({
        message: "Error handling Telegram webhook",
      });
    }
  };
}

module.exports = new TelegramController();