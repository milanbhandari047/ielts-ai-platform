import type { Request, Response } from "express";
import { ReadingService } from "./reading.service.js";

const svc = new ReadingService();

export class ReadingController {
  async getTests(req: Request, res: Response) {
    try {
      const data = await svc.getTests(req.query as any);

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

  async getTest(req: Request<{ testId: string }>, res: Response) {
    try {
      const data = await svc.getTest(req.params.testId);

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

  async getAttempt(req: Request<{ attemptId: string }>, res: Response) {
    try {
      const data = await svc.getAttempt(req.user!.userId, req.params.attemptId);

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
}
