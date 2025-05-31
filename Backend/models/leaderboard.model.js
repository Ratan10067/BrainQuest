const mongoose = require("mongoose");

const leaderboardEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  completionTime: Number,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const LeaderBoard = mongoose.model("leaderBoard", leaderboardEntrySchema);
module.exports = LeaderBoard;
