const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/checkpointController");
const { checkAuth } = require("../middlewares/auth");
const { authorizeRole } = require("../middlewares/rolesAuthorize");

//Public routes
router.get("/", (req, res, next) => {
  // #swagger.tags = ['Checkpoints']
  // #swagger.summary = 'Get all checkpoints'
  return ctrl.getAllCheckpoints(req, res, next);
});

router.get("/:id", (req, res, next) => {
  // #swagger.tags = ['Checkpoints']
  // #swagger.summary = 'Get a checkpoint by ID'
  return ctrl.getCheckpointById(req, res, next);
});

router.get("/:id/history", (req, res, next) => {
  // #swagger.tags = ['Checkpoints']
  // #swagger.summary = 'Get checkpoint status history'
  return ctrl.getCheckpointHistory(req, res, next);
});

// Admin + Moderator only

// Create checkpoint
router.post(
  "/",
  checkAuth,
  authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
    // #swagger.tags = ['Checkpoints']
    // #swagger.summary = 'Create a new checkpoint (Admin and Moderator only)'
    // #swagger.security = [{ BearerAuth: [] }]
    return ctrl.createCheckpoint(req, res, next);
  }
);

// Update status
router.put(
  "/:id/status",
  checkAuth,
  authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
    // #swagger.tags = ['Checkpoints']
    // #swagger.summary = 'Update checkpoint status (Admin and Moderator only)'
    // #swagger.security = [{ BearerAuth: [] }]
    return ctrl.updateCheckpointStatus(req, res, next);
  }
);


module.exports = router;