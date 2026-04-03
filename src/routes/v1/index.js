const express = require("express");
const userRouter = require('../users');
const routingRouter = require("../routes");
const reportRouter = require("../reports");
const router = express.Router();

router.use("/users", userRouter);
router.use("/routes", routingRouter);
router.use("/reports", reportRouter);
module.exports = router;



