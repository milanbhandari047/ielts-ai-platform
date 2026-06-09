import { create } from "zustand";

import type {
  QuizQuestion,
  QuizResult,
  DueReviewWord,
  SavedWord,
  MasteredWord,
  DailyWords,
  VocabularyStats,
  VocabularyWord,
} from "@/types/vocabulary";
import { vocabularyService } from "@/services/vocabulary.service";

type VocabularyStore = {
  // ================= FLASHCARDS =================
  currentCardIndex: number;
  isFlipped: boolean;
  savedWordIds: Set<string>;

  setCardIndex: (index: number) => void;
  flipCard: () => void;
  nextCard: (total: number) => void;
  prevCard: () => void;
  setSavedWordIds: (ids: string[]) => void;
  toggleSaved: (id: string) => void;

  // ================= QUIZ =================
  quizQuestions: QuizQuestion[];
  quizAnswers: Record<string, string>;
  quizResult: QuizResult | null;

  setQuizQuestions: (questions: QuizQuestion[]) => void;
  setQuizAnswer: (questionId: string, answer: string) => void;
  setQuizResult: (result: QuizResult) => void;
  resetQuiz: () => void;

  // ================= API STATE =================
  dueWords: DueReviewWord[];
  savedWords: SavedWord[];
  masteredWords: MasteredWord[];

  daily: DailyWords | null;
  stats: VocabularyStats | null;

  loadingDue: boolean;
  loadingSaved: boolean;
  loadingMastered: boolean;
  loadingDashboard: boolean;

  // ================= ALL WORDS =================
  allWords: VocabularyWord[];
  loadingAllWords: boolean;

  // ================= FETCH =================
  fetchDashboard: () => Promise<void>;
  fetchDueWords: () => Promise<void>;
  fetchSavedWords: () => Promise<void>;
  fetchMasteredWords: () => Promise<void>;
  fetchAllWords: () => Promise<void>;

  // ================= ACTIONS =================
  reviewWord: (id: string, quality: number) => Promise<void>;
  removeFromSaved: (id: string) => Promise<void>;
  saveWord: (id: string) => Promise<void>;

  syncStatsAndLists: () => Promise<void>;
};

export const useVocabularyStore = create<VocabularyStore>((set, get) => ({
  // ================= FLASHCARDS =================
  currentCardIndex: 0,
  isFlipped: false,
  savedWordIds: new Set(),

  setCardIndex: (i) => set({ currentCardIndex: i, isFlipped: false }),

  flipCard: () => set((s) => ({ isFlipped: !s.isFlipped })),

  nextCard: (t) =>
    set((s) => ({
      currentCardIndex: Math.min(s.currentCardIndex + 1, t - 1),
      isFlipped: false,
    })),

  prevCard: () =>
    set((s) => ({
      currentCardIndex: Math.max(s.currentCardIndex - 1, 0),
      isFlipped: false,
    })),

  setSavedWordIds: (ids) => set({ savedWordIds: new Set(ids) }),

  toggleSaved: (id) =>
    set((s) => {
      const next = new Set(s.savedWordIds);
      next.has(id) ? next.delete(id) : next.add(id);
      return { savedWordIds: next };
    }),

  // ================= QUIZ =================
  quizQuestions: [],
  quizAnswers: {},
  quizResult: null,

  setQuizQuestions: (q) => set({ quizQuestions: q }),

  setQuizAnswer: (id, ans) =>
    set((s) => ({ quizAnswers: { ...s.quizAnswers, [id]: ans } })),

  setQuizResult: (r) => set({ quizResult: r }),

  resetQuiz: () =>
    set({ quizQuestions: [], quizAnswers: {}, quizResult: null }),

  // ================= LOADING STATES =================
  loadingDue: false,
  loadingSaved: false,
  loadingMastered: false,
  loadingDashboard: false,

  // ================= API STATE =================
  dueWords: [],
  savedWords: [],
  masteredWords: [],

  daily: null,
  stats: null,

  // ================= ALL WORDS STATE =================
  allWords: [],
  loadingAllWords: false,

  // ================= FETCH DASHBOARD =================
  fetchDashboard: async () => {
    set({ loadingDashboard: true });
    try {
      const [daily, stats] = await Promise.all([
        vocabularyService.getDailyWords(),
        vocabularyService.getStats(),
      ]);
      set({ daily, stats });
    } catch (err) {
      console.error("fetchDashboard failed:", err);
    } finally {
      set({ loadingDashboard: false });
    }
  },

  // ================= FETCH DUE =================
  fetchDueWords: async () => {
    set({ loadingDue: true });
    try {
      const data = await vocabularyService.getDueReviews();
      set({ dueWords: data });
    } catch (err) {
      console.error("fetchDueWords failed:", err);
    } finally {
      set({ loadingDue: false });
    }
  },

  // ================= FETCH SAVED =================
  fetchSavedWords: async () => {
    set({ loadingSaved: true });
    try {
      const data = await vocabularyService.getSavedWords();
      set({ savedWords: data });
    } catch (err) {
      console.error("fetchSavedWords failed:", err);
    } finally {
      set({ loadingSaved: false });
    }
  },

  // ================= FETCH MASTERED =================
  fetchMasteredWords: async () => {
    set({ loadingMastered: true });
    try {
      const data = await vocabularyService.getMasteredWords();
      set({ masteredWords: data });
    } catch (err) {
      console.error("fetchMasteredWords failed:", err);
    } finally {
      set({ loadingMastered: false });
    }
  },

  // ================= FETCH ALL WORDS =================
  fetchAllWords: async () => {
    set({ loadingAllWords: true });
    try {
      const response = await vocabularyService.getAllWords(1, 500);
      set({ allWords: response.items ?? [] });
    } catch (err) {
      console.error("fetchAllWords failed:", err);
    } finally {
      set({ loadingAllWords: false });
    }
  },

  // ================= REVIEW WORD =================
  reviewWord: async (id, quality) => {
    try {
      await vocabularyService.submitReview(id, quality);
      // Optimistic removal from due list
      set({ dueWords: get().dueWords.filter((w) => w.id !== id) });
      await get().syncStatsAndLists();
    } catch (err) {
      console.error("reviewWord failed:", err);
    }
  },

  // ================= REMOVE SAVED =================
  removeFromSaved: async (id) => {
    // Snapshot both before optimistic update so we can roll back fully on error
    const prevSavedWords = get().savedWords;
    const prevSavedWordIds = new Set(get().savedWordIds);

    // Optimistic update
    const nextIds = new Set(prevSavedWordIds);
    nextIds.delete(id);
    set({
      savedWords: prevSavedWords.filter((w) => w.id !== id),
      savedWordIds: nextIds,
    });

    try {
      await vocabularyService.unsaveWord(id);
      await get().syncStatsAndLists();
    } catch (err) {
      console.error("removeFromSaved failed:", err);
      // Fully restore both savedWords and savedWordIds on failure
      set({ savedWords: prevSavedWords, savedWordIds: prevSavedWordIds });
    }
  },

  // ================= SAVE WORD =================
  saveWord: async (id) => {
    // Snapshot savedWords in case we need to roll back
    const prevSavedWords = get().savedWords;
    const prevSavedWordIds = new Set(get().savedWordIds);

    // Optimistic update
    const nextIds = new Set(prevSavedWordIds);
    nextIds.add(id);
    set({ savedWordIds: nextIds });

    try {
      await vocabularyService.saveWord(id);
      await get().syncStatsAndLists();
    } catch (err) {
      console.error("saveWord failed:", err);
      // Roll back both on failure
      set({ savedWords: prevSavedWords, savedWordIds: prevSavedWordIds });
    }
  },

  // ================= GLOBAL SYNC =================
  syncStatsAndLists: async () => {
    try {
      const [stats, dueWords, savedWords, masteredWords, allWordsRes] =
        await Promise.all([
          vocabularyService.getStats(),
          vocabularyService.getDueReviews(),
          vocabularyService.getSavedWords(),
          vocabularyService.getMasteredWords(),
          vocabularyService.getAllWords(1, 500),
        ]);

      // Also rebuild savedWordIds from the fresh savedWords list
      set({
        stats,
        dueWords,
        savedWords,
        masteredWords,
        allWords: allWordsRes.items ?? [],
        savedWordIds: new Set(savedWords.map((w) => w.id)),
      });
    } catch (err) {
      console.error("sync failed:", err);
    }
  },
}));
