const Alert = require("../models/alertModel");
const Subscription = require("../models/alertSubmodel");

class AlertService {
  constructor(notificationServices = []) {
    this.notificationServices = notificationServices;
  }

  async createAlert(data) {
    const { incident_id, category, message, latitude, longitude } = data;
    const alert = await Alert.create({ incident_id, category, message, latitude, longitude });
    const subscriptions = await Subscription.findAll({ where: { category } });
    const usersToNotify = subscriptions.filter(sub => {
      if (!latitude || !longitude || !sub.latitude || !sub.longitude) return true;
      const distance = this.calculateDistance(latitude, longitude, sub.latitude, sub.longitude);
      return distance <= sub.radius_km;
    });


    for (const sub of usersToNotify) {
      for (const service of this.notificationServices) {
        await service.send(sub.user_id, message, "New Alert");
      }
    }

    return alert;
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  async getAlerts() {
    return await Alert.findAll();
  }
}

module.exports = AlertService;