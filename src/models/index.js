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
  });

  User.hasMany(Report, {
    foreignKey: "user_id",
    as: "reports",
  });

  Report.hasMany(ReportVote, {
    foreignKey: "report_id",
    as: "votes",
  });

  ReportVote.belongsTo(Report, {
    foreignKey: "report_id",
  });

  ReportVote.belongsTo(User, {
    foreignKey: "user_id",
    as: "voter",
  });

  User.hasMany(ReportVote, {
    foreignKey: "user_id",
    as: "votes_cast",
  });

  Report.hasMany(ReportComment, {
    foreignKey: "report_id",
    as: "comments",
  });

  ReportComment.belongsTo(Report, {
    foreignKey: "report_id",
  });

  ReportComment.belongsTo(User, {
    foreignKey: "user_id",
    as: "author",
  });

  User.hasMany(ReportComment, {
    foreignKey: "user_id",
    as: "report_comments",
  });

  ModerationLog.belongsTo(User, {
    foreignKey: "performed_by",
    as: "moderator",
  });

  User.hasMany(ModerationLog, {
    foreignKey: "performed_by",
    as: "moderation_logs",
  });

  // Self-referencing association for duplicates
  Report.belongsTo(Report, {
    foreignKey: "duplicate_of",
    as: "original_report",
  });

  Report.hasMany(Report, {
    foreignKey: "duplicate_of",
    as: "duplicate_reports",
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
