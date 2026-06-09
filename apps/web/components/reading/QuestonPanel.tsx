"use client";

import { useReadingStore } from "@/store/reading.store";
import { cn } from "@/lib/utils";
import type { ReadingPassage, ReadingQuestion } from "@/types";

interface QuestionPanelProps {
  passages: ReadingPassage[];
}

export function QuestionPanel({ passages }: QuestionPanelProps) {
  const { answers, setAnswer } = useReadingStore();
  let globalQuestionNumber = 0;

  return (
    <div className="p-6 space-y-8">
      {passages.map((passage) => (
        <div key={passage.id}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Passage: {passage.title}
          </p>
          <div className="space-y-6">
            {passage.questions.map((question) => {
              globalQuestionNumber++;
              const num = globalQuestionNumber;
              return (
                <QuestionItem
                  key={question.id}
                  question={question}
                  number={num}
                  answer={answers[question.id] ?? ""}
                  onAnswer={(val) => setAnswer(question.id, val)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

interface QuestionItemProps {
  question: ReadingQuestion;
  number: number;
  answer: string;
  onAnswer: (value: string) => void;
}

function QuestionItem({
  question,
  number,
  answer,
  onAnswer,
}: QuestionItemProps) {
  const isAnswered = answer.trim().length > 0;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition",
        isAnswered
          ? "border-indigo-200 bg-indigo-50/40"
          : "border-gray-200 bg-white"
      )}
    >
      <div className="mb-2 flex items-start gap-2">
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
            isAnswered
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-600"
          )}
        >
          {number}
        </span>
        <p className="text-sm text-gray-800">{question.questionText}</p>
      </div>

      <div className="pl-8">
        <QuestionInput
          question={question}
          answer={answer}
          onAnswer={onAnswer}
        />
      </div>
    </div>
  );
}

function QuestionInput({
  question,
  answer,
  onAnswer,
}: {
  question: ReadingQuestion;
  answer: string;
  onAnswer: (value: string) => void;
}) {
  const { questionType, options } = question;

  // Multiple choice
  if (questionType === "MULTIPLE_CHOICE" && options) {
    return (
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition",
              answer === opt
                ? "border-indigo-400 bg-indigo-50 text-indigo-800"
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
          >
            <input
              type="radio"
              name={question.id}
              value={opt}
              checked={answer === opt}
              onChange={() => onAnswer(opt)}
              className="sr-only"
            />
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full border text-xs",
                answer === opt
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-gray-300"
              )}
            >
              {answer === opt && "✓"}
            </span>
            {opt}
          </label>
        ))}
      </div>
    );
  }

  // True / False / Not Given
  if (questionType === "TRUE_FALSE_NOT_GIVEN") {
    const tfOptions = ["True", "False", "Not Given"];
    return (
      <div className="flex gap-2">
        {tfOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => onAnswer(opt)}
            className={cn(
              "flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition",
              answer === opt
                ? "border-indigo-500 bg-indigo-600 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }

  // Match headings — select from a dropdown
  if (
    (questionType === "MATCH_HEADINGS" ||
      questionType === "MATCH_INFORMATION") &&
    options
  ) {
    return (
      <select
        value={answer}
        onChange={(e) => onAnswer(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  // Fill in blank / Short answer / Sentence completion / Summary / Note
  return (
    <input
      type="text"
      value={answer}
      onChange={(e) => onAnswer(e.target.value)}
      placeholder="Type your answer…"
      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
    />
  );
}
