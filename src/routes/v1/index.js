const express = require("express");
const router = express.Router();
const userRouter = require("../users");
const reportRouter = require("../reports");
const checkpointRouter = require("../checkpoints");
const incidentRouter = require("../incidents");
const subscribeRouter = require("../subscribe");
const alertsRouter = require("../alerts");
const routingRouter = require("../routes");
const subscribeRouter = require("../subscribe");
const alertsRouter = require("../alerts");
const app=express();
app.use(express.json());

//routes
router.use("/users", userRouter);
router.use("/routes", routingRouter);
router.use("/reports", reportRouter);
router.use("/checkpoints", checkpointRouter);
router.use("/incidents", incidentRouter);
router.use("/routes", routingRouter); 
router.use("/alertSubscriptions", subscribeRouter); 
router.use("/alerts", alertsRouter);


// healthcheck
router.get("/health", (req, res) => {
  res.json({ status: "ok", apiVersion: "v1" });
});
router.get("/health", (req, res) => {
  res.json({ status: "ok", apiVersion: "v1" });
});

module.exports = router;



