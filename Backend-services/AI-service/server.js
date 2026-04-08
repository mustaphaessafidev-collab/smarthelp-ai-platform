import dotenv from "dotenv";
dotenv.config(); // 👈 أول حاجة

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import router from "./src/routes/aiRoutes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/ai", router);

const PORT = process.env.PORT || 4004;


app.listen(PORT, () => {
  console.log(`AI service running on port ${PORT}`);
});