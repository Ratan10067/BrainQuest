const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./db/db");
const userRoutes = require("./routes/user.routes");
const quizRoutes = require("./routes/quiz.routes");
const cookieParser = require("cookie-parser");
const { authUser } = require("./middlewares/auth.middlewares");

const contactRoutes = require("./routes/contact.routes");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const connectToDB = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
  }
};
connectToDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send({ message: "Server is Wroking Properly" });
});
app.use("/users", userRoutes);
app.use("/quiz", quizRoutes);
app.use("/contact", contactRoutes);
app.listen(PORT, () => {
  console.log(`Server is Listening at Port ${PORT}`);
});
