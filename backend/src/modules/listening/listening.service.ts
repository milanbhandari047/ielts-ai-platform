import { prisma } from "../../config/db.js";
import { listeningScoreToBand } from "../../utils/bandScore.utils.js";
import {
  getPagination,
  paginatedResponse,
} from "../../utils/pagination.utils.js";
import { AnalyticsService } from "../analytics/analytics.service.js";

const analyticsService = new AnalyticsService();

export class ListeningService {
  async getTests(query: { page?: string; limit?: string }) {
    const { page, limit, skip } = getPagination(query);

    const [tests, total] = await Promise.all([
      prisma.listeningTest.findMany({
        skip,
        take: limit,
        include: {
          sections: { include: { questions: { select: { id: true } } } },
        },
      }),
      prisma.listeningTest.count(),
    ]);

    const items = tests.map((t) => ({
      id: t.id,
      title: t.title,
      sectionCount: t.sections.length,
      questionCount: t.sections.reduce((s, sec) => s + sec.questions.length, 0),
    }));

    return paginatedResponse(items, total, page, limit);
  }

  async getTest(testId: string) {
    const test = await prisma.listeningTest.findUnique({
      where: { id: testId },
      include: {
        sections: {
          include: {
            questions: {
              select: { id: true, questionText: true },
            },
          },
        },
      },
    });

    if (!test) throw new Error("Test not found");
    return test;
  }

  async submitTest(
    userId: string,
    testId: string,
    answers: Record<string, string>,
    timeTaken: number
  ) {
    const test = await prisma.listeningTest.findUnique({
      where: { id: testId },
      include: { sections: { include: { questions: true } } },
    });

    if (!test) throw new Error("Test not found");

    const allQuestions = test.sections.flatMap((s) => s.questions);
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
    const band = listeningScoreToBand(correct);

    const attempt = await prisma.listeningAttempt.create({
      data: { userId, testId, score, band },
    });

    analyticsService
      .upsertBandFromAttempt(userId, "listening", band)
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
}
