const express = require("express");
const TelegramController = require("../controllers/TelegramController");

const router = express.Router();

router.post("/webhook",(req,res) => 
 // #swagger.tags = ['Telegram Bot']
 // #swagger.summary = 'Receive incoming Telegram webhook updates'
  // #swagger.description = 'Receives webhook updates sent by Telegram. If the update contains a message, it is processed by the bot message handler.'
/* #swagger.responses[200] = {
      description: 'Telegram update received and processed successfully',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Telegram update received and processed successfully" },
              data: { type: "object" }
            }
          },
          example: {
            success: true,
            message: "Telegram update received and processed successfully",
            data: { id: 1 }
          }
        }
      }
} */

/* #swagger.responses[500] = {
      description: 'Server error while handling Telegram webhook',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Server error while handling Telegram webhook" }
            }
          },
          example: {
            success: false,
            message: "Server error while handling Telegram webhook"
          }
        }
      }
} */
  TelegramController.handleWebhook(req,res));
module.exports = router;

// to get webhook info 
//https://api.telegram.org/botTHETOKEN/getWebhookInfo
