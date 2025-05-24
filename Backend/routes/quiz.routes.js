const express = require("express");
const router = express.Router();
const {
  insertQuestion,
  getQuestion,
} = require("../controllers/quiz.controller");
const { authUser } = require("../middlewares/auth.middlewares");
router.get("/insert-question", insertQuestion);
router.get("/start", authUser, getQuestion);
module.exports = router;
