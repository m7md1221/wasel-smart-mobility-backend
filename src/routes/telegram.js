const express = require("express");
const TelegramController = require("../controllers/TelegramController");

const router = express.Router();

router.post("/webhook",(req,res) => 
 // #swagger.tags = ['Telegram Bot']
 // #swagger.summary = 'Receive incoming Telegram webhook updates'
 TelegramController.handleWebhook(req,res));

module.exports = router;


// to get webhook info 
//https://api.telegram.org/botTHETOKEN/getWebhookInfo
