import express from "express";
import { analyzeTicket, generateReply } from "../controllers/aiController.js";

const router = express.Router();

router.post("/analyze-ticket", analyzeTicket);
router.post("/generate-reply", generateReply);

export default router;