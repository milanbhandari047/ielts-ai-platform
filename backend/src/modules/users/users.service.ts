import { prisma } from "../../config/db.js";

export class UsersService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        targetBand: true,
        streak: true,
        emailVerified: true,
        createdAt: true,
        profile: true,
        subscription: {
          select: { plan: true, status: true, endAt: true },
        },
        analytics: true,
      },
    });
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateProfile(
    userId: string,
    data: {
      name?: string;
      targetBand?: number;
      bio?: string;
      country?: string;
      phone?: string;
      language?: string;
    }
  ) {
    const { name, targetBand, ...profileData } = data;

    const [user] = await Promise.all([
      prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(targetBand !== undefined && { targetBand }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          targetBand: true,
          streak: true,
        },
      }),
      // Upsert profile fields
      Object.keys(profileData).length > 0
        ? prisma.userProfile.upsert({
            where: { userId },
            create: { userId, ...profileData },
            update: profileData,
          })
        : Promise.resolve(),
    ]);

    return user;
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: { id: true, avatar: true },
    });
  }

  async deleteAccount(userId: string) {
    await prisma.user.delete({ where: { id: userId } });
    return { message: "Account deleted" };
  }
}
