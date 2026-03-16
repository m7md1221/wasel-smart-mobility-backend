const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ReportVote = sequelize.define("ReportVote", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  report_id: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
  vote: DataTypes.STRING(10),
  created_at: DataTypes.DATE
}, {
  tableName: "report_votes",
  timestamps: false
});

module.exports = ReportVote;