const Query = require("../models/query.model");
require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

exports.contactUs = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const emailContent = `
    <h1>Contact Us Query</h1>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: "New Contact Us Query",
      html: emailContent,
    });

    // Save to your database
    const query = new Query({
      userId: req.user._id,
      query: message,
    });
    await query.save();

    return res.status(200).json({
      message:
        "Your message has been sent successfully. We will get back to you soon.",
    });
  } catch (err) {
    console.error("Email send error:", err);
    return res
      .status(500)
      .json({ error: "Failed to send your message. Please try again later." });
  }
};
