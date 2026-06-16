import dotenv from "dotenv";
dotenv.config();
import { ENV } from "./config/env.js";
import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import analyticsRoutes from "./modules/analytics/analytics.routes.js";
import readingRoutes from "./modules/reading/reading.routes.js";
import writingRoutes from "./modules/writing/writing.routes.js";
import listeningRoutes from "./modules/listening/listening.routes.js";
import speakingRoutes from "./modules/speaking/speaking.routes.js";
import usersRoutes from "./modules/users/user.routes.js";

import vocabularyRoutes from "./modules/vocabulary/vocabulary.routes.js";
import aiTutorRoutes from "./modules/ai-tutor/ai-tutor.routes.js";
import mockTestRoutes from "./modules/mock-test/mock-test.routes.js";
import notificationRoutes from "./modules/notifications/notificaions.routes.js";
import communityRoutes from "./modules/community/community.routes.js";
import leaderboardRouter from "./modules/leaderboard/leaderboard.routes.js";

import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reading", readingRoutes);
app.use("/api/writing", writingRoutes);
app.use("/api/listening", listeningRoutes);
app.use("/api/speaking", speakingRoutes);
app.use("/api/vocabulary", vocabularyRoutes);
app.use("/api/ai-tutor", aiTutorRoutes);
app.use("/api/mock-test", mockTestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/ai-tutor", aiTutorRoutes);
app.use("/api/leaderboard", leaderboardRouter);

// Error handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "IELTS API running" });
});

app.listen(ENV.PORT, () => {
  console.log(`Server running on http://localhost:${ENV.PORT}`);
});
