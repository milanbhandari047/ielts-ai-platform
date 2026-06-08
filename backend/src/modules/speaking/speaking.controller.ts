import type { Request, Response } from "express";
import { SpeakingService } from "./speaking.service.js";

const svc = new SpeakingService();

function toString(value: unknown): string {
  if (Array.isArray(value)) return value[0];
  return String(value ?? "");
}

export class SpeakingController {
  async getCueCards(req: Request, res: Response) {
    try {
      const partRaw = req.query.part;
      const part = partRaw
        ? (toString(partRaw) as "PART1" | "PART2" | "PART3")
        : undefined;

      const data = await svc.getCueCards(part);

      return res.json({ success: true, data });
    } catch (e: any) {
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }

  async getCueCard(req: Request, res: Response) {
    try {
      const cueCardId = toString(req.params.cueCardId);

      const data = await svc.getCueCard(cueCardId);

      return res.json({ success: true, data });
    } catch (e: any) {
      return res.status(404).json({
        success: false,
        message: e.message,
      });
    }
  }

  async submit(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Audio file required",
        });
      }

      const cueCardId = toString(req.body.cueCardId);
      const userId = toString(req.user?.userId);

      if (!cueCardId) {
        return res.status(400).json({
          success: false,
          message: "cueCardId required",
        });
      }

      const data = await svc.submit(userId, cueCardId, req.file);

      return res.status(202).json({ success: true, data });
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  }

  async getSubmission(req: Request, res: Response) {
    try {
      const submissionId = toString(req.params.submissionId);
      const userId = toString(req.user?.userId);

      const data = await svc.getSubmission(userId, submissionId);

      return res.json({ success: true, data });
    } catch (e: any) {
      return res.status(404).json({
        success: false,
        message: e.message,
      });
    }
  }

  async getMySubmissions(req: Request, res: Response) {
    try {
      const userId = toString(req.user?.userId);

      const data = await svc.getMySubmissions(userId, req.query as any);

      return res.json({ success: true, data });
    } catch (e: any) {
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }
}
