"use client";

import { cn } from "@/lib/utils";
import { useVocabularyStore } from "@/store/vocabulary.store";
import type { VocabularyWord } from "@/types/vocabulary";

interface FlashcardProps {
  word: VocabularyWord;
  index: number;
  total: number;
  /** Called when the user toggles save; isSaved = the NEW desired state */
  onSaveToggle?: (wordId: string, isSaved: boolean) => void;
}

export function Flashcard({
  word,
  index,
  total,
  onSaveToggle,
}: FlashcardProps) {
  const { isFlipped, flipCard, nextCard, prevCard, savedWordIds, toggleSaved } =
    useVocabularyStore();

  const isSaved = savedWordIds.has(word.id);

  const handleSave = () => {
    // Toggle optimistically in the store, then notify parent
    toggleSaved(word.id);
    onSaveToggle?.(word.id, !isSaved);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress bar */}
      <div className="flex w-full max-w-lg items-center gap-3">
        <span className="text-sm text-gray-500">
          {index + 1} / {total}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
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
            {/* Show review streak if progress exists */}
            {word.progress && (
              <span className="mt-4 rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium">
                {word.progress.correctCount >= 3
                  ? "✓ Mastered"
                  : `Streak: ${word.progress.correctCount}`}
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
            {/* SM-2 info */}
            {word.progress && (
              <div className="mt-4 flex gap-3 text-xs text-gray-400">
                <span>Interval: {word.progress.interval}d</span>
                <span>Ease: {word.progress.easeFactor.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={prevCard}
          disabled={index === 0}
          className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
        >
          ← Prev
        </button>

        <button
          onClick={handleSave}
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
