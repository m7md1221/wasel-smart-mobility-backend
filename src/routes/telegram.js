const express = require("express");
const TelegramController = require("../controllers/TelegramController");

const router = express.Router();

router.post("/webhook", TelegramController.handleWebhook);

module.exports = router;