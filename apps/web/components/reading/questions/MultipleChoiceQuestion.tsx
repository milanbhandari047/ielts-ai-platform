"use client";

import { cn } from "@/lib/utils";
import { NumCircle, RadioDot } from "../shared";
import type { QuestionProps } from "./types";

interface MultipleChoiceQuestionProps extends QuestionProps {
  options: string[];
}

export function MultipleChoiceQuestion({
  question,
  globalNum,
  answer,
  onAnswer,
  options,
}: MultipleChoiceQuestionProps) {
  return (
    <div>
      <div className="mb-2 flex items-start gap-3">
        <NumCircle n={globalNum} />
        <p className="text-sm text-gray-800">{question.questionText}</p>
      </div>

      {options.length > 0 ? (
        <div className="ml-9 space-y-1.5">
          {options.map((opt, oi) => {
            const label = String.fromCharCode(65 + oi);
            const selected = answer === opt;
            return (
              <label
                key={opt}
                onClick={() => onAnswer(question.id, opt)}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition",
                  selected
                    ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                    : "border-gray-200 bg-white text-gray-800 hover:border-gray-300"
                )}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 text-xs font-semibold text-gray-500">
                  {label}
                </span>
                <RadioDot selected={selected} />
                {opt}
              </label>
            );
          })}
        </div>
      ) : (
        // Fallback: no options from API — plain letter input
        <div className="ml-9">
          <input
            type="text"
            value={answer}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            placeholder="Enter letter (A, B, C…)"
            maxLength={2}
            className="w-32 border border-gray-300 bg-white px-3 py-1.5 text-sm uppercase text-gray-900 placeholder:normal-case placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-100"
          />
        </div>
      )}
    </div>
  );
}
