const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AlertSubscription = sequelize.define("AlertSubscription", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  latitude: DataTypes.DOUBLE,
  longitude: DataTypes.DOUBLE,
  radius_km: DataTypes.INTEGER,
  category: DataTypes.STRING(50),
  created_at: DataTypes.DATE
}, {
  tableName: "alert_subscriptions",
  timestamps: false
});

module.exports = AlertSubscription;