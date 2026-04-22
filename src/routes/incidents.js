const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/incidentController");
const { checkAuth } = require("../middlewares/auth");
const { authorizeRole } = require("../middlewares/rolesAuthorize");

//Public routes
router.get("/", (req, res, next) => {
  // #swagger.tags = ['Incidents']
  // #swagger.summary = 'Get all incidents with their information and status'
  return ctrl.getAllIncidents(req, res, next);
});

router.get("/:id", (req, res, next) => {
  // #swagger.tags = ['Incidents']
  // #swagger.summary = 'Get a specific incident by ID'
  return ctrl.getIncidentById(req, res, next);
});

//Any logged-in user
router.post("/", checkAuth, (req, res, next) => {
  // #swagger.tags = ['Incidents']
  // #swagger.summary = 'Create a new incident (Any authenticated user)'
  // #swagger.security = [{ BearerAuth: [] }]
  return ctrl.createIncident(req, res, next);
});

//Admin + Moderator only
router.put(
  "/:id/status",
  checkAuth,
  authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
    // #swagger.tags = ['Incidents']
    // #swagger.summary = 'Update incident status (Admin/Moderator only)'
    // #swagger.security = [{ BearerAuth: [] }]
    return ctrl.updateIncidentStatus(req, res, next);
  }
);
module.exports = router;