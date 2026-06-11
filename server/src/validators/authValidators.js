import { ApiError } from "../utils/ApiError.js";

export const normalizeEmail = (email = "") => email.trim().toLowerCase();

export const validateEmail = (email) => {
  const normalized = normalizeEmail(email);
  const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(normalized);

  if (!isValid) {
    throw new ApiError(400, "Please enter a valid email address.");
  }

  return normalized;
};

export const validatePassword = (password = "") => {
  const errors = [];

  if (password.length < 8) errors.push("at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
  if (!/\d/.test(password)) errors.push("one number");

  if (errors.length > 0) {
    throw new ApiError(400, `Password must contain ${errors.join(", ")}.`);
  }
};

export const validateOtp = (otp = "") => {
  const normalized = otp.trim();

  if (!/^\d{6}$/.test(normalized)) {
    throw new ApiError(400, "Verification code must be exactly 6 digits.");
  }

  return normalized;
};

export const validateName = (name = "") => {
  const normalized = name.trim();

  if (normalized.length < 2) {
    throw new ApiError(400, "Name must be at least 2 characters long.");
  }

  return normalized;
};
