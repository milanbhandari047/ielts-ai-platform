import type { Request, Response } from "express";
import { MockTestService } from "./mock-test.service.js";

const svc = new MockTestService();

interface SessionParams {
  sessionId: string;
}

interface StartSessionBody {
  mockTestId: string;
}

export class MockTestController {
  async getTests(req: Request, res: Response) {
    try {
      const data = await svc.getTests();

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

  async startSession(req: Request<{}, {}, StartSessionBody>, res: Response) {
    try {
      const data = await svc.startSession(
        req.user!.userId,
        req.body.mockTestId
      );

      res.status(201).json({
        success: true,
        data,
      });
    } catch (e: any) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  }

  async getMySessions(req: Request, res: Response) {
    try {
      const data = await svc.getMySessions(req.user!.userId, req.query);

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

  async getSession(req: Request<SessionParams>, res: Response) {
    try {
      const data = await svc.getSession(req.user!.userId, req.params.sessionId);

      res.json({
        success: true,
        data,
      });
    } catch (e: any) {
      res.status(404).json({
        success: false,
        message: e.message,
      });
    }
  }

  async submitSection(req: Request<SessionParams>, res: Response) {
    try {
      const data = await svc.submitSection(
        req.user!.userId,
        req.params.sessionId,
        req.body.section,
        req.body
      );

      res.json({
        success: true,
        data,
      });
    } catch (e: any) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  }

  async completeSession(req: Request<SessionParams>, res: Response) {
    try {
      const data = await svc.completeSession(
        req.user!.userId,
        req.params.sessionId
      );

      res.json({
        success: true,
        data,
      });
    } catch (e: any) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  }

  async getResult(req: Request<SessionParams>, res: Response) {
    try {
      const data = await svc.getResult(req.user!.userId, req.params.sessionId);

      res.json({
        success: true,
        data,
      });
    } catch (e: any) {
      res.status(404).json({
        success: false,
        message: e.message,
      });
    }
  }
}
