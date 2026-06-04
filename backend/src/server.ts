import dotenv from "dotenv";
dotenv.config();
import { ENV } from "./config/env.js";
import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import cors from "cors";

const app = express();
// const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "IELTS API running" });
});

app.listen(ENV.PORT, () => {
  console.log(`Server running on http://localhost:${ENV.PORT}`);
});
