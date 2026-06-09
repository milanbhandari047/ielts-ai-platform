import api from "@/lib/axios";
import type {
  ApiResponse,
  PaginatedResponse,
  WritingPrompt,
  WritingSubmitPayload,
  WritingResult,
  WritingSubmissionListItem,
} from "@/types";

export const writingService = {
  getPrompts: (task?: "TASK1" | "TASK2") =>
    api
      .get<ApiResponse<WritingPrompt[]>>(
        `/writing/prompts${task ? `?task=${task}` : ""}`
      )
      .then((r) => r.data.data),

  getPrompt: (promptId: string) =>
    api
      .get<ApiResponse<WritingPrompt>>(`/writing/prompts/${promptId}`)
      .then((r) => r.data.data),

  submit: (payload: WritingSubmitPayload) =>
    api
      .post<ApiResponse<{ submissionId: string; status: string }>>(
        "/writing/submit",
        payload
      )
      .then((r) => r.data.data),

  getResult: (submissionId: string) =>
    api
      .get<ApiResponse<WritingResult>>(`/writing/submissions/${submissionId}`)
      .then((r) => r.data.data),

  getMySubmissions: (page = 1, limit = 10) =>
    api
      .get<ApiResponse<PaginatedResponse<WritingSubmissionListItem>>>(
        `/writing/submissions?page=${page}&limit=${limit}`
      )
      .then((r) => r.data.data),
};
