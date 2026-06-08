import { PrismaClient, TestType, TestStatus } from "@prisma/client";

export async function seedMockTests(
  prisma: PrismaClient,
  readingTestId: string,
  listeningTestId: string,
  writingPromptId: string,
  speakingCueCardId: string
) {
  return prisma.mockTest.create({
    data: {
      title: "IELTS Academic Mock Test 1",

      description: "Complete IELTS Academic Mock Test",

      type: TestType.ACADEMIC,
      status: TestStatus.PUBLISHED,

      readingTestId,
      listeningTestId,
      writingPromptId,
      speakingCueCardId,

      readingMinutes: 60,
      listeningMinutes: 40,
      writingMinutes: 60,
      speakingMinutes: 15,
    },
  });
}
