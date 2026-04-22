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
    // #swagger.summary = 'Get all alerts (Admin and Moderator only)'
    // #swagger.security = [{ BearerAuth: [] }]
     return alertsController.getAlerts(req,res,next);
});

module.exports = router; 