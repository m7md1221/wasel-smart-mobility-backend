const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/checkpointController");
const { checkAuth } = require("../middlewares/auth");
const { authorizeRole } = require("../middlewares/rolesAuthorize");

// Public
router.get("/",           ctrl.getAllCheckpoints);
router.get("/:id",        ctrl.getCheckpointById);
router.get("/:id/history",ctrl.getCheckpointHistory);

// Admin + Moderator only
router.post("/",               checkAuth, authorizeRole("ADMIN", "MODERATOR"), ctrl.createCheckpoint);
router.patch("/:id/status",    checkAuth, authorizeRole("ADMIN", "MODERATOR"), ctrl.updateCheckpointStatus);

module.exports = router;