const express = require('express');
const alertsController = require("../controllers/alertController");
const validate = require("../middlewares/validateMiddleware");
const {createAlertSchema} = require("../validators/alertValidator");
const authentication = require("../middlewares/auth"); 
const authorization = require("../middlewares/rolesAuthorize");
const router = express.Router();

router.use(authentication.checkAuth); //all routes need authentication
router.get("/",authorization.authorizeRole("ADMIN","MODERATOR"), alertsController.getAlerts);

module.exports = router; 