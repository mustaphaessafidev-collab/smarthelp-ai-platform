import express from "express";
import { createTicket, getMyTickets } from "../controllers/ticketController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, upload.array("attachments"), createTicket);
router.get("/my-tickets", authMiddleware, getMyTickets);

export default router;