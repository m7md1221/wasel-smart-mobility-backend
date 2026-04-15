const Alert = require("../models/alertModel");
const Subscription = require("../models/alertSubmodel");

class AlertService {
  constructor(notificationService) {
    this.notificationService = notificationService;
  }

  async createAlert(data) {
    let { incident_id, category, message, latitude, longitude } = data;

    // store category in capital letters
    category = category?.trim().toUpperCase();

    const alert = await Alert.create({
      incident_id,
      category,
      message,
      latitude,
      longitude
    });

    const subscriptions = await Subscription.findAll({
      where: { category }
    });

    const usersToNotify = subscriptions.filter(sub => {
      if (
        latitude == null ||
        longitude == null ||
        sub.latitude == null ||
        sub.longitude == null
      ) {
        return false;
      }

      const distance = this.calculateDistance(
        latitude,
        longitude,
        sub.latitude,
        sub.longitude
      );

      return distance <= sub.radius_km;
    });
    const emailBody = `
A new alert has been created.

Category: ${category}
Message: ${message}
Location: ${latitude}, ${longitude}
`; 
    for (const sub of usersToNotify) {
      try {
        await this.notificationService.send(sub.user_id, emailBody, "New Alert");
      } catch (err) {
        console.error(`Failed to notify user ${sub.user_id}: ${err.message}`);
      }
    }

    return alert;
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  async getAlerts() {
    return await Alert.findAll();
  }
}

module.exports = AlertService;