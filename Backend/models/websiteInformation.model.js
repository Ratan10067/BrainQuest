const mongoose = require("mongoose");

const websiteinformationSchema = new mongoose.Schema(
  {
    usersCount: {
      type: Number,
      required: true,
      default: 0,
    },
    quizStats: {
      totalQuizzes: { type: Number, default: 0 },
      completedQuizzes: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
    },
    subjectStats: [
      {
        subject: String,
        quizCount: { type: Number, default: 0 },
        participantCount: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 },
      },
    ],
    dailyStats: {
      activeUsers: { type: Number, default: 0 },
      newUsers: { type: Number, default: 0 },
      quizzesTaken: { type: Number, default: 0 },
      date: { type: Date, default: Date.now },
    },
    platformStats: {
      totalQuestions: { type: Number, default: 0 },
      totalFeedbacks: { type: Number, default: 0 },
      premiumUsers: { type: Number, default: 0 },
      averageQuizDuration: { type: Number, default: 0 }, // in minutes
    },
    leaderboardStats: {
      topScorers: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          score: Number,
          quizCount: Number,
        },
      ],
      lastUpdated: { type: Date, default: Date.now },
    },
    systemMetrics: {
      apiRequests: { type: Number, default: 0 },
      averageResponseTime: { type: Number, default: 0 }, // in ms
      errorCount: { type: Number, default: 0 },
      lastMaintenance: Date,
    },
    engagementMetrics: {
      averageSessionDuration: { type: Number, default: 0 }, // in minutes
      returnRate: { type: Number, default: 0 }, // percentage
      completionRate: { type: Number, default: 0 }, // percentage
      userRetention: { type: Number, default: 0 }, // percentage
    },
  },
  {
    timestamps: true,
    // Add index for better query performance
    indexes: [{ dailyStats: 1 }, { "subjectStats.subject": 1 }],
  }
);

// Add methods to update stats
websiteinformationSchema.methods.updateDailyStats = async function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (this.dailyStats.date < today) {
    this.dailyStats = {
      activeUsers: 0,
      newUsers: 0,
      quizzesTaken: 0,
      date: today,
    };
  }
};

// Add method to calculate averages
websiteinformationSchema.methods.calculateAverages = async function () {
  if (this.quizStats.completedQuizzes > 0) {
    this.quizStats.averageScore =
      this.quizStats.totalScore / this.quizStats.completedQuizzes;
  }
};

const WebsiteInformation = mongoose.model(
  "WebsiteInformation",
  websiteinformationSchema
);

module.exports = WebsiteInformation;
