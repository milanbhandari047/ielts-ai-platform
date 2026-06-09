"use client";

import { useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { listeningService } from "@/services/listening.service";
import { useListeningStore } from "@/store/listening.store";
import { TimerCountdown } from "@/components/ui/TimerCountdown";
import { SectionLoader } from "@/components/ui/spinner";
import { AudioPlayer } from "@/components/listening/AudioPlayer";
import { cn } from "@/lib/utils";

export default function ListeningTestPage() {
  const params = useParams();
  const testId = params.testId as string;
  const router = useRouter();

  const {
    currentTest,
    currentSectionIndex,
    answers,
    timeLeft,
    isSubmitting,
    setTest,
    setSection,
    setAnswer,
    setTimeLeft,
    setSubmitting,
    setResult,
    markAudioCompleted,
    audioCompleted,
    reset,
  } = useListeningStore();

  useEffect(() => {
    reset();
    listeningService.getTest(testId).then(setTest);
  }, [testId]);

  const handleSubmit = useCallback(async () => {
    if (!currentTest || isSubmitting) return;
    setSubmitting(true);
    try {
      const result = await listeningService.submitTest({
        testId: currentTest.id,
        answers,
        timeTaken: 2400 - timeLeft,
      });
      setResult(result);
      router.push(`/listening/${testId}/result`);
    } catch {
      setSubmitting(false);
    }
  }, [currentTest, answers, timeLeft, isSubmitting]);

  if (!currentTest) return <SectionLoader />;

  const section = currentTest.sections[currentSectionIndex];
  const allQuestions = currentTest.sections.flatMap((s) => s.questions);
  const answeredCount = Object.keys(answers).length;
  let questionOffset = currentTest.sections
    .slice(0, currentSectionIndex)
    .reduce((sum, s) => sum + s.questions.length, 0);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">
            {currentTest.title}
          </h1>
          <p className="text-xs text-gray-500">
            Section {currentSectionIndex + 1} of {currentTest.sections.length} ·{" "}
            {answeredCount}/{allQuestions.length} answered
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
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:opacity-60"
          >
            {isSubmitting ? "Submitting…" : "Submit Test"}
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex border-b border-gray-200 bg-white px-6">
        {currentTest.sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSection(i)}
            className={cn(
              "border-b-2 px-4 py-2.5 text-sm font-medium transition",
              i === currentSectionIndex
                ? "border-purple-600 text-purple-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            Section {i + 1}
            {audioCompleted[i] && (
              <span className="ml-1.5 text-xs text-green-600">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AudioPlayer
          src={section.audioUrl}
          onComplete={() => markAudioCompleted(currentSectionIndex)}
          className="mb-6"
        />

        <div className="space-y-4">
          {section.questions.map((question, i) => {
            const num = questionOffset + i + 1;
            const userAnswer = answers[question.id] ?? "";
            return (
              <div
                key={question.id}
                className={cn(
                  "rounded-xl border p-4",
                  userAnswer
                    ? "border-purple-200 bg-purple-50/40"
                    : "border-gray-200 bg-white"
                )}
              >
                <div className="mb-2 flex items-start gap-2">
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      userAnswer
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {num}
                  </span>
                  <p className="text-sm text-gray-800">
                    {question.questionText}
                  </p>
                </div>
                <div className="pl-8">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setAnswer(question.id, e.target.value)}
                    placeholder="Type your answer…"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Next section / submit */}
        <div className="mt-6 flex justify-end gap-3">
          {currentSectionIndex < currentTest.sections.length - 1 ? (
            <button
              onClick={() => setSection(currentSectionIndex + 1)}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              Next Section →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-60"
            >
              {isSubmitting ? "Submitting…" : "Submit Test"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
