const express = require('express');
const alertsController = require("../controllers/alertController");
const validate = require("../middlewares/validateMiddleware");
const {createAlertSchema} = require("../validators/alertValidator");
const authentication = require("../middlewares/auth"); 
const authorization = require("../middlewares/rolesAuthorize");
const router = express.Router();



module.exports = router; 