const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/checkpointController");
const { checkAuth } = require("../middlewares/auth");
const { authorizeRole } = require("../middlewares/rolesAuthorize");

// 🔹 Public routes
router.get("/", ctrl.getAllCheckpoints);
router.get("/:id", ctrl.getCheckpointById);
router.get("/:id/history", ctrl.getCheckpointHistory);

// 🔹 Admin + Moderator only

// Create checkpoint
router.post(
  "/",
  checkAuth,
  authorizeRole("ADMIN", "MODERATOR"),
  ctrl.createCheckpoint
);

// Update status (باستخدام PUT)
router.put(
  "/:id/status",
  checkAuth,
  authorizeRole("ADMIN", "MODERATOR"),
  ctrl.updateCheckpointStatus
);

module.exports = router;