import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "API Gateway is working" });
});

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": "/api/auth",
    },
    ignorePath: false,
  })
);

// app.use(
//   "/api/tickets",
//   createProxyMiddleware({
//     target: process.env.TICKET_SERVICE_URL,
//     changeOrigin: true,
//   })
// );

// app.use(
//   "/api/admin",
//   createProxyMiddleware({
//     target: process.env.ADMIN_SERVICE_URL,
//     changeOrigin: true,
//   })
// );

// app.use(
//   "/api/ai",
//   createProxyMiddleware({
//     target: process.env.AI_SERVICE_URL,
//     changeOrigin: true,
//   })
// );

export default app;