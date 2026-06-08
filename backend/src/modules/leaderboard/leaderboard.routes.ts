import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { LeaderboardController } from "./leaderboard.controller.js";

const leaderboardRouter: Router = Router();

const controller = new LeaderboardController();

leaderboardRouter.use(authenticate);

leaderboardRouter.get(
  "/weekly",
  controller.getWeeklyLeaderboard.bind(controller)
);

leaderboardRouter.get("/me", controller.getMyRank.bind(controller));

export default leaderboardRouter;
