 const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Report = sequelize.define("Report", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  title: DataTypes.STRING(200),
  latitude: DataTypes.DOUBLE,
  longitude: DataTypes.DOUBLE,
  category: DataTypes.STRING(50),
  description: DataTypes.TEXT,
  status: DataTypes.STRING(20),
  confidence_score: DataTypes.INTEGER,
  duplicate_of: DataTypes.INTEGER,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE
}, {
  tableName: "reports",
  timestamps: false
});

module.exports = Report;