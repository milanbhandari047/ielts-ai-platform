import { PrismaClient } from "@prisma/client";

export async function seedCommunity(prisma: PrismaClient, userId: string) {
  await prisma.communityPost.create({
    data: {
      userId,
      title: "How I Improved Reading Band",
      content: "Practicing daily passages helped me improve.",
    },
  });
}
