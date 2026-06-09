import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse } from "@/types";
import type {
  VocabularyWord,
  VocabularyStats,
  DailyWords,
  QuizQuestion,
  ToggleSaveResult,
  SubmitReviewResult,
  SavedWord,
  MasteredWord,
  DueReviewWord,
} from "@/types/vocabulary";

// -----------------------------
// Helper
// -----------------------------
const unwrap = <T>(res: { data: ApiResponse<T> }): T => res.data.data;

export const vocabularyService = {
  // =========================================================
  // DAILY WORDS (includes example + topic now)
  // =========================================================
  getDailyWords: async (): Promise<DailyWords> => {
    return unwrap(await api.get("/vocabulary/daily"));
  },

  // =========================================================
  // ALL WORDS (UPDATED SCHEMA SUPPORT)
  // =========================================================
  getAllWords: async (
    page = 1,
    limit = 20,
    search?: string,
    topic?: string
  ): Promise<PaginatedResponse<VocabularyWord>> => {
    const query =
      `/vocabulary/words?page=${page}&limit=${limit}` +
      (search ? `&search=${encodeURIComponent(search)}` : "") +
      (topic ? `&topic=${encodeURIComponent(topic)}` : "");

    return unwrap(await api.get(query));
  },

  // =========================================================
  // STATS
  // =========================================================
  getStats: async (): Promise<VocabularyStats> => {
    return unwrap(await api.get("/vocabulary/stats"));
  },

  // =========================================================
  // SAVED WORDS
  // =========================================================
  getSavedWords: async (): Promise<SavedWord[]> => {
    return unwrap(await api.get("/vocabulary/saved"));
  },

  saveWord: async (vocabularyId: string): Promise<ToggleSaveResult> => {
    return unwrap(await api.post("/vocabulary/saved", { vocabularyId }));
  },

  unsaveWord: async (vocabularyId: string): Promise<ToggleSaveResult> => {
    return unwrap(await api.delete(`/vocabulary/saved/${vocabularyId}`));
  },

  // =========================================================
  // QUIZ
  // =========================================================
  getQuizQuestions: async (count = 10): Promise<QuizQuestion[]> => {
    return unwrap(await api.get(`/vocabulary/quiz?count=${count}`));
  },

  submitQuiz: async (
    answers: { vocabularyId: string; answer: string }[]
  ): Promise<{ answers: { vocabularyId: string; answer: string }[] }> => {
    return unwrap(await api.post("/vocabulary/quiz/submit", { answers }));
  },

  // =========================================================
  // REVIEW (SM-2 SYSTEM)
  // =========================================================
  submitReview: async (
    vocabularyId: string,
    quality: number
  ): Promise<SubmitReviewResult> => {
    return unwrap(
      await api.post("/vocabulary/review", {
        vocabularyId,
        quality,
      })
    );
  },

  // =========================================================
  // MASTERED WORDS
  // =========================================================
  getMasteredWords: async (): Promise<MasteredWord[]> => {
    return unwrap(await api.get("/vocabulary/mastered"));
  },

  // =========================================================
  // DUE REVIEWS
  // =========================================================
  getDueReviews: async (): Promise<DueReviewWord[]> => {
    return unwrap(await api.get("/vocabulary/reviews"));
  },
};
