const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
  registerUser,
  login,
  logout,
  getProfile,
  updateProfile,
  sendOtp,
  verifyOtp,
  googleLogin,
  forgotPassword,
  getResetPassword,
  resetPassword,
  deleteUser
} = require("../controllers/user.controller");
const { authUser } = require("../middlewares/auth.middlewares");
router.post(
  "/user-register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must have at least 8 characters"),
  ],
  registerUser
);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post(
  "/user-login",
  [
    body("email")
      .isEmail()
      .withMessage("The email which you enter is not a Valid Email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must have at least 8 characters"),
  ],
  login
);
router.get("/user-profile", authUser, getProfile);
router.get("/user-logout", logout);
router.post("/user-update", authUser, updateProfile);
router.post("/google-auth", googleLogin);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", getResetPassword);
router.post("/reset-password/:token", resetPassword);
router.delete("/delete-account", authUser, deleteUser);
module.exports = router;
