import express from "express";
import cors from "cors";
import morgan from "morgan";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Admin service is working" });
});

app.use("/api/admin", adminRoutes);

export default app;