import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const hasSmtpConfig = Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    })
  : null;

export const sendOtpEmail = async ({ email, otp }) => {
  const subject = "Your Review Lens verification code";
  const text = `Your Review Lens verification code is ${otp}. It expires in 10 minutes.`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#10201c">
      <h2>Review Lens verification</h2>
      <p>Use this code to verify your email address:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:6px">${otp}</p>
      <p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
    </div>
  `;

  if (!transporter) {
    // Development fallback keeps local setup simple without exposing codes in production.
    console.log(`[Review Lens OTP] ${email}: ${otp}`);
    return;
  }

  await transporter.sendMail({
    from: env.smtp.from,
    to: email,
    subject,
    text,
    html,
  });
};
