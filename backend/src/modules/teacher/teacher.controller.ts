// backend/src/teacher/teacher.controller.ts
import type { Request, Response } from "express";
import { TeacherService } from "./teacher.service.js";

const svc = new TeacherService();

function getUserId(req: Request): string {
  const user = req.user as any;
  return user?.id || user?.userId;
}

export class TeacherController {
  // ── Dashboard ──────────────────────────────────────────────────

  async getDashboard(req: Request, res: Response) {
    try {
      const data = await svc.getDashboardStats();
      res.json({ success: true, data });
    } catch (e: any) {
      console.error("getDashboard error:", e);
      res.status(500).json({ success: false, message: e.message });
    }
  }

  // ── Students ───────────────────────────────────────────────────

  async getStudents(req: Request, res: Response) {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 15);
      const search =
        typeof req.query.search === "string" ? req.query.search : undefined;
      const sortBy =
        typeof req.query.sortBy === "string" ? req.query.sortBy : "name";

      const data = await svc.getStudents(page, limit, search, sortBy);
      res.json({ success: true, data });
    } catch (e: any) {
      console.error("getStudents error:", e);
      res.status(500).json({ success: false, message: e.message });
    }
  }

  async getStudentDetail(req: Request, res: Response) {
    try {
      const data = await svc.getStudentDetail(req.params.id);
      res.json({ success: true, data });
    } catch (e: any) {
      if (e.message === "STUDENT_NOT_FOUND") {
        return res
          .status(404)
          .json({ success: false, message: "Student not found." });
      }
      console.error("getStudentDetail error:", e);
      res.status(500).json({ success: false, message: e.message });
    }
  }

  // ── Score overrides ────────────────────────────────────────────

  async overrideWritingScore(req: Request, res: Response) {
    try {
      const data = await svc.overrideWritingScore(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (e: any) {
      if (e.message === "NOT_FOUND") {
        return res
          .status(404)
          .json({ success: false, message: "Submission not found." });
      }
      res.status(500).json({ success: false, message: e.message });
    }
  }

  async overrideSpeakingScore(req: Request, res: Response) {
    try {
      const data = await svc.overrideSpeakingScore(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (e: any) {
      if (e.message === "NOT_FOUND") {
        return res
          .status(404)
          .json({ success: false, message: "Submission not found." });
      }
      res.status(500).json({ success: false, message: e.message });
    }
  }

  // ── Tests ──────────────────────────────────────────────────────

  async getReadingTests(req: Request, res: Response) {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const data = await svc.getReadingTests(page, limit);
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  }

  async createReadingTest(req: Request, res: Response) {
    try {
      const { title, type, passages } = req.body;
      if (!title || !type || !passages?.length) {
        return res.status(400).json({
          success: false,
          message: "title, type, and passages are required.",
        });
      }
      const data = await svc.createReadingTest(getUserId(req), req.body);
      res.status(201).json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  }

  async updateTestStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid status." });
      }
      const data = await svc.updateTestStatus(req.params.id, status);
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  }

  async deleteTest(req: Request, res: Response) {
    try {
      await svc.deleteTest(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      if (e.message === "NOT_FOUND")
        return res
          .status(404)
          .json({ success: false, message: "Test not found." });
      if (e.message === "CANNOT_DELETE_PUBLISHED")
        return res.status(409).json({
          success: false,
          message: "Cannot delete a published test. Archive it first.",
        });
      res.status(500).json({ success: false, message: e.message });
    }
  }

  // ── Writing review ─────────────────────────────────────────────

  async getWritingSubmissions(req: Request, res: Response) {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 15);
      const filter = (req.query.filter as any) ?? "all";
      const data = await svc.getWritingSubmissions(page, limit, filter);
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  }
}
