import api from "@/lib/axios";
import type {
  ApiResponse,
  PaginatedResponse,
  ListeningTest,
  ListeningTestListItem,
  ListeningSubmitPayload,
  ListeningResult,
} from "@/types";

export const listeningService = {
  getTests: (page = 1, limit = 10) =>
    api
      .get<ApiResponse<PaginatedResponse<ListeningTestListItem>>>(
        `/listening/tests?page=${page}&limit=${limit}`
      )
      .then((r) => r.data.data),

  getTest: (testId: string) =>
    api
      .get<ApiResponse<ListeningTest>>(`/listening/tests/${testId}`)
      .then((r) => r.data.data),

  submitTest: (payload: ListeningSubmitPayload) =>
    api
      .post<ApiResponse<ListeningResult>>("/listening/submit", payload)
      .then((r) => r.data.data),

  getResult: (attemptId: string) =>
    api
      .get<ApiResponse<ListeningResult>>(`/listening/attempts/${attemptId}`)
      .then((r) => r.data.data),
};
