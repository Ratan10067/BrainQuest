const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/othersprofile.controller");
const { authUser } = require("../middlewares/auth.middlewares");
router.get("/", authUser, getProfile);
module.exports = router;
