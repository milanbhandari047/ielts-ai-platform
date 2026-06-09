"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SectionLoader } from "@/components/ui/spinner";
import { useVocabularyStore } from "@/store/vocabulary.store";

export default function ReviewPage() {
  const { dueWords, fetchDueWords, reviewWord, loadingDue } =
    useVocabularyStore();

  const [showAnswer, setShowAnswer] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    fetchDueWords();
  }, [fetchDueWords]);

  if (loadingDue) return <SectionLoader />;

  // IMPORTANT: always take first item (SM-2 queue changes dynamically)
  const word = dueWords[0];

  const handleReview = async (quality: 0 | 5) => {
    if (!word || isReviewing) return;

    setIsReviewing(true);

    try {
      await reviewWord(word.id, quality);
      setShowAnswer(false);
    } finally {
      setIsReviewing(false);
    }
  };

  if (!dueWords.length) {
    return (
      <div className="mx-auto max-w-3xl text-center p-10 border rounded-2xl bg-white shadow-sm">
        <p className="text-lg font-semibold text-gray-800">
          🎉 No words due for review
        </p>

        <Link
          href="/vocabulary"
          className="inline-block mt-4 text-sm text-blue-600 hover:underline"
        >
          Back to Vocabulary
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Vocabulary Review</h1>

        <Link
          href="/vocabulary"
          className="text-sm px-3 py-1 border rounded-lg hover:bg-gray-50"
        >
          Exit
        </Link>
      </div>

      {/* PROGRESS (dynamic queue) */}
      <div className="text-sm text-gray-500">
        Remaining words: {dueWords.length}
      </div>

      {/* CARD */}
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        {/* WORD */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {word.word}
          </h2>

          {/* TOPIC */}
          {word.topic && (
            <span className="inline-block mt-3 text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              {word.topic}
            </span>
          )}
        </div>

        {/* MEANING */}
        {showAnswer && (
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              {word.meaning}
            </p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-10 flex flex-col gap-3 items-center">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full max-w-xs bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-black transition"
            >
              Show Meaning
            </button>
          ) : (
            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={() => handleReview(0)}
                disabled={isReviewing}
                className="flex-1 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition font-medium disabled:opacity-50"
              >
                Wrong
              </button>

              <button
                onClick={() => handleReview(5)}
                disabled={isReviewing}
                className="flex-1 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition font-medium disabled:opacity-50"
              >
                Correct
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
