import { PrismaClient } from "@prisma/client";

export async function seedAiTutor(prisma: PrismaClient, userId: string) {
  await prisma.aiTutorSession.create({
    data: {
      userId,
      title: "IELTS Writing Feedback Session",
    },
  });
}
