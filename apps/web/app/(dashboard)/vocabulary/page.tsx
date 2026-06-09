"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SectionLoader } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { DailyWords, VocabularyProgress } from "@/types";
import { vocabularyService } from "@/services/vocabular.service";

export default function VocabularyPage() {
  const [daily, setDaily] = useState<DailyWords | null>(null);
  const [progress, setProgress] = useState<VocabularyProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      vocabularyService.getDailyWords(),
      vocabularyService.getMyProgress(),
    ])
      .then(([d, p]) => {
        setDaily(d);
        setProgress(p.items);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <SectionLoader />;

  const masteredCount = progress.filter((p) => p.correctCount >= 3).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vocabulary Builder</h1>
        <p className="mt-1 text-sm text-gray-500">
          Learn IELTS academic vocabulary with spaced repetition.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Words Mastered",
            value: masteredCount,
            icon: "🎓",
            color: "from-emerald-500 to-teal-500",
          },
          {
            label: "Words in Progress",
            value: progress.length - masteredCount,
            icon: "📖",
            color: "from-blue-500 to-indigo-500",
          },
          {
            label: "Daily Target",
            value: `${daily?.completed ?? 0}/${daily?.total ?? 10}`,
            icon: "🎯",
            color: "from-orange-500 to-amber-500",
          },
        ].map(({ label, value, icon, color }) => (
          <div
            key={label}
            className={`rounded-2xl bg-gradient-to-br ${color} p-5 text-white`}
          >
            <p className="text-2xl font-black">{value}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium opacity-90">
              <span>{icon}</span>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Practice modes */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/vocabulary/flashcards"
          className="group flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md hover:ring-indigo-100"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl group-hover:bg-indigo-100">
            🃏
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Flashcards
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review words with interactive flip cards. Perfect for
              memorisation.
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
            Start reviewing →
          </span>
        </Link>

        <Link
          href="/vocabulary/quiz"
          className="group flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md hover:ring-orange-100"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl group-hover:bg-orange-100">
            ✏️
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Quiz Mode</h2>
            <p className="mt-1 text-sm text-gray-500">
              Test yourself with multiple-choice questions. Track your accuracy.
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-orange-600 group-hover:gap-2 transition-all">
            Take a quiz →
          </span>
        </Link>
      </div>

      {/* Daily words preview */}
      {daily && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Today&apos;s Words
            </h2>
            <span className="text-xs text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {daily.words.slice(0, 6).map((w) => (
              <div
                key={w.id}
                className="flex items-start gap-3 rounded-xl border border-gray-100 p-3"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                  {w.word[0].toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {w.word}
                  </p>
                  <p className="text-xs text-gray-500">{w.meaning}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/vocabulary/flashcards"
            className="mt-4 block text-center text-sm font-medium text-indigo-600 hover:underline"
          >
            Study all {daily.total} words →
          </Link>
        </div>
      )}

      {/* Progress table */}
      {progress.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">
            My Progress
          </h2>
          <div className="space-y-2">
            {progress.slice(0, 10).map((p) => (
              <div key={p.vocabularyId} className="flex items-center gap-4">
                <span className="w-32 truncate text-sm font-medium text-gray-800">
                  {p.word}
                </span>
                <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      p.correctCount >= 3
                        ? "bg-emerald-500"
                        : p.correctCount >= 1
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    )}
                    style={{
                      width: `${Math.min((p.correctCount / 5) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="w-16 text-right text-xs text-gray-400">
                  {p.correctCount >= 3 ? "✓ Mastered" : `${p.correctCount}/5`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
