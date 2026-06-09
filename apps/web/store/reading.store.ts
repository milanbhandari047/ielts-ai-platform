import { create } from "zustand";
import type { ReadingTest, ReadingResult } from "@/types";

interface ReadingState {
  currentTest: ReadingTest | null;
  answers: Record<string, string>;
  timeLeft: number;
  isSubmitting: boolean;
  result: ReadingResult | null;

  setTest: (test: ReadingTest) => void;
  setAnswer: (questionId: string, answer: string) => void;
  setTimeLeft: (seconds: number) => void;
  setSubmitting: (v: boolean) => void;
  setResult: (result: ReadingResult) => void;
  reset: () => void;
}

export const useReadingStore = create<ReadingState>((set) => ({
  currentTest: null,
  answers: {},
  timeLeft: 60 * 60, // 60 minutes
  isSubmitting: false,
  result: null,

  setTest: (test) => set({ currentTest: test, answers: {}, result: null }),
  setAnswer: (questionId, answer) =>
    set((s) => ({ answers: { ...s.answers, [questionId]: answer } })),
  setTimeLeft: (timeLeft) => set({ timeLeft }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setResult: (result) => set({ result }),
  reset: () =>
    set({
      currentTest: null,
      answers: {},
      timeLeft: 60 * 60,
      isSubmitting: false,
      result: null,
    }),
}));
