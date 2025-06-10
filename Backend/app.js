const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./db/db");
const userRoutes = require("./routes/user.routes");
const quizRoutes = require("./routes/quiz.routes");
const cookieParser = require("cookie-parser");
const { authUser } = require("./middlewares/auth.middlewares");
const { getLeaderboard } = require("./controllers/leaderboard.controller");
const profileRoutes = require("./routes/profile.routes");
const contactRoutes = require("./routes/contact.routes");
const chatbotRoutes = require("./routes/chatbot.routes");
const path = require("path");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
app.set("views", path.join(__dirname, "views")); // Adjust path if necessary
app.set("view engine", "ejs");
console.log("Views Directory:", path.join(__dirname, "views"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const connectToDB = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
  }
};
connectToDB();
app.get("/", (req, res) => {
  res.send({ message: "Server is Wroking Properly" });
});
app.use("/users", userRoutes);
app.use("/quiz", quizRoutes);
app.use("/contact", contactRoutes);
app.get("/leaderboard", getLeaderboard);
app.use("/profile", profileRoutes);
app.use("/chatbot", chatbotRoutes);
app.listen(PORT, () => {
  console.log(`Server is Listening at Port ${PORT}`);
});
