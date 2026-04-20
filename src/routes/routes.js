const express = require("express");
const routeController = require("../controllers/routeController");
const validate = require("../middlewares/validateMiddleware");
const { estimateRouteSchema } = require("../validators/routeValidator");
const authentication = require("../middlewares/auth");

const router = express.Router();

// ✅ Route estimation
router.post(
  "/estimate",
  authentication.checkAuth,
  validate(estimateRouteSchema),
  routeController.estimateRoute
);

module.exports = router;
