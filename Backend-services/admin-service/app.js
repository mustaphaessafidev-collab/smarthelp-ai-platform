import express from "express";
import cors from "cors";
import morgan from "morgan";

import categoryRoutes from "./src/routes/CategoryRouter.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Admin service is working" });
});

export default app;