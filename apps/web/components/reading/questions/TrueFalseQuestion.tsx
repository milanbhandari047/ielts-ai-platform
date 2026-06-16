"use client";

import { NumCircle, RadioDot } from "../shared";
import type { QuestionProps } from "./types";
import type { QuestionType } from "@/types";

interface TrueFalseQuestionProps extends QuestionProps {
  questionType: QuestionType;
}

const OPTIONS: Record<string, string[]> = {
  TRUE_FALSE_NOT_GIVEN: ["TRUE", "FALSE", "NOT GIVEN"],
  YES_NO_NOT_GIVEN: ["YES", "NO", "NOT GIVEN"],
};

export function TrueFalseQuestion({
  question,
  globalNum,
  answer,
  onAnswer,
  questionType,
}: TrueFalseQuestionProps) {
  const options = OPTIONS[questionType] ?? OPTIONS.TRUE_FALSE_NOT_GIVEN;

  return (
    <div>
      <div className="mb-2 flex items-start gap-3">
        <NumCircle n={globalNum} />
        <p className="text-sm text-gray-800">{question.questionText}</p>
      </div>

      <div className="ml-9 space-y-1.5">
        {options.map((opt, oi) => {
          const selected = answer === opt;
          return (
            <label
              key={opt}
              onClick={() => onAnswer(question.id, opt)}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-800"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 text-xs font-semibold text-gray-500">
                {String.fromCharCode(65 + oi)}
              </span>
              <RadioDot selected={selected} />
              {opt}
            </label>
          );
        })}
      </div>
    </div>
  );
}
