"use client";

import { cn } from "@/lib/utils";
import type { DashboardSummary } from "@/types";

interface BandPredictionCardProps {
  summary: DashboardSummary;
}

const SKILLS = [
  { key: "readingBand", label: "Reading", color: "bg-blue-500" },
  { key: "listeningBand", label: "Listening", color: "bg-purple-500" },
  { key: "writingBand", label: "Writing", color: "bg-emerald-500" },
  { key: "speakingBand", label: "Speaking", color: "bg-orange-500" },
] as const;

function BandRing({ band }: { band: number | null }) {
  const value = band ?? 0;
  const max = 9;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-bold text-gray-900">
          {band !== null ? band.toFixed(1) : "—"}
        </p>
        <p className="text-xs text-gray-500">Overall</p>
      </div>
    </div>
  );
}

export function BandPredictionCard({ summary }: BandPredictionCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Band Prediction
      </h2>
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <BandRing band={summary.overallBand} />
        <div className="flex-1 space-y-3 w-full">
          {SKILLS.map(({ key, label, color }) => {
            const band = summary[key];
            const pct = band !== null ? (band / 9) * 100 : 0;
            return (
              <div key={key}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {band !== null ? band.toFixed(1) : "—"}
                  </span>
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
              </div>
            );
          })}
        </div>
      </div>
      {summary.studyGoal && (
        <div className="mt-4 rounded-lg bg-indigo-50 px-4 py-3">
          <p className="text-xs text-indigo-700">
            🎯 Target:{" "}
            <span className="font-semibold">
              Band {summary.studyGoal.targetBand}
            </span>{" "}
            by{" "}
            {new Date(summary.studyGoal.targetDate).toLocaleDateString(
              "en-US",
              {
                month: "short",
                year: "numeric",
              }
            )}
          </p>
        </div>
      )}
    </div>
  );
}
