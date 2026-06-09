"use client";

import { cn } from "@/lib/utils";
import type { WritingResult } from "@/types";

interface AIFeedbackPanelProps {
  result: WritingResult;
}

/* ---------------- Criteria ---------------- */

const CRITERIA = [
  { key: "taskResponse", label: "Task Response", icon: "📋" },
  { key: "coherence", label: "Coherence & Cohesion", icon: "🔗" },
  { key: "lexical", label: "Lexical Resource", icon: "📚" },
  { key: "grammar", label: "Grammatical Range", icon: "✏️" },
] as const;

type CriteriaKey = (typeof CRITERIA)[number]["key"];

/* ---------------- Strongly typed map ---------------- */

const criteriaMap: Record<CriteriaKey, (typeof CRITERIA)[number]> =
  Object.fromEntries(CRITERIA.map((c) => [c.key, c])) as Record<
    CriteriaKey,
    (typeof CRITERIA)[number]
  >;

/* ---------------- Band Bar ---------------- */

function BandBar({ score }: { score: number }) {
  const safeScore = Math.min(Math.max(score, 0), 9);
  const pct = (safeScore / 9) * 100;

  const color =
    safeScore >= 7
      ? "bg-emerald-500"
      : safeScore >= 6
      ? "bg-blue-500"
      : safeScore >= 5
      ? "bg-yellow-500"
      : "bg-red-400";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            color
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-sm font-bold text-gray-700">
        {safeScore.toFixed(1)}
      </span>
    </div>
  );
}

/* ---------------- Main Component ---------------- */

export function AIFeedbackPanel({ result }: AIFeedbackPanelProps) {
  const weakest = CRITERIA.reduce((min, c) =>
    result[c.key] < result[min.key] ? c : min
  );

  return (
    <div className="space-y-6">
      {/* Overall band */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-center text-white shadow-sm">
        <p className="text-sm font-medium text-indigo-200">
          Overall Band Score
        </p>
        <p className="mt-1 text-6xl font-black">
          {result.overallBand.toFixed(1)}
        </p>
        <p className="mt-1 text-sm text-indigo-200">
          {result.wordCount} words submitted
        </p>
      </div>

      {/* Weakest area */}
      <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
        <p className="text-sm font-medium text-orange-800">
          ⚠️ Weakest Area:{" "}
          <span className="font-semibold">
            {criteriaMap[weakest.key].icon} {criteriaMap[weakest.key].label}
          </span>
        </p>
      </div>

      {/* Breakdown */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          Score Breakdown
        </h3>

        <div className="space-y-4">
          {CRITERIA.map(({ key, label, icon }) => {
            const score = result[key];
            const fb = result.feedback.find((f) => f.criterion === key);

            return (
              <div key={key}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-gray-700">
                    <span>{icon}</span>
                    {label}
                  </span>
                </div>

                <BandBar score={score} />

                {fb?.comment && (
                  <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                    {fb.comment}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {result.feedback.length === 0 && (
          <p className="mt-4 text-sm text-gray-400">
            No detailed feedback available.
          </p>
        )}
      </div>

      {/* Suggestions */}
      {result.feedback.map(
        (fb) =>
          fb.suggestions.length > 0 && (
            <div
              key={`${fb.criterion}-suggestions`}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
            >
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                {criteriaMap[fb.criterion].icon}{" "}
                {criteriaMap[fb.criterion].label} — Suggestions
              </h3>

              <ul className="space-y-2">
                {fb.suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs text-indigo-700 font-bold">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )
      )}

      {/* Improved version */}
      {result.improvedVersion && (
        <div className="rounded-2xl bg-emerald-50 p-6 ring-1 ring-emerald-100">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-800">
            <span>✨</span> AI-Improved Version
          </h3>

          <p className="text-sm leading-relaxed text-emerald-900 whitespace-pre-wrap">
            {result.improvedVersion}
          </p>
        </div>
      )}
    </div>
  );
}
