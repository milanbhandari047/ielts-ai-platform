import { create } from "zustand";
import type { SpeakingCueCard, SpeakingResult } from "@/types";

type RecordingState =
  | "idle"
  | "preparing"
  | "recording"
  | "recorded"
  | "uploading";

interface SpeakingState {
  currentCueCard: SpeakingCueCard | null;
  recordingState: RecordingState;
  audioBlob: Blob | null;
  audioUrl: string | null;
  prepTimeLeft: number;
  recordTimeLeft: number;
  result: SpeakingResult | null;
  submissionId: string | null;
  isPolling: boolean;
  error: string | null;

  setCueCard: (cueCard: SpeakingCueCard) => void;
  setRecordingState: (state: RecordingState) => void;
  setAudioBlob: (blob: Blob | null, url: string | null) => void;
  setPrepTimeLeft: (seconds: number) => void;
  setRecordTimeLeft: (seconds: number) => void;
  setResult: (result: SpeakingResult) => void;
  setSubmissionId: (id: string) => void;
  setPolling: (v: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const PREP_TIME: Record<string, number> = {
  PART1: 0,
  PART2: 60, // 1 minute prep for Part 2
  PART3: 0,
};

const RECORD_TIME: Record<string, number> = {
  PART1: 4 * 60, // 4 minutes
  PART2: 2 * 60, // 2 minutes
  PART3: 5 * 60, // 5 minutes
};

export const useSpeakingStore = create<SpeakingState>((set) => ({
  currentCueCard: null,
  recordingState: "idle",
  audioBlob: null,
  audioUrl: null,
  prepTimeLeft: 0,
  recordTimeLeft: 0,
  result: null,
  submissionId: null,
  isPolling: false,
  error: null,

  setCueCard: (cueCard) =>
    set({
      currentCueCard: cueCard,
      recordingState: "idle",
      audioBlob: null,
      audioUrl: null,
      result: null,
      prepTimeLeft: PREP_TIME[cueCard.part] ?? 0,
      recordTimeLeft: RECORD_TIME[cueCard.part] ?? 120,
    }),

  setRecordingState: (recordingState) => set({ recordingState }),
  setAudioBlob: (audioBlob, audioUrl) => set({ audioBlob, audioUrl }),
  setPrepTimeLeft: (prepTimeLeft) => set({ prepTimeLeft }),
  setRecordTimeLeft: (recordTimeLeft) => set({ recordTimeLeft }),
  setResult: (result) => set({ result }),
  setSubmissionId: (submissionId) => set({ submissionId }),
  setPolling: (isPolling) => set({ isPolling }),
  setError: (error) => set({ error }),

  reset: () =>
    set({
      currentCueCard: null,
      recordingState: "idle",
      audioBlob: null,
      audioUrl: null,
      prepTimeLeft: 0,
      recordTimeLeft: 0,
      result: null,
      submissionId: null,
      isPolling: false,
      error: null,
    }),
}));
