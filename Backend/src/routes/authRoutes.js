import express from "express";
import { register,verifyCode,login,resendCode } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-code", verifyCode);
router.post("/login",login);
router.post("/resend-code",resendCode);

export default router;