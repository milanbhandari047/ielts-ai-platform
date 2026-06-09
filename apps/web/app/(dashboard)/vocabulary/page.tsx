"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SectionLoader } from "@/components/ui/spinner";
import { useVocabularyStore } from "@/store/vocabulary.store";
import TopicExplorer from "@/components/vocabulary/TopicExplorer";
import { BookOpen, Brain, Trophy } from "lucide-react";

export default function VocabularyPage() {
  const { daily, stats, loadingDashboard, fetchDashboard } =
    useVocabularyStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loadingDashboard || !daily || !stats) {
    return <SectionLoader />;
  }

  const allDailyWords = [
    ...(daily.dueReviews ?? []),
    ...(daily.newWords ?? []),
  ];

  const total = allDailyWords.length;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vocabulary Builder</h1>
        <p className="mt-1 text-sm text-gray-500">
          Learn IELTS academic vocabulary with spaced repetition.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/vocabulary/mastered">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-5 text-white shadow-md hover:scale-[1.02] transition">
            <Trophy className="mb-2" />
            <p className="text-3xl font-black">{stats.totalLearned ?? 0}</p>
            <p className="text-sm opacity-90">Words Mastered</p>
          </div>
        </Link>

        <Link href="/vocabulary/saved">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 p-5 text-white shadow-md hover:scale-[1.02] transition">
            <BookOpen className="mb-2" />
            <p className="text-3xl font-black">{stats.totalSaved ?? 0}</p>
            <p className="text-sm opacity-90">Saved Words</p>
          </div>
        </Link>

        <Link href="/vocabulary/review">
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-5 text-white shadow-md hover:scale-[1.02] transition">
            <Brain className="mb-2" />
            <p className="text-3xl font-black">{stats.dueCount ?? 0}</p>
            <p className="text-sm opacity-90">Due for Review</p>
          </div>
        </Link>
      </div>

      {/* PRACTICE MODES */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/vocabulary/flashcards">
          <div className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 hover:shadow-lg hover:ring-indigo-200 transition">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100">
                🃏
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Flashcards
                </h2>
                <p className="text-sm text-gray-500">
                  Memorise words with spaced repetition cards
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm font-medium text-indigo-600">
              Start learning →
            </div>
          </div>
        </Link>

        <Link href="/vocabulary/quiz">
          <div className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 hover:shadow-lg hover:ring-orange-200 transition">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-100">
                ✏️
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Quiz Mode
                </h2>
                <p className="text-sm text-gray-500">
                  Test yourself with MCQs and track progress
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm font-medium text-orange-600">
              Take quiz →
            </div>
          </div>
        </Link>
      </div>
      {/* DAILY WORDS */}
      {total > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-sm font-semibold mb-4 text-gray-900">
            Today’s Words
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {allDailyWords.slice(0, 6).map((w) => (
              <div
                key={w.id}
                className="rounded-xl border p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-start justify-between">
                  <p className="font-semibold text-gray-900">{w.word}</p>

                  {w.isReview && (
                    <span className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full">
                      review
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-1">{w.meaning}</p>

                {w.topic && (
                  <p className="text-[10px] mt-2 text-blue-600">
                    Topic: {w.topic}
                  </p>
                )}

                {w.example && (
                  <p className="text-[10px] mt-1 text-gray-500 italic">
                    “{w.example}”
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 TOPIC EXPLORER (INTEGRATED PROPERLY) */}
      <TopicExplorer />

      {/* EMPTY STATE */}
      {total === 0 && (
        <div className="rounded-2xl bg-emerald-50 p-6 text-center ring-1 ring-emerald-100">
          <p className="text-lg font-bold text-emerald-800">
            🎉 All caught up for today!
          </p>
          <p className="mt-1 text-sm text-emerald-600">
            No words due for review.
          </p>
        </div>
      )}
    </div>
  );
}
