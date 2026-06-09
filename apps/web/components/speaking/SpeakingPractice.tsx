"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { speakingService } from "@/services/speaking.service";
import { useSpeakingStore } from "@/store/speaking.store";
import { VoiceRecorder } from "@/components/speaking/VoiceRecorder";
import { SectionLoader } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { SpeakingPart, SpeakingCueCard } from "@/types";

interface SpeakingPracticePageProps {
  part: SpeakingPart;
}

const PART_META: Record<
  SpeakingPart,
  { label: string; color: string; prep: string }
> = {
  PART1: {
    label: "Part 1",
    color: "from-orange-500 to-amber-500",
    prep: "No prep time — answer naturally",
  },
  PART2: {
    label: "Part 2",
    color: "from-rose-500 to-pink-500",
    prep: "1 minute preparation time given",
  },
  PART3: {
    label: "Part 3",
    color: "from-purple-500 to-violet-600",
    prep: "No prep time — discuss and justify",
  },
};

export function SpeakingPracticePage({ part }: SpeakingPracticePageProps) {
  const router = useRouter();
  const meta = PART_META[part];

  const [cueCards, setCueCards] = useState<SpeakingCueCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    currentCueCard,
    recordingState,
    audioBlob,
    setCueCard,
    setRecordingState,
    setSubmissionId,
    setError,
    reset,
  } = useSpeakingStore();

  useEffect(() => {
    reset();
    speakingService
      .getCueCards(part)
      .then((cards) => {
        setCueCards(cards);
        if (cards.length > 0) setCueCard(cards[0]);
      })
      .finally(() => setIsLoading(false));
  }, [part]);

  const handleSubmit = async () => {
    if (!currentCueCard || !audioBlob) return;
    setRecordingState("uploading");
    try {
      const data = await speakingService.submit(currentCueCard.id, audioBlob);
      setSubmissionId(data.submissionId);
      router.push(`/speaking/${data.submissionId}/feedback`);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Upload failed. Please try again."
      );
      setRecordingState("recorded");
    }
  };

  if (isLoading) return <SectionLoader />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div
        className={`rounded-2xl bg-gradient-to-br ${meta.color} p-6 text-white`}
      >
        <p className="text-xs font-semibold uppercase tracking-wide opacity-75">
          IELTS Speaking
        </p>
        <h1 className="mt-1 text-2xl font-bold">{meta.label}</h1>
        <p className="mt-1 text-sm opacity-80">{meta.prep}</p>
      </div>

      {/* Cue card selector */}
      {cueCards.length > 1 && (
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-400">
            Select Topic
          </label>
          <select
            value={currentCueCard?.id ?? ""}
            onChange={(e) => {
              const card = cueCards.find((c) => c.id === e.target.value);
              if (card) {
                reset();
                setCueCard(card);
              }
            }}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-orange-400 focus:outline-none"
          >
            {cueCards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.topic}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Cue card */}
      {currentCueCard && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {part === "PART2" ? "Talk about:" : "Question"}
          </p>
          <h2 className="text-base font-bold text-gray-900">
            {currentCueCard.topic}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-700 whitespace-pre-line">
            {currentCueCard.instruction}
          </p>
        </div>
      )}

      {/* Recorder */}
      <VoiceRecorder />

      {/* Submit */}
      {recordingState === "recorded" && audioBlob && (
        <button
          onClick={handleSubmit}
          className={cn(
            "w-full rounded-xl py-3 text-sm font-semibold text-white transition",
            "bg-orange-500 hover:bg-orange-600"
          )}
        >
          Submit for AI Evaluation
        </button>
      )}
    </div>
  );
}
