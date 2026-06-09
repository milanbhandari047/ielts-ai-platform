"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useVocabularyStore } from "@/store/vocabulary.store";
import { SectionLoader } from "@/components/ui/spinner";
import { CheckCircle2, ArrowLeft, BookOpen } from "lucide-react";

export default function MasteredPage() {
  const { masteredWords, fetchMasteredWords, loadingMastered } =
    useVocabularyStore();

  useEffect(() => {
    fetchMasteredWords();
  }, [fetchMasteredWords]);

  const totalMastered = masteredWords.length;

  const formattedWords = useMemo(() => {
    return masteredWords.map((w) => ({
      ...w,
      safeNextReview: w.nextReview ? new Date(w.nextReview) : null,
    }));
  }, [masteredWords]);

  if (loadingMastered) {
    return <SectionLoader />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Mastered Vocabulary
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Words you’ve consistently learned using SM-2 spaced repetition
          </p>
        </div>

        <Link
          href="/vocabulary"
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border hover:bg-gray-50 transition"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      {/* EMPTY STATE */}
      {!totalMastered ? (
        <div className="flex flex-col items-center justify-center border rounded-2xl p-16 bg-gray-50 text-center">
          <BookOpen className="w-10 h-10 text-gray-400 mb-3" />

          <h2 className="text-lg font-semibold text-gray-700">
            No mastered words yet
          </h2>

          <p className="text-sm text-gray-500 mt-1 max-w-sm">
            Keep practicing daily. Once you correctly recall words multiple
            times, they will appear here automatically.
          </p>
        </div>
      ) : (
        <>
          {/* STATS BAR */}
          <div className="flex items-center justify-between bg-white border rounded-xl px-4 py-3">
            <div className="text-sm text-gray-600">
              Total Mastered:{" "}
              <span className="font-semibold text-gray-900">
                {totalMastered}
              </span>
            </div>

            <div className="text-xs font-medium text-green-600">
              SM-2 Active Learning System
            </div>
          </div>

          {/* GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formattedWords.map((w) => (
              <div
                key={w.id}
                className="group border rounded-xl p-5 bg-white hover:shadow-md transition"
              >
                {/* WORD */}
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition">
                    {w.word}
                  </h2>

                  <CheckCircle2 className="text-green-500 w-5 h-5" />
                </div>

                {/* TOPIC (NEW) */}
                {w.topic && (
                  <p className="text-xs text-blue-600 font-medium mt-1">
                    Topic: {w.topic}
                  </p>
                )}

                {/* MEANING */}
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {w.meaning}
                </p>

                {/* EXAMPLE (NEW) */}
                {w.example && (
                  <p className="text-xs text-gray-500 mt-2 italic border-l-2 border-blue-200 pl-2">
                    “{w.example}”
                  </p>
                )}

                {/* METRICS */}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                    Correct: {w.correctCount}
                  </span>

                  <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    Reps: {w.repetitions}
                  </span>

                  <span className="px-2 py-1 rounded-full bg-gray-50 text-gray-600 border">
                    Next:{" "}
                    {w.safeNextReview
                      ? w.safeNextReview.toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                {/* FOOTER */}
                <div className="mt-4 text-xs font-medium text-green-600">
                  Mastered ✔
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
