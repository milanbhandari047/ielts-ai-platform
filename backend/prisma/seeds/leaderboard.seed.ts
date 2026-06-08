import { PrismaClient } from "@prisma/client";

export async function seedLeaderboard(prisma: PrismaClient, userId: string) {
  await prisma.leaderboardEntry.upsert({
    where: {
      userId,
    },
    update: {},
    create: {
      userId,
      weeklyScore: 125,
    },
  });
}
