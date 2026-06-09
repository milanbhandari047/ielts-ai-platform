import api from "@/lib/axios";
import type {
  ApiResponse,
  PaginatedResponse,
  SpeakingCueCard,
  SpeakingResult,
  SpeakingSubmissionListItem,
} from "@/types";

export const speakingService = {
  getCueCards: (part?: "PART1" | "PART2" | "PART3") =>
    api
      .get<ApiResponse<SpeakingCueCard[]>>(
        `/speaking/cue-cards${part ? `?part=${part}` : ""}`
      )
      .then((r) => r.data.data),

  getCueCard: (cueCardId: string) =>
    api
      .get<ApiResponse<SpeakingCueCard>>(`/speaking/cue-cards/${cueCardId}`)
      .then((r) => r.data.data),

  // Multipart upload — audio file + metadata
  submit: (cueCardId: string, audioBlob: Blob) => {
    const form = new FormData();
    form.append("cueCardId", cueCardId);
    form.append("audio", audioBlob, "recording.webm");
    return api
      .post<ApiResponse<{ submissionId: string; status: string }>>(
        "/speaking/submit",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((r) => r.data.data);
  },

  getResult: (submissionId: string) =>
    api
      .get<ApiResponse<SpeakingResult>>(`/speaking/submissions/${submissionId}`)
      .then((r) => r.data.data),

  getMySubmissions: (page = 1, limit = 10) =>
    api
      .get<ApiResponse<PaginatedResponse<SpeakingSubmissionListItem>>>(
        `/speaking/submissions?page=${page}&limit=${limit}`
      )
      .then((r) => r.data.data),
};
