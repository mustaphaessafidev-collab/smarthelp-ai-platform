import express from "express";
import { createTicket, getMyTickets } from "../controllers/ticketController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, upload.array("attachments", 5), createTicket);
router.get("/my-tickets", authMiddleware, getMyTickets);

export default router;