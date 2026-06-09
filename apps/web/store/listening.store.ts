import { create } from "zustand";
import type { ListeningTest, ListeningResult } from "@/types";

interface ListeningState {
  currentTest: ListeningTest | null;
  currentSectionIndex: number;
  answers: Record<string, string>;
  timeLeft: number;
  isSubmitting: boolean;
  result: ListeningResult | null;
  audioCompleted: boolean[];

  setTest: (test: ListeningTest) => void;
  setSection: (index: number) => void;
  setAnswer: (questionId: string, answer: string) => void;
  setTimeLeft: (seconds: number) => void;
  setSubmitting: (v: boolean) => void;
  setResult: (result: ListeningResult) => void;
  markAudioCompleted: (sectionIndex: number) => void;
  reset: () => void;
}

export const useListeningStore = create<ListeningState>((set) => ({
  currentTest: null,
  currentSectionIndex: 0,
  answers: {},
  timeLeft: 40 * 60, // 40 minutes
  isSubmitting: false,
  result: null,
  audioCompleted: [],

  setTest: (test) =>
    set({
      currentTest: test,
      answers: {},
      result: null,
      currentSectionIndex: 0,
      audioCompleted: new Array(test.sections.length).fill(false),
    }),
  setSection: (currentSectionIndex) => set({ currentSectionIndex }),
  setAnswer: (questionId, answer) =>
    set((s) => ({ answers: { ...s.answers, [questionId]: answer } })),
  setTimeLeft: (timeLeft) => set({ timeLeft }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setResult: (result) => set({ result }),
  markAudioCompleted: (sectionIndex) =>
    set((s) => {
      const audioCompleted = [...s.audioCompleted];
      audioCompleted[sectionIndex] = true;
      return { audioCompleted };
    }),
  reset: () =>
    set({
      currentTest: null,
      currentSectionIndex: 0,
      answers: {},
      timeLeft: 40 * 60,
      isSubmitting: false,
      result: null,
      audioCompleted: [],
    }),
}));
