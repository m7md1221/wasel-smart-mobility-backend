const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/incidentController");
const { checkAuth } = require("../middlewares/auth");
const { authorizeRole } = require("../middlewares/rolesAuthorize");

// 🔹 Public routes
router.get("/", ctrl.getAllIncidents);
router.get("/:id", ctrl.getIncidentById);

// 🔹 Any logged-in user
router.post("/", checkAuth, ctrl.createIncident);

// 🔹 Admin + Moderator only (UPDATE STATUS باستخدام PUT)
router.put(
  "/:id/status",
  checkAuth,
  authorizeRole("ADMIN", "MODERATOR"),
  ctrl.updateIncidentStatus
);

module.exports = router;