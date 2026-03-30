import express from "express";
import { createTicket,getMyTickets } from "../controllers/ticketController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/createTicket", authMiddleware, createTicket);
router.get("/getTickets", authMiddleware, getMyTickets);

export default router;