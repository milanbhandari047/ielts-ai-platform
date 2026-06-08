import type { Request, Response } from "express";
import {
  getWeeklyLeaderboardService,
  getMyRankService,
} from "./leaderboard.service.js";

export class LeaderboardController {
  async getWeeklyLeaderboard(req: Request, res: Response) {
    try {
      const data = await getWeeklyLeaderboardService(req.user!.userId);

      res.json({
        success: true,
        data,
      });
    } catch (e: any) {
      res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }

  async getMyRank(req: Request, res: Response) {
    try {
      const data = await getMyRankService(req.user!.userId);

      res.json({
        success: true,
        data,
      });
    } catch (e: any) {
      res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }
}
