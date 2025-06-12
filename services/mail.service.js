const nodemailer = require("nodemailer");
const config = require("config");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.get("smtp_host"), // e.g. smtp.gmail.com
      port: config.get("smtp_port"), // 587 or 465
      secure: config.get("smtp_port") === 465, // true for port 465, false for 587
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_password"),
      },
    });
  }

  async sendMail(toEmail, link) {
    try {
      await this.transporter.sendMail({
        from: `"Your App Name" <${config.get("smtp_user")}>`,
        to: toEmail,
        subject: "Admin faollashtirish",
        text: `Activation Link: ${link}`,
        html: `
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Link</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05); text-align: center;">
    <h2 style="color: #333;">🔐 Your Activation Link</h2>
    <div style="font-size: 18px; font-weight: bold; margin: 20px auto; background-color: #f0f0f0; display: inline-block; padding: 15px 30px; border-radius: 8px; color: #111;">
      <a href="${link}" target="_blank">${link}</a>
    </div>
    <p style="margin-top: 20px; font-size: 14px; color: #777;">Click the link to activate your admin account.</p>
    <p style="font-size: 12px; color: #aaa;">If you did not request this, please ignore this message.</p>
  </div>
</body>
</html>
        `,
      });
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      throw new Error("Failed to send email");
    }
  }
}

const mailService = new MailService();
module.exports = { mailService };
