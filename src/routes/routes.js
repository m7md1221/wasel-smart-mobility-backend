const express = require("express");
const routeController = require("../controllers/routeController");
const validate = require("../middlewares/validateMiddleware");
const { estimateRouteSchema } = require("../validators/routeValidator");
const authentication = require("../middlewares/auth");

const router = express.Router();


router.post(
  "/estimate",
  authentication.checkAuth,
  validate(estimateRouteSchema),(req,res,next)=>{
    // #swagger.tags = ['Route Estimation']
    // #swagger.summary = 'Estimate the best route between two locations considering traffic and checkpoints and give alternative routes'
    // #swagger.security = [{ BearerAuth: [] }]
     return routeController.estimateRoute(req,res,next);
  }
);

module.exports = router;

