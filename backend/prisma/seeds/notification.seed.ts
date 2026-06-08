import { PrismaClient } from "@prisma/client";

export async function seedNotifications(prisma: PrismaClient, userId: string) {
  await prisma.notification.createMany({
    data: [
      {
        userId,
        type: "RESULT_READY",
        title: "Writing Score Ready",
        message: "Your Writing Task 2 score has been generated.",
      },
      {
        userId,
        type: "STREAK_REMINDER",
        title: "Keep Your Streak",
        message: "Complete today's lesson to maintain streak.",
      },
    ],
    skipDuplicates: true,
  });
}
