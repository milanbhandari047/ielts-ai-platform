import { useReadingStore } from "@/store/reading.store";

/**
 * Thin wrapper around the reading store's answer state.
 * Centralise here so analytics, auto-save, or validation
 * can be added later without touching individual question components.
 */
export function useQuestionAnswer(questionId: string) {
  const answers = useReadingStore((s) => s.answers);
  const setAnswer = useReadingStore((s) => s.setAnswer);

  const answer = answers[questionId] ?? "";

  function onChange(value: string) {
    setAnswer(questionId, value);
  }

  return { answer, onChange };
}
