import { Router } from "express";
import {
  getCurrentUser,
  googleLogin,
  login,
  logout,
  sendOtp,
  signup,
  verifyOtp,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { methodNotAllowed } from "../middleware/methodNotAllowed.js";

const router = Router();

router
  .route("/send-otp")
  .post(sendOtp)
  .all(methodNotAllowed(["POST"], "Send a POST request with JSON body: { \"email\": \"you@example.com\" }."));

router
  .route("/verify-otp")
  .post(verifyOtp)
  .all(methodNotAllowed(["POST"], "Send a POST request with JSON body: { \"email\": \"you@example.com\", \"otp\": \"123456\" }."));

router
  .route("/signup")
  .post(signup)
  .all(methodNotAllowed(["POST"], "Send a POST request with name, email, password, confirmPassword, and otp."));

router
  .route("/login")
  .post(login)
  .all(methodNotAllowed(["POST"], "Send a POST request with JSON body: { \"email\": \"you@example.com\", \"password\": \"...\" }."));

router
  .route("/google")
  .post(googleLogin)
  .all(methodNotAllowed(["POST"], "Send a POST request with the Google ID credential."));

router
  .route("/logout")
  .post(requireAuth, logout)
  .all(methodNotAllowed(["POST"], "Send a POST request while logged in."));

router
  .route("/me")
  .get(requireAuth, getCurrentUser)
  .all(methodNotAllowed(["GET"], "Send a GET request with your JWT session."));

export default router;
