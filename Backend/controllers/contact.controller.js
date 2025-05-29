const Query = require("../models/query.model");
require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your organization's Gmail
    pass: process.env.EMAIL_APP_PASSWORD, // App password for your Gmail
  },
});

module.exports.contactUs = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Name, email, and message are required." });
  }

  // Create email content to send to your organization
  //   const emailContent = `
  //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  //       <h2 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
  //         New Contact Form Submission
  //       </h2>

  //       <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
  //         <h3 style="color: #555; margin-top: 0;">Contact Details:</h3>
  //         <p><strong>Name:</strong> ${name}</p>
  //         <p><strong>Email:</strong> ${email}</p>
  //         ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
  //         <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
  //       </div>

  //       <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
  //         <h3 style="color: #555; margin-top: 0;">Message:</h3>
  //         <p style="line-height: 1.6; color: #333;">${message.replace(
  //           /\n/g,
  //           "<br>"
  //         )}</p>
  //       </div>

  //       <div style="margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-radius: 8px;">
  //         <p style="margin: 0; color: #666; font-size: 14px;">
  //           <strong>Note:</strong> Please respond to this query by contacting the user directly at: ${email}
  //         </p>
  //       </div>
  //     </div>
  //   `;
  const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Query</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            📩 New Contact Query
          </h1>
          <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">
            BrainQuest Contact Form Submission
          </p>
        </div>

        <!-- Alert Badge -->
        <div style="padding: 0 40px; margin-top: -15px;">
          <div style="background-color: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);">
            NEW INQUIRY
          </div>
        </div>

        <!-- Contact Information Card -->
        <div style="padding: 30px 40px 20px 40px;">
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; border-left: 4px solid #3b82f6; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
              👤 Contact Information
            </h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; width: 100px;">
                  <span style="background-color: #ddd6fe; color: #7c3aed; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">NAME</span>
                </td>
                <td style="padding: 8px 0 8px 15px; border-bottom: 1px solid #e2e8f0; color: #334155; font-weight: 500;">
                  ${name}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="background-color: #fecaca; color: #dc2626; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">EMAIL</span>
                </td>
                <td style="padding: 8px 0 8px 15px; border-bottom: 1px solid #e2e8f0;">
                  <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${email}</a>
                </td>
              </tr>
              ${
                subject
                  ? `
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="background-color: #fed7aa; color: #ea580c; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">SUBJECT</span>
                </td>
                <td style="padding: 8px 0 8px 15px; border-bottom: 1px solid #e2e8f0; color: #334155; font-weight: 500;">
                  ${subject}
                </td>
              </tr>
              `
                  : ""
              }
              <tr>
                <td style="padding: 8px 0;">
                  <span style="background-color: #bbf7d0; color: #16a34a; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">TIME</span>
                </td>
                <td style="padding: 8px 0 8px 15px; color: #64748b; font-size: 14px;">
                  ${new Date().toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZoneName: "short",
                  })}
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Message Content -->
        <div style="padding: 0 40px 30px 40px;">
          <div style="background-color: #ffffff; border-radius: 12px; padding: 25px; border: 2px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
              💬 Message Content
            </h2>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 3px solid #f59e0b;">
              <p style="color: #374151; line-height: 1.7; margin: 0; font-size: 16px; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <div style="padding: 0 40px 30px 40px; text-align: center;">
          <a href="mailto:${email}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3); transition: all 0.2s;">
            📧 Reply to ${name}
          </a>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 25px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; margin: 0; font-size: 14px; line-height: 1.5;">
            This email was automatically generated from your <strong>BrainQuest</strong> contact form.<br>
            Please respond to the customer within 24 hours for the best experience.
          </p>
          <div style="margin-top: 15px;">
            <span style="background-color: #e2e8f0; color: #64748b; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
              🚀 BrainQuest Support System
            </span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  try {
    // Send email to your organization
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Your organization's email (sender)
      to: process.env.CONTACT_EMAIL, // Your organization's contact email (receiver)
      subject: `New Contact Query${subject ? `: ${subject}` : ` from ${name}`}`,
      html: emailContent,
      replyTo: email, // Set user's email as reply-to for easy response
    });

    // Save to database (optional - only if user is authenticated)
    if (req.user && req.user._id) {
      const query = new Query({
        userId: req.user._id,
        name: name,
        email: email,
        subject: subject || "No subject",
        query: message,
        createdAt: new Date(),
      });
      await query.save();
    }

    return res.status(200).json({
      message:
        "Your message has been sent successfully. We will get back to you soon.",
      success: true,
    });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({
      error: "Failed to send your message. Please try again later.",
      success: false,
    });
  }
};
