const express = require("express");
const { authUser } = require("../middlewares/auth.middlewares");
const { generateChatBotResponse } = require("../controllers/chatbot.controller");
const router = express.Router();
router.post("/generate", authUser, generateChatBotResponse);

module.exports = router;
