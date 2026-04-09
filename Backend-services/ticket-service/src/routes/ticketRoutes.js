import express from "express";
import {
  addMessageToTicket,
  assignTicket,
  createTicket,
  DeleteTicket,
  getAllTickets,
  getMyAssignedTickets,
  getMyTickets,
  getTicketById,
  updateTicket,
} from "../controllers/ticketController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { getCategoriesFromAdmin } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/categories", getCategoriesFromAdmin);
router.post("/create",authMiddleware,upload.array("attachments"),createTicket);
router.get("/my-tickets", authMiddleware, getMyTickets);
router.get("/:id", authMiddleware, getTicketById);
router.post("/:id/messages", authMiddleware, addMessageToTicket);
router.delete("/:id", authMiddleware, DeleteTicket);
router.put("/:id", authMiddleware, upload.array("attachments"), updateTicket);


// agent
router.get("/", authMiddleware, getAllTickets);
router.post("/:ticketId/assign", authMiddleware, assignTicket);
router.get("/my", authMiddleware, getMyAssignedTickets);
export default router;
