const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/incidentController");
const { checkAuth } = require("../middlewares/auth");
const { authorizeRole } = require("../middlewares/rolesAuthorize");

// Public
router.get("/",    ctrl.getAllIncidents);
router.get("/:id", ctrl.getIncidentById);

// Any logged in user
router.post("/", checkAuth, ctrl.createIncident);

// Admin + Moderator only
router.patch("/:id/status", checkAuth, authorizeRole("ADMIN", "MODERATOR"), ctrl.updateIncidentStatus);

module.exports = router;