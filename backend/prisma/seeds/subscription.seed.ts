import {
  PrismaClient,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@prisma/client";

export async function seedSubscription(prisma: PrismaClient, userId: string) {
  await prisma.subscription.upsert({
    where: {
      userId,
    },
    update: {},
    create: {
      userId,
      plan: SubscriptionPlan.PREMIUM,
      status: SubscriptionStatus.ACTIVE,
      startAt: new Date(),
      endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
}
