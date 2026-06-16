"use client";

import type { ReadingPassage } from "@/types";

interface PassageViewerProps {
  passage: ReadingPassage;
  index: number;
}

export function PassageViewer({ passage, index }: PassageViewerProps) {
  const label = `READING PASSAGE ${index + 1}`;

  return (
    <div className="border-b border-gray-200 px-8 py-8 last:border-0">
      {/* Passage label */}
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </p>

      {/* Title */}
      <h2 className="mb-5 text-xl font-bold text-gray-900 leading-snug">
        {passage.title}
      </h2>

      {/* Body text — rendered as labelled paragraphs if they are letter-prefixed,
          otherwise plain flowing prose */}
      <PassageBody content={passage.content} />
    </div>
  );
}

function PassageBody({ content }: { content: string }) {
  // Detect if paragraphs are prefixed with single uppercase letters (A, B, C…)
  // common in IELTS passages. Pattern: line starts with "A\t" or "A " etc.
  const paragraphs = content.split(/\n{2,}/).filter(Boolean);
  const isLabelled = paragraphs.every((p) => /^[A-G]\s/.test(p.trim()));

  if (isLabelled) {
    return (
      <div className="space-y-4 text-sm text-gray-700 leading-7">
        {paragraphs.map((para, i) => {
          const letter = para.trim()[0];
          const body = para.trim().slice(1).trim();
          return (
            <div key={i} className="flex gap-3">
              <span className="mt-0.5 shrink-0 font-bold text-gray-900">
                {letter}
              </span>
              <p>{body}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm text-gray-700 leading-7">
      {paragraphs.map((para, i) => (
        <p key={i}>{para.trim()}</p>
      ))}
    </div>
  );
}
