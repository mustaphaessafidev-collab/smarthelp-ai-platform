import express from "express";
import { register,verifyCode,login,resendCode, googleLogin,forgotPassword,resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-code", verifyCode);
router.post("/login",login);
router.post("/resend-code",resendCode);
router.post("/google-login",googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


export default router;