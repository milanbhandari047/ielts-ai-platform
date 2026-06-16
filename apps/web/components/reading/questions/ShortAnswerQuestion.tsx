"use client";

import { NumCircle } from "../shared";
import type { QuestionProps } from "./types";

export function ShortAnswerQuestion({
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
        <input
          type="text"
          value={answer}
          onChange={(e) => onAnswer(question.id, e.target.value)}
          placeholder="No more than three words and/or a number…"
          className="w-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-100"
        />
      </div>
    </div>
  );
}
