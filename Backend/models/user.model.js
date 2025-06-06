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
    gender: {
      type: String,
    },
    summary: {
      type: String,
      default: "Tell us about yourself (interests, experience, etc.)",
    },
    github: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    twitter: {
      type: String,
    },
    experience: {
      work: [{ type: String }],
      education: [{ type: String }],
    },
    skills: [{ type: String }],
    phone: {
      type: String,
      required: true,
      default: "Not provided", // Default value if phone number is not provided
    },
    location: {
      type: String,
      required: true,
      default: "Unknown", // Default location if not provided
    },
    password: {
      type: String,
      // Password is only required for local authentication
      required: function () {
        return this.authMethod === "email";
      },
    },
    birthday: { type: Date },
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
        completedAt: Date,
      },
    ],
    otp: {
      code: {
        type: String,
        default: null,
      },
      expiry: {
        type: Date,
        default: null,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    friendList: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Should match your model name
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "blocked"],
          default: "pending",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    rewards: [
      {
        badgeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Badge",
        },
        earnedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    authMethod: {
      type: String,
      enum: ["email", "google", "github"],
      required: true,
      default: "email",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);
userSchema.methods.clearOTP = async function () {
  this.otp.code = null;
  this.otp.expiry = null;
  await this.save();
};

// Add method to set OTP
userSchema.methods.setOTP = async function (otp) {
  this.otp.code = otp;
  this.otp.expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  await this.save();
};

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
