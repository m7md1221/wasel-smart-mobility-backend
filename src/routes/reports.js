const express = require("express");
const reportController = require("../controllers/reportController");
const authentication = require("../middlewares/auth");
const authorization = require("../middlewares/rolesAuthorize");
const validate = require("../middlewares/validateMiddleware");
const {
  submitReportValidator,
  voteValidator,
  moderationValidator,
  commentValidator,
} = require("../validators/reportValidator");

const router = express.Router();

// Moderation endpoints first (more specific) - MUST BE BEFORE /:id routes
router.get(
  "/moderation/queue",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
  // #swagger.tags = ['Reports']
  // #swagger.summary = 'Get moderation queue (Moderator and Admin only)'
  // #swagger.security = [{ BearerAuth: [] }]
  return reportController.getModerationQueue(req, res, next);
  }
);

router.get(
  "/moderation/stats",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
  // #swagger.tags = ['Reports']
  // #swagger.summary = 'Get moderation statistics (Moderator and Admin only)'
  // #swagger.security = [{ BearerAuth: [] }]
  return reportController.getModerationStats(req, res, next);
  }
);

router.get(
  "/moderation/logs",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
  // #swagger.tags = ['Reports']
  // #swagger.summary = 'Get moderation logs (Moderator and Admin only)'
  // #swagger.security = [{ BearerAuth: [] }]
  return reportController.getModerationLogs(req, res, next);
  }
);

router.get(
  "/moderation/duplicates",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
  // #swagger.tags = ['Reports']
  // #swagger.summary = 'Get potential duplicate reports (Moderator and Admin only)'
  // #swagger.security = [{ BearerAuth: [] }]
  return reportController.getDuplicateReports(req, res, next);
  }
);

// Public endpoints
router.get("/", (req, res, next) => {
  // #swagger.tags = ['Reports']
  // #swagger.summary = 'Retrieve all reports' information and status'
  return reportController.getReports(req, res, next);
});

router.get("/stats", (req, res, next) => {
  // #swagger.tags = ['Reports']
  // #swagger.summary = 'Get report statistics'
  return reportController.getReportStats(req, res, next);
});

// Single report endpoints (AFTER more specific routes)
router.get("/:id", (req, res, next) => {
  // #swagger.tags = ['Reports']
  // #swagger.summary = 'Get a report by ID'
  return reportController.getReportById(req, res, next);
});

router.get("/:id/audit", (req, res, next) => {
  // #swagger.tags = ['Reports']
  // #swagger.summary = 'Get audit trail for a report'
  return reportController.getAuditTrail(req, res, next);
});

router.get("/:id/comments", (req, res, next) => {
  // #swagger.tags = ['Reports']
  // #swagger.summary = 'Get comments for a report'
  return reportController.getComments(req, res, next);
});

// Authenticated user endpoints
router.post(
  "/",
  authentication.checkAuth,
  validate(submitReportValidator),
  (req, res, next) => {
    // #swagger.tags = ['Reports']
    // #swagger.summary = 'Submit a new report'
    // #swagger.security = [{ BearerAuth: [] }]
    return reportController.submitReport(req, res, next);
  }
);

router.post(
  "/:id/vote",
  authentication.checkAuth,
  validate(voteValidator),
  (req, res, next) => {
    // #swagger.tags = ['Reports']
    // #swagger.summary = 'Vote on a report'
    // #swagger.security = [{ BearerAuth: [] }]
    return reportController.voteOnReport(req, res, next);
  }
);

router.post(
  "/:id/comments",
  authentication.checkAuth,
  validate(commentValidator),
  (req, res, next) => {
    // #swagger.tags = ['Reports']
    // #swagger.summary = 'Add a comment to a report'
    // #swagger.security = [{ BearerAuth: [] }]
    return reportController.addComment(req, res, next);
  }
);

// Moderation endpoints (moderator/admin only)
router.post(
  "/:id/moderate",
  authentication.checkAuth,authorization.authorizeRole("ADMIN", "MODERATOR"),
  validate(moderationValidator),
  (req, res, next) => {
    // #swagger.tags = ['Reports']
    // #swagger.summary = 'Moderate a report (Moderator and Admin only)'
    // #swagger.security = [{ BearerAuth: [] }]
    return reportController.moderateReport(req, res, next);
  }
);

router.delete("/:id", authentication.checkAuth,authorization.authorizeRole("ADMIN", "MODERATOR"), (req, res, next) => {
  // #swagger.tags = ['Reports']
  // #swagger.summary = 'Delete a report (Moderator and Admin only)'
  // #swagger.security = [{ BearerAuth: [] }]
  return reportController.deleteReport(req, res, next);
});

// Delete comment endpoint
router.delete(
  "/:id/comments/:commentId",
  authentication.checkAuth,
  (req, res, next) => {
    // #swagger.tags = ['Reports']
    // #swagger.summary = 'Delete a comment from a report'
    // #swagger.security = [{ BearerAuth: [] }]
    return reportController.deleteComment(req, res, next);
  }
);

module.exports = router;
