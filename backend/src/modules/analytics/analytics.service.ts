import { prisma } from "../../config/db.js";
import { calculateOverallBand } from "../../utils/bandScore.utils.js";

export class AnalyticsService {
  async getDashboardSummary(userId: string) {
    const [analytics, user, recentAttempts, bandHistory, studyGoal] =
      await Promise.all([
        prisma.userAnalytics.findUnique({ where: { userId } }),
        prisma.user.findUnique({
          where: { id: userId },
          select: { streak: true, targetBand: true },
        }),
        this.getRecentActivity(userId),
        prisma.bandHistory.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 10,
          select: { createdAt: true, overall: true, source: true },
        }),
        prisma.studyGoal.findFirst({
          where: { userId },
          orderBy: { id: "desc" },
        }),
      ]);

    const r = analytics?.readingBand ?? null;
    const l = analytics?.listeningBand ?? null;
    const w = analytics?.writingBand ?? null;
    const s = analytics?.speakingBand ?? null;
    const overall = calculateOverallBand(r, l, w, s);

    // Weak skills = any skill band below 6 or the lowest
    const weakSkills = [
      { skill: "READING" as const, band: r, label: "Reading" },
      { skill: "LISTENING" as const, band: l, label: "Listening" },
      { skill: "WRITING" as const, band: w, label: "Writing" },
      { skill: "SPEAKING" as const, band: s, label: "Speaking" },
    ]
      .filter((sk) => sk.band !== null && sk.band < 6.5)
      .sort((a, b) => (a.band ?? 9) - (b.band ?? 9))
      .slice(0, 3);

    return {
      readingBand: r,
      listeningBand: l,
      writingBand: w,
      speakingBand: s,
      overallBand: overall,
      streak: user?.streak ?? 0,
      totalTests: recentAttempts.length,
      recentActivity: recentAttempts,
      bandHistory: bandHistory.map((bh) => ({
        date: bh.createdAt.toISOString(),
        overall: bh.overall,
        source: bh.source,
      })),
      studyGoal: studyGoal
        ? {
            id: studyGoal.id,
            targetBand: studyGoal.targetBand,
            targetDate: studyGoal.targetDate.toISOString(),
            dailyMinutes: studyGoal.dailyMinutes,
          }
        : null,
      weakSkills,
    };
  }

  private async getRecentActivity(userId: string) {
    const [reading, listening, writing, speaking] = await Promise.all([
      prisma.readingAttempt.findMany({
        where: { userId },
        include: { test: { select: { title: true } } },
        orderBy: { id: "desc" },
        take: 5,
      }),
      prisma.listeningAttempt.findMany({
        where: { userId },
        include: { test: { select: { title: true } } },
        orderBy: { id: "desc" },
        take: 5,
      }),
      prisma.writingSubmission.findMany({
        where: { userId },
        include: { prompt: { select: { title: true } } },
        orderBy: { id: "desc" },
        take: 5,
      }),
      prisma.speakingSubmission.findMany({
        where: { userId },
        include: { cueCard: { select: { topic: true } } },
        orderBy: { id: "desc" },
        take: 5,
      }),
    ]);

    const activities = [
      ...reading.map((a) => ({
        id: a.id,
        type: "READING" as const,
        title: a.test.title,
        band: a.band,
        score: a.score,
        completedAt: new Date().toISOString(),
      })),
      ...listening.map((a) => ({
        id: a.id,
        type: "LISTENING" as const,
        title: a.test.title,
        band: a.band,
        score: a.score,
        completedAt: new Date().toISOString(),
      })),
      ...writing.map((a) => ({
        id: a.id,
        type: "WRITING" as const,
        title: a.prompt.title,
        band: a.overallBand,
        score: null,
        completedAt: new Date().toISOString(),
      })),
      ...speaking.map((a) => ({
        id: a.id,
        type: "SPEAKING" as const,
        title: a.cueCard.topic,
        band:
          a.fluency && a.pronunciation && a.grammar && a.vocabulary
            ? Math.round(
                ((a.fluency + a.pronunciation + a.grammar + a.vocabulary) / 4) *
                  2
              ) / 2
            : null,
        score: null,
        completedAt: new Date().toISOString(),
      })),
    ];

    return activities.sort(() => Math.random() - 0.5).slice(0, 10);
  }

  async upsertBandFromAttempt(
    userId: string,
    skill: "reading" | "listening" | "writing" | "speaking",
    band: number
  ) {
    const fieldMap = {
      reading: "readingBand",
      listening: "listeningBand",
      writing: "writingBand",
      speaking: "speakingBand",
    } as const;

    await prisma.userAnalytics.upsert({
      where: { userId },
      create: { userId, [fieldMap[skill]]: band },
      update: { [fieldMap[skill]]: band },
    });

    // Get updated analytics to record new overall in history
    const updated = await prisma.userAnalytics.findUnique({
      where: { userId },
    });
    if (!updated) return;

    const overall = calculateOverallBand(
      updated.readingBand,
      updated.listeningBand,
      updated.writingBand,
      updated.speakingBand
    );

    if (overall !== null) {
      await prisma.bandHistory.create({
        data: { userId, overall, source: skill.toUpperCase() },
      });
    }
  }

  async setStudyGoal(
    userId: string,
    data: { targetBand: number; targetDate: string; dailyMinutes: number }
  ) {
    // Upsert latest goal — one active goal per user
    await prisma.studyGoal.deleteMany({ where: { userId } });
    return prisma.studyGoal.create({
      data: {
        userId,
        targetBand: data.targetBand,
        targetDate: new Date(data.targetDate),
        dailyMinutes: data.dailyMinutes,
      },
    });
  }

  async updateStreak(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streak: true, lastActiveAt: true },
    });
    if (!user) return;

    const now = new Date();
    const lastActive = user.lastActiveAt;
    const isYesterday =
      lastActive &&
      Math.floor(
        (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
      ) === 1;

    const isToday =
      lastActive &&
      Math.floor(
        (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
      ) === 0;

    if (isToday) return; // already counted today

    await prisma.user.update({
      where: { id: userId },
      data: {
        streak: isYesterday ? user.streak + 1 : 1,
        lastActiveAt: now,
      },
    });
  }
}
