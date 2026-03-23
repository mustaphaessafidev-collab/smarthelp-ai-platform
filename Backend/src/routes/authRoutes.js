import express from "express";
import { register,verifyCode,login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-code", verifyCode);
router.post("/login",login);

export default router;