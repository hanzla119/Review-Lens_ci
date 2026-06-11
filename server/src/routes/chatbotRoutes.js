import { Router } from "express";
import { listChatHistory, sendChatMessage } from "../controllers/chatbotController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

// Secure chatbot endpoints
router.use(requireAuth);

router.get("/history", listChatHistory);
router.post("/", sendChatMessage);

export default router;
