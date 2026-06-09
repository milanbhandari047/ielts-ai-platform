"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LeaderboardEntry } from "@/types";
import { leaderboardService } from "@/services/leaderboard.service";
import { SectionLoader } from "@/components/ui/spinner";
import { BandBadge } from "@/components/ui/BandBadge";

const RANK_COLORS: Record<number, string> = {
  1: "bg-yellow-400 text-yellow-900",
  2: "bg-gray-300 text-gray-700",
  3: "bg-amber-600 text-amber-100",
};

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<{
    rank: number;
    weeklyScore: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      leaderboardService.getWeekly(),
      leaderboardService.getMyRank(),
    ])
      .then(([e, r]) => {
        setEntries(e);
        setMyRank(r);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <SectionLoader />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weekly Leaderboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Rankings reset every Monday. Score points by completing tests and
          practice sessions.
        </p>
      </div>

      {/* My rank banner */}
      {myRank && (
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">
                Your Rank This Week
              </p>
              <p className="mt-1 text-3xl font-black">#{myRank.rank}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Weekly Score</p>
              <p className="text-2xl font-bold">
                {myRank.weeklyScore.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 podium */}
      {entries.length >= 3 && (
        <div className="flex items-end justify-center gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          {[entries[1], entries[0], entries[2]].map((entry, i) => {
            const heights = ["h-20", "h-28", "h-16"];
            const realRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            return (
              <div
                key={entry.userId}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                  {entry.name[0]}
                </div>
                <p className="max-w-[80px] truncate text-center text-xs font-medium text-gray-700">
                  {entry.name}
                </p>
                <BandBadge band={entry.overallBand} size="sm" />
                <div
                  className={cn(
                    "w-full rounded-t-xl flex items-center justify-center font-black text-xl",
                    heights[i],
                    RANK_COLORS[realRank] ?? "bg-gray-100"
                  )}
                >
                  #{realRank}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="divide-y divide-gray-50">
          {entries.map((entry) => (
            <div
              key={entry.userId}
              className={cn(
                "flex items-center gap-4 px-5 py-3.5",
                entry.isCurrentUser && "bg-indigo-50"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  entry.rank <= 3
                    ? RANK_COLORS[entry.rank] ?? "bg-gray-200 text-gray-600"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {entry.rank}
              </span>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                {entry.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    entry.isCurrentUser ? "text-indigo-700" : "text-gray-900"
                  )}
                >
                  {entry.name}{" "}
                  {entry.isCurrentUser && (
                    <span className="text-xs">(you)</span>
                  )}
                </p>
              </div>
              <BandBadge band={entry.overallBand} size="sm" />
              <span className="text-sm font-bold text-gray-700">
                {entry.weeklyScore.toFixed(0)} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">
        Score points by completing reading/listening tests (10 pts),
        writing/speaking submissions (20 pts), and daily streaks (5 pts/day).
      </p>
    </div>
  );
}
