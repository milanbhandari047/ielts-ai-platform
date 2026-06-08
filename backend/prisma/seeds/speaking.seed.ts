import { PrismaClient, SpeakingPart } from "@prisma/client";

export async function seedSpeaking(prisma: PrismaClient) {
  await prisma.speakingCueCard.createMany({
    data: [
      {
        part: SpeakingPart.PART1,
        topic: "Hometown",
        instruction: "Describe your hometown.",
      },
      {
        part: SpeakingPart.PART2,
        topic: "A Memorable Journey",
        instruction: "Describe a journey you remember.",
      },
    ],
  });

  return prisma.speakingCueCard.findFirstOrThrow({
    where: {
      part: SpeakingPart.PART2,
    },
  });
}
