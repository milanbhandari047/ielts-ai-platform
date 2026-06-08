import { prisma } from "../../config/db.js";

export async function getWeeklyLeaderboardService(currentUserId: string) {
  const entries = await prisma.leaderboardEntry.findMany({
    orderBy: {
      weeklyScore: "desc",
    },
    take: 50,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          analytics: {
            select: {
              readingBand: true,
              listeningBand: true,
              writingBand: true,
              speakingBand: true,
            },
          },
        },
      },
    },
  });

  return entries.map((e, i) => {
    const a = e.user.analytics;

    const bands = [
      a?.readingBand,
      a?.listeningBand,
      a?.writingBand,
      a?.speakingBand,
    ].filter(Boolean) as number[];

    const overallBand =
      bands.length > 0
        ? Math.round((bands.reduce((s, b) => s + b, 0) / bands.length) * 2) / 2
        : null;

    return {
      rank: i + 1,
      userId: e.userId,
      name: e.user.name,
      avatar: e.user.avatar,
      weeklyScore: e.weeklyScore,
      overallBand,
      isCurrentUser: e.userId === currentUserId,
    };
  });
}

export async function getMyRankService(userId: string) {
  const all = await prisma.leaderboardEntry.findMany({
    orderBy: {
      weeklyScore: "desc",
    },
  });

  const myIndex = all.findIndex((e) => e.userId === userId);

  const myEntry = all[myIndex];

  return {
    rank: myIndex >= 0 ? myIndex + 1 : all.length + 1,

    weeklyScore: myEntry?.weeklyScore ?? 0,
  };
}

export async function awardLeaderboardPoints(userId: string, points: number) {
  return prisma.leaderboardEntry.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      weeklyScore: points,
    },
    update: {
      weeklyScore: {
        increment: points,
      },
    },
  });
}
