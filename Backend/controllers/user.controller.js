const User = require("../models/user.model");
const { validationResult } = require("express-validator");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});
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
  console.log("token", token);
  if (!token) {
    return res.status(500).json({ message: "Token generation failed" });
  }
  // Set token in cookie and send in response headers
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send token in response body for frontend to store in localStorage
  return res.status(201).json({
    success: true,
    token: token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

module.exports.sendOtp = async (req, res, next) => {
  console.log("sendOtp me yaha aa rha ha");
  try {
    const { email } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      // If user exists, check if they are already verified
      if (user.isVerified) {
        return res
          .status(400)
          .json({ message: "User already Exist Please Sigin" });
      }
    }
    // Generate OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    if (!user) {
      // Create temporary user
      user = new User({
        email,
        password: "temporary", // Will be updated during verification
        name: "temporary",
      });
    }

    // Set OTP in database
    await user.setOTP(otp);

    // Send email
    // await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: "Verify your email for BrainQuest",
    //   html: `
    //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    //       <h2>Welcome to BrainQuest!</h2>
    //       <p>Your verification code is:</p>
    //       <h1 style="font-size: 36px; letter-spacing: 5px; color: #f59e0b;">${otp}</h1>
    //       <p>This code will expire in 5 minutes.</p>
    //     </div>
    //   `,
    // });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to BrainQuest - Verify Your Email",
      html: `
        <div style="
          font-family: 'Helvetica', Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: linear-gradient(145deg, #1a1f37 0%, #2c3250 100%);
          border-radius: 16px;
          color: #ffffff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        ">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://your-logo-url.com/logo.png" alt="BrainQuest Logo" style="width: 150px; margin-bottom: 20px;">
            <h1 style="
              color: #f59e0b;
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            ">Welcome to BrainQuest!</h1>
          </div>
    
          <div style="
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 25px;
          ">
            <p style="
              font-size: 16px;
              line-height: 1.5;
              margin-bottom: 25px;
              color: #e5e7eb;
            ">Thank you for joining BrainQuest! To start your learning journey, please verify your email address using the verification code below:</p>
    
            <div style="
              background: rgba(245, 158, 11, 0.1);
              border: 2px dashed #f59e0b;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin-bottom: 25px;
            ">
              <h2 style="
                font-size: 36px;
                letter-spacing: 8px;
                color: #f59e0b;
                margin: 0;
                font-weight: 700;
              ">${otp}</h2>
            </div>
    
            <div style="text-align: center; color: #e5e7eb; font-size: 14px;">
              <p style="margin-bottom: 15px;">⚠️ This code will expire in 5 minutes</p>
              <p style="color: #9ca3af; font-style: italic;">For security reasons, please do not share this code with anyone.</p>
            </div>
          </div>
    
          <div style="
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 14px;
            color: #9ca3af;
          ">
            <p>If you didn't create a BrainQuest account, you can safely ignore this email.</p>
            <div style="margin-top: 20px;">
              <a href="#" style="color: #f59e0b; text-decoration: none; margin: 0 10px;">Help Center</a>
              <a href="#" style="color: #f59e0b; text-decoration: none; margin: 0 10px;">Terms of Service</a>
              <a href="#" style="color: #f59e0b; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
            </div>
            <p style="margin-top: 20px;">© ${new Date().getFullYear()} BrainQuest. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

module.exports.verifyOtp = async (req, res, next) => {
  console.log("verifyOtp me yaha aa rha ha");
  try {
    const { email, otp, name, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if OTP exists and is valid
    if (!user.otp.code || user.otp.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP has expired
    if (Date.now() > user.otp.expiry) {
      await user.clearOTP();
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Update user details
    const hashPassword = await User.hashPassword(password);
    user.name = name;
    user.password = hashPassword;
    user.isVerified = true;
    user.authMethod = "email";
    await user.clearOTP(); // Clear OTP after successful verification

    // Generate token
    const token = await user.generateAuthToken();

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
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
  return res.status(200).json({ user: req.user });
};

module.exports.updateProfile = async (req, res, next) => {
  console.log("update profile me yaha aa rha ha");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log(req.body);
  const { name, email, phone, location, avatar } = req.body;
  console.log("update profile me yaha aa rha ha", req.user._id);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
      phone,
      location,
      avatar,
    },
    { new: true }
  );
  console.log(user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ user });
};

module.exports.googleLogin = async (req, res, next) => {
  try {
    const { code } = req.body;

    const { OAuth2Client } = require("google-auth-library");
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Exchange authorization code for tokens
    const { tokens } = await client.getToken(code);

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    });

    if (!user) {
      // Create new user without password
      user = new User({
        name,
        email,
        googleId,
        avatar: picture,
        isVerified: true,
        authMethod: "google",
      });
      await user.save();
    } else {
      // User exists - update Google credentials if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.authMethod = "google";
        await user.save();
      }
      // Update profile picture if empty
      if (!user.avatar) {
        user.avatar = picture;
        await user.save();
      }
    }

    // Generate JWT
    const token = await user.generateAuthToken();

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authMethod: user.authMethod,
      },
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(400).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  console.log("forgot password me aaya hu", email);
  // 1. Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // 2. Generate reset token (expires in 10 mins)
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
  await user.save();
  // 3. Send email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/users/reset-password/${resetToken}`;
  console.log("yaha tk to aagay ab kya", resetUrl);

  const message = `
    <h1>Password Reset Request</h1>
    <p>Click this link to reset your password:</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    <p><small>Link expires in 10 minutes</small></p>
  `;
  console.log(user.email);
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: message,
    });

    res.json({ message: "Reset link sent to email" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500).json({ message: "Email could not be sent" });
  }
};

module.exports.getResetPassword = async (req, res, next) => {
  const { token } = req.params;
  try {
    // Hash the token to match the one stored in the database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    // Find the user with the matching token and check if it is still valid
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // Ensure token has not expired
    });

    if (!user) {
      return res.status(400).send("Invalid or expired token");
    }

    // Render the EJS file and pass the token to the template
    return res.render("resetPassword", { token });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while processing your request.");
  }
};

module.exports.resetPassword = async (req, res, next) => {
  const { password } = req.body;
  console.log(password, req.params.token);
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log("hashedToken : ", hashedToken);
  // 2. Find user with valid token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid or expired token",
    });
  }
  const hashedPassword = await User.hashPassword(password);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  const email = user.email;
  console.log(user.email);
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Changed",
      html: `<p>Your password has been successfully changed.</p>`,
    });
  } catch (err) {
    // Email fail shouldn't block the reset
    console.error("Confirmation email failed:", err);
  }
  res.status(200).json({
    message: "Password updated successfully",
  });
};
