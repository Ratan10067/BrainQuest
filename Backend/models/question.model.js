const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: [(val) => val.length === 4, "Exactly 4 options are required"],
    },
    correctOption: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("question", questionSchema);
module.exports = Question;
