"use client";
// components/leaderboard/MyRankBanner.tsx

import { cn } from "@/lib/utils";
import type { MyRank } from "@/types/leaderboard";
import { TrendingUp, Star } from "lucide-react";

interface MyRankBannerProps {
  myRank: MyRank;
}

function getEncouragementMessage(rank: number | null, total: number): string {
  if (rank === null) return "Complete an activity to get on the board! 💪";
  const pct = rank / total;
  if (rank === 1) return "You're #1! Incredible work this week 🔥";
  if (rank <= 3) return "You're on the podium! Keep it up 🏆";
  if (pct <= 0.1) return "You're in the top 10%! Amazing 🌟";
  if (pct <= 0.25) return "You're in the top 25% — great progress!";
  if (pct <= 0.5) return "You're in the top half — keep going!";
  return "Every activity earns points — keep studying!";
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function MyRankBanner({ myRank }: MyRankBannerProps) {
  const { rank, weeklyScore, total } = myRank;

  const isTop3 = rank !== null && rank <= 3;

  // Cap at 100% and only show if ranked
  const percentile =
    rank !== null && total > 0
      ? Math.min(100, Math.round((rank / total) * 100))
      : null;

  return (
    <div
      className={cn(
        "rounded-2xl p-5 text-white relative overflow-hidden",
        isTop3
          ? "bg-gradient-to-br from-yellow-400 via-orange-500 to-rose-500"
          : "bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600"
      )}
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -right-4 -bottom-6 w-20 h-20 rounded-full bg-white/10" />

      <div className="relative flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 opacity-80" />
            <p className="text-sm font-medium opacity-80">
              Your rank this week
            </p>
          </div>

          <p className="text-4xl font-black tracking-tight">
            {rank !== null ? getOrdinal(rank) : "—"}
          </p>

          <p className="text-sm opacity-70 mt-1">
            {getEncouragementMessage(rank, total)}
          </p>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end mb-1">
            <Star className="w-4 h-4 opacity-80" />
            <p className="text-sm font-medium opacity-80">Weekly score</p>
          </div>

          <p className="text-3xl font-black tabular-nums">
            {weeklyScore.toFixed(0)}
          </p>

          <p className="text-sm opacity-70 mt-1">
            {percentile !== null
              ? `Top ${percentile}% of ${total} students`
              : `${total} student${total !== 1 ? "s" : ""} on the board`}
          </p>
        </div>
      </div>
    </div>
  );
}
