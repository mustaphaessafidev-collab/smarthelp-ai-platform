import express from "express";
import { AddAgent, deleteAgent, getAgentOnly, getUsersOnly } from "../controllers/adminuserController.js";


const router = express.Router();
// user roture
router.get("/users",getUsersOnly)

//Agent Ruter
router.get("/agent",getAgentOnly)
router.post("/agent",AddAgent)
router.delete("/agent/:id",deleteAgent)
export default router;