const User = require("../models/user.model");
const Result = require("../models/result.model");
const Quiz = require("../models/quiz.model");
const LeaderBoard = require("../models/leaderboard.model");
const { validationResult } = require("express-validator");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const Feedback = require("../models/feedback.model");
const crypto = require("crypto");
const Query = require("../models/query.model");
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

    await user.setOTP(otp);
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
  const {
    name,
    email,
    phone,
    location,
    avatar,
    gender,
    birthday,
    github,
    twitter,
    linkedin,
    summary,
    skills,
  } = req.body;
  console.log("update profile me yaha aa rha ha", req.user._id);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
      phone,
      location,
      avatar,
      birthday,
      github,
      linkedin,
      summary,
      skills,
      twitter,
      gender,
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
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f7f9fc;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .email-header {
        background: #4caf50;
        color: white;
        padding: 20px;
        text-align: center;
      }
      .email-body {
        padding: 20px;
      }
      .email-body p {
        margin: 0 0 10px;
        line-height: 1.5;
        color: #333;
      }
      .email-body a {
        color: #4caf50;
        text-decoration: none;
        font-weight: bold;
      }
      .email-footer {
        text-align: center;
        padding: 10px;
        background: #f1f1f1;
        font-size: 12px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h1>BrainQuest</h1>
      </div>
      <div class="email-body">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested to reset your password. Click the link below to reset your password:</p>
        <p>
          <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        </p>
        <p>Please note that this link will expire in 10 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      </div>
      <div class="email-footer">
        <p>&copy; ${new Date().getFullYear()} BrainQuest. All Rights Reserved.</p>
      </div>
    </div>
  </body>
</html>
`;
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
      subject: "Password Changed Successfully - BrainQuest",
      html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Changed Successfully - BrainQuest</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8f9fa;
                margin: 0;
                padding: 20px;
            }
    
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                border: 1px solid #e0e0e0;
            }
    
            .header {
                background: linear-gradient(135deg, #1a1f37 0%, #2c3250 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }
    
            .header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255, 193, 7, 0.1) 0%, transparent 70%);
                animation: pulse 6s ease-in-out infinite;
            }
    
            @keyframes pulse {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.02); }
            }
    
            .logo {
                position: relative;
                z-index: 2;
            }
    
            .logo h1 {
                color: #ffc107;
                font-size: 2.5rem;
                font-weight: 800;
                margin: 0 0 8px 0;
                text-shadow: 0 2px 10px rgba(255, 193, 7, 0.3);
            }
    
            .logo p {
                color: rgba(255, 255, 255, 0.8);
                font-size: 0.9rem;
                margin: 0;
                font-weight: 300;
            }
    
            .content {
                padding: 40px 30px;
                background: #ffffff;
            }
    
            .success-icon {
                text-align: center;
                margin-bottom: 30px;
            }
    
            .success-icon .icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
                box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
            }
    
            .success-icon .checkmark {
                color: white;
                font-size: 2.5rem;
                font-weight: bold;
            }
    
            .main-message {
                text-align: center;
                margin-bottom: 30px;
            }
    
            .main-message h2 {
                color: #1a1f37;
                font-size: 1.8rem;
                font-weight: 700;
                margin-bottom: 15px;
            }
    
            .main-message p {
                color: #666;
                font-size: 1.1rem;
                line-height: 1.6;
            }
    
            .details-box {
                background: linear-gradient(135deg, rgba(255, 193, 7, 0.05) 0%, rgba(255, 152, 0, 0.05) 100%);
                border: 1px solid rgba(255, 193, 7, 0.2);
                border-radius: 12px;
                padding: 25px;
                margin: 30px 0;
            }
    
            .detail-item {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                padding: 8px 0;
            }
    
            .detail-item:last-child {
                margin-bottom: 0;
            }
    
            .detail-icon {
                width: 20px;
                height: 20px;
                margin-right: 15px;
                color: #ffc107;
            }
    
            .detail-text {
                color: #444;
                font-size: 0.95rem;
            }
    
            .detail-text strong {
                color: #1a1f37;
                font-weight: 600;
            }
    
            .security-notice {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 20px;
                margin: 25px 0;
            }
    
            .security-notice .warning-icon {
                color: #856404;
                font-size: 1.2rem;
                margin-right: 10px;
            }
    
            .security-notice h3 {
                color: #856404;
                font-size: 1.1rem;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
            }
    
            .security-notice p {
                color: #856404;
                font-size: 0.9rem;
                margin: 0;
                line-height: 1.5;
            }
    
            .action-buttons {
                text-align: center;
                margin: 30px 0;
            }
    
            .btn {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
                color: #1a1f37;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 0.95rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
            }
    
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
                text-decoration: none;
                color: #1a1f37;
            }
    
            .footer {
                background: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }
    
            .footer p {
                color: #6c757d;
                font-size: 0.85rem;
                margin: 5px 0;
            }
    
            .footer .support-link {
                color: #ffc107;
                text-decoration: none;
                font-weight: 500;
            }
    
            .footer .support-link:hover {
                text-decoration: underline;
            }
    
            @media (max-width: 600px) {
                .email-container {
                    margin: 10px;
                    border-radius: 12px;
                }
                
                .header {
                    padding: 30px 20px;
                }
                
                .content {
                    padding: 30px 20px;
                }
                
                .logo h1 {
                    font-size: 2rem;
                }
                
                .main-message h2 {
                    font-size: 1.5rem;
                }
                
                .details-box {
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">
                    <h1>BrainQuest</h1>
                    <p>Learn • Challenge • Excel</p>
                </div>
            </div>
    
            <div class="content">
                <div class="success-icon">
                    <div class="icon">
                        <span class="checkmark">✓</span>
                    </div>
                </div>
    
                <div class="main-message">
                    <h2>Password Changed Successfully!</h2>
                    <p>Your account password has been updated securely. You can now use your new password to sign in to your BrainQuest account.</p>
                </div>
    
                <div class="details-box">
                    <div class="detail-item">
                        <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V11a4 4 0 018 0v4z"></path>
                        </svg>
                        <div class="detail-text">
                            <strong>Account:</strong> Your BrainQuest learning account
                        </div>
                    </div>
                    <div class="detail-item">
                        <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div class="detail-text">
                            <strong>Date & Time:</strong> ${new Date().toLocaleString()}
                        </div>
                    </div>
                    <div class="detail-item">
                        <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div class="detail-text">
                            <strong>Status:</strong> Password updated successfully
                        </div>
                    </div>
                </div>
    
                <div class="security-notice">
                    <h3>
                        <span class="warning-icon">⚠️</span>
                        Didn't make this change?
                    </h3>
                    <p>If you didn't request this password change, please contact our support team immediately. Your account security is our top priority, and we'll help you secure your account right away.</p>
                </div>
    
                <div class="action-buttons">
                    <a href="http://localhost:3000/signin" class="btn">Sign In to BrainQuest</a>
                </div>
            </div>
    
            <div class="footer">
                <p><strong>BrainQuest</strong> - Your Learning Companion</p>
                <p>Need help? Contact us at <a href="mailto:support@brainquest.com" class="support-link">support@brainquest.com</a></p>
                <p>This email was sent to confirm your password change. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>`,
    });
  } catch (err) {
    // Email fail shouldn't block the reset
    console.error("Confirmation email failed:", err);
  }
  res.status(200).json({
    message: "Password updated successfully",
  });
};

module.exports.deleteUser = async (req, res, next) => {
  console.log("delete krne aaya hu", req.user._id);
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await User.findByIdAndDelete(userId);
    await Quiz.deleteMany({ userId: userId });
    await Result.deleteMany({ userId: userId });
    await Query.deleteMany({ userId: userId });
    await LeaderBoard.deleteMany({ userId: userId });
    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting account",
      error: error.message,
    });
  }
};

module.exports.submitFeedback = async (req, res, next) => {
  console.log("submitFeedback me yaha aa rha ha", req.body);
  const { rating, comment, likes } = req.body;
  const userId = req.user._id;

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ message: "Feedback cannot be empty" });
  }

  try {
    const feedback = { userId, rating, comment, likes };
    const newFeedback = await Feedback.create(feedback);
    console.log("Feedback submitted successfully:", newFeedback);
    return res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: newFeedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return res.status(500).json({ message: "Failed to submit feedback" });
  }
};

module.exports.getPastFeedback = async (req, res, next) => {
  try {
    // Get all feedbacks with populated user information
    const feedbacks = await Feedback.find()
      .populate({
        path: "userId",
        model: "User",
        select: "name email avatar", // Select only needed fields
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    // If no feedbacks found
    if (!feedbacks || feedbacks.length === 0) {
      return res.status(200).json({
        message: "No feedback found",
        feedbacks: [],
      });
    }

    // Map through feedbacks to ensure proper user information
    const formattedFeedbacks = feedbacks.map((feedback) => ({
      _id: feedback._id,
      rating: feedback.rating,
      comment: feedback.comment,
      likes: feedback.likes,
      createdAt: feedback.createdAt,
      user: feedback.userId
        ? {
            _id: feedback.userId._id,
            name: feedback.userId.name || "Anonymous",
            email: feedback.userId.email,
            avatar: feedback.userId.avatar || null,
          }
        : {
            name: "Anonymous",
            email: null,
            avatar: null,
          },
    }));

    return res.status(200).json({
      message: "Feedback retrieved successfully",
      feedbacks: formattedFeedbacks,
    });
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    return res.status(500).json({
      message: "Failed to retrieve feedback",
      error: error.message,
    });
  }
};
