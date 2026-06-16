"use client";
// app/leaderboard/page.tsx

import { useEffect } from "react";
import { RefreshCw, Trophy, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLeaderboardStore } from "@/store/leaderboard.store";
import { MyRankBanner } from "@/components/leaderboard/MyRankBanner";
import { Podium } from "@/components/leaderboard/Podium";
import { LeaderboardRow } from "@/components/leaderboard/LeaderboardRow";
import { PointsGuide } from "@/components/leaderboard/PointsGuide";

// ─── Skeletons ─────────────────────────────────────────────────────────────────

function BannerSkeleton() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-200 to-purple-200 p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-white/50 rounded-full" />
          <div className="h-10 w-16 bg-white/50 rounded-xl" />
          <div className="h-3 w-48 bg-white/40 rounded-full" />
        </div>
        <div className="text-right space-y-2">
          <div className="h-3 w-24 bg-white/50 rounded-full ml-auto" />
          <div className="h-8 w-12 bg-white/50 rounded-xl ml-auto" />
          <div className="h-3 w-28 bg-white/40 rounded-full ml-auto" />
        </div>
      </div>
    </div>
  );
}

function PodiumSkeleton() {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm px-6 pt-6 pb-0 overflow-hidden">
      <div className="h-3 w-24 bg-gray-100 rounded-full mx-auto mb-6 animate-pulse" />
      <div className="flex items-end justify-center gap-3">
        {[20, 32, 14].map((h, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
            <div className="h-2 w-16 bg-gray-100 rounded-full animate-pulse" />
            <div
              className={`w-full rounded-t-xl bg-gray-100 animate-pulse`}
              style={{ height: `${h * 4}px` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3 animate-pulse"
        >
          <div className="w-7 h-7 rounded-full bg-gray-100 flex-shrink-0" />
          <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-28 bg-gray-100 rounded-full" />
          </div>
          <div className="h-5 w-12 bg-gray-100 rounded-full" />
          <div className="h-4 w-10 bg-gray-100 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const { entries, myRank, isLoading, error, fetchLeaderboard, refresh } =
    useLeaderboardStore();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 py-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
          </div>
          <p className="text-sm text-gray-500 pl-10">
            Weekly rankings · {entries.length} participants
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-40"
        >
          <RefreshCw
            className={cn("w-3.5 h-3.5", isLoading && "animate-spin")}
          />
          Refresh
        </button>
      </div>

      {/* ── Error state ── */}
      {error && !isLoading && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button
              onClick={refresh}
              className="text-xs text-red-500 hover:text-red-700 underline mt-0.5"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* ── My rank banner ── */}
      {isLoading ? (
        <BannerSkeleton />
      ) : myRank && entries.length > 0 ? (
        <MyRankBanner myRank={myRank} totalParticipants={entries.length} />
      ) : null}

      {/* ── Podium ── */}
      {isLoading ? (
        <PodiumSkeleton />
      ) : top3.length >= 3 ? (
        <Podium top3={top3} />
      ) : null}

      {/* ── Full list ── */}
      {isLoading ? (
        <ListSkeleton />
      ) : entries.length > 0 ? (
        <div>
          {/* Header row */}
          <div className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <div className="w-9" />
            <div className="w-8" />
            <div className="flex-1">Student</div>
            <div className="hidden sm:block w-16">Band</div>
            <div className="w-12 text-right">Score</div>
          </div>

          <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            {entries.map((entry, i) => (
              <LeaderboardRow
                key={entry.userId}
                entry={entry}
                isFirst={i === 0}
                isLast={i === entries.length - 1}
              />
            ))}
          </div>
        </div>
      ) : !error ? (
        <div className="text-center py-16 bg-white rounded-2xl ring-1 ring-gray-100">
          <Trophy className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No scores yet this week</p>
          <p className="text-sm text-gray-400 mt-1">
            Complete activities to earn points and appear here
          </p>
        </div>
      ) : null}

      {/* ── Points guide ── */}
      <PointsGuide />
    </div>
  );
}
