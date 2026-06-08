import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ENV } from "../../src/config/env.js";

export async function seedUsers(prisma: PrismaClient) {
  const adminPassword = await bcrypt.hash(ENV.ADMIN_PASSWORD, 10);
  const studentPassword = await bcrypt.hash(ENV.STUDENT_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: {
      email: ENV.ADMIN_EMAIL,
    },
    update: {},
    create: {
      name: ENV.ADMIN_NAME,
      email: ENV.ADMIN_EMAIL,
      password: adminPassword,
      role: Role.ADMIN,
      emailVerified: true,
      targetBand: 9,
    },
  });

  const student = await prisma.user.upsert({
    where: {
      email: ENV.STUDENT_EMAIL,
    },
    update: {},
    create: {
      name: ENV.STUDENT_NAME,
      email: ENV.STUDENT_EMAIL,
      password: studentPassword,
      role: Role.STUDENT,
      emailVerified: true,
      targetBand: 7,
      streak: 3,
    },
  });

  await prisma.userAnalytics.upsert({
    where: {
      userId: student.id,
    },
    update: {},
    create: {
      userId: student.id,
      readingBand: 6.5,
      listeningBand: 7,
      writingBand: 6,
      speakingBand: 6.5,
    },
  });

  return {
    admin,
    student,
  };
}
