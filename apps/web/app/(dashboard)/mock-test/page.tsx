"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatRelativeTime } from "@/lib/utils";
import type { MockTestListItem, MockTestResult } from "@/types";
import { mockTestService } from "@/services/mocktest.service";
import { SectionLoader } from "@/components/ui/spinner";
import { BandBadge } from "@/components/ui/BandBadge";

export default function MockTestPage() {
  const router = useRouter();
  const [tests, setTests] = useState<MockTestListItem[]>([]);
  const [results, setResults] = useState<MockTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([mockTestService.getTests(), mockTestService.getMyResults()])
      .then(([t, r]) => {
        setTests(t);
        setResults(r.items);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleStart = async (mockTestId: string) => {
    setStarting(mockTestId);
    try {
      const session = await mockTestService.startSession(mockTestId);
      router.push(`/mock-test/${session.id}`);
    } finally {
      setStarting(null);
    }
  };

  if (isLoading) return <SectionLoader />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Full Mock Tests</h1>
        <p className="mt-1 text-sm text-gray-500">
          Simulate a real IELTS exam — Listening, Reading, Writing, and Speaking
          in one session.
        </p>
      </div>

      {/* What to expect */}
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          {
            section: "Listening",
            time: "40 min",
            icon: "🎧",
            color: "bg-purple-50 border-purple-100 text-purple-700",
          },
          {
            section: "Reading",
            time: "60 min",
            icon: "📖",
            color: "bg-blue-50 border-blue-100 text-blue-700",
          },
          {
            section: "Writing",
            time: "60 min",
            icon: "✍️",
            color: "bg-emerald-50 border-emerald-100 text-emerald-700",
          },
          {
            section: "Speaking",
            time: "15 min",
            icon: "🎙️",
            color: "bg-orange-50 border-orange-100 text-orange-700",
          },
        ].map(({ section, time, icon, color }) => (
          <div
            key={section}
            className={`rounded-xl border p-4 text-center ${color}`}
          >
            <p className="text-2xl">{icon}</p>
            <p className="mt-1 text-sm font-semibold">{section}</p>
            <p className="text-xs opacity-70">{time}</p>
          </div>
        ))}
      </div>

      {/* Tests */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Available Tests
        </h2>
        {tests.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
            No mock tests available yet.
          </div>
        ) : (
          tests.map((test) => (
            <div
              key={test.id}
              className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
            >
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {test.title}
                </h3>
                <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                  {test.listeningTestId && <span>✓ Listening</span>}
                  {test.readingTestId && <span>✓ Reading</span>}
                  {test.hasWriting && <span>✓ Writing</span>}
                  {test.hasSpeaking && <span>✓ Speaking</span>}
                  <span>~2h 55min total</span>
                </div>
              </div>
              <button
                onClick={() => handleStart(test.id)}
                disabled={starting === test.id}
                className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {starting === test.id ? "Starting…" : "Start Test"}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Past results */}
      {results.length > 0 && (
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Past Results
          </h2>
          <div className="space-y-3">
            {results.map((r) => (
              <div
                key={r.sessionId}
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatRelativeTime(r.completedAt)}
                  </p>
                  <div className="mt-1 flex gap-2 text-xs text-gray-400">
                    {r.readingBand && <span>R:{r.readingBand}</span>}
                    {r.listeningBand && <span>L:{r.listeningBand}</span>}
                    {r.writingBand && <span>W:{r.writingBand}</span>}
                    {r.speakingBand && <span>S:{r.speakingBand}</span>}
                  </div>
                </div>
                <BandBadge band={r.overallBand} size="md" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
