"use client";

import { useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { readingService } from "@/services/reading.service";
import { useReadingStore } from "@/store/reading.store";
import { TimerCountdown } from "@/components/ui/TimerCountdown";
import { SectionLoader } from "@/components/ui/spinner";
import { PassageViewer } from "@/components/reading/PassageViewer";
import { QuestionPanel } from "@/components/reading/QuestonPanel";

export default function ReadingTestPage() {
  const params = useParams();
  const testId = params.testId as string;
  const router = useRouter();

  const {
    currentTest,
    answers,
    timeLeft,
    isSubmitting,
    setTest,
    setTimeLeft,
    setSubmitting,
    setResult,
    reset,
  } = useReadingStore();

  useEffect(() => {
    reset();
    readingService.getTest(testId).then((test) => setTest(test));
  }, [testId]);

  const handleSubmit = useCallback(async () => {
    if (!currentTest || isSubmitting) return;
    setSubmitting(true);
    try {
      const result = await readingService.submitTest({
        testId: currentTest.id,
        answers,
        timeTaken: 3600 - timeLeft,
      });
      setResult(result);
      router.push(`/reading/${testId}/result`);
    } catch {
      setSubmitting(false);
    }
  }, [currentTest, answers, timeLeft, isSubmitting]);

  if (!currentTest) return <SectionLoader />;

  const allQuestions = currentTest.passages.flatMap((p) => p.questions);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-white overflow-hidden">
      {/* ── Top bar ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div>
          <h1 className="text-sm font-bold text-gray-900">
            {currentTest.title}
          </h1>
          <p className="text-xs text-gray-400">
            {answeredCount} of {allQuestions.length} answered
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-1.5 rounded border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700">
            <svg
              className="h-3.5 w-3.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <TimerCountdown
              seconds={timeLeft}
              onTick={setTimeLeft}
              onExpire={handleSubmit}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSubmitting ? "Submitting…" : "Submit Test"}
          </button>
        </div>
      </div>

      {/* ── Split view ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left — reading passages */}
        <div className="w-1/2 overflow-y-auto border-r border-gray-200 bg-white">
          {currentTest.passages.map((passage, i) => (
            <PassageViewer key={passage.id} passage={passage} index={i} />
          ))}
        </div>

        {/* Right — questions */}
        <div className="relative w-1/2 bg-gray-50/60">
          <div className="absolute inset-0 overflow-y-auto">
            <QuestionPanel passages={currentTest.passages} />
          </div>
        </div>
      </div>

      {/* ── Question navigator (bottom strip) ─────────────────────── */}
      <div className="border-t border-gray-200 bg-white px-6 py-2">
        <div className="flex flex-wrap gap-1.5">
          {allQuestions.map((q, i) => {
            const isAnswered = (answers[q.id] ?? "").trim().length > 0;
            return (
              <span
                key={q.id}
                className={`flex h-6 w-6 items-center justify-center rounded text-xs font-semibold ${
                  isAnswered
                    ? "bg-indigo-600 text-white"
                    : "border border-gray-300 bg-white text-gray-500"
                }`}
              >
                {i + 1}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
