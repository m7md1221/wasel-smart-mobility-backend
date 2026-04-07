const express = require("express");
const userRouter = require('../users');
const routingRouter = require("../routes");
const subscribeRouter = require("../subscribe");
const router = express.Router();
const app=express();
app.use(express.json());
router.use("/users", userRouter);
router.use("/routes", routingRouter); // keep old path for compatibility
router.use("/alertSubscriptions", subscribeRouter); // make /api/v1/alertSubscriptions routes available directly

// healthcheck
router.get("/health", (req, res) => {
  res.json({ status: "ok", apiVersion: "v1" });
});

module.exports = router;



