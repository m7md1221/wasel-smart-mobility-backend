const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ReportComment = sequelize.define("ReportComment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  report_id: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
  comment: DataTypes.TEXT,
  created_at: DataTypes.DATE
}, {
  tableName: "report_comments",
  timestamps: false
});

module.exports = ReportComment;