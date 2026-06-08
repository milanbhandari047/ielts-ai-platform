import type { Request, Response } from "express";
import { WritingService } from "./writing.service.js";

const svc = new WritingService();

export class WritingController {
  async getPrompts(req: Request, res: Response) {
    try {
      const task = req.query.task as "TASK1" | "TASK2" | undefined;

      return res.json({
        success: true,
        data: await svc.getPrompts(task),
      });
    } catch (e: any) {
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }

  async getPrompt(req: Request<{ promptId: string }>, res: Response) {
    try {
      return res.json({
        success: true,
        data: await svc.getPrompt(req.params.promptId),
      });
    } catch (e: any) {
      return res.status(404).json({
        success: false,
        message: e.message,
      });
    }
  }

  async submit(req: Request, res: Response) {
    try {
      const { promptId, essay, wordCount } = req.body;

      if (!promptId || !essay) {
        return res.status(400).json({
          success: false,
          message: "promptId and essay are required",
        });
      }

      const data = await svc.submit(
        req.user!.userId,
        promptId,
        essay,
        wordCount ?? 0
      );

      return res.status(202).json({
        success: true,
        data,
      });
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  }

  async getSubmission(req: Request<{ submissionId: string }>, res: Response) {
    try {
      const data = await svc.getSubmission(
        req.user!.userId,
        req.params.submissionId
      );

      return res.json({
        success: true,
        data,
      });
    } catch (e: any) {
      return res.status(404).json({
        success: false,
        message: e.message,
      });
    }
  }

  async getMySubmissions(req: Request, res: Response) {
    try {
      const data = await svc.getMySubmissions(
        req.user!.userId,
        req.query as any
      );

      return res.json({
        success: true,
        data,
      });
    } catch (e: any) {
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }
}
