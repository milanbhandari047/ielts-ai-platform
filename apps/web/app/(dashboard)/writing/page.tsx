"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { writingService } from "@/services/writing.service";
import { BandBadge } from "@/components/ui/BandBadge";
import { SectionLoader } from "@/components/ui/spinner";
import { formatRelativeTime } from "@/lib/utils";
import type { WritingSubmissionListItem } from "@/types";

export default function WritingPage() {
  const [submissions, setSubmissions] = useState<WritingSubmissionListItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    writingService
      .getMySubmissions()
      .then((data) => setSubmissions(data.items))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Writing Practice</h1>
        <p className="mt-1 text-sm text-gray-500">
          Submit essays for AI-powered IELTS band scoring and detailed feedback.
        </p>
      </div>

      {/* Task cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100">
            Academic / General
          </p>
          <h2 className="mt-1 text-xl font-bold">Task 1</h2>
          <p className="mt-2 text-sm text-emerald-100">
            Describe a graph, chart, diagram or map. Minimum 150 words.
          </p>
          <Link
            href="/writing/task1"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/30"
          >
            Start Task 1
            <svg
              className="h-4 w-4"
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
          </Link>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">
            Academic / General
          </p>
          <h2 className="mt-1 text-xl font-bold">Task 2</h2>
          <p className="mt-2 text-sm text-indigo-100">
            Write an essay in response to a point of view or argument. Minimum
            250 words.
          </p>
          <Link
            href="/writing/task2"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/30"
          >
            Start Task 2
            <svg
              className="h-4 w-4"
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
          </Link>
        </div>
      </div>

      {/* Previous submissions */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          My Submissions
        </h2>
        {isLoading ? (
          <SectionLoader />
        ) : submissions.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
            No submissions yet. Start practising above!
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <Link
                key={sub.id}
                href={`/writing/${sub.id}/feedback`}
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      {sub.task === "TASK1" ? "Task 1" : "Task 2"}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {sub.promptTitle}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {sub.wordCount} words · {formatRelativeTime(sub.createdAt)}
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
