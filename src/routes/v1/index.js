const express = require("express");

const router = express.Router();

const userRouter = require("../users");
const checkpointRouter = require("../checkpoints");
const incidentRouter = require("../incidents");
const routingRouter = require("../routes");
const subscribeRouter = require("../subscribe");

// routes
router.use("/users", userRouter);
router.use("/checkpoints", checkpointRouter);
router.use("/incidents", incidentRouter);

// routing
router.use("/routes", routingRouter); // old path
router.use("/", routingRouter); // enables /estimate

// alert subscriptions
router.use("/alertSubscriptions", subscribeRouter);

// healthcheck
router.get("/health", (req, res) => {
  res.json({ status: "ok", apiVersion: "v1" });
});

module.exports = router;