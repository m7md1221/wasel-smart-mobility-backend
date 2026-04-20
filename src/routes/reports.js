const express = require("express");
const reportController = require("../controllers/reportController");
const authentication = require("../middlewares/auth");
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
  reportController.getModerationQueue
);
router.get(
  "/moderation/stats",
  authentication.checkAuth,
  reportController.getModerationStats
);
router.get(
  "/moderation/logs",
  authentication.checkAuth,
  reportController.getModerationLogs
);
router.get(
  "/moderation/duplicates",
  authentication.checkAuth,
  reportController.getDuplicateReports
);

// Public endpoints
router.get("/", reportController.getReports);
router.get("/stats", reportController.getReportStats);

// Single report endpoints (AFTER more specific routes)
router.get("/:id", reportController.getReportById);
router.get("/:id/audit", reportController.getAuditTrail);
router.get("/:id/comments", reportController.getComments);

// Authenticated user endpoints
router.post(
  "/",
  authentication.checkAuth,
  validate(submitReportValidator),
  reportController.submitReport
);
router.post(
  "/:id/vote",
  authentication.checkAuth,
  validate(voteValidator),
  reportController.voteOnReport
);
router.post(
  "/:id/comments",
  authentication.checkAuth,
  validate(commentValidator),
  reportController.addComment
);

// Moderation endpoints (moderator/admin only)
router.post(
  "/:id/moderate",
  authentication.checkAuth,
  validate(moderationValidator),
  reportController.moderateReport
);

router.delete("/:id", authentication.checkAuth, reportController.deleteReport);

// Delete comment endpoint
router.delete(
  "/:id/comments/:commentId",
  authentication.checkAuth,
  reportController.deleteComment
);

module.exports = router;
