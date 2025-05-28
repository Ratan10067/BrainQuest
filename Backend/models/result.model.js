const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    questions: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selectedOption: { type: String },
        correctOption: { type: String },
        isCorrect: { type: Boolean, required: true },
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    statistics: {
      attemptedQuestions: { type: Number, required: true },
      correctAnswers: { type: Number, required: true },
      incorrectAnswers: { type: Number, required: true },
      accuracy: { type: Number, required: true },
      skippedQuestions: { type: Number, required: true },
    },
    timeStats: {
      startTime: { type: Date, required: true },
      endTime: { type: Date, required: true },
      timeTaken: { type: Number, required: true }, // in seconds
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for formatted time
resultSchema.virtual("formattedTime").get(function () {
  const minutes = Math.floor(this.timeStats.timeTaken / 60);
  const seconds = this.timeStats.timeTaken % 60;
  return `${minutes}m ${seconds}s`;
});

const Result = mongoose.model("Result", resultSchema);
module.exports = Result;
