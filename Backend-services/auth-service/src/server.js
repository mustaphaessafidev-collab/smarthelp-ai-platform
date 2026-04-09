import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRouter.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// ✅ middleware
app.use(helmet());

app.use(cors({
  origin: "http://localhost:5173", // React
  credentials: true,
}));

app.use(morgan("dev"));
app.use(express.json());

// ✅ FIX الصور (مهم بزاف 🔥)
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// ✅ serve images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ routes
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", adminRouter);

// test route
app.get("/", (req, res) => {
  res.json({ message: "SmartHelp AI Backend is running" });
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});