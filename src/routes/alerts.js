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
          schema: {
            message: "alerts retrieved successfully",
            data: [
              {
                alertId: 1,
                incident_id: 5,
                category: "CLOSURE",
                message: "Incident has been verified",
                latitude: 31.9522,
                longitude: 35.2332,
                createdAt: "2026-04-25T10:00:00.000Z"
              }
            ]
          }
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - missing or invalid token',
          schema: {
            message: "Unauthorized - missing or invalid token"
          }
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - only Admin or Moderator can access alerts',
          schema: {
            message: "Forbidden - only Admin or Moderator can access alerts"
          }
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while retrieving alerts',
          schema: {
            message: "Server error while retrieving alerts"
          }
    } */

     return alertsController.getAlerts(req,res,next);
});

module.exports = router; 