import { prisma } from "../../config/db.js";
import { AnalyticsService } from "../analytics/analytics.service.js";
import {
  calculateOverallBand,
  listeningScoreToBand,
  readingScoreToBand,
} from "../../utils/bandScore.utils.js";

const analyticsService = new AnalyticsService();

const SECTION_TIMES = {
  LISTENING: 40 * 60,
  READING: 60 * 60,
  WRITING: 60 * 60,
  SPEAKING: 15 * 60,
};

export class MockTestService {
  async getTests() {
    const sessions = await prisma.mockTest.findMany({
      include: { sessions: { select: { id: true }, take: 1 } },
    });

    return sessions.map((t) => ({
      id: t.id,
      title: t.title,
      readingTestId: null,
      listeningTestId: null,
      hasWriting: true,
      hasSpeaking: true,
    }));
  }

  async startSession(userId: string, mockTestId: string) {
    const mockTest = await prisma.mockTest.findUnique({
      where: { id: mockTestId },
    });
    if (!mockTest) throw new Error("Mock test not found");

    const session = await prisma.mockTestSession.create({
      data: { userId, mockTestId, status: "IN_PROGRESS" },
    });

    return {
      id: session.id,
      mockTestId: session.mockTestId,
      status: session.status,
      currentSection: "LISTENING",
      timeLeft: SECTION_TIMES.LISTENING,
      readingScore: null,
      listeningScore: null,
      writingScore: null,
      speakingScore: null,
      overallBand: null,
    };
  }

  async getSession(userId: string, sessionId: string) {
    const session = await prisma.mockTestSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) throw new Error("Session not found");

    let currentSection: string = "LISTENING";
    if (session.listeningScore !== null) currentSection = "READING";
    if (session.readingScore !== null) currentSection = "WRITING";
    if (session.writingScore !== null) currentSection = "SPEAKING";
    if (session.speakingScore !== null) currentSection = "DONE";

    return {
      id: session.id,
      mockTestId: session.mockTestId,
      status: session.status,
      currentSection,
      timeLeft:
        SECTION_TIMES[currentSection as keyof typeof SECTION_TIMES] ?? 0,
      readingScore: session.readingScore,
      listeningScore: session.listeningScore,
      writingScore: session.writingScore,
      speakingScore: session.speakingScore,
      overallBand: session.overallBand,
    };
  }

  async submitSection(
    userId: string,
    sessionId: string,
    section: string,
    payload: any
  ) {
    const session = await prisma.mockTestSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new Error("Session not found");

    const updateData: any = {};
    let nextSection: string | null = null;

    switch (section) {
      case "LISTENING":
        updateData.listeningScore = listeningScoreToBand(
          Math.floor(Object.keys(payload.answers ?? {}).length * 0.7)
        );
        nextSection = "READING";
        break;

      case "READING":
        updateData.readingScore = readingScoreToBand(
          Math.floor(Object.keys(payload.answers ?? {}).length * 0.75)
        );
        nextSection = "WRITING";
        break;

      case "WRITING":
        updateData.writingScore = 6.0;
        nextSection = "SPEAKING";
        break;

      case "SPEAKING":
        updateData.speakingScore = 6.0;
        nextSection = null;
        break;
    }

    await prisma.mockTestSession.update({
      where: { id: sessionId },
      data: updateData,
    });

    return { nextSection };
  }

  async completeSession(userId: string, sessionId: string) {
    const session = await prisma.mockTestSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new Error("Session not found");

    const overall = calculateOverallBand(
      session.readingScore,
      session.listeningScore,
      session.writingScore,
      session.speakingScore
    );

    await prisma.mockTestSession.update({
      where: { id: sessionId },
      data: { status: "COMPLETED", overallBand: overall },
    });

    if (overall !== null) {
      await analyticsService.upsertBandFromAttempt(
        userId,
        "reading",
        session.readingScore ?? 0
      );
      await analyticsService.upsertBandFromAttempt(
        userId,
        "listening",
        session.listeningScore ?? 0
      );
      await analyticsService.updateStreak(userId);
    }

    return this.getResult(userId, sessionId);
  }

  async getResult(userId: string, sessionId: string) {
    const session = await prisma.mockTestSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new Error("Session not found");

    return {
      sessionId: session.id,
      overallBand: session.overallBand ?? 0,
      readingBand: session.readingScore,
      listeningBand: session.listeningScore,
      writingBand: session.writingScore,
      speakingBand: session.speakingScore,
      timeTaken: 0,
      completedAt: new Date().toISOString(),
      sectionBreakdown: [],
    };
  }

  async getMySessions(userId: string, query: any) {
    const page = Math.max(1, parseInt(query.page ?? "1", 10));
    const limit = 10;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(query.status ? { status: query.status } : {}),
    };

    const [sessions, total] = await Promise.all([
      prisma.mockTestSession.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: "desc" },
      }),
      prisma.mockTestSession.count({ where }),
    ]);

    return {
      items: sessions.map((s) => ({
        sessionId: s.id,
        overallBand: s.overallBand ?? 0,
        readingBand: s.readingScore,
        listeningBand: s.listeningScore,
        writingBand: s.writingScore,
        speakingBand: s.speakingScore,
        timeTaken: 0,
        completedAt: new Date().toISOString(),
        sectionBreakdown: [],
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
