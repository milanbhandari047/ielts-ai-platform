"use client";

import { cn } from "@/lib/utils";
import { NumCircle, CheckBox } from "../shared";
import type { QuestionProps } from "./types";

interface MultipleChoiceMultiQuestionProps extends QuestionProps {
  options: string[];
  maxSelect?: number;
}

export function MultipleChoiceMultiQuestion({
  question,
  globalNum,
  answer,
  onAnswer,
  options,
  maxSelect = 2,
}: MultipleChoiceMultiQuestionProps) {
  const selected = answer ? answer.split(",").filter(Boolean) : [];

  const toggle = (opt: string) => {
    const next = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : selected.length < maxSelect
      ? [...selected, opt]
      : selected; // max reached — ignore
    onAnswer(question.id, next.join(","));
  };

  return (
    <div>
      <div className="mb-2 flex items-start gap-3">
        <NumCircle n={globalNum} />
        <p className="text-sm text-gray-800">{question.questionText}</p>
      </div>

      <div className="ml-9 space-y-1.5">
        {options.map((opt, oi) => {
          const label = String.fromCharCode(65 + oi);
          const isSelected = selected.includes(opt);
          const isDisabled = !isSelected && selected.length >= maxSelect;

          return (
            <label
              key={opt}
              onClick={() => !isDisabled && toggle(opt)}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition",
                isSelected
                  ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                  : isDisabled
                  ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                  : "border-gray-200 bg-white text-gray-800 hover:border-gray-300"
              )}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-300 text-xs font-semibold text-gray-500">
                {label}
              </span>
              <CheckBox selected={isSelected} />
              {opt}
            </label>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="ml-9 mt-1.5 text-xs text-gray-400">
          {selected.length} of {maxSelect} selected
        </p>
      )}
    </div>
  );
}
