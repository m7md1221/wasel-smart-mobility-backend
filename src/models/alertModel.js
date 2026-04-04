const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Alert = sequelize.define("Alert", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  incident_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "incidents", 
      key: "id",
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "alerts",
  timestamps: false, 
});

module.exports = Alert;