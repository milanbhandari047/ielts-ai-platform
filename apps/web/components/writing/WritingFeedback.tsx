"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { writingService } from "@/services/writing.service";
import { AIFeedbackPanel } from "@/components/writing/AIFeedbackPanel";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { WritingResult } from "@/types";

const POLL_INTERVAL_MS = 4000;
const MAX_POLLS = 30; // 2 minutes max

export default function WritingFeedbackPage() {
  const { submissionId } = useParams() as { submissionId: string };
  const [result, setResult] = useState<WritingResult | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollCount = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const data = await writingService.getResult(submissionId);
        // Backend returns overallBand: null while evaluating
        if (data.overallBand != null) {
          setResult(data);
          setIsPolling(false);
          return;
        }
      } catch {
        // keep polling
      }

      pollCount.current += 1;
      if (pollCount.current >= MAX_POLLS) {
        setError(
          "AI evaluation is taking longer than expected. Please check back in a few minutes."
        );
        setIsPolling(false);
        return;
      }

      timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [submissionId]);

  if (isPolling) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="relative">
          <Spinner size="lg" className="text-indigo-600" />
          <span className="absolute inset-0 flex items-center justify-center text-xl">
            ✍️
          </span>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">
            AI is evaluating your essay…
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Checking Task Response, Coherence, Lexical Resource and Grammar.
            <br />
            This usually takes 15–30 seconds.
          </p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 animate-bounce rounded-full bg-indigo-400"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <Link
          href="/writing"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Back to Writing
        </Link>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/writing"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Writing
        </Link>
        <Link
          href="/writing/task2"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Write Another Essay
        </Link>
      </div>

      <AIFeedbackPanel result={result} />
    </div>
  );
}
