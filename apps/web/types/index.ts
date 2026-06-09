// ─── Auth ────────────────────────────────────────────────────────────────────
export type Role = "STUDENT" | "TEACHER" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  avatar: string | null;
  targetBand: number | null;
  streak: number;
  createdAt: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ─── Dashboard / Analytics ───────────────────────────────────────────────────

export interface DashboardSummary {
  readingBand: number | null;
  listeningBand: number | null;
  writingBand: number | null;
  speakingBand: number | null;
  overallBand: number | null;
  streak: number;
  totalTests: number;
  recentActivity: RecentActivity[];
  bandHistory: BandHistoryPoint[];
  studyGoal: StudyGoal | null;
  weakSkills: WeakSkill[];
}

export interface RecentActivity {
  id: string;
  type: "READING" | "LISTENING" | "WRITING" | "SPEAKING" | "MOCK_TEST";
  title: string;
  band: number | null;
  score: number | null;
  completedAt: string;
}

export interface BandHistoryPoint {
  date: string;
  overall: number | null;
  source: string | null;
}

export interface StudyGoal {
  id: string;
  targetBand: number;
  targetDate: string;
  dailyMinutes: number;
}

export interface WeakSkill {
  skill: "READING" | "LISTENING" | "WRITING" | "SPEAKING";
  band: number | null;
  label: 5;
}

// ─── Reading ─────────────────────────────────────────────────────────────────

export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE_NOT_GIVEN"
  | "FILL_IN_THE_BLANK"
  | "MATCH_HEADINGS"
  | "MATCH_INFORMATION"
  | "SHORT_ANSWER"
  | "SENTENCE_COMPLETION"
  | "SUMMARY_COMPLETION"
  | "DIAGRAM_LABELLING"
  | "NOTE_COMPLETION";

export interface ReadingQuestion {
  id: string;
  questionText: string;
  questionType: QuestionType;
  options: string[] | null;
  correctAnswer?: string; // only returned after submission
}

export interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  questions: ReadingQuestion[];
}

export interface ReadingTest {
  id: string;
  title: string;
  type: "ACADEMIC" | "GENERAL";
  passages: ReadingPassage[];
}

export interface ReadingTestListItem {
  id: string;
  title: string;
  type: "ACADEMIC" | "GENERAL";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  passageCount: number;
  questionCount: number;
}

export interface ReadingSubmitPayload {
  testId: string;
  answers: Record<string, string>; // { [questionId]: answer }
  timeTaken: number; // seconds
}

export interface ReadingResult {
  attemptId: string;
  score: number;
  total: number;
  band: number;
  timeTaken: number;
  correctAnswers: Record<string, { correct: boolean; correctAnswer: string }>;
}

// ─── Listening ────────────────────────────────────────────────────────────────

export interface ListeningQuestion {
  id: string;
  questionText: string;
  correctAnswer?: string;
}

export interface ListeningSection {
  id: string;
  audioUrl: string;
  questions: ListeningQuestion[];
}

export interface ListeningTest {
  id: string;
  title: string;
  sections: ListeningSection[];
}

export interface ListeningTestListItem {
  id: string;
  title: string;
  sectionCount: number;
  questionCount: number;
}

export interface ListeningSubmitPayload {
  testId: string;
  answers: Record<string, string>;
  timeTaken: number;
}

export interface ListeningResult {
  attemptId: string;
  score: number;
  total: number;
  band: number;
  timeTaken: number;
  correctAnswers: Record<string, { correct: boolean; correctAnswer: string }>;
}

// ─── Writing ──────────────────────────────────────────────────────────────────

export type WritingTask = "TASK1" | "TASK2";

export interface WritingPrompt {
  id: string;
  task: WritingTask;
  title: string;
  instruction: string;
  imageUrl?: string; // for Task 1 graph/chart
}

export interface WritingSubmitPayload {
  promptId: string;
  essay: string;
  wordCount: number;
}

export type CriteriaKey = "taskResponse" | "coherence" | "lexical" | "grammar";

export interface WritingFeedback {
  criterion: CriteriaKey;
  score: number;
  comment: string;
  suggestions: string[];
}

export interface WritingResult {
  submissionId: string;
  overallBand: number;
  taskResponse: number;
  coherence: number;
  lexical: number;
  grammar: number;
  wordCount: number;
  feedback: WritingFeedback[];
  improvedVersion?: string;
}

export interface WritingSubmissionListItem {
  id: string;
  promptTitle: string;
  task: WritingTask;
  overallBand: number | null;
  wordCount: number;
  createdAt: string;
  status: "PENDING" | "EVALUATED";
}

// ─── Speaking ─────────────────────────────────────────────────────────────────

export type SpeakingPart = "PART1" | "PART2" | "PART3";

export interface SpeakingCueCard {
  id: string;
  part: SpeakingPart;
  topic: string;
  instruction: string;
}

export interface SpeakingSubmitPayload {
  cueCardId: string;
  audioBlob: Blob;
}

export interface SpeakingResult {
  submissionId: string;
  transcript: string;
  fluency: number;
  pronunciation: number;
  grammar: number;
  vocabulary: number;
  overallBand: number;
  feedback: {
    fluency: string;
    pronunciation: string;
    grammar: string;
    vocabulary: string;
  };
  suggestions: string[];
}

export interface SpeakingSubmissionListItem {
  id: string;
  topic: string;
  part: SpeakingPart;
  overallBand: number | null;
  createdAt: string;
  status: "PENDING" | "EVALUATED";
}

// ─── API Response wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── AI Tutor ─────────────────────────────────────────────────────────────────

export interface AiTutorMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface AiTutorSession {
  id: string;
  title: string | null;
  messages: AiTutorMessage[];
  createdAt: string;
}

export interface AiTutorSessionListItem {
  id: string;
  title: string | null;
  lastMessage: string | null;
  createdAt: string;
}

// ─── Vocabulary ────────────────────────────────────────────────────────────────

export interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;
  example?: string;
  synonyms?: string[];
  difficulty?: "EASY" | "MEDIUM" | "HARD";
}

export interface VocabularyProgress {
  vocabularyId: string;
  word: string;
  meaning: string;
  correctCount: number;
  nextReview: string | null; // ISO date
  isSaved: boolean;
}

export interface DailyWords {
  words: VocabularyWord[];
  date: string;
  completed: number;
  total: number;
}

export interface QuizQuestion {
  id: string;
  word: string;
  options: string[]; // 4 options
  correctAnswer: string;
}

export interface QuizResult {
  total: number;
  correct: number;
  score: number; // percentage
  answers: { wordId: string; correct: boolean; correctAnswer: string }[];
}

// ─── Mock Test ────────────────────────────────────────────────────────────────

export interface MockTestListItem {
  id: string;
  title: string;
  readingTestId: string | null;
  listeningTestId: string | null;
  hasWriting: boolean;
  hasSpeaking: boolean;
}

export interface MockTestSession {
  id: string;
  mockTestId: string;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  currentSection: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
  timeLeft: number; // seconds remaining for current section
  readingScore: number | null;
  listeningScore: number | null;
  writingScore: number | null;
  speakingScore: number | null;
  overallBand: number | null;
}

export interface MockTestResult {
  sessionId: string;
  overallBand: number;
  readingBand: number | null;
  listeningBand: number | null;
  writingBand: number | null;
  speakingBand: number | null;
  timeTaken: number;
  completedAt: string;
  sectionBreakdown: {
    section: string;
    band: number | null;
    score: number | null;
    total: number | null;
  }[];
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  setNotifications: (n: AppNotification[]) => void;
  addNotification: (n: AppNotification) => void;
  setUnreadCount: (c: number) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string | null;
  weeklyScore: number;
  overallBand: number | null;
  isCurrentUser: boolean;
}

// ─── Community ────────────────────────────────────────────────────────────────

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: { id: string; name: string; avatar: string | null };
  commentCount: number;
  createdAt: string;
}

export interface CommunityComment {
  id: string;
  content: string;
  author: { id: string; name: string; avatar: string | null };
  createdAt: string;
}

// ─── Enhanced Analytics ───────────────────────────────────────────────────────

export interface SkillRadarData {
  skill: string;
  band: number;
  fullMark: number;
}

export interface TimeSpentData {
  date: string;
  reading: number;
  listening: number;
  writing: number;
  speaking: number;
}

export interface WeaknessHeatmapCell {
  skill: string;
  category: string;
  errorRate: number; // 0–1
}

export interface EnhancedAnalytics {
  radarData: SkillRadarData[];
  bandProgression: { date: string; band: number; source: string }[];
  timeSpent: TimeSpentData[];
  totalPracticeHours: number;
  testsTaken: number;
  averageBand: number | null;
  improvementRate: number | null; // % change from first to latest band
}
export interface Author {
  id: string;
  name: string;
  avatar: string | null;
}

export interface PostItem {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  author: Author;
  isOwn: boolean;
  commentCount: number;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  content: string;
  author: Author;
  isOwn: boolean;
  createdAt: string;
}

export interface PostDetail extends PostItem {
  comments: CommentItem[];
}

export interface MyComment extends CommentItem {
  post: {
    id: string;
    title: string;
  };
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
export interface Author {
  id: string;
  name: string;
  avatar: string | null;
}

export interface PostItem {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  author: Author;
  isOwn: boolean;
  commentCount: number;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  content: string;
  author: Author;
  isOwn: boolean;
  createdAt: string;
}

export interface PostDetail extends PostItem {
  comments: CommentItem[];
}

export interface MyComment extends CommentItem {
  post: {
    id: string;
    title: string;
  };
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Author {
  id: string;
  name: string;
  avatar: string | null;
}

export interface PostItem {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  author: Author;
  isOwn: boolean;
  commentCount: number;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  content: string;
  author: Author;
  isOwn: boolean;
  createdAt: string;
}

export interface PostDetail extends PostItem {
  comments: CommentItem[];
}

export interface MyComment extends CommentItem {
  post: { id: string; title: string };
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export type View = "list" | "detail" | "create" | "edit";
export type ProfileTab = "posts" | "bookmarks" | "comments";
