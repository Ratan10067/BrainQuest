const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { contactUs, getQueries } = require("../controllers/contact.controller");
const { authUser } = require("../middlewares/auth.middlewares");
router.post(
  "/submit-query",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid Email"),
    body("message").notEmpty().withMessage("Message is required"),
  ],
  authUser,
  contactUs
);

router.get("/past-queries", authUser, getQueries);

module.exports = router;
