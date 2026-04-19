const express = require("express");
const userRouter = require("../users");
const reportRouter = require("../reports");
const checkpointRouter = require("../checkpoints");
const incidentRouter = require("../incidents");
const subscribeRouter = require("../subscribe");
const alertsRouter = require("../alerts");
const routingRouter = require("../routes");

const router = express.Router();

// routes
router.use("/users", userRouter);
router.use("/routes", routingRouter);
router.use("/reports", reportRouter);
router.use("/checkpoints", checkpointRouter);
router.use("/incidents", incidentRouter);
router.use("/routes", routingRouter); // keep old path for compatibility
router.use("/", routingRouter); // make /api/v1/estimate route available directly

// alerts + subscriptions
router.use("/alertSubscriptions", subscribeRouter);
router.use("/alerts", alertsRouter);

// healthcheck
router.get("/health", (req, res) => {
  res.json({ status: "ok", apiVersion: "v1" });
});

module.exports = router;
