const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ExternalApiCache = sequelize.define("ExternalApiCache", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  provider_name: DataTypes.STRING(100),
  request_hash: DataTypes.TEXT,
  response_data: DataTypes.JSONB,
  expires_at: DataTypes.DATE,
  created_at: DataTypes.DATE
}, {
  tableName: "external_api_cache",
  timestamps: false
});

module.exports = ExternalApiCache;


