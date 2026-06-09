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

  // Load test
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

  // Flatten all questions for the navigator
  const allQuestions = currentTest.passages.flatMap((p) => p.questions);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">
            {currentTest.title}
          </h1>
          <p className="text-xs text-gray-500">
            {answeredCount} / {allQuestions.length} answered
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5">
            <svg
              className="h-4 w-4 text-gray-500"
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
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSubmitting ? "Submitting…" : "Submit Test"}
          </button>
        </div>
      </div>

      {/* Split view */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — passages */}
        <div className="w-1/2 overflow-y-auto border-r border-gray-200 bg-white">
          {currentTest.passages.map((passage, i) => (
            <PassageViewer key={passage.id} passage={passage} index={i} />
          ))}
        </div>

        {/* Right — questions */}
        <div className="w-1/2 overflow-y-auto bg-gray-50">
          <QuestionPanel passages={currentTest.passages} />
        </div>
      </div>
    </div>
  );
}
