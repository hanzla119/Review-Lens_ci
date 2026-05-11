import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const tokenCookieName = "review_lens_token";

export const signToken = (userId) =>
  jwt.sign({ sub: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);

export const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: env.cookieSecure,
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export const setAuthCookie = (res, token) => {
  res.cookie(tokenCookieName, token, getCookieOptions());
};

export const clearAuthCookie = (res) => {
  res.clearCookie(tokenCookieName, getCookieOptions());
};
