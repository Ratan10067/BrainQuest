const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  criteria: {
    type: String,
    required: true,
    enum: ["quizzesTaken", "totalScore", "streak", "perfectScores", "custom"],
  },
  threshold: {
    type: Number,
    required: true,
  },
});

const Badge = mongoose.model("badge", badgeSchema);

module.exports = Badge;
