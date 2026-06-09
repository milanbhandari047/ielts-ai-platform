import { ApiResponse, AppNotification, PaginatedResponse } from "@/types";
import api from "@/lib/axios";

// ─── Notifications ────────────────────────────────────────────────────────────
export const notificationService = {
  getAll: (page = 1) =>
    api
      .get<ApiResponse<PaginatedResponse<AppNotification>>>(
        `/notifications?page=${page}`
      )
      .then((r) => r.data.data),

  getUnreadCount: () =>
    api
      .get<ApiResponse<{ count: number }>>("/notifications/unread-count")
      .then((r) => r.data.data.count),

  markRead: (notificationId: string) =>
    api.patch(`/notifications/${notificationId}/read`).then((r) => r.data),

  markAllRead: () => api.patch("/notifications/read-all").then((r) => r.data),
};
