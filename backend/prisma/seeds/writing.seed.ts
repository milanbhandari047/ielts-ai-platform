import { PrismaClient, WritingTask } from "@prisma/client";

export async function seedWriting(prisma: PrismaClient) {
  await prisma.writingPrompt.createMany({
    data: [
      {
        task: WritingTask.TASK1,
        title: "Internet Usage Trends",
        instruction: "Describe the information shown in the chart.",
      },
      {
        task: WritingTask.TASK2,
        title: "Technology Impact",
        instruction: "Discuss whether technology has improved society.",
      },
    ],
  });

  return prisma.writingPrompt.findFirstOrThrow({
    where: {
      task: WritingTask.TASK2,
    },
  });
}
