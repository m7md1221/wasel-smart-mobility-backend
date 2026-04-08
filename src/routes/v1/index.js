const express = require("express");
const router = express.Router();

const userRouter = require("../users");
const checkpointRouter = require("../checkpoints");
const incidentRouter = require("../incidents");
const routingRouter = require("../routes");

router.use("/users", userRouter);
router.use("/checkpoints", checkpointRouter);
router.use("/incidents", incidentRouter);
router.use("/routes", routingRouter); // keep old path for compatibility
router.use("/", routingRouter); // make /api/v1/estimate route available directly

// healthcheck
router.get("/health", (req, res) =>
  res.json({ status: "ok", apiVersion: "v1" })
);

module.exports = router;
