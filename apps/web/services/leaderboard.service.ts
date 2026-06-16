// services/leaderboard.service.ts
// Matches backend routes:
//   GET /leaderboard/weekly  → getWeeklyLeaderboardService
//   GET /leaderboard/me      → getMyRankService

import api from "@/lib/axios";
import type { ApiResponse } from "@/types";
import type { LeaderboardEntry, MyRank } from "@/types/leaderboard";

export const leaderboardService = {
  /**
   * GET /leaderboard/weekly
   * Returns top 50 entries ordered by weeklyScore desc
   * Each entry includes rank, userId, name, avatar, weeklyScore, overallBand, isCurrentUser
   */
  getWeekly: (): Promise<LeaderboardEntry[]> =>
    api
      .get<ApiResponse<LeaderboardEntry[]>>("/leaderboard/weekly")
      .then((r) => r.data.data),

  /**
   * GET /leaderboard/me
   * Returns the current user's rank and weeklyScore
   */
  getMyRank: (): Promise<MyRank> =>
    api.get<ApiResponse<MyRank>>("/leaderboard/me").then((r) => r.data.data),
};
