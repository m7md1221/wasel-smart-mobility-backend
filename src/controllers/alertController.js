const AlertService = require("../services/alertService");
const EmailService = require("../services/emailService");

const alertService = new AlertService(new EmailService());

exports.createAlert = async (req, res) => {
  try {
    const alert = await alertService.createAlert(req.body);

    res.status(201).json({
      message: "alert created successfully",
      data: {
        alertId: alert.id,
        incident_id: alert.incident_id,
        category: alert.category,
        message: alert.message,
        latitude: alert.latitude,
        longitude: alert.longitude,
        createdAt: alert.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await alertService.getAlerts();
    res.json({
      message: "alerts retrieved successfully",
      data: alerts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};