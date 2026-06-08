import type { Request, Response } from "express";
import { AnalyticsService } from "./analytics.service.js";

const svc = new AnalyticsService();

export class AnalyticsController {
  async getDashboard(req: Request, res: Response) {
    try {
      const data = await svc.getDashboardSummary(req.user!.userId);
      return res.json({ success: true, data });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  async setGoal(req: Request, res: Response) {
    try {
      const goal = await svc.setStudyGoal(req.user!.userId, req.body);
      return res.json({ success: true, data: goal });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
}
