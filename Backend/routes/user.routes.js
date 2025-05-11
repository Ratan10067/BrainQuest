const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
  registerUser,
  login,
  logout,
} = require("../controllers/user.controller");
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
router.get("/user-logout", logout);

module.exports = router;
