const express = require("express");
const userRouter = require('../users');
const routingRouter = require("../routes");
const subscribeRouter = require("../subscribe");
const alertsRouter = require("../alerts");
const router = express.Router();

const app=express();
app.use(express.json());
//routes
router.use("/users", userRouter);
router.use("/routes", routingRouter); 
router.use("/alertSubscriptions", subscribeRouter); 
router.use("/alerts", alertsRouter);

// healthcheck
router.get("/health", (req, res) => {
  res.json({ status: "ok", apiVersion: "v1" });
});

module.exports = router;



