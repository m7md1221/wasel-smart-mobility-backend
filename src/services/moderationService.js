const { Report, ModerationLog } = require("../models");
const { Op } = require("sequelize");

const MODERATION_ACTIONS = ["approve", "reject", "flag_review", "hide", "unhide"];
const MODERATION_EVENT_TYPES = {
  REPORT: "report",
  COMMENT: "comment",
  USER: "user",
};

async function logModerationAction(
  eventType,
  eventId,
  performedBy,
  action,
  reason = null
) {
  if (!MODERATION_ACTIONS.includes(action)) {
    throw {
      status: 400,
      message: `Action must be one of: ${MODERATION_ACTIONS.join(", ")}`,
    };
  }

  const log = await ModerationLog.create({
    event_type: eventType,
    event_id: eventId,
    performed_by: performedBy,
    action,
    reason,
    created_at: new Date(),
  });

  return log;
}

async function getAuditTrail(reportId, limit = 50) {
  const logs = await ModerationLog.findAll({
    where: {
      event_type: MODERATION_EVENT_TYPES.REPORT,
      event_id: reportId,
    },
    limit,
    order: [["created_at", "DESC"]],
  });

  return logs.map((log) => ({
    id: log.id,
    action: log.action,
    reason: log.reason,
    performed_by: log.performed_by,
    timestamp: log.created_at,
  }));
}

async function moderateReport(reportId, moderatorId, action, reason) {
  if (!MODERATION_ACTIONS.includes(action)) {
    throw {
      status: 400,
      message: `Action must be one of: ${MODERATION_ACTIONS.join(", ")}`,
    };
  }

  const report = await Report.findByPk(reportId);
  if (!report) {
    throw {
      status: 404,
      message: "Report not found",
    };
  }

  let newStatus = report.status;

  switch (action) {
    case "approve":
      newStatus = "approved";
      break;
    case "reject":
      newStatus = "rejected";
      break;
    case "flag_review":
      newStatus = "flagged";
      break;
    case "hide":
      newStatus = "hidden";
      break;
    case "unhide":
      newStatus = "pending"; // Reset to pending
      break;
  }

  report.status = newStatus;
  report.updated_at = new Date();
  await report.save();

  // Log the moderation action
  await logModerationAction(
    MODERATION_EVENT_TYPES.REPORT,
    reportId,
    moderatorId,
    action,
    reason
  );

  return {
    report: report.toJSON(),
    moderation_log: {
      action,
      reason,
      performed_by: moderatorId,
      timestamp: new Date(),
    },
  };
}

async function getModerationQueueStats() {
  const pending = await Report.count({ where: { status: "pending" } });
  const flagged = await Report.count({ where: { status: "flagged" } });
  const approved = await Report.count({ where: { status: "approved" } });
  const rejected = await Report.count({ where: { status: "rejected" } });

  return {
    pending_review: pending,
    flagged_for_review: flagged,
    approved: approved,
    rejected: rejected,
    total_in_queue: pending + flagged,
  };
}

async function getPendingReportsForModeration(limit = 20, offset = 0) {
  const reports = await Report.findAll({
    where: {
      status: {
        [Op.in]: ["pending", "flagged"],
      },
    },
    limit,
    offset,
    order: [["created_at", "ASC"]],
  });

  const total = await Report.count({
    where: {
      status: {
        [Op.in]: ["pending", "flagged"],
      },
    },
  });

  return {
    reports,
    pagination: {
      total,
      limit,
      offset,
      pages: Math.ceil(total / limit),
    },
  };
}

async function getModerationLogs(filters = {}) {
  const where = {};

  if (filters.event_type) {
    where.event_type = filters.event_type;
  }

  if (filters.action) {
    where.action = filters.action;
  }

  if (filters.performed_by) {
    where.performed_by = filters.performed_by;
  }

  if (filters.start_date && filters.end_date) {
    where.created_at = {
      [Op.between]: [
        new Date(filters.start_date),
        new Date(filters.end_date),
      ],
    };
  }

  const limit = Math.min(filters.limit || 50, 200);
  const offset = (filters.page || 0) * limit;

  const logs = await ModerationLog.findAll({
    where,
    limit,
    offset,
    order: [["created_at", "DESC"]],
  });

  const total = await ModerationLog.count({ where });

  return {
    logs,
    pagination: {
      total,
      limit,
      offset,
      pages: Math.ceil(total / limit),
    },
  };
}

async function autoFlagReports() {
  // Auto-flag reports with very low confidence scores
  const lowConfidenceReports = await Report.findAll({
    where: {
      status: "pending",
      confidence_score: {
        [Op.lt]: 20,
      },
    },
  });

  for (const report of lowConfidenceReports) {
    report.status = "flagged";
    report.updated_at = new Date();
    await report.save();

    await logModerationAction(
      MODERATION_EVENT_TYPES.REPORT,
      report.id,
      null,
      "flag_review",
      "Automatically flagged: Low confidence score"
    );
  }

  return lowConfidenceReports.length;
}

async function getDuplicateReports() {
  const duplicates = await Report.findAll({
    where: {
      duplicate_of: {
        [Op.ne]: null,
      },
    },
    order: [["duplicate_of", "ASC"]],
  });

  return duplicates;
}

module.exports = {
  moderateReport,
  logModerationAction,
  getAuditTrail,
  getModerationQueueStats,
  getPendingReportsForModeration,
  getModerationLogs,
  autoFlagReports,
  getDuplicateReports,
  MODERATION_ACTIONS,
  MODERATION_EVENT_TYPES,
};
