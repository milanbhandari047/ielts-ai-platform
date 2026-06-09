import { create } from "zustand";
import type { WritingPrompt, WritingResult } from "@/types";

interface WritingState {
  currentPrompt: WritingPrompt | null;
  essay: string;
  wordCount: number;

  isSubmitting: boolean;
  isSaving: boolean;
  lastSaved: Date | null;

  result: WritingResult | null;

  submissionId: string | null;
  isPolling: boolean;

  setPrompt: (prompt: WritingPrompt) => void;
  setEssay: (essay: string) => void;

  setSubmitting: (v: boolean) => void;
  setSaving: (v: boolean) => void;
  setLastSaved: (date: Date) => void;

  setResult: (result: WritingResult) => void;
  setSubmissionId: (id: string | null) => void;
  setPolling: (v: boolean) => void;

  reset: () => void;
}

/* ---------------- Safe word counter ---------------- */
function countWords(text: string): number {
  return text.trim().length
    ? text.trim().split(/\s+/).filter(Boolean).length
    : 0;
}

export const useWritingStore = create<WritingState>((set) => ({
  currentPrompt: null,
  essay: "",
  wordCount: 0,

  isSubmitting: false,
  isSaving: false,
  lastSaved: null,

  result: null,

  submissionId: null,
  isPolling: false,

  /* ---------------- Prompt ---------------- */
  setPrompt: (prompt) =>
    set({
      currentPrompt: prompt,
      essay: "",
      wordCount: 0,
      result: null,
      submissionId: null,
      isPolling: false,
    }),

  /* ---------------- Essay ---------------- */
  setEssay: (essay) =>
    set({
      essay,
      wordCount: countWords(essay),
    }),

  /* ---------------- UI states ---------------- */
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setSaving: (isSaving) => set({ isSaving }),
  setLastSaved: (lastSaved) => set({ lastSaved }),

  /* ---------------- AI result ---------------- */
  setResult: (result) => set({ result }),

  /* ---------------- Submission tracking ---------------- */
  setSubmissionId: (submissionId) => set({ submissionId }),

  setPolling: (isPolling) => set({ isPolling }),

  /* ---------------- Reset ---------------- */
  reset: () =>
    set({
      currentPrompt: null,
      essay: "",
      wordCount: 0,

      isSubmitting: false,
      isSaving: false,
      lastSaved: null,

      result: null,
      submissionId: null,
      isPolling: false,
    }),
}));
