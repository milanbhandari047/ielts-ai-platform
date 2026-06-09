"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { speakingService } from "@/services/speaking.service";
import { BandBadge } from "@/components/ui/BandBadge";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { SpeakingResult } from "@/types";

const POLL_MS = 5000;
const MAX_POLLS = 24; // 2 minutes

const CRITERIA = [
  { key: "fluency", label: "Fluency & Coherence", icon: "💬" },
  { key: "pronunciation", label: "Pronunciation", icon: "🗣️" },
  { key: "grammar", label: "Grammatical Range", icon: "✏️" },
  { key: "vocabulary", label: "Lexical Resource", icon: "📚" },
] as const;

export default function SpeakingFeedbackPage() {
  const { submissionId } = useParams() as { submissionId: string };
  const [result, setResult] = useState<SpeakingResult | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollCount = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const data = await speakingService.getResult(submissionId);
        if (data.fluency != null) {
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
          "Evaluation is taking longer than expected. Please check back in a few minutes."
        );
        setIsPolling(false);
        return;
      }
      timerRef.current = setTimeout(poll, POLL_MS);
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
          <Spinner size="lg" />
          <span className="absolute inset-0 flex items-center justify-center text-xl">
            🎙️
          </span>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">
            Transcribing & evaluating your speech…
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Whisper AI is transcribing your audio. This usually takes 20–40
            seconds.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <Link
          href="/speaking"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          Back to Speaking
        </Link>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/speaking"
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
          Back to Speaking
        </Link>
      </div>

      {/* Overall */}
      <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-center text-white">
        <p className="text-sm font-medium opacity-80">Speaking Band Score</p>
        <p className="mt-1 text-6xl font-black">
          {(
            (result.fluency +
              result.pronunciation +
              result.grammar +
              result.vocabulary) /
            4
          ).toFixed(1)}
        </p>
      </div>

      {/* Criteria */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          Score Breakdown
        </h3>
        <div className="space-y-4">
          {CRITERIA.map(({ key, label, icon }) => {
            const score = result[key];
            const feedbackText = result.feedback[key];
            return (
              <div key={key}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-gray-700">
                    {icon} {label}
                  </span>
                  <BandBadge band={score} size="sm" />
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      score >= 7
                        ? "bg-emerald-500"
                        : score >= 6
                        ? "bg-blue-500"
                        : score >= 5
                        ? "bg-yellow-500"
                        : "bg-red-400"
                    )}
                    style={{ width: `${(score / 9) * 100}%` }}
                  />
                </div>
                {feedbackText && (
                  <p className="mt-1.5 text-xs text-gray-500">{feedbackText}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Transcript */}
      {result.transcript && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            📝 Transcript
          </h3>
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
            {result.transcript}
          </p>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="rounded-2xl bg-orange-50 p-6 ring-1 ring-orange-100">
          <h3 className="mb-3 text-sm font-semibold text-orange-800">
            💡 Suggestions
          </h3>
          <ul className="space-y-2">
            {result.suggestions.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-orange-900"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-200 text-xs font-bold text-orange-700">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
