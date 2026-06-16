"use client";
// components/leaderboard/LeaderboardRow.tsx

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { BandBadge } from "@/components/ui/BandBadge";
import type { LeaderboardEntry } from "@/types/leaderboard";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isFirst?: boolean;
  isLast?: boolean;
}

const RANK_MEDAL: Record<number, { icon: string; bg: string; text: string }> = {
  1: { icon: "🥇", bg: "bg-yellow-50", text: "text-yellow-700" },
  2: { icon: "🥈", bg: "bg-slate-50", text: "text-slate-600" },
  3: { icon: "🥉", bg: "bg-amber-50", text: "text-amber-700" },
};

export function LeaderboardRow({
  entry,
  isFirst,
  isLast,
}: LeaderboardRowProps) {
  const medal = RANK_MEDAL[entry.rank];
  const isTop3 = entry.rank <= 3;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 transition-colors",
        entry.isCurrentUser
          ? "bg-indigo-50 hover:bg-indigo-100/60"
          : "hover:bg-gray-50",
        isFirst && "rounded-t-xl",
        isLast && "rounded-b-xl",
        isTop3 &&
          !entry.isCurrentUser &&
          "bg-gradient-to-r from-transparent to-transparent"
      )}
    >
      {/* Rank */}
      <div className="w-9 flex-shrink-0 flex justify-center">
        {medal ? (
          <span className="text-xl leading-none">{medal.icon}</span>
        ) : (
          <span
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
              entry.isCurrentUser
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-500"
            )}
          >
            {entry.rank}
          </span>
        )}
      </div>

      {/* Avatar */}
      <Avatar
        name={entry.name}
        avatar={entry.avatar}
        size="sm"
        className={cn(
          entry.isCurrentUser && "ring-2 ring-indigo-400 ring-offset-1"
        )}
      />

      {/* Name + "you" tag */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <p
            className={cn(
              "text-sm font-semibold truncate",
              entry.isCurrentUser ? "text-indigo-800" : "text-gray-900"
            )}
          >
            {entry.name}
          </p>
          {entry.isCurrentUser && (
            <span className="flex-shrink-0 text-xs font-medium text-indigo-500 bg-indigo-100 px-1.5 py-0.5 rounded-full">
              you
            </span>
          )}
        </div>
      </div>

      {/* Band badge */}
      <div className="hidden sm:block">
        <BandBadge band={entry.overallBand} size="sm" />
      </div>

      {/* Score */}
      <div className="text-right flex-shrink-0">
        <p
          className={cn(
            "text-sm font-bold tabular-nums",
            entry.isCurrentUser ? "text-indigo-700" : "text-gray-800"
          )}
        >
          {entry.weeklyScore.toFixed(0)}
          <span className="text-xs font-normal text-gray-400 ml-0.5">pts</span>
        </p>
      </div>
    </div>
  );
}
