import { PrismaClient } from "@prisma/client";

export async function seedVocabulary(prisma: PrismaClient) {
  await prisma.vocabulary.createMany({
    data: [
      {
        word: "Meticulous",
        meaning: "Showing great attention to detail",
      },
      {
        word: "Innovative",
        meaning: "Featuring new methods or ideas",
      },
      {
        word: "Sustainable",
        meaning: "Able to continue long term",
      },
      {
        word: "Deteriorate",
        meaning: "Become progressively worse",
      },
      {
        word: "Conventional",
        meaning: "Based on accepted standards",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Vocabulary seeded");
}
