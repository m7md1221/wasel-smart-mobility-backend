const express = require("express");
const routeController = require("../controllers/routeController");
const validate = require("../middlewares/validateMiddleware");
const { estimateRouteSchema } = require("../validators/routeValidator");
const authentication = require("../middlewares/auth");

const v1Routes = require("./v1");

const router = express.Router();

// ✅ Route estimation
router.post(
  "/estimate",
  authentication.checkAuth,
  validate(estimateRouteSchema),
  routeController.estimateRoute
);

// ✅ API v1
router.use("/v1", v1Routes);

module.exports = router;
