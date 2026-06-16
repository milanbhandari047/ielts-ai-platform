"use client";
// components/leaderboard/PointsGuide.tsx

import {
  FileText,
  Headphones,
  PenLine,
  Mic,
  Trophy,
  Flame,
} from "lucide-react";

const POINT_RULES = [
  {
    icon: FileText,
    label: "Reading attempt",
    pts: 10,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Headphones,
    label: "Listening attempt",
    pts: 10,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: PenLine,
    label: "Writing submission",
    pts: 20,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Mic,
    label: "Speaking submission",
    pts: 20,
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    icon: Trophy,
    label: "Full mock test",
    pts: 50,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    icon: Flame,
    label: "Daily streak bonus",
    pts: 5,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
];

export function PointsGuide() {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm p-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        How to earn points
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {POINT_RULES.map((rule) => (
          <div
            key={rule.label}
            className="flex items-center gap-2.5 rounded-xl p-2.5 bg-gray-50"
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${rule.bg}`}
            >
              <rule.icon className={`w-3.5 h-3.5 ${rule.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-600 font-medium leading-tight truncate">
                {rule.label}
              </p>
              <p className="text-xs font-bold text-indigo-600">
                +{rule.pts} pts
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Rankings reset every Monday at midnight UTC
      </p>
    </div>
  );
}
