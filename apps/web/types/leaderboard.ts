// types/leaderboard.ts

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string | null;
  weeklyScore: number;
  overallBand: number | null;
  isCurrentUser: boolean;
}

export interface MyRank {
  rank: number | null;
  weeklyScore: number;
  total: number;
}
