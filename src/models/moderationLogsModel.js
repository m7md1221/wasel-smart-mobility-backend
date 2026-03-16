const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ModerationLog = sequelize.define("ModerationLog", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  event_type: DataTypes.STRING(20),
  event_id: DataTypes.INTEGER,
  performed_by: DataTypes.INTEGER,
  action: DataTypes.STRING(50),
  reason: DataTypes.TEXT,
  created_at: DataTypes.DATE
}, {
  tableName: "moderation_logs",
  timestamps: false
});

module.exports = ModerationLog;