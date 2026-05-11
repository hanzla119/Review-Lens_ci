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

const router = Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, getCurrentUser);

export default router;
