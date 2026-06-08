import { PrismaClient } from "@prisma/client";

import { seedUsers } from "./seeds/users.seed.js";
import { seedReading } from "./seeds/reading.seed.js";
import { seedListening } from "./seeds/listening.seed.js";
import { seedWriting } from "./seeds/writing.seed.js";
import { seedSpeaking } from "./seeds/speaking.seed.js";
import { seedMockTests } from "./seeds/mock-tests.seed.js";

import { seedVocabulary } from "./seeds/vocabulary.seed.js";
import { seedSubscription } from "./seeds/subscription.seed.js";
import { seedNotifications } from "./seeds/notification.seed.js";
import { seedAiTutor } from "./seeds/ai-tutor.seed.js";
import { seedCommunity } from "./seeds/community.seed.js";
import { seedLeaderboard } from "./seeds/leaderboard.seed.js";
import { seedBlog } from "./seeds/blog.seed.js";
import { seedAnalytics } from "./seeds/analytics.seed.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Users
  const { admin, student } = await seedUsers(prisma);

  // User-related data
  await seedSubscription(prisma, student.id);
  await seedVocabulary(prisma);
  await seedNotifications(prisma, student.id);
  await seedAiTutor(prisma, student.id);
  await seedCommunity(prisma, student.id);
  await seedLeaderboard(prisma, student.id);
  await seedBlog(prisma);
  await seedAnalytics(prisma, student.id);

  // IELTS modules
  const reading = await seedReading(prisma);
  const listening = await seedListening(prisma);
  const writing = await seedWriting(prisma);
  const speaking = await seedSpeaking(prisma);

  // Full mock test
  await seedMockTests(
    prisma,
    reading.id,
    listening.id,
    writing.id,
    speaking.id
  );

  console.log("✅ Database seeded successfully");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
