const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "API v1 working" });
  console.log("v1 routes loaded");
}); 

module.exports = router;