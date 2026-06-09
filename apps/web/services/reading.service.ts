import api from "@/lib/axios";
import type {
  ApiResponse,
  PaginatedResponse,
  ReadingTest,
  ReadingTestListItem,
  ReadingSubmitPayload,
  ReadingResult,
} from "@/types";

export const readingService = {
  getTests: (page = 1, limit = 10) =>
    api
      .get<ApiResponse<PaginatedResponse<ReadingTestListItem>>>(
        `/reading/tests?page=${page}&limit=${limit}`
      )
      .then((r) => r.data.data),

  getTest: (testId: string) =>
    api
      .get<ApiResponse<ReadingTest>>(`/reading/tests/${testId}`)
      .then((r) => r.data.data),

  submitTest: (payload: ReadingSubmitPayload) =>
    api
      .post<ApiResponse<ReadingResult>>("/reading/submit", payload)
      .then((r) => r.data.data),

  getResult: (attemptId: string) =>
    api
      .get<ApiResponse<ReadingResult>>(`/reading/attempts/${attemptId}`)
      .then((r) => r.data.data),

  getMyAttempts: (page = 1, limit = 10) =>
    api
      .get<ApiResponse<PaginatedResponse<ReadingTestListItem>>>(
        `/reading/attempts?page=${page}&limit=${limit}`
      )
      .then((r) => r.data.data),
};
