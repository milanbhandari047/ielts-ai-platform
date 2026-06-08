import type { Request, Response } from "express";
import { AiTutorService } from "./ai-tutor.service.js";

const svc = new AiTutorService();

// helper to safely extract params
function getParam(param: string | string[] | undefined): string | null {
  if (!param || Array.isArray(param)) return null;
  return param;
}

export class AiTutorController {
  async createSession(req: Request, res: Response) {
    try {
      const { message } = req.body;

      if (!message?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }

      const data = await svc.createSession(req.user!.userId, message);

      return res.status(201).json({ success: true, data });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  async getSessions(req: Request, res: Response) {
    try {
      const data = await svc.getSessions(req.user!.userId, req.query as any);

      return res.json({ success: true, data });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  async getSession(req: Request, res: Response) {
    try {
      const sessionId = getParam(req.params.sessionId);

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: "Invalid sessionId",
        });
      }

      const data = await svc.getSession(req.user!.userId, sessionId);

      return res.json({ success: true, data });
    } catch (e: any) {
      return res.status(404).json({ success: false, message: e.message });
    }
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const { message, history } = req.body;
      const sessionId = getParam(req.params.sessionId);

      if (!message?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: "Invalid sessionId",
        });
      }

      const data = await svc.sendMessage(
        req.user!.userId,
        sessionId,
        message,
        history ?? []
      );

      return res.json({ success: true, data });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  async streamMessage(req: Request, res: Response) {
    try {
      const { message, history } = req.body;
      const sessionId = getParam(req.params.sessionId);

      if (!message?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: "Invalid sessionId",
        });
      }

      // SSE headers
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      await svc.streamMessage(
        req.user!.userId,
        sessionId,
        message,
        history ?? [],
        (chunk: any) => {
          res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        },
        () => {
          res.write("data: [DONE]\n\n");
          res.end();
        }
      );
    } catch (e: any) {
      res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
      res.end();
    }
  }

  async deleteSession(req: Request, res: Response) {
    try {
      const sessionId = getParam(req.params.sessionId);

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: "Invalid sessionId",
        });
      }

      const data = await svc.deleteSession(req.user!.userId, sessionId);

      return res.json({ success: true, ...data });
    } catch (e: any) {
      return res.status(404).json({ success: false, message: e.message });
    }
  }
}
