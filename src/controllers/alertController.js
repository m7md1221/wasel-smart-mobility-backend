const AlertService = require("../services/alertService");
const EmailService = require("../services/emailService");
const TelegramService = require("../services/telegramService");

const alertService = new AlertService([new EmailService(), new TelegramService()]);

exports.createAlert = async (req, res) => {
  try {
    const alert = await alertService.createAlert(req.body);
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await alertService.getAlerts();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};