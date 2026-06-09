// ── Raw backend shapes ───────────────────────────────────────────────────────

export interface VocabularyProgress {
  id: string;
  userId: string;
  vocabularyId: string;
  repetitions: number;
  easeFactor: number;
  interval: number;
  correctCount: number;
  nextReview: string; // ISO date string
}

// ── MAIN VOCABULARY WORD ────────────────────────────────────────────────────

export interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;

  // ✅ NEW FIELDS (from Prisma)
  example?: string;
  topic?: string;

  isSaved: boolean;
  progress: VocabularyProgress | null;
}

// ── SAVED WORD ───────────────────────────────────────────────────────────────

export interface SavedWord {
  id: string;
  word: string;
  meaning: string;

  // ✅ NEW FIELDS
  example?: string;
  topic?: string;

  notes: string | null;
  savedAt: string;
  progress: VocabularyProgress | null;
}

// ── DAILY WORDS ──────────────────────────────────────────────────────────────

export interface DailyWords {
  dueReviews: (VocabularyWord & {
    progressId: string;
    isReview: true;
  })[];

  newWords: (VocabularyWord & {
    progressId: null;
    isReview: false;
  })[];
}

// ── STATS ────────────────────────────────────────────────────────────────────

export interface VocabularyStats {
  totalSaved: number;
  totalLearned: number; // correctCount >= 3
  dueCount: number; // nextReview <= now
}

// ── QUIZ ─────────────────────────────────────────────────────────────────────

export interface QuizOption {
  id: string;
  meaning: string;
}

export interface QuizQuestion {
  id: string; // progressId
  word: string;
  correctAnswer: string;
  options: QuizOption[];
}

// ── QUIZ RESULT (FRONTEND ONLY) ─────────────────────────────────────────────

export interface QuizAnswerResult {
  wordId: string;
  correct: boolean;
  correctAnswer: string;
  yourAnswer: string;
}

export interface QuizResult {
  correct: number;
  total: number;
  score: number; // 0-100
  answers: QuizAnswerResult[];
}

// ── SAVE / UNSAVE ───────────────────────────────────────────────────────────

export interface ToggleSaveResult {
  saved: boolean;
}

// ── REVIEW (SM-2) ───────────────────────────────────────────────────────────

export interface SubmitReviewResult {
  repetitions: number;
  easeFactor: number;
  interval: number;
  nextReview: string;
  correctCount: number;
}

// ── MASTERED WORD ───────────────────────────────────────────────────────────

export interface MasteredWord {
  id: string;
  word: string;
  meaning: string;

  // ✅ NEW FIELDS
  example?: string;
  topic?: string;

  correctCount: number;
  repetitions: number;
  nextReview: string;
}

// ── DUE REVIEW WORD ─────────────────────────────────────────────────────────

export interface DueReviewWord {
  id: string;
  word: string;
  meaning: string;

  // ✅ NEW FIELDS
  example?: string;
  topic?: string;

  correctCount: number;
  nextReview: string;
}
