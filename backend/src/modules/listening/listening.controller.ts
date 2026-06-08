import type { Request, Response } from "express";
import { ListeningService } from "./listening.service.js";

const svc = new ListeningService();

export class ListeningController {
  async getTests(req: Request, res: Response) {
    try {
      return res.json({
        success: true,
        data: await svc.getTests(req.query as any),
      });
    } catch (e: any) {
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }

  async getTest(req: Request<{ testId: string }>, res: Response) {
    try {
      return res.json({
        success: true,
        data: await svc.getTest(req.params.testId),
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
      const { testId, answers, timeTaken } = req.body;

      const data = await svc.submitTest(
        req.user!.userId,
        testId,
        answers,
        timeTaken ?? 0
      );

      return res.json({
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
}
