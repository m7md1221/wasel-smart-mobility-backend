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
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Route estimated successfully" },
              data: { type: "object" }
            }
          },
          example: {
            success: true,
            message: "Route estimated successfully",
            data: { id: 1 }
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Invalid routing request payload for provider" }
            }
          },
          example: {
            success: false,
            message: "Invalid routing request payload for provider"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Unauthorized - missing or invalid token" }
            }
          },
          example: {
            success: false,
            message: "Unauthorized - missing or invalid token"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "No route found for selected points or coordinates are not routable" }
            }
          },
          example: {
            success: false,
            message: "No route found for selected points or coordinates are not routable"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Route violates selected constraints" }
            }
          },
          example: {
            success: false,
            message: "Route violates selected constraints"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Routing provider request failed" }
            }
          },
          example: {
            success: false,
            message: "Routing provider request failed"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Routing provider rate limit reached" }
            }
          },
          example: {
            success: false,
            message: "Routing provider rate limit reached"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Routing provider timed out" }
            }
          },
          example: {
            success: false,
            message: "Routing provider timed out"
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
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Unexpected route estimation error" }
            }
          },
          example: {
            success: false,
            message: "Unexpected route estimation error"
          }
        }
      }
} */

     return routeController.estimateRoute(req,res,next);
  }
);

module.exports = router;

