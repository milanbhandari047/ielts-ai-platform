import type { Request, Response } from "express";
import { UsersService } from "./users.service.js";

const svc = new UsersService();

export class UsersController {
  async getProfile(req: Request, res: Response) {
    try {
      const data = await svc.getProfile(req.user!.userId);
      return res.json({ success: true, data });
    } catch (e: any) {
      return res.status(404).json({ success: false, message: e.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const data = await svc.updateProfile(req.user!.userId, req.body);
      return res.json({ success: true, data });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }

  async updateAvatar(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      const data = await svc.updateAvatar(req.user!.userId, avatarUrl);
      return res.json({ success: true, data });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      const data = await svc.deleteAccount(req.user!.userId);
      return res.json({ success: true, ...data });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
}
