"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listeningService } from "@/services/listening.service";
import { SectionLoader } from "@/components/ui/spinner";
import type { ListeningTestListItem } from "@/types";

export default function ListeningPage() {
  const [tests, setTests] = useState<ListeningTestListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listeningService
      .getTests()
      .then((data) => setTests(data.items))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Listening Tests</h1>
        <p className="mt-1 text-sm text-gray-500">
          Practice with IELTS-style audio recordings. 40 minutes per test.
        </p>
      </div>

      {isLoading ? (
        <SectionLoader />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <div
              key={test.id}
              className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
            >
              <div className="flex items-center gap-2 text-purple-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Listening
                </span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-gray-900 group-hover:text-purple-700">
                {test.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {test.sectionCount} sections · {test.questionCount} questions ·
                40 min
              </p>
              <Link
                href={`/listening/${test.id}`}
                className="mt-4 flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-800"
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
            <div className="col-span-full flex h-48 items-center justify-center text-sm text-gray-500">
              No tests available yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
