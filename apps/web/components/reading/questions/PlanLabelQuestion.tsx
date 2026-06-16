"use client";

import { NumCircle } from "../shared";
import type { QuestionProps } from "./types";

export function PlanLabelQuestion({
  question,
  globalNum,
  answer,
  onAnswer,
}: QuestionProps) {
  return (
    <div className="flex items-start gap-3">
      <NumCircle n={globalNum} />
      <div className="flex-1">
        <p className="mb-1.5 text-sm text-gray-800">{question.questionText}</p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            placeholder="Label…"
            className="w-48 border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-100"
          />
          <span className="text-xs text-gray-400">ONE WORD ONLY</span>
        </div>
      </div>
    </div>
  );
}
