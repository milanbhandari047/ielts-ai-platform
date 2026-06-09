"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useVocabularyStore } from "@/store/vocabulary.store";
import { vocabularyService } from "@/services/vocabulary.service";
import { SectionLoader } from "@/components/ui/spinner";
import type { QuizResult } from "@/types/vocabulary";

export default function QuizPage() {
  const {
    quizQuestions,
    quizAnswers,
    quizResult,
    setQuizQuestions,
    setQuizAnswer,
    setQuizResult,
    resetQuiz,
  } = useVocabularyStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);

  const loadQuestions = async () => {
    setIsLoading(true);
    resetQuiz();
    setCurrentQ(0);

    try {
      const data = await vocabularyService.getQuizQuestions(10);
      setQuizQuestions(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const currentQuestion = quizQuestions[currentQ];

  const handleAnswer = (optionMeaning: string) => {
    if (quizResult || !currentQuestion) return;

    setQuizAnswer(currentQuestion.id, optionMeaning);

    setTimeout(() => {
      setCurrentQ((c) => Math.min(c + 1, quizQuestions.length - 1));
    }, 300);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = Object.entries(quizAnswers).map(
        ([vocabularyId, answer]) => ({
          vocabularyId,
          answer,
        })
      );

      await vocabularyService.submitQuiz(payload);

      const answers = quizQuestions.map((q) => {
        const chosen = quizAnswers[q.id] ?? "";

        const correct = chosen === q.correctAnswer;

        return {
          wordId: q.id,
          correct,
          correctAnswer: q.correctAnswer,
          yourAnswer: chosen,
        };
      });

      const correctCount = answers.filter((a) => a.correct).length;

      const result: QuizResult = {
        correct: correctCount,
        total: quizQuestions.length,
        score: Math.round((correctCount / quizQuestions.length) * 100),
        answers,
      };

      /**
       * SM-2 QUALITY MAPPING (IMPROVED)
       * correct → 4 (good recall)
       * wrong → 2 (weak recall, not failure)
       */
      await Promise.allSettled(
        quizQuestions.map((q) => {
          const isCorrect = quizAnswers[q.id] === q.correctAnswer;

          return vocabularyService.submitReview(q.id, isCorrect ? 4 : 2);
        })
      );

      setQuizResult(result);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <SectionLoader />;

  if (!quizQuestions.length) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-gray-500">
          No quiz questions available.
          <br />
          Learn more words to unlock quizzes.
        </p>

        <Link
          href="/vocabulary/flashcards"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          Study flashcards →
        </Link>
      </div>
    );
  }

  const answeredCount = Object.keys(quizAnswers).length;
  const allAnswered = answeredCount === quizQuestions.length;

  // ================= RESULT SCREEN =================
  if (quizResult) {
    const pct = quizResult.score;

    return (
      <div className="mx-auto max-w-lg space-y-6">
        {/* SCORE */}
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
          <p className="text-5xl font-black text-gray-900">
            {quizResult.correct}/{quizResult.total}
          </p>

          <p className="mt-1 text-lg font-semibold text-gray-600">
            {pct}% score
          </p>

          <div
            className={cn(
              "mt-4 inline-block rounded-full px-4 py-1.5 text-sm font-semibold",
              pct >= 80
                ? "bg-emerald-100 text-emerald-700"
                : pct >= 60
                ? "bg-blue-100 text-blue-700"
                : "bg-orange-100 text-orange-700"
            )}
          >
            {pct >= 80
              ? "Excellent 🎉"
              : pct >= 60
              ? "Good 👍"
              : "Keep practicing 📚"}
          </div>
        </div>

        {/* REVIEW */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-sm font-semibold">Review Answers</h2>

          <div className="space-y-3">
            {quizResult.answers.map((a) => {
              const q = quizQuestions.find((x) => x.id === a.wordId);

              return (
                <div
                  key={a.wordId}
                  className={cn(
                    "rounded-lg border p-3",
                    a.correct
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  )}
                >
                  <p className="font-semibold">{q?.word}</p>

                  {/* NEW: topic + example support */}
                  {q?.word && (
                    <p className="text-xs text-gray-500 mt-1">
                      {q?.word && `Topic: ${(q as any).topic || "General"}`}
                    </p>
                  )}

                  <p className="text-sm text-gray-600 mt-1">
                    Correct:{" "}
                    <span className="text-green-700 font-medium">
                      {a.correctAnswer}
                    </span>
                  </p>

                  {!a.correct && (
                    <p className="text-sm text-red-600">
                      Your answer: {a.yourAnswer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={loadQuestions}
            className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Retry
          </button>

          <Link
            href="/vocabulary"
            className="flex-1 rounded-xl border py-3 text-center text-sm font-medium hover:bg-gray-50"
          >
            Back
          </Link>
        </div>
      </div>
    );
  }

  // ================= QUIZ SCREEN =================
  if (!currentQuestion) return null;

  const selectedAnswer = quizAnswers[currentQuestion.id];

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* HEADER */}
      <div className="flex justify-between text-sm text-gray-500">
        <Link href="/vocabulary">← Back</Link>
        <span>
          {currentQ + 1} / {quizQuestions.length}
        </span>
      </div>

      {/* PROGRESS */}
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div
          className="h-full bg-indigo-500 transition-all"
          style={{
            width: `${((currentQ + 1) / quizQuestions.length) * 100}%`,
          }}
        />
      </div>

      {/* QUESTION */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <p className="text-3xl font-black text-gray-900">
          {currentQuestion.word}
        </p>

        {/* NEW: topic display */}
        {(currentQuestion as any).topic && (
          <p className="text-xs text-gray-500 mt-2">
            Topic: {(currentQuestion as any).topic}
          </p>
        )}
      </div>

      {/* OPTIONS */}
      <div className="space-y-3">
        {currentQuestion.options.map((opt) => {
          const isSelected = selectedAnswer === opt.meaning;
          const isCorrect = opt.meaning === currentQuestion.correctAnswer;
          const showResult = !!selectedAnswer;

          return (
            <button
              key={opt.id}
              onClick={() => handleAnswer(opt.meaning)}
              disabled={!!selectedAnswer}
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium",
                !showResult && "hover:bg-indigo-50",
                showResult &&
                  isSelected &&
                  isCorrect &&
                  "bg-green-50 border-green-400",
                showResult &&
                  isSelected &&
                  !isCorrect &&
                  "bg-red-50 border-red-400",
                showResult &&
                  !isSelected &&
                  isCorrect &&
                  "bg-green-50 border-green-300",
                showResult &&
                  !isSelected &&
                  !isCorrect &&
                  "bg-gray-50 text-gray-400"
              )}
            >
              {opt.meaning}
            </button>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQ((c) => Math.max(0, c - 1))}
          disabled={currentQ === 0}
          className="border px-4 py-2 rounded-lg text-sm"
        >
          Back
        </button>

        {allAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        ) : (
          <span className="text-xs text-gray-400">
            {answeredCount}/{quizQuestions.length} answered
          </span>
        )}
      </div>
    </div>
  );
}
