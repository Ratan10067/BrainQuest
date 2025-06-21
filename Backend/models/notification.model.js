const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["quiz", "achievement", "friend_request", "system", "reminder"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true, // Add index for filtering unread notifications
    },
    action: {
      type: String,
      enum: ["accept", "decline", "none"],
      default: "none",
    },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt
    collection: "notifications",
  }
);

// Add compound index for userId + read status for common queries
notificationSchema.index({ userId: 1, read: 1 });

// Add TTL index if you want notifications to auto-delete after expiry
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
