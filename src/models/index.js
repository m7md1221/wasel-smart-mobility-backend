try {
  const User = require("./userModel");
  const Report = require("./reportModel");
  const ReportVote = require("./reportVoteModel");
  const ModerationLog = require("./moderationLogsModel");
  const ReportComment = require("./reportCommentModel");

  // Define associations
  Report.belongsTo(User, {
    foreignKey: "user_id",
    as: "author",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  User.hasMany(Report, {
    foreignKey: "user_id",
    as: "reports",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Report.hasMany(ReportVote, {
    foreignKey: "report_id",
    as: "votes",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  ReportVote.belongsTo(Report, {
    foreignKey: "report_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  ReportVote.belongsTo(User, {
    foreignKey: "user_id",
    as: "voter",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  User.hasMany(ReportVote, {
    foreignKey: "user_id",
    as: "votes_cast",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Report.hasMany(ReportComment, {
    foreignKey: "report_id",
    as: "comments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  ReportComment.belongsTo(Report, {
    foreignKey: "report_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  ReportComment.belongsTo(User, {
    foreignKey: "user_id",
    as: "author",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  User.hasMany(ReportComment, {
    foreignKey: "user_id",
    as: "report_comments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  ModerationLog.belongsTo(User, {
    foreignKey: "performed_by",
    as: "moderator",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  User.hasMany(ModerationLog, {
    foreignKey: "performed_by",
    as: "moderation_logs",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // Self-referencing association for duplicates
  Report.belongsTo(Report, {
    foreignKey: "duplicate_of",
    as: "original_report",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  Report.hasMany(Report, {
    foreignKey: "duplicate_of",
    as: "duplicate_reports",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  module.exports = {
    User,
    Report,
    ReportVote,
    ModerationLog,
    ReportComment,
  };
} catch (error) {
  console.warn("Model associations warning:", error.message);
  module.exports = {};
}
