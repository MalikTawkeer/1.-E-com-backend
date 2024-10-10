import nodemailer from "nodemailer";
import config from "../config/config.js";

console.log(config.password, config.gmail);

const TRANSPORTER = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: config.gmail,
    pass: config.password,
  },
});

async function sendEmail(senderName, recipientEmail, subject, text) {
  try {
    // Compose the email
    const mailOptions = {
      from: { senderName },
      to: recipientEmail,
      subject: subject,
      text: text,
    };

    // Send the email
    const info = await TRANSPORTER.sendMail(mailOptions);

    console.log("Email sent:", info.response);

    return true; // Email sent successfully
  } catch (error) {
    console.error("Error:", error);
    return false; // Email sending failed
  }
}
export default sendEmail;
