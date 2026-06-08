import type { Request, Response } from "express";
import {
  getNotificationsService,
  getUnreadCountService,
  markAsReadService,
  markAllAsReadService,
} from "./notifications.service.js";

export class NotificationController {
  async getNotifications(req: Request, res: Response) {
    try {
      const data = await getNotificationsService(req);

      res.json({
        success: true,
        data,
      });
    } catch (e: any) {
      res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }

  async getUnreadCount(req: Request, res: Response) {
    try {
      const count = await getUnreadCountService(req.user!.userId);

      res.json({
        success: true,
        data: { count },
      });
    } catch (e: any) {
      res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await markAsReadService(id, req.user!.userId);

      res.json({
        success: true,
        message: "Marked as read",
      });
    } catch (e: any) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      await markAllAsReadService(req.user!.userId);

      res.json({
        success: true,
        message: "All marked as read",
      });
    } catch (e: any) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  }
}
