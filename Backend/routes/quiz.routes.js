const express = require("express");
const router = express.Router();
const {
  insertQuestion,
  startQuiz,
  submitQuiz,
  getPastQuizzes,
  getQuizResult,
} = require("../controllers/quiz.controller");
const { authUser } = require("../middlewares/auth.middlewares");
router.get("/insert-question", insertQuestion);
router.get("/start", authUser, startQuiz);
router.post("/submit", authUser, submitQuiz);
router.get("/past", authUser, getPastQuizzes);
router.get("/result/:quizId", authUser, getQuizResult);
module.exports = router;
