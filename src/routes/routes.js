const express = require("express");
const routeController = require("../controllers/routeController");
const validate = require("../middlewares/validateMiddleware");
const { estimateRouteSchema } = require("../validators/routeValidator");
const authentication = require("../middlewares/auth");

const v1Routes = require("./v1"); 

const router = express.Router();


router.post(
  "/estimate",
  authentication.checkAuth,
  validate(estimateRouteSchema),
  routeController.estimateRoute
);


router.use("/v1", v1Routes);

module.exports = router;