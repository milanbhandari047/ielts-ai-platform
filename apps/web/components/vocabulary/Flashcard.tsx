"use client";

import { cn } from "@/lib/utils";
import { useVocabularyStore } from "@/store/mocktest.store";
import type { VocabularyWord } from "@/types";

interface FlashcardProps {
  word: VocabularyWord;
  index: number;
  total: number;
}

export function Flashcard({ word, index, total }: FlashcardProps) {
  const { isFlipped, flipCard, nextCard, prevCard, savedWordIds, toggleSaved } =
    useVocabularyStore();

  const isSaved = savedWordIds.has(word.id);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress */}
      <div className="flex w-full max-w-lg items-center gap-3">
        <span className="text-sm text-gray-500">
          {index + 1} / {total}
        </span>
        <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className="relative h-64 w-full max-w-lg cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={flipCard}
      >
        <div
          className={cn(
            "relative h-full w-full transition-all duration-500",
            isFlipped && "[transform:rotateY(180deg)]"
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white shadow-lg"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
              Word
            </p>
            <p className="text-4xl font-black">{word.word}</p>
            {word.difficulty && (
              <span
                className={cn(
                  "mt-4 rounded-full px-3 py-0.5 text-xs font-medium",
                  word.difficulty === "EASY" &&
                    "bg-green-400/30 text-green-100",
                  word.difficulty === "MEDIUM" &&
                    "bg-yellow-400/30 text-yellow-100",
                  word.difficulty === "HARD" && "bg-red-400/30 text-red-100"
                )}
              >
                {word.difficulty}
              </span>
            )}
            <p className="mt-6 text-xs opacity-60">Tap to reveal meaning</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-100"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Meaning
            </p>
            <p className="text-center text-lg font-semibold text-gray-900">
              {word.meaning}
            </p>
            {word.example && (
              <p className="mt-3 text-center text-sm italic text-gray-500">
                &ldquo;{word.example}&rdquo;
              </p>
            )}
            {word.synonyms && word.synonyms.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1 justify-center">
                {word.synonyms.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => prevCard()}
          disabled={index === 0}
          className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
        >
          ← Prev
        </button>

        <button
          onClick={() => toggleSaved(word.id)}
          className={cn(
            "flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition",
            isSaved
              ? "border-yellow-300 bg-yellow-50 text-yellow-700"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          )}
        >
          {isSaved ? "★ Saved" : "☆ Save"}
        </button>

        <button
          onClick={() => nextCard(total)}
          disabled={index === total - 1}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
