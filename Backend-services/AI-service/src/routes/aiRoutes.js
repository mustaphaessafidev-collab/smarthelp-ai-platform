import express from "express";
import { analyzeTicket } from "../controllers/aiController.js";

const router = express.Router();

router.post("/analyze-ticket", analyzeTicket);

export default router;