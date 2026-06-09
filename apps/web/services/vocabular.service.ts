import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse } from "@/types";
import type {
  VocabularyWord,
  VocabularyProgress,
  DailyWords,
  QuizQuestion,
  QuizResult,
} from "@/types";

export const vocabularyService = {
  // ── Daily Words ─────────────────────────────
  getDailyWords: () =>
    api
      .get<ApiResponse<DailyWords>>("/vocabulary/daily")
      .then((r) => r.data.data),

  // ── All Words ────────────────────────────────
  getAllWords: (page = 1, limit = 20, difficulty?: string) =>
    api
      .get<ApiResponse<PaginatedResponse<VocabularyWord>>>(
        `/vocabulary/words?page=${page}&limit=${limit}${
          difficulty ? `&difficulty=${difficulty}` : ""
        }`
      )
      .then((r) => r.data.data),

  // ── Progress / Stats (backend = /stats) ─────
  getMyProgress: (page = 1, limit = 20) =>
    api
      .get<ApiResponse<PaginatedResponse<VocabularyProgress>>>(
        `/vocabulary/stats?page=${page}&limit=${limit}`
      )
      .then((r) => r.data.data),

  // ── Saved Words ──────────────────────────────
  getSavedWords: () =>
    api
      .get<ApiResponse<VocabularyWord[]>>("/vocabulary/saved")
      .then((r) => r.data.data),

  saveWord: (vocabularyId: string) =>
    api
      .post<ApiResponse<any>>("/vocabulary/saved", { vocabularyId })
      .then((r) => r.data),

  unsaveWord: (vocabularyId: string) =>
    api
      .delete<ApiResponse<any>>(`/vocabulary/saved/${vocabularyId}`)
      .then((r) => r.data),

  // ── Quiz ─────────────────────────────────────
  getQuizQuestions: (count = 10) =>
    api
      .get<ApiResponse<QuizQuestion[]>>(`/vocabulary/quiz?count=${count}`)
      .then((r) => r.data.data),

  submitQuiz: (answers: { vocabularyId: string; answer: string }[]) =>
    api
      .post<ApiResponse<QuizResult>>("/vocabulary/quiz/submit", {
        answers,
      })
      .then((r) => r.data.data),

  // ── Review (FIXED ENDPOINT) ──────────────────
  markReviewed: (vocabularyId: string, correct: boolean) =>
    api
      .post<ApiResponse<any>>("/vocabulary/review", {
        vocabularyId,
        correct,
      })
      .then((r) => r.data),
};
