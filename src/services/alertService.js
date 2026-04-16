const Alert = require("../models/alertModel");
const Subscription = require("../models/alertSubmodel");
const { calculateDistance } = require("../../utils/distanceCalculator") ; 
const Incident = require("../models/incidentsModel"); 
const Checkpoint = require("../models/checkpointModel"); 

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

      const distance = calculateDistance(
        latitude,
        longitude,
        sub.latitude,
        sub.longitude
      );

      return distance <= sub.radius_km;
    });
    let checkpointName = "your area";

    const incident = await Incident.findByPk(incident_id);
    if (incident && incident.checkpoint_id) {
      const checkpoint = await Checkpoint.findByPk(incident.checkpoint_id);
      if (checkpoint && checkpoint.name) {
        checkpointName = checkpoint.name;
      }
    }
    const readableCategory =
      category.charAt(0) + category.slice(1).toLowerCase();

    const emailBody = `Dear user,

A ${readableCategory.toLowerCase()} incident happened near ${checkpointName}.

You're receiving this alert based on your subscription.

- Wasel Palestine Team`;
    for (const sub of usersToNotify) {
      try { 
        await this.notificationService.send(sub.user_id, emailBody, "New Alert from Wasel Palestine 📢");
      } catch (err) {
        console.error(`Failed to notify user ${sub.user_id}: ${err.message}`);
      }
    }
/////checking for normalizarion//////////////////////
    console.log("Incoming incident category:", data.category);
console.log("Normalized alert category:", category);
subscriptions = await Subscription.findAll({ where: { category } });
console.log("Matching subscriptions:", subscriptions.length);
/////////////////////////////////////////
for (const sub of subscriptions) {
  console.log("Sub:", {
    user_id: sub.user_id,
    category: sub.category,
    latitude: sub.latitude,
    longitude: sub.longitude,
    radius_km: sub.radius_km,
    radius: sub.radius
  });
}
    return alert;
  }

  async getAlerts() {
    return await Alert.findAll();
  }
}

module.exports = AlertService;