"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMockTestStore } from "@/store/mocktest.store";
import { mockTestService } from "@/services/mocktest.service";
import { SectionLoader } from "../ui/spinner";
import { TimerCountdown } from "../ui/TimerCountdown";

type Section = "LISTENING" | "READING" | "WRITING" | "SPEAKING";

const SECTION_META: Record<
  Section,
  { label: string; icon: string; color: string }
> = {
  LISTENING: { label: "Listening", icon: "🎧", color: "text-purple-600" },
  READING: { label: "Reading", icon: "📖", color: "text-blue-600" },
  WRITING: { label: "Writing", icon: "✍️", color: "text-emerald-600" },
  SPEAKING: { label: "Speaking", icon: "🎙️", color: "text-orange-600" },
};

export default function MockTestSessionPage() {
  const { sessionId } = useParams() as { sessionId: string };
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sectionData, setSectionData] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [submittingSection, setSubmittingSection] = useState(false);

  const {
    currentSection,
    timeLeft,
    answers,
    essay,
    setSessionId,
    setSection,
    setTimeLeft,
    setSubmitting,
    setAnswer,
    setEssay,
    reset,
  } = useMockTestStore();

  useEffect(() => {
    reset();
    setSessionId(sessionId);
    mockTestService
      .getSession(sessionId)
      .then((session) => {
        setSection(session.currentSection as Section);
        setTimeLeft(session.timeLeft);
        loadSectionData(session.currentSection as Section);
      })
      .finally(() => setIsLoading(false));
  }, [sessionId]);

  const loadSectionData = async (section: Section) => {
    setIsLoading(true);
    try {
      const data = await mockTestService.getSession(sessionId);
      setSectionData(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSection = useCallback(async () => {
    if (submittingSection) return;
    setSubmittingSection(true);
    try {
      const payload: Record<string, unknown> = {};
      if (currentSection === "READING" || currentSection === "LISTENING") {
        payload.answers = answers;
      } else if (currentSection === "WRITING") {
        payload.essay = essay;
        payload.wordCount = essay.trim().split(/\s+/).length;
      }

      const result = await mockTestService.submitSection(
        sessionId,
        currentSection,
        payload
      );

      if (result.nextSection) {
        setSection(result.nextSection as Section);
        setShowInstructions(true);
        await loadSectionData(result.nextSection as Section);
      } else {
        // All sections done
        const finalResult = await mockTestService.completeSession(sessionId);
        router.push(`/mock-test/${sessionId}/result`);
      }
    } finally {
      setSubmittingSection(false);
    }
  }, [currentSection, answers, essay, sessionId, submittingSection]);

  if (isLoading) return <SectionLoader />;

  const meta = SECTION_META[currentSection];

  // Instructions overlay
  if (showInstructions) {
    const instructions: Record<Section, string> = {
      LISTENING:
        "You will hear a series of recordings. Answer the questions as you listen. You can only play each recording once.",
      READING:
        "Read the passages carefully and answer all questions. You have 60 minutes for this section.",
      WRITING:
        "Complete both writing tasks. Task 1 requires at least 150 words; Task 2 requires at least 250 words.",
      SPEAKING:
        "Record your answers to the speaking questions. You will have preparation time for Part 2.",
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center">
          <span className="text-5xl">{meta.icon}</span>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {meta.label}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {instructions[currentSection]}
          </p>
          <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-500">
            ⏱ Time allowed:{" "}
            {currentSection === "READING" || currentSection === "WRITING"
              ? "60 minutes"
              : currentSection === "LISTENING"
              ? "40 minutes"
              : "15 minutes"}
          </div>
          <button
            onClick={() => setShowInstructions(false)}
            className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Begin {meta.label} Section
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-900 text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-6 py-3">
        <div className="flex items-center gap-3">
          <span className={cn("font-semibold", meta.color)}>
            {meta.icon} {meta.label}
          </span>
          <div className="flex gap-1">
            {(["LISTENING", "READING", "WRITING", "SPEAKING"] as Section[]).map(
              (s) => (
                <div
                  key={s}
                  className={cn(
                    "h-1.5 w-8 rounded-full",
                    s === currentSection ? "bg-indigo-400" : "bg-gray-600"
                  )}
                />
              )
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-gray-700 px-3 py-1.5">
            <svg
              className="h-4 w-4 text-gray-300"
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
              onExpire={handleSubmitSection}
              className="text-white"
            />
          </div>
          <button
            onClick={handleSubmitSection}
            disabled={submittingSection}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {submittingSection ? "Submitting…" : "Submit Section →"}
          </button>
        </div>
      </div>

      {/* Section content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl">
          {(currentSection === "READING" || currentSection === "LISTENING") && (
            <div className="rounded-xl bg-white p-6 text-gray-800">
              <p className="text-sm text-gray-500">
                Answer the questions using the answers panel. Your session data
                is linked to session ID:{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">
                  {sessionId}
                </code>
              </p>
              <div className="mt-4 space-y-3">
                {Object.entries(answers).length > 0 ? (
                  Object.entries(answers).map(([qId, ans]) => (
                    <div key={qId} className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400 font-mono text-xs">
                        {qId.slice(-6)}
                      </span>
                      <span className="font-medium">{ans}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    This section uses the same reading/listening interfaces from
                    Phase 1. In production, embed the Reading or Listening test
                    component here with the mock test session context.
                  </p>
                )}
              </div>
              {/* Generic answer input for demo */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Type answer and question ID, e.g. q1:True"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const [qId, ans] = e.currentTarget.value.split(":");
                      if (qId && ans) {
                        setAnswer(qId.trim(), ans.trim());
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}

          {currentSection === "WRITING" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-white p-6 text-gray-800">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Writing Task 2
                </p>
                <p className="text-sm text-gray-600">
                  Write at least 250 words on the assigned topic.
                </p>
              </div>
              <textarea
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                placeholder="Start writing your essay here…"
                className="w-full min-h-[400px] rounded-xl border border-gray-600 bg-gray-800 p-4 text-sm text-white placeholder:text-gray-500 focus:border-indigo-400 focus:outline-none resize-none"
              />
              <p className="text-right text-xs text-gray-400">
                {essay.trim().split(/\s+/).filter(Boolean).length} words
              </p>
            </div>
          )}

          {currentSection === "SPEAKING" && (
            <div className="rounded-xl bg-white p-6 text-center text-gray-800">
              <p className="text-lg font-semibold mb-2">Speaking Section</p>
              <p className="text-sm text-gray-500">
                Use the speaking recorder from Phase 1 here. In production,
                embed the VoiceRecorder component with the mock test session
                context.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
