import express from "express";
import { createTicket } from "../controllers/ticketController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createTicket);

export default router;