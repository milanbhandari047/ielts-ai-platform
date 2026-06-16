// backend/src/teacher/teacher.service.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CreateReadingTestPayload {
  title: string;
  type: "ACADEMIC" | "GENERAL";
  passages: Array<{
    title: string;
    content: string;
    questions: Array<{
      questionText: string;
      questionType: string;
      options?: string[];
      correctAnswer: string;
    }>;
  }>;
}

export interface ScoreOverridePayload {
  overallBand?: number;
  taskResponse?: number;
  coherence?: number;
  lexical?: number;
  grammar?: number;
  fluency?: number;
  pronunciation?: number;
  vocabulary?: number;
  feedback?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function computeOverallBand(bands: (number | null)[]): number | null {
  const valid = bands.filter((b): b is number => b !== null && b !== undefined);
  if (!valid.length) return null;
  return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 2) / 2;
}

// ── Service ───────────────────────────────────────────────────────────────────

export class TeacherService {
  // ── Dashboard stats ────────────────────────────────────────────

  async getDashboardStats() {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const monthAgo = new Date(now.getTime() - 30 * 86400000);

    const [
      totalStudents,
      activeThisWeek,
      activeThisMonth,
      totalWritingSubmissions,
      ungradedWriting,
      totalMockSessions,
      avgAnalytics,
      recentActivity,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({
        where: { role: "STUDENT", lastActiveAt: { gte: weekAgo } },
      }),
      prisma.user.count({
        where: { role: "STUDENT", lastActiveAt: { gte: monthAgo } },
      }),
      prisma.writingSubmission.count(),
      prisma.writingSubmission.count({ where: { overallBand: null } }),
      prisma.mockTestSession.count({ where: { status: "COMPLETED" } }),
      prisma.userAnalytics.aggregate({
        _avg: {
          readingBand: true,
          listeningBand: true,
          writingBand: true,
          speakingBand: true,
        },
      }),
      prisma.writingSubmission.findMany({
        where: { createdAt: { gte: weekAgo } },
        select: { createdAt: true },
      }),
    ]);

    // Band distribution
    const bandDistribution = await prisma.userAnalytics.findMany({
      select: {
        readingBand: true,
        listeningBand: true,
        writingBand: true,
        speakingBand: true,
      },
    });

    const bandBuckets: Record<string, number> = {
      "4.0-4.5": 0,
      "5.0-5.5": 0,
      "6.0-6.5": 0,
      "7.0-7.5": 0,
      "8.0+": 0,
    };
    bandDistribution.forEach((a) => {
      const bands = [
        a.readingBand,
        a.listeningBand,
        a.writingBand,
        a.speakingBand,
      ].filter(Boolean) as number[];
      const avg = bands.length
        ? bands.reduce((s, b) => s + b, 0) / bands.length
        : null;
      if (avg === null) return;
      if (avg >= 8) bandBuckets["8.0+"]++;
      else if (avg >= 7) bandBuckets["7.0-7.5"]++;
      else if (avg >= 6) bandBuckets["6.0-6.5"]++;
      else if (avg >= 5) bandBuckets["5.0-5.5"]++;
      else bandBuckets["4.0-4.5"]++;
    });

    const avg = avgAnalytics._avg;

    return {
      totalStudents,
      activeThisWeek,
      activeThisMonth,
      totalWritingSubmissions,
      ungradedWriting,
      totalMockSessions,
      classAvgBand: computeOverallBand([
        avg.readingBand,
        avg.listeningBand,
        avg.writingBand,
        avg.speakingBand,
      ]),
      avgBySkill: {
        reading: avg.readingBand ? +avg.readingBand.toFixed(1) : null,
        listening: avg.listeningBand ? +avg.listeningBand.toFixed(1) : null,
        writing: avg.writingBand ? +avg.writingBand.toFixed(1) : null,
        speaking: avg.speakingBand ? +avg.speakingBand.toFixed(1) : null,
      },
      bandDistribution: Object.entries(bandBuckets).map(([range, count]) => ({
        range,
        count,
      })),
      weeklyActivity: recentActivity.length,
    };
  }

  // ── Students ───────────────────────────────────────────────────

  async getStudents(page = 1, limit = 15, search?: string, sortBy = "name") {
    page = Math.max(1, page);
    const where: any = {
      role: "STUDENT",
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const orderBy: any =
      sortBy === "band"
        ? { analytics: { readingBand: "desc" } }
        : sortBy === "active"
        ? { lastActiveAt: "desc" }
        : sortBy === "joined"
        ? { createdAt: "desc" }
        : { name: "asc" };

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          targetBand: true,
          streak: true,
          lastActiveAt: true,
          createdAt: true,
          analytics: {
            select: {
              readingBand: true,
              listeningBand: true,
              writingBand: true,
              speakingBand: true,
            },
          },
          subscription: { select: { plan: true, status: true } },
          studyGoals: {
            take: 1,
            orderBy: { id: "desc" },
            select: { targetBand: true, targetDate: true },
          },
          _count: {
            select: {
              readingAttempts: true,
              listeningAttempts: true,
              writingSubmissions: true,
              speakingSubmissions: true,
              mockSessions: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      students: students.map((s) => ({
        ...s,
        overallBand: computeOverallBand([
          s.analytics?.readingBand ?? null,
          s.analytics?.listeningBand ?? null,
          s.analytics?.writingBand ?? null,
          s.analytics?.speakingBand ?? null,
        ]),
        totalActivities:
          (s._count.readingAttempts ?? 0) +
          (s._count.listeningAttempts ?? 0) +
          (s._count.writingSubmissions ?? 0) +
          (s._count.speakingSubmissions ?? 0),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStudentDetail(studentId: string) {
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        analytics: true,
        studyGoals: { take: 1, orderBy: { id: "desc" } },
        bandHistory: { orderBy: { createdAt: "desc" }, take: 30 },
        writingSubmissions: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { prompt: { select: { title: true, task: true } } },
        },
        speakingSubmissions: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { cueCard: { select: { topic: true, part: true } } },
        },
        readingAttempts: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { test: { select: { title: true } } },
        },
        listeningAttempts: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { test: { select: { title: true } } },
        },
        mockSessions: {
          where: { status: "COMPLETED" },
          orderBy: { completedAt: "desc" },
          take: 5,
          include: { mockTest: { select: { title: true } } },
        },
      },
    });

    if (!student) throw new Error("STUDENT_NOT_FOUND");

    return {
      ...student,
      overallBand: computeOverallBand([
        student.analytics?.readingBand ?? null,
        student.analytics?.listeningBand ?? null,
        student.analytics?.writingBand ?? null,
        student.analytics?.speakingBand ?? null,
      ]),
    };
  }

  // ── Score overrides ────────────────────────────────────────────

  async overrideWritingScore(
    submissionId: string,
    payload: ScoreOverridePayload
  ) {
    const submission = await prisma.writingSubmission.findUnique({
      where: { id: submissionId },
    });
    if (!submission) throw new Error("NOT_FOUND");

    const updated = await prisma.writingSubmission.update({
      where: { id: submissionId },
      data: {
        ...(payload.overallBand !== undefined && {
          overallBand: payload.overallBand,
        }),
        ...(payload.taskResponse !== undefined && {
          taskResponse: payload.taskResponse,
        }),
        ...(payload.coherence !== undefined && {
          coherence: payload.coherence,
        }),
        ...(payload.lexical !== undefined && { lexical: payload.lexical }),
        ...(payload.grammar !== undefined && { grammar: payload.grammar }),
        ...(payload.feedback !== undefined && {
          feedback: {
            ...((submission.feedback as any) ?? {}),
            teacherFeedback: payload.feedback,
          },
        }),
      },
      include: { prompt: { select: { title: true, task: true } } },
    });

    // Refresh analytics
    await this._refreshStudentAnalytics(submission.userId);
    return updated;
  }

  async overrideSpeakingScore(
    submissionId: string,
    payload: ScoreOverridePayload
  ) {
    const submission = await prisma.speakingSubmission.findUnique({
      where: { id: submissionId },
    });
    if (!submission) throw new Error("NOT_FOUND");

    const updated = await prisma.speakingSubmission.update({
      where: { id: submissionId },
      data: {
        ...(payload.fluency !== undefined && { fluency: payload.fluency }),
        ...(payload.pronunciation !== undefined && {
          pronunciation: payload.pronunciation,
        }),
        ...(payload.grammar !== undefined && { grammar: payload.grammar }),
        ...(payload.vocabulary !== undefined && {
          vocabulary: payload.vocabulary,
        }),
      },
      include: { cueCard: { select: { topic: true, part: true } } },
    });

    await this._refreshStudentAnalytics(submission.userId);
    return updated;
  }

  // ── Tests ──────────────────────────────────────────────────────

  async getReadingTests(page = 1, limit = 10) {
    const [tests, total] = await Promise.all([
      prisma.readingTest.findMany({
        orderBy: { id: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: { select: { passages: true, readingAttempts: true } },
          passages: {
            take: 1,
            include: { _count: { select: { questions: true } } },
          },
        },
      }),
      prisma.readingTest.count(),
    ]);

    return {
      tests: tests.map((t) => ({
        ...t,
        passageCount: t._count.passages,
        attemptCount: t._count.readingAttempts,
        questionCount: t.passages.reduce(
          (sum, p) => sum + (p._count?.questions ?? 0),
          0
        ),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createReadingTest(teacherId: string, data: CreateReadingTestPayload) {
    return prisma.readingTest.create({
      data: {
        title: data.title,
        type: data.type,
        status: "DRAFT",
        passages: {
          create: data.passages.map((p) => ({
            title: p.title,
            content: p.content,
            questions: {
              create: p.questions.map((q) => ({
                questionText: q.questionText,
                questionType: q.questionType as any,
                options: q.options ?? undefined,
                correctAnswer: q.correctAnswer,
              })),
            },
          })),
        },
      },
      include: { passages: { include: { questions: true } } },
    });
  }

  async updateTestStatus(
    testId: string,
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  ) {
    return prisma.readingTest.update({
      where: { id: testId },
      data: { status },
    });
  }

  async deleteTest(testId: string) {
    const test = await prisma.readingTest.findUnique({ where: { id: testId } });
    if (!test) throw new Error("NOT_FOUND");
    if (test.status === "PUBLISHED") throw new Error("CANNOT_DELETE_PUBLISHED");
    return prisma.readingTest.delete({ where: { id: testId } });
  }

  // ── Writing submissions for review ─────────────────────────────

  async getWritingSubmissions(
    page = 1,
    limit = 15,
    filter: "all" | "ungraded" | "graded" = "all"
  ) {
    const where: any = {
      ...(filter === "ungraded" ? { overallBand: null } : {}),
      ...(filter === "graded" ? { overallBand: { not: null } } : {}),
    };

    const [submissions, total] = await Promise.all([
      prisma.writingSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { id: true, name: true, avatar: true, email: true } },
          prompt: { select: { title: true, task: true } },
        },
      }),
      prisma.writingSubmission.count({ where }),
    ]);

    return { submissions, total, page, totalPages: Math.ceil(total / limit) };
  }

  // ── Private helpers ────────────────────────────────────────────

  async _refreshStudentAnalytics(userId: string) {
    const [lastReading, lastListening, lastWriting, lastSpeaking] =
      await Promise.all([
        prisma.readingAttempt.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" },
        }),
        prisma.listeningAttempt.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" },
        }),
        prisma.writingSubmission.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" },
        }),
        prisma.speakingSubmission.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" },
        }),
      ]);

    const speakingBand = lastSpeaking
      ? computeOverallBand([
          lastSpeaking.fluency,
          lastSpeaking.pronunciation,
          lastSpeaking.grammar,
          lastSpeaking.vocabulary,
        ])
      : null;

    await prisma.userAnalytics.upsert({
      where: { userId },
      update: {
        ...(lastReading?.band !== undefined && {
          readingBand: lastReading.band,
        }),
        ...(lastListening?.band !== undefined && {
          listeningBand: lastListening.band,
        }),
        ...(lastWriting?.overallBand !== undefined && {
          writingBand: lastWriting.overallBand,
        }),
        ...(speakingBand !== null && { speakingBand }),
      },
      create: { userId },
    });
  }
}
