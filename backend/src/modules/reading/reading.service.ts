import { prisma } from "../../config/db.js";
import { readingScoreToBand } from "../../utils/bandScore.utils.js";
import {
  getPagination,
  paginatedResponse,
} from "../../utils/pagination.utils.js";
import { AnalyticsService } from "../analytics/analytics.service.js";

const analyticsService = new AnalyticsService();

export class ReadingService {
  // ── List published tests ──────────────────────────────────────────────
  async getTests(query: { page?: string; limit?: string }) {
    const { page, limit, skip } = getPagination(query);

    const [tests, total] = await Promise.all([
      prisma.readingTest.findMany({
        where: { status: "PUBLISHED" },
        skip,
        take: limit,
        include: {
          passages: {
            include: { questions: { select: { id: true } } },
          },
        },
      }),
      prisma.readingTest.count({ where: { status: "PUBLISHED" } }),
    ]);

    const items = tests.map((t) => ({
      id: t.id,
      title: t.title,
      type: t.type,
      status: t.status,
      passageCount: t.passages.length,
      questionCount: t.passages.reduce((s, p) => s + p.questions.length, 0),
    }));

    return paginatedResponse(items, total, page, limit);
  }

  // ── Single test (no correct answers) ─────────────────────────────────
  async getTest(testId: string) {
    const test = await prisma.readingTest.findUnique({
      where: { id: testId },
      include: {
        passages: {
          include: {
            questions: {
              select: {
                id: true,
                questionText: true,
                questionType: true,
                options: true,
                // correctAnswer intentionally omitted
              },
            },
          },
        },
      },
    });

    if (!test || test.status !== "PUBLISHED") {
      throw new Error("Test not found");
    }

    return test;
  }

  // ── Submit + score ────────────────────────────────────────────────────
  async submitTest(
    userId: string,
    testId: string,
    answers: Record<string, string>,
    timeTaken: number
  ) {
    const test = await prisma.readingTest.findUnique({
      where: { id: testId },
      include: {
        passages: {
          include: { questions: true },
        },
      },
    });

    if (!test) throw new Error("Test not found");

    const allQuestions = test.passages.flatMap((p) => p.questions);
    let correct = 0;
    const correctAnswers: Record<
      string,
      { correct: boolean; correctAnswer: string }
    > = {};

    for (const q of allQuestions) {
      const submitted = (answers[q.id] ?? "").trim().toLowerCase();
      const expected = q.correctAnswer.trim().toLowerCase();
      const isCorrect = submitted === expected;
      if (isCorrect) correct++;
      correctAnswers[q.id] = {
        correct: isCorrect,
        correctAnswer: q.correctAnswer,
      };
    }

    const score = correct;
    const total = allQuestions.length;
    const band = readingScoreToBand(correct);

    // Persist attempt
    const attempt = await prisma.readingAttempt.create({
      data: { userId, testId, score, band },
    });

    // Update analytics asynchronously — don't fail the response
    analyticsService
      .upsertBandFromAttempt(userId, "reading", band)
      .catch(console.error);
    analyticsService.updateStreak(userId).catch(console.error);

    return {
      attemptId: attempt.id,
      score,
      total,
      band,
      timeTaken,
      correctAnswers,
    };
  }

  // ── Get a single attempt result ───────────────────────────────────────
  async getAttempt(userId: string, attemptId: string) {
    const attempt = await prisma.readingAttempt.findFirst({
      where: { id: attemptId, userId },
    });
    if (!attempt) throw new Error("Attempt not found");
    return attempt;
  }
}
