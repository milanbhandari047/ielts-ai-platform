// services/teacher.service.ts
import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse } from "@/types";
import type {
  TeacherDashboardStats,
  StudentListItem,
  StudentDetail,
  WritingSubmissionItem,
  ReadingTestItem,
  ScoreOverridePayload,
  CreateReadingTestPayload,
} from "@/types/teacher";

export interface CreateReadingTestPayload {
  title: string;
  type: "ACADEMIC" | "GENERAL";
  passages: Array<{
    title: string;
    content: string;
    questions: Array<{
      questionText: string;
      questionType: string;
      options?: string[];
      correctAnswer: string;
    }>;
  }>;
}

export const teacherService = {
  // ── Dashboard ──────────────────────────────────────────────────
  getDashboard: (): Promise<TeacherDashboardStats> =>
    api
      .get<ApiResponse<TeacherDashboardStats>>("/teacher/dashboard")
      .then((r) => r.data.data),

  // ── Students ───────────────────────────────────────────────────
  getStudents: (params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
  }) =>
    api
      .get<
        ApiResponse<
          PaginatedResponse<StudentListItem> & { students: StudentListItem[] }
        >
      >("/teacher/students", { params })
      .then((r) => r.data.data),

  getStudentDetail: (id: string): Promise<StudentDetail> =>
    api
      .get<ApiResponse<StudentDetail>>(`/teacher/students/${id}`)
      .then((r) => r.data.data),

  // ── Score overrides ────────────────────────────────────────────
  overrideWritingScore: (submissionId: string, payload: ScoreOverridePayload) =>
    api
      .patch<ApiResponse<WritingSubmissionItem>>(
        `/teacher/writing/${submissionId}/score`,
        payload
      )
      .then((r) => r.data.data),

  overrideSpeakingScore: (
    submissionId: string,
    payload: ScoreOverridePayload
  ) =>
    api
      .patch<ApiResponse<any>>(
        `/teacher/speaking/${submissionId}/score`,
        payload
      )
      .then((r) => r.data.data),

  // ── Tests ──────────────────────────────────────────────────────
  getReadingTests: (params?: { page?: number; limit?: number }) =>
    api
      .get<
        ApiResponse<
          PaginatedResponse<ReadingTestItem> & { tests: ReadingTestItem[] }
        >
      >("/teacher/tests/reading", { params })
      .then((r) => r.data.data),

  createReadingTest: (payload: CreateReadingTestPayload) =>
    api
      .post<ApiResponse<any>>("/teacher/tests/reading", payload)
      .then((r) => r.data.data),

  updateTestStatus: (
    testId: string,
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  ) =>
    api
      .patch<ApiResponse<any>>(`/teacher/tests/reading/${testId}`, { status })
      .then((r) => r.data.data),

  deleteTest: (testId: string) =>
    api
      .delete<ApiResponse<any>>(`/teacher/tests/reading/${testId}`)
      .then((r) => r.data),

  // ── Writing review ─────────────────────────────────────────────
  getWritingSubmissions: (params: {
    page?: number;
    limit?: number;
    filter?: "all" | "ungraded" | "graded";
  }) =>
    api
      .get<
        ApiResponse<
          PaginatedResponse<WritingSubmissionItem> & {
            submissions: WritingSubmissionItem[];
          }
        >
      >("/teacher/writing/submissions", { params })
      .then((r) => r.data.data),
};
