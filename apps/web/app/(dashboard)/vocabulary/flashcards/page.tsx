"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { VocabularyWord } from "@/types/vocabulary";
import { useVocabularyStore } from "@/store/vocabulary.store";
import { vocabularyService } from "@/services/vocabulary.service";
import { SectionLoader } from "@/components/ui/spinner";
import { Flashcard } from "@/components/vocabulary/Flashcard";

export default function FlashcardsPage() {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const { currentCardIndex, setCardIndex, setSavedWordIds } =
    useVocabularyStore();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [daily, saved] = await Promise.all([
          vocabularyService.getDailyWords(),
          vocabularyService.getSavedWords(),
        ]);

        if (!mounted) return;

        const allWords: VocabularyWord[] = [
          ...daily.dueReviews.map((w) => ({
            id: w.id,
            word: w.word,
            meaning: w.meaning,
            example: (w as any).example ?? "",
            topic: (w as any).topic ?? "",
            isSaved: w.isSaved,
            progress: w.progress,
          })),
          ...daily.newWords.map((w) => ({
            id: w.id,
            word: w.word,
            meaning: w.meaning,
            example: (w as any).example ?? "",
            topic: (w as any).topic ?? "",
            isSaved: w.isSaved,
            progress: w.progress,
          })),
        ];

        setWords(allWords);
        setSavedWordIds(saved.map((s) => s.id));
        setCardIndex(0);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [setCardIndex, setSavedWordIds]);

  const handleSaveToggle = async (wordId: string, isSaved: boolean) => {
    try {
      if (isSaved) {
        await vocabularyService.unsaveWord(wordId);
      } else {
        await vocabularyService.saveWord(wordId);
      }
    } catch (err) {
      console.error("Save toggle failed:", err);
    }
  };

  const handleReview = async (quality: 0 | 3 | 4 | 5) => {
    const word = words[currentCardIndex];
    if (!word || reviewingId === word.id) return;

    setReviewingId(word.id);

    try {
      await vocabularyService.submitReview(word.id, quality);
    } finally {
      setReviewingId(null);
    }
  };

  if (isLoading) return <SectionLoader />;

  if (!words.length) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-gray-500">No vocabulary words due today.</p>
        <Link
          href="/vocabulary"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to Vocabulary
        </Link>
      </div>
    );
  }

  const allDone = currentCardIndex >= words.length - 1;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/vocabulary"
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Vocabulary
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-700">Flashcards</span>
      </div>

      {/* Flashcard */}
      <Flashcard
        word={words[currentCardIndex]}
        index={currentCardIndex}
        total={words.length}
        onSaveToggle={handleSaveToggle}
      />

      {/* Review Buttons */}
      <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
        <p className="mb-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wide">
          How well did you recall this?
        </p>

        <div className="grid grid-cols-4 gap-2">
          {[
            {
              label: "Forgot",
              quality: 0,
              color: "bg-red-100 text-red-700 hover:bg-red-200",
            },
            {
              label: "Hard",
              quality: 3,
              color: "bg-orange-100 text-orange-700 hover:bg-orange-200",
            },
            {
              label: "Good",
              quality: 4,
              color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
            },
            {
              label: "Easy",
              quality: 5,
              color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
            },
          ].map(({ label, quality, color }) => (
            <button
              key={quality}
              onClick={() => handleReview(quality as any)}
              disabled={reviewingId === words[currentCardIndex]?.id}
              className={cn(
                "rounded-lg py-2 text-xs font-semibold transition disabled:opacity-50",
                color
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Completion */}
      {allDone && (
        <div className="rounded-2xl bg-emerald-50 p-6 text-center ring-1 ring-emerald-100">
          <p className="text-lg font-bold text-emerald-800">
            🎉 You&apos;ve reviewed all words!
          </p>
          <p className="mt-1 text-sm text-emerald-600">
            Test your knowledge with the quiz.
          </p>

          <Link
            href="/vocabulary/quiz"
            className="mt-4 inline-block rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Take Quiz
          </Link>
        </div>
      )}
    </div>
  );
}
