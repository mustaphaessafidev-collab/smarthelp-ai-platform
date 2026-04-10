import express from "express";
import { AddAgent, deleteAgent, deleteUser, getAgentOnly, getUsersOnly, UpdateAgent } from "../controllers/adminuserController.js";


const router = express.Router();
// user roture
router.get("/users",getUsersOnly)
router.delete("/user/:id", deleteUser);
//Agent Ruter
router.get("/agent",getAgentOnly)
router.post("/agent",AddAgent)
router.delete("/agent/:id",deleteAgent)
router.put("/agents/:id", UpdateAgent);
export default router;