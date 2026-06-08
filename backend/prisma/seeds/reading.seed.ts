import {
  PrismaClient,
  TestType,
  TestStatus,
  QuestionType,
} from "@prisma/client";

export async function seedReading(prisma: PrismaClient) {
  const readingTest = await prisma.readingTest.create({
    data: {
      title: "Academic Reading Test 1",
      type: TestType.ACADEMIC,
      status: TestStatus.PUBLISHED,

      passages: {
        create: [
          {
            title: "The Rise of Artificial Intelligence",
            content:
              "Artificial Intelligence has transformed industries worldwide.",

            questions: {
              create: [
                {
                  questionText: "What technology accelerated AI growth?",
                  questionType: QuestionType.MULTIPLE_CHOICE,
                  options: [
                    "Blockchain",
                    "Deep Learning",
                    "IoT",
                    "Cloud Storage",
                  ],
                  correctAnswer: "Deep Learning",
                },
                {
                  questionText: "AI is only used in laboratories.",
                  questionType: QuestionType.TRUE_FALSE_NOT_GIVEN,
                  correctAnswer: "False",
                },
              ],
            },
          },
        ],
      },
    },
  });

  return readingTest;
}
