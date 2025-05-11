const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // URL or base64-encoded string for the avatar image
      default: "default-avatar.png", // Default image if user hasn't uploaded one
    },
    quizzesTaken: {
      type: Number,
      default: 0, // Track the total number of quizzes attempted
    },
    totalScore: {
      type: Number,
      default: 0, // Cumulative score of all quizzes
    },
    progressHistory: [
      {
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }, // Reference to the quiz
        score: Number,
        completedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = async function (password) {
  const hash = this.password;
  console.log(hash, password);
  return await bcrypt.compare(password, hash);
};
const User = mongoose.model("user", userSchema);
module.exports = User;
