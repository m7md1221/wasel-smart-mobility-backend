const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CheckpointStatusHistory = sequelize.define("CheckpointStatusHistory", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  checkpoint_id: DataTypes.INTEGER,
  status: DataTypes.STRING(50),
  changed_at: DataTypes.DATE,
  changed_by: DataTypes.INTEGER
}, {
  tableName: "checkpoint_status_history",
  timestamps: false
});

module.exports = CheckpointStatusHistory;