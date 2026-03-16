const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Checkpoint = sequelize.define("Checkpoint", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING(150),
  latitude: DataTypes.DOUBLE,
  longitude: DataTypes.DOUBLE,
  current_status: DataTypes.STRING(50),
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE
}, {
  tableName: "checkpoints",
  timestamps: false
});

module.exports = Checkpoint;