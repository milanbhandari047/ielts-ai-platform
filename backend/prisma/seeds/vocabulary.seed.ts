import { PrismaClient } from "@prisma/client";

export async function seedVocabulary(prisma: PrismaClient) {
  await prisma.vocabulary.createMany({
    data: [
      {
        word: "Meticulous",
        meaning: "Showing great attention to detail",
        example:
          "The researcher was meticulous in documenting every observation during the experiment.",
        topic: "Education",
      },
      {
        word: "Sustainable",
        meaning: "Able to continue long term without harming resources",
        example:
          "Sustainable energy solutions are essential for combating climate change.",
        topic: "Environment",
      },
      {
        word: "Alleviate",
        meaning: "To reduce or make something less severe",
        example:
          "Government programs aim to alleviate poverty in rural communities.",
        topic: "Society",
      },
      {
        word: "Innovative",
        meaning: "Featuring new methods or ideas",
        example:
          "The startup introduced an innovative app that transformed online learning.",
        topic: "Technology",
      },
      {
        word: "Deteriorate",
        meaning: "To become progressively worse",
        example:
          "Air quality continues to deteriorate in heavily industrialized cities.",
        topic: "Environment",
      },
      {
        word: "Advocate",
        meaning: "To publicly support or recommend something",
        example:
          "Many experts advocate for stricter environmental regulations.",
        topic: "Society",
      },
      {
        word: "Comprehensive",
        meaning: "Complete and including all necessary details",
        example:
          "The report provides a comprehensive overview of global economic trends.",
        topic: "Economics",
      },
      {
        word: "Substantial",
        meaning: "Large in amount or importance",
        example:
          "There has been a substantial increase in online education after the pandemic.",
        topic: "Education",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Vocabulary seeded");
}
