"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useReadingStore } from "@/store/reading.store";
import { BandBadge } from "@/components/ui/BandBadge";
import { cn } from "@/lib/utils";

export default function ReadingResultPage() {
  const params = useParams();
  const testId = params.testId as string;
  const router = useRouter();

  const { result, currentTest, answers, reset } = useReadingStore();

  useEffect(() => {
    if (!result) router.replace(`/reading/${testId}`);
  }, [result, router, testId]);

  if (!result || !currentTest) return null;

  const pct = Math.round((result.score / result.total) * 100);

  const allQuestions = currentTest.passages.flatMap((p) => p.questions);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Score card */}
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
        <p className="mb-1 text-sm font-medium text-gray-500">Reading Score</p>

        <BandBadge band={result.band} size="lg" className="mx-auto" />

        <p className="mt-4 text-4xl font-bold text-gray-900">
          {result.score} / {result.total}
        </p>

        <p className="text-sm text-gray-500">{pct}% correct</p>

        <div className="mt-4 flex justify-center gap-3">
          <Link
            href="/reading"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to tests
          </Link>

          <Link
            href={`/reading/${testId}`}
            onClick={reset}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          >
            Retake test
          </Link>
        </div>
      </div>

      {/* Answer review */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">
          Answer Review
        </h2>

        <div className="space-y-3">
          {allQuestions.map((q, i) => {
            const review = result.correctAnswers[q.id];
            const userAnswer = answers[q.id] ?? "—";
            const isCorrect = review?.correct ?? false;

            return (
              <div
                key={q.id}
                className={cn(
                  "rounded-lg border p-3",
                  isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                )}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      isCorrect
                        ? "bg-green-600 text-white"
                        : "bg-red-500 text-white"
                    )}
                  >
                    {isCorrect ? "✓" : "✗"}
                  </span>

                  <div className="text-sm">
                    <p className="font-medium text-gray-800">
                      Q{i + 1}. {q.questionText}
                    </p>

                    <p className="mt-1 text-gray-600">
                      Your answer:{" "}
                      <span
                        className={cn(
                          "font-medium",
                          isCorrect ? "text-green-700" : "text-red-700"
                        )}
                      >
                        {userAnswer}
                      </span>
                    </p>

                    {!isCorrect && (
                      <p className="text-gray-600">
                        Correct:{" "}
                        <span className="font-medium text-green-700">
                          {review?.correctAnswer}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
