"use client";

import { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboard.service";
import { BandBadge } from "@/components/ui/BandBadge";
import { SectionLoader } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { DashboardSummary } from "@/types";

const SKILLS = [
  { key: "readingBand", label: "Reading", emoji: "📖", color: "bg-blue-500" },
  {
    key: "listeningBand",
    label: "Listening",
    emoji: "🎧",
    color: "bg-purple-500",
  },
  {
    key: "writingBand",
    label: "Writing",
    emoji: "✍️",
    color: "bg-emerald-500",
  },
  {
    key: "speakingBand",
    label: "Speaking",
    emoji: "🎙️",
    color: "bg-orange-500",
  },
] as const;

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getSummary()
      .then(setSummary)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <SectionLoader />;
  if (!summary) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your progress across all IELTS skills.
        </p>
      </div>

      {/* Overall + skills */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Overall */}
        <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-sm lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide opacity-75">
            Overall
          </p>
          <p className="mt-1 text-5xl font-black">
            {summary.overallBand?.toFixed(1) ?? "—"}
          </p>
          <p className="mt-1 text-xs opacity-60">Predicted Band</p>
        </div>

        {/* Each skill */}
        {SKILLS.map(({ key, label, emoji, color }) => {
          const band = summary[key];
          const pct = band !== null ? (band / 9) * 100 : 0;
          return (
            <div
              key={key}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  {emoji} {label}
                </span>
                <BandBadge band={band} size="sm" />
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    color
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {band !== null
                  ? `${((band / 9) * 100).toFixed(0)}% of max`
                  : "No data yet"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Band history timeline */}
      {summary.bandHistory.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">
            Band History
          </h2>
          <div className="space-y-2">
            {summary.bandHistory.map((point, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-24 text-xs text-gray-400">
                  {new Date(point.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex-1 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                    style={{ width: `${((point.overall ?? 0) / 9) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs font-semibold text-gray-700">
                  {point.overall?.toFixed(1) ?? "—"}
                </span>
                <span className="w-20 text-xs text-gray-400">
                  {point.source}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weak skills */}
      {summary.weakSkills.length > 0 && (
        <div className="rounded-2xl bg-orange-50 p-6 ring-1 ring-orange-100">
          <h2 className="mb-4 text-sm font-semibold text-orange-900">
            ⚠ Focus Areas
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {summary.weakSkills.map((skill) => (
              <div
                key={skill.skill}
                className="rounded-xl border border-orange-200 bg-white p-4"
              >
                <p className="text-sm font-semibold text-orange-800">
                  {skill.label}
                </p>
                <BandBadge band={skill.band} size="sm" className="mt-2" />
                <p className="mt-2 text-xs text-orange-600">
                  Prioritise practice
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streak */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <div>
            <p className="text-lg font-bold text-gray-900">
              {summary.streak}-day streak
            </p>
            <p className="text-sm text-gray-500">
              Keep practising every day to build your streak!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
