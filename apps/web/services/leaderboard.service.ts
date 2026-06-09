import api from "@/lib/axios";
import type { ApiResponse, LeaderboardEntry } from "@/types";

// ─── Leaderboard ──────────────────────────────────────────────────────────────
export const leaderboardService = {
  getWeekly: () =>
    api
      .get<ApiResponse<LeaderboardEntry[]>>("/leaderboard/weekly")
      .then((r) => r.data.data),

  getMyRank: () =>
    api
      .get<ApiResponse<{ rank: number; weeklyScore: number }>>(
        "/leaderboard/me"
      )
      .then((r) => r.data.data),
};
