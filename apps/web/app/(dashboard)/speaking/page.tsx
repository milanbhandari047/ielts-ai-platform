"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { speakingService } from "@/services/speaking.service";
import { BandBadge } from "@/components/ui/BandBadge";
import { SectionLoader } from "@/components/ui/spinner";
import { formatRelativeTime } from "@/lib/utils";
import type { SpeakingSubmissionListItem } from "@/types";

const PARTS = [
  {
    part: "PART1" as const,
    href: "/speaking/part1",
    label: "Part 1",
    desc: "Introduction & general questions",
    duration: "4–5 min",
    color: "from-orange-500 to-amber-500",
  },
  {
    part: "PART2" as const,
    href: "/speaking/part2",
    label: "Part 2",
    desc: "Individual long turn — cue card",
    duration: "3–4 min",
    color: "from-rose-500 to-pink-500",
  },
  {
    part: "PART3" as const,
    href: "/speaking/part3",
    label: "Part 3",
    desc: "Two-way discussion",
    duration: "4–5 min",
    color: "from-purple-500 to-violet-600",
  },
];

export default function SpeakingPage() {
  const [submissions, setSubmissions] = useState<SpeakingSubmissionListItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    speakingService
      .getMySubmissions()
      .then((d) => setSubmissions(d.items))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Speaking Practice</h1>
        <p className="mt-1 text-sm text-gray-500">
          Record your responses and receive AI-powered band scores with detailed
          feedback.
        </p>
      </div>

      {/* Part cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {PARTS.map(({ href, label, desc, duration, color }) => (
          <div
            key={href}
            className={`rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-sm`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide opacity-75">
              IELTS Speaking
            </p>
            <h2 className="mt-1 text-xl font-bold">{label}</h2>
            <p className="mt-1 text-sm opacity-80">{desc}</p>
            <p className="mt-1 text-xs opacity-60">{duration}</p>
            <Link
              href={href}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/30"
            >
              Start {label} →
            </Link>
          </div>
        ))}
      </div>

      {/* Submissions */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          My Recordings
        </h2>
        {isLoading ? (
          <SectionLoader />
        ) : submissions.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
            No recordings yet. Start practising above!
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <Link
                key={sub.id}
                href={`/speaking/${sub.id}/feedback`}
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                      {sub.part.replace("PART", "Part ")}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {sub.topic}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {formatRelativeTime(sub.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {sub.status === "PENDING" ? (
                    <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700">
                      Evaluating…
                    </span>
                  ) : (
                    <BandBadge band={sub.overallBand} size="sm" />
                  )}
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
