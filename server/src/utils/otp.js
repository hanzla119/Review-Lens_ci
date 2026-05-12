import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OtpToken } from "../models/OtpToken.js";
import { ApiError } from "./ApiError.js";

const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

export const generateOtpCode = () => crypto.randomInt(100000, 1000000).toString();

export const createOtpToken = async ({ email, purpose = "signup", otp }) => {
  await OtpToken.deleteMany({ email, purpose });

  return OtpToken.create({
    email,
    purpose,
    otpHash: await bcrypt.hash(otp, 10),
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
  });
};

export const verifyOtpToken = async ({ email, purpose = "signup", otp, markVerified = true }) => {
  const token = await OtpToken.findOne({
    email,
    purpose,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!token) {
    throw new ApiError(400, "Verification code has expired. Please request a new code.");
  }

  if (token.attempts >= MAX_OTP_ATTEMPTS) {
    throw new ApiError(429, "Too many incorrect verification attempts. Please request a new code.");
  }

  const isMatch = await bcrypt.compare(otp, token.otpHash);

  if (!isMatch) {
    token.attempts += 1;
    await token.save();
    throw new ApiError(400, "Invalid verification code.");
  }

  if (markVerified) {
    token.verified = true;
    await token.save();
  }

  return token;
};
