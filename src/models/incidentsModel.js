const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Incident = sequelize.define("Incident", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: DataTypes.STRING(200),
  category: DataTypes.STRING(50),
  description: DataTypes.TEXT,
  severity: DataTypes.STRING(20),
  status: DataTypes.STRING(20),
  latitude: DataTypes.DOUBLE,
  longitude: DataTypes.DOUBLE,
  checkpoint_id: DataTypes.INTEGER,
  created_by: DataTypes.INTEGER,
  verified_by: DataTypes.INTEGER,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
  closed_at: DataTypes.DATE
}, {
  tableName: "incidents",
  timestamps: false
});

module.exports = Incident;