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
    // #swagger.summary = 'Estimate the best route'
    // #swagger.description = 'Estimates the best route between two locations while considering traffic, checkpoints, constraints, and alternative routes.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["from", "to"],
                properties: {
                  from: {
                    type: "object",
                    required: ["latitude", "longitude"],
                    properties: {
                      latitude: { type: "number", example: 31.9522 },
                      longitude: { type: "number", example: 35.2332 }
                    }
                  },
                  to: {
                    type: "object",
                    required: ["latitude", "longitude"],
                    properties: {
                      latitude: { type: "number", example: 31.5017 },
                      longitude: { type: "number", example: 34.4668 }
                    }
                  },
                  constraints: {
                    type: "object",
                    properties: {
                      avoidCheckpoints: { type: "boolean", example: true },
                      avoidTraffic: { type: "boolean", example: true },
                      maxDistanceKm: { type: "number", example: 120 }
                    }
                  }
                }
              }
            }
          }
    } */

    /* #swagger.responses[200] = {
          description: 'Route estimated successfully',
          schema: {
            distanceKm: 150,
            durationMin: 180,
            checkpoints: 5,
            trafficLevel: "High"
          }
    } */

    /* #swagger.responses[400] = {
          description: 'Invalid routing request payload for provider',
          schema: {
            message: "Invalid routing request payload for provider",
            details: {
              status: 400,
              message: "Bad Request"
            }
          }
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - missing or invalid token'
    } */

    /* #swagger.responses[404] = {
          description: 'No route found for selected points or coordinates are not routable',
          schema: {
            message: "No route found for selected points or coordinates are not routable",
            details: {
              status: 404,
              message: "Not Found"
            }
          }
    } */

    /* #swagger.responses[409] = {
          description: 'Route violates selected constraints',
          schema: {
            message: "Route violates selected constraints",
            details: {  
              avoidCheckpoints: true, 
              avoidTraffic: true,
              maxDistanceKm: 120
            },
            route: {  
              distanceKm: 150,
              durationMin: 180, 
              checkpoints: 5,
              trafficLevel: "High"
            }
          }
    } */

    /* #swagger.responses[502] = {
          description: 'Routing provider request failed',
          schema: {
            message: "Routing provider request failed",
            details: {
              status: 502,
              message: "Bad Gateway"
            }
          }
    } */

    /* #swagger.responses[503] = {
          description: 'Routing provider rate limit reached',
          schema: {
            message: "Routing provider rate limit reached",
            retryAfter: 60
          }
    } */

    /* #swagger.responses[504] = {
          description: 'Routing provider timed out'
    } */

    /* #swagger.responses[500] = {
          description: 'Unexpected route estimation error',
          schema:{
           message: "Routing provider timed out"
          }
    } */

     return routeController.estimateRoute(req,res,next);
  }
);

module.exports = router;

