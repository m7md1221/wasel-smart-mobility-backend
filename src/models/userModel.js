const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING(100),
  email: {
    type: DataTypes.STRING(150),
    unique: true
  },
  password: DataTypes.TEXT,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_authorized: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  role: DataTypes.STRING(20),
  confidence_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE
}, {
  tableName: "users",
  timestamps: false
});

module.exports = User;