const User = require("../models/user.model");
const { validationResult } = require("express-validator");
module.exports.registerUser = async (req, res, next) => {
  console.log("register me yaha aa rha ha");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("yaha aa rha ha");
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;
  const isUserAlreadyExist = await User.findOne({ email });
  if (isUserAlreadyExist) {
    return res.status(400).json({ message: "User Already Exist" });
  }

  const hashPassword = await User.hashPassword(password);

  const user = await User.create({
    name: name,
    email: email,
    password: hashPassword,
  });
  const token = await user.generateAuthToken();
  res.cookie("token", token);
  return res.status(201).json({ token: token, user });
};
module.exports.login = async (req, res, next) => {
  console.log("login me yaha aa rha ha");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const userCheck = await User.findOne({ email });
  console.log(userCheck);

  if (!userCheck) {
    return res.status(401).json("Invalid Email or Password");
  }
  const isMatch = await userCheck.comparePassword(password);
  console.log("Match", isMatch);

  if (!isMatch) {
    return res.status(401).json("Invalid Email or Password");
  }
  const token = await userCheck.generateAuthToken();
  res.cookie("token", token);
  return res.status(200).json({ token, user: userCheck });
};

module.exports.logout = async (req, res, next) => {
  console.log("logout me yaha aa rha ha");
  const token = req.cookies.token || req.headers.authorization?.split("")[1];
  res.clearCookie("token");
  res.status(200).json({ message: "Logout Successfully" });
};

module.exports.getProfile = async (req, res, next) => {
  console.log(req.user);
  return res.json({ user: req.user });
};
