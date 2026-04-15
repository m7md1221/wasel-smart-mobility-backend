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



>>>>>>> deema
