import { prisma } from "../../config/db.js";
import {
  getPagination,
  paginatedResponse,
} from "../../utils/pagination.utils.js";

export async function getNotificationsService(req: any) {
  const { page, limit, skip } = getPagination(req.query as any);

  const [items, total] = await Promise.all([
    prisma.notification.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        id: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.notification.count({
      where: {
        userId: req.user.userId,
      },
    }),
  ]);

  return paginatedResponse(
    items.map((n) => ({
      ...n,
      createdAt: new Date().toISOString(),
    })),
    total,
    page,
    limit
  );
}

export async function getUnreadCountService(userId: string) {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
}

export async function markAsReadService(id: string, userId: string) {
  return prisma.notification.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      isRead: true,
    },
  });
}

export async function markAllAsReadService(userId: string) {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
}

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string
) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
    },
  });
}
