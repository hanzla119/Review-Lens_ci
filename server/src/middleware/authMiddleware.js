import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { tokenCookieName, verifyToken } from "../utils/jwt.js";

export const requireAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = bearerToken || req.cookies?.[tokenCookieName];

    if (!token) {
      throw new ApiError(401, "You must be logged in to access this resource.");
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.sub);

    if (!user) {
      throw new ApiError(401, "Your session is no longer valid. Please log in again.");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, "Invalid or expired session. Please log in again."));
  }
};
