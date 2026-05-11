import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { OtpToken } from "../models/OtpToken.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { clearAuthCookie, setAuthCookie, signToken } from "../utils/jwt.js";
import { sendOtpEmail } from "../utils/mailer.js";
import { createOtpToken, generateOtpCode, verifyOtpToken } from "../utils/otp.js";
import {
  normalizeEmail,
  validateEmail,
  validateName,
  validateOtp,
  validatePassword,
} from "../validators/authValidators.js";

const googleClient = new OAuth2Client(env.googleClientId);

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  provider: user.provider,
  isVerified: user.isVerified,
});

const sendAuthResponse = async (res, user, message, statusCode = 200) => {
  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken(user._id.toString());
  setAuthCookie(res, token);

  res.status(statusCode).json({
    message,
    token,
    user: sanitizeUser(user),
  });
};

export const sendOtp = async (req, res, next) => {
  try {
    const email = validateEmail(req.body.email);
    const purpose = req.body.purpose || "signup";

    if (purpose !== "signup") {
      throw new ApiError(400, "Unsupported OTP purpose.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists. Please log in instead.");
    }

    const otp = generateOtpCode();
    await createOtpToken({ email, purpose, otp });
    await sendOtpEmail({ email, otp });

    res.json({
      message: "Verification code sent. Please check your email.",
      ...(env.nodeEnv !== "production" ? { developmentOtp: otp } : {}),
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const email = validateEmail(req.body.email);
    const otp = validateOtp(req.body.otp);
    const purpose = req.body.purpose || "signup";

    if (purpose !== "signup") {
      throw new ApiError(400, "Unsupported OTP purpose.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists. Please log in instead.");
    }

    await verifyOtpToken({ email, purpose, otp });
    res.json({ message: "Email verified successfully. You can complete signup now." });
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
    const name = validateName(req.body.name);
    const email = validateEmail(req.body.email);
    const otp = validateOtp(req.body.otp);
    const password = req.body.password || "";
    const confirmPassword = req.body.confirmPassword || "";

    validatePassword(password);

    if (password !== confirmPassword) {
      throw new ApiError(400, "Password and confirm password do not match.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists. Please log in instead.");
    }

    const verifiedOtp = await OtpToken.findOne({
      email,
      purpose: "signup",
      verified: true,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!verifiedOtp) {
      await verifyOtpToken({ email, purpose: "signup", otp });
    } else {
      const otpMatches = await bcrypt.compare(otp, verifiedOtp.otpHash);
      if (!otpMatches) {
        throw new ApiError(400, "Invalid verification code.");
      }
    }

    const user = await User.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      provider: "local",
      isVerified: true,
    });

    await OtpToken.deleteMany({ email, purpose: "signup" });
    await sendAuthResponse(res, user, "Signup completed successfully.", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const email = validateEmail(req.body.email);
    const password = req.body.password || "";

    if (!password) {
      throw new ApiError(400, "Password is required.");
    }

    const user = await User.findOne({ email }).select("+passwordHash");
    const isPasswordValid = user ? await user.comparePassword(password) : false;

    if (!user || !isPasswordValid) {
      throw new ApiError(401, "Invalid email or password.");
    }

    if (!user.isVerified) {
      throw new ApiError(403, "Please verify your email before logging in.");
    }

    await sendAuthResponse(res, user, "Logged in successfully.");
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const credential = req.body.credential;

    if (!credential) {
      throw new ApiError(400, "Google credential is required.");
    }

    if (!env.googleClientId) {
      throw new ApiError(500, "Google authentication is not configured on the server.");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.googleClientId,
    });

    const payload = ticket.getPayload();
    const email = normalizeEmail(payload?.email);

    if (!email || !payload?.email_verified) {
      throw new ApiError(403, "Google account email must be verified.");
    }

    let user = await User.findOne({ email });

    if (user) {
      user.googleId = user.googleId || payload.sub;
      user.avatar = payload.picture || user.avatar;
      user.isVerified = true;
    } else {
      user = await User.create({
        name: payload.name || email.split("@")[0],
        email,
        googleId: payload.sub,
        avatar: payload.picture || "",
        provider: "google",
        isVerified: true,
      });
    }

    await sendAuthResponse(res, user, "Google authentication successful.");
  } catch (error) {
    next(error);
  }
};

export const logout = (_req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out successfully." });
};

export const getCurrentUser = (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};
