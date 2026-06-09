"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { writingService } from "@/services/writing.service";
import { useWritingStore } from "@/store/writing.store";
import { RichTextEditor } from "@/components/writing/RichTextEditor";
import { SectionLoader } from "@/components/ui/spinner";
import type { WritingTask, WritingPrompt } from "@/types";

interface WritingEditorPageProps {
  task: WritingTask;
}

/* ---------------- Task Meta ---------------- */

const TASK_META = {
  TASK1: {
    minWords: 150,
    label: "Task 1",
    color: "from-emerald-500 to-teal-600",
  },
  TASK2: {
    minWords: 250,
    label: "Task 2",
    color: "from-indigo-500 to-purple-600",
  },
} as const;

type TaskKey = keyof typeof TASK_META;

export function WritingEditorPage({ task }: WritingEditorPageProps) {
  const router = useRouter();

  const meta = TASK_META[task as TaskKey];

  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(
    null
  );

  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);

  const {
    essay,
    wordCount,
    isSubmitting,
    setPrompt,
    setSubmitting,
    setSubmissionId,
    reset,
  } = useWritingStore();

  /* ---------------- Load prompts ---------------- */

  useEffect(() => {
    reset();

    writingService
      .getPrompts(task)
      .then((data) => {
        setPrompts(data);

        if (data.length > 0) {
          setSelectedPrompt(data[0]);
          setPrompt(data[0]);
        }
      })
      .finally(() => setIsLoadingPrompts(false));
  }, [task]);

  /* ---------------- Change prompt ---------------- */

  const handlePromptChange = (promptId: string) => {
    const p = prompts.find((pr) => pr.id === promptId) ?? null;

    reset();

    setSelectedPrompt(p);
    if (p) setPrompt(p);
  };

  /* ---------------- Submit ---------------- */

  const handleSubmit = async () => {
    if (!selectedPrompt) return;

    const safeWordCount = Number(wordCount);

    if (safeWordCount < meta.minWords || isSubmitting) return;

    setSubmitting(true);

    try {
      const data = await writingService.submit({
        promptId: selectedPrompt.id,
        essay,
        wordCount: safeWordCount,
      });

      setSubmissionId(data.submissionId);

      router.push(`/writing/${data.submissionId}/feedback`);
    } catch (err) {
      console.error("Submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoadingPrompts) return <SectionLoader />;

  /* ---------------- Button state ---------------- */

  const safeWordCount = Number(wordCount);

  const isDisabled =
    !selectedPrompt || isSubmitting || safeWordCount < meta.minWords;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div
        className={`rounded-2xl bg-gradient-to-br ${meta.color} p-6 text-white`}
      >
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
          IELTS Writing
        </p>
        <h1 className="mt-1 text-2xl font-bold">{meta.label}</h1>
        <p className="mt-1 text-sm opacity-80">
          Minimum {meta.minWords} words required
        </p>
      </div>

      {/* Prompt selector */}
      {prompts.length > 1 && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500 uppercase tracking-wide">
            Select Question
          </label>

          <select
            value={selectedPrompt?.id ?? ""}
            onChange={(e) => handlePromptChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            {prompts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Question */}
      {selectedPrompt && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Question
          </p>

          <h2 className="text-base font-semibold text-gray-900">
            {selectedPrompt.title}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            {selectedPrompt.instruction}
          </p>

          {task === "TASK1" && selectedPrompt.imageUrl && (
            <img
              src={selectedPrompt.imageUrl}
              alt="Task 1"
              className="mt-4 rounded-xl border border-gray-100 object-contain"
            />
          )}
        </div>
      )}

      {/* Editor */}
      <RichTextEditor
        minWords={meta.minWords}
        placeholder={
          task === "TASK1"
            ? "Describe the graph/chart..."
            : "Write your essay with clear introduction, body, and conclusion..."
        }
      />

      {/* Submit */}
      <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4">
        <p className="text-xs text-gray-500">
          AI will evaluate your essay on IELTS criteria.
        </p>

        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`rounded-lg px-6 py-2.5 text-sm font-medium text-white transition
            ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
        >
          {isSubmitting ? "Submitting for AI Evaluation…" : "Submit Essay"}
        </button>
      </div>
    </div>
  );
}
