const express = require('express');
const alertsController = require("../controllers/alertController");
const validate = require("../middlewares/validateMiddleware");
const {createAlertSchema} = require("../validators/alertValidator");
const authentication = require("../middlewares/auth"); 
const authorization = require("../middlewares/rolesAuthorize");
const router = express.Router();

router.use(authentication.checkAuth);  //all routes need authentication
router.get("/",authorization.authorizeRole("ADMIN","MODERATOR"),(req,res,next)=>{
// #swagger.tags = ['Alerts']
    // #swagger.summary = 'Get all alerts'
    // #swagger.description = 'Retrieves all created alerts. Only Admin and Moderator can access this endpoint.'
    // #swagger.security = [{ BearerAuth: [] }]
/* #swagger.responses[200] = {
      description: 'Alerts retrieved successfully',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "alerts retrieved successfully"
              },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    alertId: { type: "integer", example: 1 },
                    incident_id: { type: "integer", example: 5 },
                    category: { type: "string", example: "CLOSURE" },
                    message: { type: "string", example: "Incident has been verified" },
                    latitude: { type: "number", example: 31.9522 },
                    longitude: { type: "number", example: 35.2332 },
                    createdAt: { type: "string", example: "2026-04-25T10:00:00.000Z" }
                  }
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

/* #swagger.responses[403] = {
      description: 'Forbidden - only Admin or Moderator can access alerts',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Forbidden - only Admin or Moderator can access alerts"
              }
            }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Server error while retrieving alerts',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Server error while retrieving alerts"
              }
            }
          }
        }
      }
} */

     return alertsController.getAlerts(req,res,next);
});

module.exports = router; 