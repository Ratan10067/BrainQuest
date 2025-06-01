const User = require("../models/user.model");
module.exports.getProfile = async (req, res) => {
  console.log("getProfile me aagaya hu");
  try {
    const user = await User.findById(req.params.userId)
      .select(
        "name email phone location avatar quizzesTaken totalScore createdAt"
      )
      .lean();

    if (!user) {
      return res.status(404).render("error", {
        message: "User not found",
      });
    }

    // Format dates and other data as needed
    user.createdAt = new Date(user.createdAt).toLocaleDateString();
    user.avatar = user.avatar || "default-avatar.png";

    res.render("profile", {
      title: `${user.name}'s Profile`,
      user,
      isAuthenticated: req.isAuthenticated(), // If using auth
      currentUser: req.user, // If you want to show current user info
    });
  } catch (err) {
    console.error("Profile render error:", err);
    res.status(500).render("error", {
      message: "Error loading profile",
    });
  }
};
