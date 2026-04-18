const express = require("express");

const router = express.Router();

const userRouter = require("../users");
const checkpointRouter = require("../checkpoints");
const incidentRouter = require("../incidents");
const subscribeRouter = require("../subscribe");
const alertsRouter = require("../alerts");

// routes
router.use("/users", userRouter);
router.use("/checkpoints", checkpointRouter);
router.use("/incidents", incidentRouter);

// alerts + subscriptions
router.use("/alertSubscriptions", subscribeRouter);
router.use("/alerts", alertsRouter);

// healthcheck
router.get("/health", (req, res) => {
  res.json({ status: "ok", apiVersion: "v1" });
});

module.exports = router;