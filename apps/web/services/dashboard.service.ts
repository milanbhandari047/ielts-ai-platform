import api from "@/lib/axios";
import type { ApiResponse, DashboardSummary, StudyGoal } from "@/types";

export const dashboardService = {
  getSummary: () =>
    api
      .get<ApiResponse<DashboardSummary>>("/analytics/dashboard")
      .then((r) => r.data.data),

  setStudyGoal: (goal: Omit<StudyGoal, "id">) =>
    api
      .post<ApiResponse<StudyGoal>>("/analytics/goal", goal)
      .then((r) => r.data.data),
};
