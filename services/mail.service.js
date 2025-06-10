const nodemailer = require("nodemailer");
const config = require("config");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp_host"),         
      port: config.get("smtp_port"),         
      secure: false,
      auth: {
        user: config.get("smtp_user"),       
        pass: config.get("smtp_password"),   
      },
    });
  }

  async sendMail(toEmail, link) {
    await this.transporter.sendMail({
      from: config.get("smtp_user"),
      to: toEmail,
      subject: "Admin faollashtirish",
      text: "",
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
    <h2 style="color: #333;">🔐Your link</h2>
    <div style="font-size: 36px; font-weight: bold; margin: 20px auto; background-color: #f0f0f0; display: inline-block; padding: 15px 30px; border-radius: 8px; color: #111;">
      ${link}
    </div>
    <p style="margin-top: 20px; font-size: 14px; color: #777;">This link to activate</p>
    <p style="font-size: 12px; color: #aaa;">If smth went wrong please try again</p>
  </div>
</body>
</html>
      `,
    });
  }
}


const mailService = new MailService();

module.exports = {
  mailService,
};
