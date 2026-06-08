import { PrismaClient } from "@prisma/client";

export async function seedBlog(prisma: PrismaClient) {
  await prisma.blogPost.createMany({
    data: [
      {
        title: "10 IELTS Reading Tips",
        slug: "10-ielts-reading-tips",
        content: "Effective strategies to improve reading score.",
      },
      {
        title: "Master IELTS Writing Task 2",
        slug: "master-ielts-writing-task-2",
        content: "A complete guide to writing high-band essays.",
      },
    ],
    skipDuplicates: true,
  });
}
