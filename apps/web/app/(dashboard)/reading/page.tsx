"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readingService } from "@/services/reading.service";
import { SectionLoader } from "@/components/ui/spinner";
import type { ReadingTestListItem } from "@/types";

export default function ReadingPage() {
  const [tests, setTests] = useState<ReadingTestListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    readingService
      .getTests()
      .then((data) => setTests(data.items))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reading Tests</h1>
        <p className="mt-1 text-sm text-gray-500">
          Practice with IELTS-style reading passages. 60 minutes per test.
        </p>
      </div>

      {isLoading ? (
        <SectionLoader />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <div
              key={test.id}
              className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md hover:ring-indigo-100"
            >
              <div className="flex items-start justify-between">
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {test.type}
                </span>
                <span className="text-xs text-gray-400">
                  {test.questionCount} questions
                </span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-gray-900 group-hover:text-indigo-700">
                {test.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {test.passageCount} passage{test.passageCount !== 1 ? "s" : ""}{" "}
                · 60 min
              </p>
              <Link
                href={`/reading/${test.id}`}
                className="mt-4 flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                Start test
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
          ))}

          {tests.length === 0 && (
            <div className="col-span-full flex h-48 flex-col items-center justify-center gap-2 text-center">
              <p className="text-sm text-gray-500">No tests available yet.</p>
              <p className="text-xs text-gray-400">Check back soon!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
