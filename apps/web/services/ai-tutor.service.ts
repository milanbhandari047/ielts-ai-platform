import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse } from "@/types";
import type { AiTutorSession, AiTutorSessionListItem } from "@/types";

export const aiTutorService = {
  // Create a new session
  createSession: (firstMessage: string) =>
    api
      .post<ApiResponse<AiTutorSession>>("/ai-tutor/sessions", {
        message: firstMessage,
      })
      .then((r) => r.data.data),

  // Get all sessions (sidebar list)
  getSessions: (page = 1, limit = 20) =>
    api
      .get<ApiResponse<PaginatedResponse<AiTutorSessionListItem>>>(
        `/ai-tutor/sessions?page=${page}&limit=${limit}`
      )
      .then((r) => r.data.data),

  // Get a single session with all messages
  getSession: (sessionId: string) =>
    api
      .get<ApiResponse<AiTutorSession>>(`/ai-tutor/sessions/${sessionId}`)
      .then((r) => r.data.data),

  // Send a message — returns the full updated session
  sendMessage: (sessionId: string, message: string) =>
    api
      .post<ApiResponse<{ reply: string; sessionId: string }>>(
        `/ai-tutor/sessions/${sessionId}/message`,
        { message }
      )
      .then((r) => r.data.data),

  // Streaming send — returns a ReadableStream
  sendMessageStream: (sessionId: string, message: string): Promise<Response> =>
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ai-tutor/sessions/${sessionId}/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ message }),
      }
    ),

  deleteSession: (sessionId: string) =>
    api.delete(`/ai-tutor/sessions/${sessionId}`).then((r) => r.data),
};
