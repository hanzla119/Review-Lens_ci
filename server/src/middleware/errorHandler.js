import { env } from "../config/env.js";

export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  if (error.code === 11000) {
    return res.status(409).json({
      message: "An account with this email already exists.",
    });
  }

  return res.status(statusCode).json({
    message: error.message || "Something went wrong. Please try again.",
    ...(error.details ? { details: error.details } : {}),
    ...(env.nodeEnv !== "production" && !error.isOperational ? { stack: error.stack } : {}),
  });
};
