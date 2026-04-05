import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  updateMyPassword,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";



const router = express.Router();

router.get("/profile",authMiddleware, getMyProfile);
router.put("/profile",authMiddleware, updateMyProfile);
router.put("/profile/password",authMiddleware, updateMyPassword);

export default router;