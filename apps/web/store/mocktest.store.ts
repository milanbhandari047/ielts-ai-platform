import { QuizQuestion, QuizResult, AppNotification } from "@/types";
import { create } from "zustand";

// ─── Vocabulary Store ─────────────────────────────────────────────────────────
interface VocabularyState {
  currentCardIndex: number;
  isFlipped: boolean;
  quizQuestions: QuizQuestion[];
  quizAnswers: Record<string, string>; // { [vocabularyId]: selectedAnswer }
  quizResult: QuizResult | null;
  savedWordIds: Set<string>;

  setCardIndex: (i: number) => void;
  nextCard: (total: number) => void;
  prevCard: () => void;
  flipCard: () => void;
  resetFlip: () => void;
  setQuizQuestions: (qs: QuizQuestion[]) => void;
  setQuizAnswer: (vocabId: string, answer: string) => void;
  setQuizResult: (result: QuizResult) => void;
  setSavedWordIds: (ids: string[]) => void;
  toggleSaved: (id: string) => void;
  resetQuiz: () => void;
}

export const useVocabularyStore = create<VocabularyState>((set) => ({
  currentCardIndex: 0,
  isFlipped: false,
  quizQuestions: [],
  quizAnswers: {},
  quizResult: null,
  savedWordIds: new Set(),

  setCardIndex: (i) => set({ currentCardIndex: i, isFlipped: false }),
  nextCard: (total) =>
    set((s) => ({
      currentCardIndex: Math.min(s.currentCardIndex + 1, total - 1),
      isFlipped: false,
    })),
  prevCard: () =>
    set((s) => ({
      currentCardIndex: Math.max(s.currentCardIndex - 1, 0),
      isFlipped: false,
    })),
  flipCard: () => set((s) => ({ isFlipped: !s.isFlipped })),
  resetFlip: () => set({ isFlipped: false }),
  setQuizQuestions: (quizQuestions) =>
    set({ quizQuestions, quizAnswers: {}, quizResult: null }),
  setQuizAnswer: (vocabId, answer) =>
    set((s) => ({ quizAnswers: { ...s.quizAnswers, [vocabId]: answer } })),
  setQuizResult: (quizResult) => set({ quizResult }),
  setSavedWordIds: (ids) => set({ savedWordIds: new Set(ids) }),
  toggleSaved: (id) =>
    set((s) => {
      const next = new Set(s.savedWordIds);
      next.has(id) ? next.delete(id) : next.add(id);
      return { savedWordIds: next };
    }),
  resetQuiz: () =>
    set({ quizQuestions: [], quizAnswers: {}, quizResult: null }),
}));

// ─── Mock Test Store ──────────────────────────────────────────────────────────
type MockSection = "LISTENING" | "READING" | "WRITING" | "SPEAKING";

interface MockTestState {
  sessionId: string | null;
  currentSection: MockSection;
  sectionOrder: MockSection[];
  timeLeft: number;
  isSubmitting: boolean;
  answers: Record<string, string>;
  essay: string;
  audioBlob: Blob | null;

  setSessionId: (id: string) => void;
  setSection: (section: MockSection) => void;
  setTimeLeft: (s: number) => void;
  setSubmitting: (v: boolean) => void;
  setAnswer: (qId: string, ans: string) => void;
  setEssay: (essay: string) => void;
  setAudioBlob: (blob: Blob | null) => void;
  reset: () => void;
}

const SECTION_ORDER: MockSection[] = [
  "LISTENING",
  "READING",
  "WRITING",
  "SPEAKING",
];
const SECTION_TIME: Record<MockSection, number> = {
  LISTENING: 40 * 60,
  READING: 60 * 60,
  WRITING: 60 * 60,
  SPEAKING: 15 * 60,
};

export const useMockTestStore = create<MockTestState>((set) => ({
  sessionId: null,
  currentSection: "LISTENING",
  sectionOrder: SECTION_ORDER,
  timeLeft: SECTION_TIME["LISTENING"],
  isSubmitting: false,
  answers: {},
  essay: "",
  audioBlob: null,

  setSessionId: (sessionId) => set({ sessionId }),
  setSection: (section) =>
    set({
      currentSection: section,
      timeLeft: SECTION_TIME[section],
      answers: {},
    }),
  setTimeLeft: (timeLeft) => set({ timeLeft }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setAnswer: (qId, ans) =>
    set((s) => ({ answers: { ...s.answers, [qId]: ans } })),
  setEssay: (essay) => set({ essay }),
  setAudioBlob: (audioBlob) => set({ audioBlob }),
  reset: () =>
    set({
      sessionId: null,
      currentSection: "LISTENING",
      timeLeft: SECTION_TIME["LISTENING"],
      isSubmitting: false,
      answers: {},
      essay: "",
      audioBlob: null,
    }),
}));

// ─── Notification Store ───────────────────────────────────────────────────────
interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;

  setNotifications: (n: AppNotification[]) => void;
  addNotification: (n: AppNotification) => void;

  setUnreadCount: (c: number) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => set({ notifications }),
  addNotification: (n) =>
    set((s) => ({
      notifications: [n, ...s.notifications],
      unreadCount: s.unreadCount + (n.isRead ? 0 : 1),
    })),
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
}));
