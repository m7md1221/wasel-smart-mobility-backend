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
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              distanceKm: { type: "number", example: 150 },
              durationMin: { type: "number", example: 180 },
              checkpoints: { type: "integer", example: 5 },
              trafficLevel: { type: "string", example: "High" }
            }
          }
        }
      }
} */

/* #swagger.responses[400] = {
      description: 'Invalid routing request payload for provider',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Invalid routing request payload for provider"
              },
              details: {
                type: "object",
                properties: {
                  status: { type: "integer", example: 400 },
                  message: { type: "string", example: "Bad Request" }
                }
              }
            }
          }
        }
      }
} */

/* #swagger.responses[401] = {
      description: 'Unauthorized - missing or invalid token',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Unauthorized - missing or invalid token"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[404] = {
      description: 'No route found for selected points or coordinates are not routable',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "No route found for selected points or coordinates are not routable"
              },
              details: {
                type: "object",
                properties: {
                  status: { type: "integer", example: 404 },
                  message: { type: "string", example: "Not Found" }
                }
              }
            }
          }
        }
      }
} */

/* #swagger.responses[409] = {
      description: 'Route violates selected constraints',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Route violates selected constraints"
              },
              details: {
                type: "object",
                properties: {
                  avoidCheckpoints: { type: "boolean", example: true },
                  avoidTraffic: { type: "boolean", example: true },
                  maxDistanceKm: { type: "number", example: 120 }
                }
              },
              route: {
                type: "object",
                properties: {
                  distanceKm: { type: "number", example: 150 },
                  durationMin: { type: "number", example: 180 },
                  checkpoints: { type: "integer", example: 5 },
                  trafficLevel: { type: "string", example: "High" }
                }
              }
            }
          }
        }
      }
} */

/* #swagger.responses[502] = {
      description: 'Routing provider request failed',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Routing provider request failed"
              },
              details: {
                type: "object",
                properties: {
                  status: { type: "integer", example: 502 },
                  message: { type: "string", example: "Bad Gateway" }
                }
              }
            }
          }
        }
      }
} */

/* #swagger.responses[503] = {
      description: 'Routing provider rate limit reached',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Routing provider rate limit reached"
              },
              retryAfter: {
                type: "integer",
                example: 60
              }
            }
          }
        }
      }
} */

/* #swagger.responses[504] = {
      description: 'Routing provider timed out',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Routing provider timed out"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Unexpected route estimation error',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Unexpected route estimation error"
              }
            }
          }
        }
      }
} */

     return routeController.estimateRoute(req,res,next);
  }
);

module.exports = router;

