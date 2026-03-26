import express from "express";
import { AddAgent, getAgentOnly, getUsersOnly } from "../controllers/adminuserController.js";


const router = express.Router();
// user roture
router.get("/users",getUsersOnly)

//Agent Ruter
router.get("/agent",getAgentOnly)
router.post("/agent",AddAgent)
export default router;