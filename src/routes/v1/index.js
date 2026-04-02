const express = require("express");
<<<<<<< HEAD
const router = express.Router();

const userRouter = require("../users");
const checkpointRouter = require("../checkpoints");
const incidentRouter = require("../incidents");

router.use("/users", userRouter);
router.use("/checkpoints", checkpointRouter);
router.use("/incidents", incidentRouter);

router.get("/health", (req, res) =>
  res.json({ status: "ok", apiVersion: "v1" })
);

module.exports = router;
=======
const userRouter = require('../users');
const router = express.Router();

router.use("/users", userRouter);
module.exports = router;



>>>>>>> deema
