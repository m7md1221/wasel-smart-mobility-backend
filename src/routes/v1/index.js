const express = require("express");
const userRouter = require('../users');
const routingRouter = require("../routes");
const reportRouter = require("../reports");
const router = express.Router();

const userRouter = require("../users");
const checkpointRouter = require("../checkpoints");
const incidentRouter = require("../incidents");
const subscribeRouter = require("../subscribe");
const alertsRouter = require("../alerts");
const routingRouter = require("../routes");

// routes
router.use("/users", userRouter);
router.use("/routes", routingRouter);
router.use("/reports", reportRouter);
module.exports = router;
router.use("/checkpoints", checkpointRouter);
router.use("/incidents", incidentRouter);
router.use("/routes", routingRouter); // keep old path for compatibility
router.use("/", routingRouter); // make /api/v1/estimate route available directly

<<<<<<< HEAD
// alerts + subscriptions
router.use("/alertSubscriptions", subscribeRouter);
router.use("/alerts", alertsRouter);

// healthcheck
router.get("/health", (req, res) => {
  res.json({ status: "ok", apiVersion: "v1" });
});

module.exports = router;
=======
// healthcheck
router.get("/health", (req, res) =>
  res.json({ status: "ok", apiVersion: "v1" })
);

module.exports = router;
>>>>>>> origin/AMEEN
