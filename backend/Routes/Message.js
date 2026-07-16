const express = require("express");
const router = express.Router();

const isUser = require("../Middleware/isUser");
const {
  sendMessage,
  getConversations,
  getMessageThread,
} = require("../Controller/MessageController");

// Get list of active conversations
router.get("/conversations", isUser, getConversations);

// Get chat thread history with a specific user
router.get("/thread/:userId", isUser, getMessageThread);

// Send a chat message
router.post("/send", isUser, sendMessage);

module.exports = router;
