const mongoose = require("mongoose");
const { use } = require("../routes/user.routes");
const querySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);
const Query = mongoose.model("query", querySchema);
module.exports = Query;

