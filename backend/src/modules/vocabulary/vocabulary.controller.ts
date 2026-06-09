import type { Request, Response } from "express";
import { VocabularyService } from "./vocabulary.service.js";

const svc = new VocabularyService();

// --------------------
// helpers
// --------------------
function str(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function num(value: unknown, fallback: number): number {
  const n = Number(value);
  return isNaN(n) ? fallback : n;
}

function getUserId(req: Request): string | null {
  const user = req.user as any;
  return user?.id || user?.userId || null;
}

// --------------------
// CONTROLLER
// --------------------
export class VocabularyController {
  // =====================
  // DAILY WORDS
  // =====================
  async getDailyWords(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const data = await svc.getDailyWords(userId);

      res.json({ success: true, data });
    } catch (e: any) {
      console.error("getDailyWords error:", e);
      res.status(500).json({ success: false, message: e.message });
    }
  }

  // =====================
  // ALL WORDS
  // =====================
  async getAllWords(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const data = await svc.getVocabulary(
        userId,
        num(req.query.page, 1),
        num(req.query.limit, 20),
        str(req.query.search)
      );

      res.json({ success: true, data });
    } catch (e: any) {
      console.error("getAllWords error:", e);
      res.status(500).json({ success: false, message: e.message });
    }
  }

  // =====================
  // SAVED WORDS
  // =====================
  async getSaved(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const data = await svc.getSavedWords(userId);

      res.json({ success: true, data });
    } catch (e: any) {
      console.error("getSaved error:", e);
      res.status(500).json({ success: false, message: e.message });
    }
  }

  async saveWord(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const vocabularyId = str(req.body.vocabularyId);
      if (!vocabularyId)
        return res.status(400).json({
          success: false,
          message: "vocabularyId is required",
        });

      const result = await svc.toggleSave(userId, vocabularyId);

      res.json({ success: true, data: result });
    } catch (e: any) {
      console.error("saveWord error:", e);
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async unsaveWord(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const vocabularyId = str(req.params.vocabularyId);
      if (!vocabularyId)
        return res.status(400).json({
          success: false,
          message: "vocabularyId is required",
        });

      const result = await svc.toggleSave(userId, vocabularyId);

      res.json({ success: true, data: result });
    } catch (e: any) {
      console.error("unsaveWord error:", e);
      res.status(400).json({ success: false, message: e.message });
    }
  }

  // =====================
  // QUIZ
  // =====================
  async getQuiz(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const count = num(req.query.count, 10);
      const data = await svc.getQuiz(userId, count);

      res.json({ success: true, data });
    } catch (e: any) {
      console.error("getQuiz error:", e);
      res.status(500).json({ success: false, message: e.message });
    }
  }

  async submitQuiz(req: Request, res: Response) {
    try {
      res.json({
        success: true,
        message: "Handled on frontend (or extend backend scoring)",
        data: req.body.answers,
      });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  // =====================
  // REVIEW (SM-2)
  // =====================
  async submitReview(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const vocabularyId = str(req.body.vocabularyId);
      const quality = num(req.body.quality, 0);

      if (!vocabularyId)
        return res.status(400).json({
          success: false,
          message: "vocabularyId is required",
        });

      const data = await svc.submitReview(userId, vocabularyId, quality);

      res.json({ success: true, data });
    } catch (e: any) {
      console.error("submitReview error:", e);
      res.status(400).json({ success: false, message: e.message });
    }
  }

  // =====================
  // STATS
  // =====================
  async getStats(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const data = await svc.getStats(userId);

      res.json({ success: true, data });
    } catch (e: any) {
      console.error("getStats error:", e);
      res.status(500).json({ success: false, message: e.message });
    }
  }

  // =====================
  // MASTERED WORDS
  // =====================
  async getMastered(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const data = await svc.getMasteredWords(userId);

      res.json({ success: true, data });
    } catch (e: any) {
      console.error("getMastered error:", e);
      res.status(500).json({ success: false, message: e.message });
    }
  }

  // =====================
  // DUE REVIEWS
  // =====================
  async getDueReviews(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const data = await svc.getDueReviews(userId);

      res.json({ success: true, data });
    } catch (e: any) {
      console.error("getDueReviews error:", e);
      res.status(500).json({ success: false, message: e.message });
    }
  }
}
