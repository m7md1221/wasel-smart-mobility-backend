const express = require("express");
const userRouter = require('../users');
const routingRouter = require("../routes");
const router = express.Router();

router.use("/users", userRouter);
router.use("/routes", routingRouter);
module.exports = router;



