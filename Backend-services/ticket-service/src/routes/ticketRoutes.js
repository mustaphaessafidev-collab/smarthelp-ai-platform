import express from "express";
import {
  addMessageToTicket,
  assignTicket,
  createTicket,
  DeleteTicket,
  getAllTickets,
  generateAIReply,
  getMyAssignedTickets,
  getMyTickets,
  getTicketById,
  updateTicket,
  closeTicket,
} from "../controllers/ticketController.js";
import { getAgentStats } from "../controllers/agentStatsController.js";
import {
  getTicketStats,
  getTicketsByStatus,
  getTicketsByPriority,
} from "../controllers/statsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { getCategoriesFromAdmin } from "../controllers/categoryController.js";

const router = express.Router();

// Admin routes (stats)
router.get("/admin/stats", authMiddleware, getTicketStats);
router.get("/admin/by-status", authMiddleware, getTicketsByStatus);
router.get("/admin/by-priority", authMiddleware, getTicketsByPriority);

// Agent routes (stats)
router.get("/agent/stats", authMiddleware, getAgentStats);

// Special routes (must come first)
router.get("/categories", getCategoriesFromAdmin);
router.post("/create", authMiddleware, upload.array("attachments"), createTicket);

// Agent routes
router.get("/my", authMiddleware, getMyAssignedTickets);
router.post("/:ticketId/assign", authMiddleware, assignTicket);

// User routes (my-tickets and by ID)
router.get("/my-tickets", authMiddleware, getMyTickets);
router.get("/:id", authMiddleware, getTicketById);
router.post("/:id/messages", authMiddleware, addMessageToTicket);
router.post("/:id/ai-reply", authMiddleware, generateAIReply);
router.put("/:id/close", authMiddleware, closeTicket);
router.delete("/:id", authMiddleware, DeleteTicket);
router.put("/:id", authMiddleware, upload.array("attachments"), updateTicket);

// All tickets route (generic, comes last)
router.get("/", authMiddleware, getAllTickets);
export default router;
