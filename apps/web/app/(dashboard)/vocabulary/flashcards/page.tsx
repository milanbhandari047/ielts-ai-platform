"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VocabularyWord } from "@/types";
import { useVocabularyStore } from "@/store/mocktest.store";
import { vocabularyService } from "@/services/vocabular.service";
import { SectionLoader } from "@/components/ui/spinner";
import { Flashcard } from "@/components/vocabulary/Flashcard";

export default function FlashcardsPage() {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentCardIndex, setCardIndex, setSavedWordIds } =
    useVocabularyStore();

  useEffect(() => {
    Promise.all([
      vocabularyService.getDailyWords(),
      vocabularyService.getSavedWords(),
    ])
      .then(([daily, saved]) => {
        setWords(daily.words);
        setSavedWordIds(saved.map((w) => w.id));
        setCardIndex(0);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Persist save/unsave
  const handleSaveToggle = async (wordId: string, isSaved: boolean) => {
    if (isSaved) {
      await vocabularyService.saveWord(wordId);
    } else {
      await vocabularyService.unsaveWord(wordId);
    }
  };

  if (isLoading) return <SectionLoader />;

  if (words.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-gray-500">
          No vocabulary words available yet.
        </p>
        <Link
          href="/vocabulary"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to Vocabulary
        </Link>
      </div>
    );
  }

  const allDone = currentCardIndex === words.length - 1;

  return (
    <div className="mx-auto max-w-xl space-y-6">
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

      <Flashcard
        word={words[currentCardIndex]}
        index={currentCardIndex}
        total={words.length}
      />

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
