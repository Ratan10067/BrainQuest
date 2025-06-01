const express = require("express");
const router = express.Router();
const {
  getProfile,
  addFriendRequest,
} = require("../controllers/profile.controller");
const { authUser } = require("../middlewares/auth.middlewares");
router.get("/", authUser, getProfile);
router.post("/friend-request", authUser, addFriendRequest);
module.exports = router;
