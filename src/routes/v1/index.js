const express = require("express");
const userRouter = require('../users');
const routingRouter = require("../routes");
const router = express.Router();

router.use("/users", userRouter);
router.use("/routes", routingRouter); // keep old path for compatibility
router.use("/", routingRouter); // make /api/v1/estimate route available directly

// healthcheck
router.get("/health", (req, res) => {
  res.json({ status: "ok", apiVersion: "v1" });
});

module.exports = router;



