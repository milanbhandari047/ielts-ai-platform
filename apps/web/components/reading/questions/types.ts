import type { ReadingQuestion } from "@/types";

export interface QuestionProps {
  question: ReadingQuestion;
  globalNum: number;
  answer: string;
  onAnswer: (questionId: string, value: string) => void;
}
