// store/teacher.store.ts
import { create } from "zustand";
import { teacherService } from "@/services/teacher.service";
import type {
  TeacherDashboardStats,
  StudentListItem,
  StudentDetail,
  WritingSubmissionItem,
  ReadingTestItem,
  ScoreOverridePayload,
  TeacherView,
} from "@/types/teacher";
import type { CreateReadingTestPayload } from "@/services/teacher.service";

interface TeacherState {
  // View
  currentView: TeacherView;
  selectedStudentId: string | null;

  // Dashboard
  dashboardStats: TeacherDashboardStats | null;
  dashboardLoading: boolean;

  // Students
  students: StudentListItem[];
  studentsTotal: number;
  studentsTotalPages: number;
  studentsPage: number;
  studentsSearch: string;
  studentsSortBy: string;
  studentsLoading: boolean;

  // Student detail
  studentDetail: StudentDetail | null;
  studentDetailLoading: boolean;

  // Writing review
  writingSubmissions: WritingSubmissionItem[];
  writingTotal: number;
  writingTotalPages: number;
  writingPage: number;
  writingFilter: "all" | "ungraded" | "graded";
  writingLoading: boolean;

  // Tests
  tests: ReadingTestItem[];
  testsTotal: number;
  testsTotalPages: number;
  testsPage: number;
  testsLoading: boolean;

  // Global error
  error: string | null;

  // Actions — navigation
  setView: (view: TeacherView, studentId?: string) => void;

  // Actions — data
  fetchDashboard: () => Promise<void>;
  fetchStudents: (
    page?: number,
    search?: string,
    sortBy?: string
  ) => Promise<void>;
  fetchStudentDetail: (id: string) => Promise<void>;
  fetchWritingSubmissions: (
    page?: number,
    filter?: "all" | "ungraded" | "graded"
  ) => Promise<void>;
  fetchTests: (page?: number) => Promise<void>;
  overrideWritingScore: (
    submissionId: string,
    payload: ScoreOverridePayload
  ) => Promise<void>;
  overrideSpeakingScore: (
    submissionId: string,
    payload: ScoreOverridePayload
  ) => Promise<void>;
  createReadingTest: (payload: CreateReadingTestPayload) => Promise<void>;
  updateTestStatus: (
    testId: string,
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  ) => Promise<void>;
  deleteTest: (testId: string) => Promise<void>;
  clearError: () => void;
}

export const useTeacherStore = create<TeacherState>((set, get) => ({
  currentView: "dashboard",
  selectedStudentId: null,

  dashboardStats: null,
  dashboardLoading: false,

  students: [],
  studentsTotal: 0,
  studentsTotalPages: 1,
  studentsPage: 1,
  studentsSearch: "",
  studentsSortBy: "name",
  studentsLoading: false,

  studentDetail: null,
  studentDetailLoading: false,

  writingSubmissions: [],
  writingTotal: 0,
  writingTotalPages: 1,
  writingPage: 1,
  writingFilter: "all",
  writingLoading: false,

  tests: [],
  testsTotal: 0,
  testsTotalPages: 1,
  testsPage: 1,
  testsLoading: false,

  error: null,

  // ── Navigation ─────────────────────────────────────────────────

  setView: (view, studentId) => {
    set({
      currentView: view,
      selectedStudentId: studentId ?? null,
      error: null,
    });

    // Auto-fetch data when switching views
    const state = get();
    if (view === "dashboard" && !state.dashboardStats) state.fetchDashboard();
    if (view === "students" && state.students.length === 0)
      state.fetchStudents();
    if (view === "writing-review" && state.writingSubmissions.length === 0)
      state.fetchWritingSubmissions();
    if (view === "tests" && state.tests.length === 0) state.fetchTests();
    if (view === "student-detail" && studentId)
      state.fetchStudentDetail(studentId);
  },

  // ── Dashboard ──────────────────────────────────────────────────

  fetchDashboard: async () => {
    set({ dashboardLoading: true, error: null });
    try {
      const data = await teacherService.getDashboard();
      set({ dashboardStats: data, dashboardLoading: false });
    } catch (e: any) {
      set({
        dashboardLoading: false,
        error: e?.response?.data?.message ?? e.message,
      });
    }
  },

  // ── Students ───────────────────────────────────────────────────

  fetchStudents: async (page, search, sortBy) => {
    const state = get();
    const p = page ?? state.studentsPage;
    const s = search ?? state.studentsSearch;
    const sb = sortBy ?? state.studentsSortBy;

    set({
      studentsLoading: true,
      studentsPage: p,
      studentsSearch: s,
      studentsSortBy: sb,
      error: null,
    });
    try {
      const res = await teacherService.getStudents({
        page: p,
        limit: 15,
        search: s || undefined,
        sortBy: sb,
      });
      set({
        students: res.students,
        studentsTotal: res.total,
        studentsTotalPages: res.totalPages,
        studentsLoading: false,
      });
    } catch (e: any) {
      set({
        studentsLoading: false,
        error: e?.response?.data?.message ?? e.message,
      });
    }
  },

  fetchStudentDetail: async (id) => {
    set({ studentDetailLoading: true, error: null });
    try {
      const data = await teacherService.getStudentDetail(id);
      set({ studentDetail: data, studentDetailLoading: false });
    } catch (e: any) {
      set({
        studentDetailLoading: false,
        error: e?.response?.data?.message ?? e.message,
      });
    }
  },

  // ── Writing review ─────────────────────────────────────────────

  fetchWritingSubmissions: async (page, filter) => {
    const state = get();
    const p = page ?? state.writingPage;
    const f = filter ?? state.writingFilter;

    set({
      writingLoading: true,
      writingPage: p,
      writingFilter: f,
      error: null,
    });
    try {
      const res = await teacherService.getWritingSubmissions({
        page: p,
        limit: 15,
        filter: f,
      });
      set({
        writingSubmissions: res.submissions,
        writingTotal: res.total,
        writingTotalPages: res.totalPages,
        writingLoading: false,
      });
    } catch (e: any) {
      set({
        writingLoading: false,
        error: e?.response?.data?.message ?? e.message,
      });
    }
  },

  // ── Tests ──────────────────────────────────────────────────────

  fetchTests: async (page) => {
    const p = page ?? get().testsPage;
    set({ testsLoading: true, testsPage: p, error: null });
    try {
      const res = await teacherService.getReadingTests({ page: p, limit: 10 });
      set({
        tests: res.tests,
        testsTotal: res.total,
        testsTotalPages: res.totalPages,
        testsLoading: false,
      });
    } catch (e: any) {
      set({
        testsLoading: false,
        error: e?.response?.data?.message ?? e.message,
      });
    }
  },

  // ── Score overrides ────────────────────────────────────────────

  overrideWritingScore: async (submissionId, payload) => {
    try {
      const updated = await teacherService.overrideWritingScore(
        submissionId,
        payload
      );
      // Update local state
      set((s) => ({
        writingSubmissions: s.writingSubmissions.map((w) =>
          w.id === submissionId ? { ...w, ...updated } : w
        ),
        studentDetail: s.studentDetail
          ? {
              ...s.studentDetail,
              writingSubmissions: s.studentDetail.writingSubmissions.map((w) =>
                w.id === submissionId ? { ...w, ...updated } : w
              ),
            }
          : null,
      }));
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? e.message });
      throw e;
    }
  },

  overrideSpeakingScore: async (submissionId, payload) => {
    try {
      const updated = await teacherService.overrideSpeakingScore(
        submissionId,
        payload
      );
      set((s) => ({
        studentDetail: s.studentDetail
          ? {
              ...s.studentDetail,
              speakingSubmissions: s.studentDetail.speakingSubmissions.map(
                (sp) => (sp.id === submissionId ? { ...sp, ...updated } : sp)
              ),
            }
          : null,
      }));
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? e.message });
      throw e;
    }
  },

  createReadingTest: async (payload) => {
    try {
      await teacherService.createReadingTest(payload);
      await get().fetchTests(1);
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? e.message });
      throw e;
    }
  },

  updateTestStatus: async (testId, status) => {
    try {
      await teacherService.updateTestStatus(testId, status);
      set((s) => ({
        tests: s.tests.map((t) => (t.id === testId ? { ...t, status } : t)),
      }));
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? e.message });
      throw e;
    }
  },

  deleteTest: async (testId) => {
    try {
      await teacherService.deleteTest(testId);
      set((s) => ({ tests: s.tests.filter((t) => t.id !== testId) }));
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? e.message });
      throw e;
    }
  },

  clearError: () => set({ error: null }),
}));
