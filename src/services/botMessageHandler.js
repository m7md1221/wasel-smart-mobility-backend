const citySearchService = require("./citySearchService");
const TelegramService = require("./telegramService");

class BotMessageHandler {
  constructor() {
    this.citySearchService = new citySearchService();
    this.telegramService = new TelegramService();
  }

  formatCheckpointReply(city, checkpoints) {
    if (!checkpoints.length) {
      return `No checkpoints found for city: ${city}`;
    }

    const lines = checkpoints.map(
      (checkpoint) => `- ${checkpoint.name}: ${checkpoint.current_status}`
    );

    return `Checkpoints in ${city}:\n\n${lines.join("\n")}`;
  }

  formatHelpMessage(cities) {
    if (!cities.length) {
      return "Please send a city name.";
    }

    return `Send a city name to get its checkpoints.\n\nAvailable cities:\n${cities.join("\n")}`;
  }

  async handleIncomingMessage(message) {
    const chatId = message.chat?.id;
    const text = message.text?.trim();

    if (!chatId) {
      throw new Error("Missing Telegram chat id");
    }

    if (!text) {
      await this.telegramService.send(chatId, "Please send a city name.");
      return;
    }

    if (text === "/start" || text === "/help") {
      const cities = await this.citySearchService.getDistinctCities();
      const helpMessage = this.formatHelpMessage(cities);
      await this.telegramService.send(chatId, helpMessage, "Wasel Palestine Bot");
      return;
    }
    if (text === "/cities") {
  const cities = await this.citySearchService.getDistinctCities();
  await this.telegramService.send(chatId, cities.join("\n"), "Available Cities");
  return;
}

    const checkpoints = await this.citySearchService.getCheckpointsByCity(text);

    if (!checkpoints.length) {
      const cities = await this.citySearchService.getDistinctCities();
      const availableCities = cities.length
        ? `\n\nAvailable cities:\n${cities.join("\n")}`
        : "";

      await this.telegramService.send(
        chatId,
        `No checkpoints found for city: ${text}${availableCities}`
      );
      return;
    }

    const cityName = checkpoints[0].city;
    const reply = this.formatCheckpointReply(cityName, checkpoints);

    await this.telegramService.send(chatId, reply, "Checkpoint Status");
  }
}

module.exports = BotMessageHandler;