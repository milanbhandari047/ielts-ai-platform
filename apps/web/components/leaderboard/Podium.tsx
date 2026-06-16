"use client";
// components/leaderboard/Podium.tsx

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { BandBadge } from "@/components/ui/BandBadge";
import type { LeaderboardEntry } from "@/types/leaderboard";

interface PodiumProps {
  top3: LeaderboardEntry[]; // exactly 3 entries, rank 1/2/3
}

const PODIUM_CONFIG = [
  // Display order: 2nd, 1st, 3rd
  {
    rankIndex: 1, // entries[1] = rank 2
    order: 0,
    barHeight: "h-20",
    barColor: "bg-gradient-to-t from-slate-200 to-slate-100",
    ringColor: "ring-slate-300",
    crownColor: "text-slate-400",
    label: "2nd",
    labelColor: "text-slate-500",
    avatarSize: "lg" as const,
  },
  {
    rankIndex: 0, // entries[0] = rank 1
    order: 1,
    barHeight: "h-32",
    barColor: "bg-gradient-to-t from-yellow-300 to-yellow-100",
    ringColor: "ring-yellow-400",
    crownColor: "text-yellow-500",
    label: "1st",
    labelColor: "text-yellow-600",
    avatarSize: "xl" as const,
  },
  {
    rankIndex: 2, // entries[2] = rank 3
    order: 2,
    barHeight: "h-14",
    barColor: "bg-gradient-to-t from-amber-300 to-amber-100",
    ringColor: "ring-amber-400",
    crownColor: "text-amber-600",
    label: "3rd",
    labelColor: "text-amber-600",
    avatarSize: "lg" as const,
  },
];

export function Podium({ top3 }: PodiumProps) {
  if (top3.length < 3) return null;

  return (
    <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm px-6 pt-6 pb-0 overflow-hidden">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6 text-center">
        Top 3 This Week
      </p>

      <div className="flex items-end justify-center gap-3">
        {PODIUM_CONFIG.map((cfg) => {
          const entry = top3[cfg.rankIndex];
          if (!entry) return null;

          return (
            <div
              key={entry.userId}
              className="flex flex-col items-center gap-2 flex-1 min-w-0"
            >
              {/* Crown for 1st */}
              {cfg.rankIndex === 0 && (
                <span className="text-2xl animate-bounce">👑</span>
              )}

              {/* Avatar */}
              <div
                className={cn(
                  "ring-2 rounded-full",
                  entry.isCurrentUser ? "ring-indigo-400" : cfg.ringColor
                )}
              >
                <Avatar
                  name={entry.name}
                  avatar={entry.avatar}
                  size={cfg.avatarSize}
                />
              </div>

              {/* Name */}
              <div className="text-center w-full px-1">
                <p
                  className={cn(
                    "text-xs font-semibold truncate",
                    entry.isCurrentUser ? "text-indigo-700" : "text-gray-800"
                  )}
                >
                  {entry.name.split(" ")[0]}
                  {entry.isCurrentUser && " ✦"}
                </p>
                <p className="text-xs text-gray-400 font-medium">
                  {entry.weeklyScore.toFixed(0)} pts
                </p>
              </div>

              {/* Band badge */}
              <BandBadge band={entry.overallBand} size="sm" />

              {/* Podium bar */}
              <div
                className={cn(
                  "w-full rounded-t-xl flex items-center justify-center",
                  cfg.barHeight,
                  cfg.barColor
                )}
              >
                <span className={cn("text-lg font-black", cfg.labelColor)}>
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
