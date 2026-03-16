const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Alert = sequelize.define("Alert", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  incident_id: DataTypes.INTEGER,
  created_at: DataTypes.DATE
}, {
  tableName: "alerts",
  timestamps: false
});

module.exports = Alert;