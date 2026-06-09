"use client";

import type { ReadingPassage } from "@/types";

interface PassageViewerProps {
  passage: ReadingPassage;
  index: number;
}

export function PassageViewer({ passage, index }: PassageViewerProps) {
  return (
    <div className="border-b border-gray-100 p-6 last:border-0">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
          {index + 1}
        </span>
        <h2 className="text-base font-semibold text-gray-900">
          {passage.title}
        </h2>
      </div>
      <div
        className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
        style={{ whiteSpace: "pre-wrap" }}
      >
        {passage.content}
      </div>
    </div>
  );
}
