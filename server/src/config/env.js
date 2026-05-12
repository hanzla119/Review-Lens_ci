import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/review-lens",
  jwtSecret: process.env.JWT_SECRET || "development-only-change-this-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookieSecure: process.env.COOKIE_SECURE === "true",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || "Review Lens <no-reply@reviewlens.local>",
  },
};

if (env.nodeEnv === "production" && env.jwtSecret === "development-only-change-this-secret") {
  throw new Error("JWT_SECRET must be configured in production.");
}
