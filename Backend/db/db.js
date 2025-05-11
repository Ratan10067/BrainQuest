require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(url);
    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = connectDB;
