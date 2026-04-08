import express from "express";
import { createTicket, getMyTickets } from "../controllers/ticketController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { getCategoriesFromAdmin } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/categories", getCategoriesFromAdmin);
router.post("/create", authMiddleware, upload.array("attachments"), createTicket);
router.get("/my-tickets", authMiddleware, getMyTickets);

export default router;