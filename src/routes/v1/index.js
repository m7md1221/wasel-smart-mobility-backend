const express = require("express");
const router = express.Router();

const userRouter = require("../users");
const checkpointRouter = require("../checkpoints");
const incidentRouter = require("../incidents");

router.use("/users", userRouter);
router.use("/checkpoints", checkpointRouter);
router.use("/incidents", incidentRouter);

router.get("/health", (req, res) => {
  res.json({ status: "ok", apiVersion: "v1" });
});

module.exports = router;