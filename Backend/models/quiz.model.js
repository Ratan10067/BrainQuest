const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questions: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question", // Reference to the Question model
        required: true,
      },
      userResponse: {
        type: mongoose.Schema.Types.Mixed, // User's selected option
        default: null,
      },
      isCorrect: {
        type: Boolean,
        default: null,
      },
    },
  ],
  Title: {
    type: String,
    required: true, // Title of the quiz
  },
  startTime: {
    type: Date,
    default: Date.now, // Quiz start time
  },
  endTime: {
    type: Date, // Quiz end time
    default: null,
  },
  score: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Started", "Completed"], // Current status of the quiz
    default: "Started",
  },
  totalQuestions: {
    type: Number,
    default: 0, // Total number of questions in this quiz
  },
  subject: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
});

const Quiz = mongoose.model("quiz", quizSchema);
module.exports = Quiz;
