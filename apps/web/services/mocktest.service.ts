import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse } from "@/types";
import type {
  MockTestListItem,
  MockTestSession,
  MockTestResult,
  EnhancedAnalytics,
} from "@/types";

// ─── Mock Test ────────────────────────────────────────────────────────────────
export const mockTestService = {
  getTests: () =>
    api
      .get<ApiResponse<MockTestListItem[]>>("/mock-test/tests")
      .then((r) => r.data.data),

  startSession: (mockTestId: string) =>
    api
      .post<ApiResponse<MockTestSession>>("/mock-test/sessions", { mockTestId })
      .then((r) => r.data.data),

  getSession: (sessionId: string) =>
    api
      .get<ApiResponse<MockTestSession>>(`/mock-test/sessions/${sessionId}`)
      .then((r) => r.data.data),

  submitSection: (
    sessionId: string,
    section: string,
    payload: Record<string, unknown>
  ) =>
    api
      .post<ApiResponse<{ nextSection: string | null }>>(
        `/mock-test/sessions/${sessionId}/submit-section`,
        { section, ...payload }
      )
      .then((r) => r.data.data),

  completeSession: (sessionId: string) =>
    api
      .post<ApiResponse<MockTestResult>>(
        `/mock-test/sessions/${sessionId}/complete`
      )
      .then((r) => r.data.data),

  getResult: (sessionId: string) =>
    api
      .get<ApiResponse<MockTestResult>>(
        `/mock-test/sessions/${sessionId}/result`
      )
      .then((r) => r.data.data),

  getMyResults: (page = 1) =>
    api
      .get<ApiResponse<PaginatedResponse<MockTestResult>>>(
        `/mock-test/sessions?page=${page}&status=COMPLETED`
      )
      .then((r) => r.data.data),
};

// ─── Enhanced Analytics ───────────────────────────────────────────────────────
export const analyticsService = {
  getEnhanced: () =>
    api
      .get<ApiResponse<EnhancedAnalytics>>("/analytics/enhanced")
      .then((r) => r.data.data),
};
