const express = require("express");

const router = express.Router();

const userRouter = require("../users");
const checkpointRouter = require("../checkpoints");
const incidentRouter = require("../incidents");
const routingRouter = require("../routes");

router.use("/users", userRouter);
<<<<<<< HEAD
router.use("/checkpoints", checkpointRouter);
router.use("/incidents", incidentRouter);
router.use("/routes", routingRouter);
=======
router.use("/routes", routingRouter); // keep old path for compatibility
router.use("/", routingRouter); // make /api/v1/estimate route available directly

// healthcheck
router.get("/health", (req, res) => {
  res.json({ status: "ok", apiVersion: "v1" });
});

module.exports = router;

>>>>>>> 9c0a8c0 (Feature 3: Route Estimation improvements - Add better API key handling, input validation, logging, and error messages)

router.get("/health", (req, res) => {
  res.json({ status: "ok", apiVersion: "v1" });
});

module.exports = router;