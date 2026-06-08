import { PrismaClient } from "@prisma/client";

export async function seedAnalytics(prisma: PrismaClient, userId: string) {
  await prisma.bandHistory.createMany({
    data: [
      {
        userId,
        overall: 6.5,
        source: "mock_test",
      },
      {
        userId,
        overall: 7.0,
        source: "writing_submission",
      },
    ],
    skipDuplicates: true,
  });
}
