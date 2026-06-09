"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useVocabularyStore } from "@/store/mocktest.store";
import { vocabularyService } from "@/services/vocabular.service";
import { SectionLoader } from "@/components/ui/spinner";

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

  useEffect(() => {
    resetQuiz();
    vocabularyService
      .getQuizQuestions(10)
      .then(setQuizQuestions)
      .finally(() => setIsLoading(false));
  }, []);

  const handleAnswer = (option: string) => {
    if (quizResult) return;
    setQuizAnswer(quizQuestions[currentQ].id, option);
    setTimeout(() => {
      if (currentQ < quizQuestions.length - 1) setCurrentQ((c) => c + 1);
    }, 400);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const answers = Object.entries(quizAnswers).map(
      ([vocabularyId, answer]) => ({
        vocabularyId,
        answer,
      })
    );
    try {
      const result = await vocabularyService.submitQuiz(answers);
      setQuizResult(result);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <SectionLoader />;
  if (quizQuestions.length === 0)
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        No quiz questions available.
      </div>
    );

  const answeredCount = Object.keys(quizAnswers).length;
  const allAnswered = answeredCount === quizQuestions.length;

  // ── Results screen ──────────────────────────────────────────────────────────
  if (quizResult) {
    const pct = Math.round(quizResult.score);
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
          <p className="text-5xl font-black text-gray-900">
            {quizResult.correct}/{quizResult.total}
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-600">
            {pct}% correct
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
              ? "🎉 Excellent!"
              : pct >= 60
              ? "👍 Good job!"
              : "📚 Keep practising!"}
          </div>
        </div>

        {/* Review */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">
            Answer Review
          </h2>
          <div className="space-y-3">
            {quizResult.answers.map((a, i) => {
              const q = quizQuestions.find((q) => q.id === a.wordId);
              return (
                <div
                  key={a.wordId}
                  className={cn(
                    "flex items-start gap-2 rounded-lg border p-3",
                    a.correct
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                      a.correct ? "bg-green-500" : "bg-red-500"
                    )}
                  >
                    {a.correct ? "✓" : "✗"}
                  </span>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-800">{q?.word}</p>
                    <p className="text-gray-600">
                      Correct:{" "}
                      <span className="font-medium text-green-700">
                        {a.correctAnswer}
                      </span>
                    </p>
                    {!a.correct && (
                      <p className="text-gray-500">
                        Your answer:{" "}
                        <span className="text-red-600">
                          {quizAnswers[a.wordId]}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              resetQuiz();
              setCurrentQ(0);
              setIsLoading(true);
              vocabularyService
                .getQuizQuestions(10)
                .then(setQuizQuestions)
                .finally(() => setIsLoading(false));
            }}
            className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Try Again
          </button>
          <Link
            href="/vocabulary"
            className="flex-1 rounded-xl border border-gray-200 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Vocabulary
          </Link>
        </div>
      </div>
    );
  }

  // ── Quiz screen ─────────────────────────────────────────────────────────────
  const q = quizQuestions[currentQ];
  const selectedAnswer = quizAnswers[q.id];

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/vocabulary"
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Vocabulary
        </Link>
        <span className="text-sm text-gray-500">
          {currentQ + 1} / {quizQuestions.length}
        </span>
      </div>

      {/* Progress */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
          What does this word mean?
        </p>
        <p className="text-3xl font-black text-gray-900">{q.word}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((opt) => {
          const isSelected = selectedAnswer === opt;
          const isCorrect = opt === q.correctAnswer;
          const showResult = !!selectedAnswer;
          return (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={!!selectedAnswer}
              className={cn(
                "w-full rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition",
                !showResult &&
                  "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50",
                showResult &&
                  isSelected &&
                  isCorrect &&
                  "border-green-400 bg-green-50 text-green-800",
                showResult &&
                  isSelected &&
                  !isCorrect &&
                  "border-red-400 bg-red-50 text-red-800",
                showResult &&
                  !isSelected &&
                  isCorrect &&
                  "border-green-300 bg-green-50 text-green-700",
                showResult &&
                  !isSelected &&
                  !isCorrect &&
                  "border-gray-100 bg-gray-50 text-gray-400"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQ((c) => Math.max(0, c - 1))}
          disabled={currentQ === 0}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
        >
          ← Back
        </button>
        {allAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSubmitting ? "Submitting…" : "See Results"}
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
