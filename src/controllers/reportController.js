const reportService = require("../services/reportService");
const moderationService = require("../services/moderationService");
const roles = require("../constants/roles");

async function submitReport(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Only CITIZEN and ADMIN can submit reports
    if (req.user?.role !== roles.CITIZEN && req.user?.role !== roles.ADMIN) {
      return res.status(403).json({
        message: "Only citizens can submit reports",
      });
    }

    const result = await reportService.submitReport(userId, req.body);

    let statusCode = 201;
    let message = "Report submitted successfully";

    if (result.isDuplicate) {
      statusCode = 200;
      message =
        "Report submitted successfully. Similar reports exist in this area.";
    }

    return res.status(statusCode).json({
      message,
      data: result.report,
      duplicates: result.duplicates,
      isDuplicate: result.isDuplicate,
    });
  } catch (error) {
    console.error("SubmitReport Error:", error);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      message: error.message || "Internal server error",
      errors: error.errors,
    });
  }
}

async function getReports(req, res) {
  try {
    const filters = {
      category: req.query.category,
      status: req.query.status,
      latitude: req.query.latitude ? parseFloat(req.query.latitude) : null,
      longitude: req.query.longitude ? parseFloat(req.query.longitude) : null,
      radius_km: req.query.radius_km
        ? parseFloat(req.query.radius_km)
        : null,
      min_confidence: req.query.min_confidence
        ? parseInt(req.query.min_confidence)
        : null,
      limit: req.query.limit ? parseInt(req.query.limit) : 20,
      page: req.query.page ? parseInt(req.query.page) : 0,
    };

    const result = await reportService.getReports(filters);

    return res.status(200).json({
      message: "Reports retrieved successfully",
      data: result.reports,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getReportById(req, res) {
  try {
    const { id } = req.params;
    const report = await reportService.getReportById(id);

    return res.status(200).json({
      message: "Report retrieved successfully",
      data: report,
    });
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      message: error.message,
    });
  }
}

async function voteOnReport(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { id } = req.params;
    const { vote } = req.body;

    const result = await reportService.voteOnReport(id, userId, vote);

    return res.status(200).json({
      message: "Vote recorded successfully",
      data: result,
    });
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      message: error.message,
    });
  }
}

async function getReportStats(req, res) {
  try {
    const { category } = req.query;
    const stats = await reportService.getReportStats(category);

    return res.status(200).json({
      message: "Report statistics retrieved",
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function moderateReport(req, res) {
  try {
    const moderatorId = req.user?.id;
    if (!moderatorId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if user is a moderator/admin
    if (req.user?.role !== roles.ADMIN && req.user?.role !== roles.MODERATOR) {
      return res.status(403).json({
        message: "Only moderators can perform moderation actions",
      });
    }

    const { id } = req.params;
    const { action, reason } = req.body;

    const result = await moderationService.moderateReport(
      id,
      moderatorId,
      action,
      reason
    );

    return res.status(200).json({
      message: `Report ${action} successfully`,
      data: result,
    });
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      message: error.message,
    });
  }
}

async function getAuditTrail(req, res) {
  try {
    const { id } = req.params;
    const { limit } = req.query;

    const auditTrail = await moderationService.getAuditTrail(
      id,
      limit ? parseInt(limit) : 50
    );

    return res.status(200).json({
      message: "Audit trail retrieved successfully",
      data: auditTrail,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getModerationQueue(req, res) {
  try {
    // Check admin/moderator access
    if (req.user?.role !== roles.ADMIN && req.user?.role !== roles.MODERATOR) {
      return res.status(403).json({
        message: "Only moderators can access the moderation queue",
      });
    }

    const { limit, page } = req.query;
    const result = await moderationService.getPendingReportsForModeration(
      limit ? parseInt(limit) : 20,
      page ? parseInt(page) * parseInt(limit || 20) : 0
    );

    return res.status(200).json({
      message: "Moderation queue retrieved",
      data: result.reports,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getModerationStats(req, res) {
  try {
    // Check admin/moderator access
    if (req.user?.role !== roles.ADMIN && req.user?.role !== roles.MODERATOR) {
      return res.status(403).json({
        message: "Only moderators can access moderation statistics",
      });
    }

    const stats = await moderationService.getModerationQueueStats();

    return res.status(200).json({
      message: "Moderation statistics retrieved",
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getModerationLogs(req, res) {
  try {
    // Check admin access
    if (req.user?.role !== roles.ADMIN) {
      return res.status(403).json({
        message: "Only admins can access moderation logs",
      });
    }

    const filters = {
      event_type: req.query.event_type,
      action: req.query.action,
      performed_by: req.query.performed_by
        ? parseInt(req.query.performed_by)
        : null,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      limit: req.query.limit ? parseInt(req.query.limit) : 50,
      page: req.query.page ? parseInt(req.query.page) : 0,
    };

    const result = await moderationService.getModerationLogs(filters);

    return res.status(200).json({
      message: "Moderation logs retrieved",
      data: result.logs,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getDuplicateReports(req, res) {
  try {
    const duplicates = await moderationService.getDuplicateReports();

    return res.status(200).json({
      message: "Duplicate reports retrieved",
      data: duplicates,
      count: duplicates.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function addComment(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { id } = req.params;
    const { comment } = req.body;

    const result = await reportService.addComment(id, userId, comment);

    return res.status(201).json({
      message: "Comment added successfully",
      data: result,
    });
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      message: error.message,
    });
  }
}

async function getComments(req, res) {
  try {
    const { id } = req.params;
    const { limit, page } = req.query;

    const result = await reportService.getReportComments(
      id,
      limit ? parseInt(limit) : 50,
      page ? parseInt(page) * parseInt(limit || 50) : 0
    );

    return res.status(200).json({
      message: "Comments retrieved successfully",
      data: result.comments,
      pagination: result.pagination,
    });
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      message: error.message,
    });
  }
}

async function deleteComment(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { id, commentId } = req.params;

    const result = await reportService.deleteComment(commentId, userId);

    return res.status(200).json({
      message: result.message,
      data: result,
    });
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      message: error.message,
    });
  }
}

async function deleteReport(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { id } = req.params;

    const result = await reportService.deleteReport(id, {
      id: userId,
      role: req.user?.role,
    });

    return res.status(200).json({
      message: result.message,
      data: result,
    });
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      message: error.message,
    });
  }
}

module.exports = {
  submitReport,
  getReports,
  getReportById,
  voteOnReport,
  getReportStats,
  moderateReport,
  getAuditTrail,
  getModerationQueue,
  getModerationStats,
  getModerationLogs,
  getDuplicateReports,
  addComment,
  getComments,
  deleteComment,
  deleteReport,
};
