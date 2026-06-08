import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * SM-2 Algorithm
 */
function sm2(
  quality: number,
  repetitions: number,
  easeFactor: number,
  interval: number
) {
  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);

    repetitions++;

    easeFactor =
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    if (easeFactor < 1.3) easeFactor = 1.3;
  } else {
    repetitions = 0;
    interval = 1;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { repetitions, easeFactor, interval, nextReview };
}

export class VocabularyService {
  constructor(private db = prisma) {}

  /**
   * Get vocabulary list
   */
  async getVocabulary(userId: string, page = 1, limit = 20, search?: string) {
    page = Math.max(1, page);
    limit = Math.min(100, limit);

    const where: Prisma.VocabularyWhereInput = search
      ? {
          word: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : {};

    const [items, total] = await Promise.all([
      this.db.vocabulary.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { word: "asc" },
        include: {
          progress: {
            where: { userId },
            take: 1,
          },
          savedWords: {
            where: { userId },
            take: 1,
            select: { id: true },
          },
        },
      }),

      this.db.vocabulary.count({ where }),
    ]);

    return {
      items: items.map((v) => ({
        id: v.id,
        word: v.word,
        meaning: v.meaning,
        isSaved: v.savedWords.length > 0,
        progress: v.progress[0] ?? null,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Daily words
   */
  async getDailyWords(userId: string) {
    const now = new Date();

    const dueReviews = await this.db.vocabularyProgress.findMany({
      where: {
        userId,
        nextReview: { lte: now },
      },
      include: { vocabulary: true },
      orderBy: { nextReview: "asc" },
      take: 10,
      distinct: ["vocabularyId"],
    });

    const needed = 10 - dueReviews.length;

    let newWords: any[] = [];

    if (needed > 0) {
      const learned = await this.db.vocabularyProgress.findMany({
        where: { userId },
        select: { vocabularyId: true },
      });

      const excludeIds = learned.map((l) => l.vocabularyId);

      newWords = await this.db.vocabulary.findMany({
        where: { id: { notIn: excludeIds } },
        orderBy: { word: "asc" },
        take: needed,
      });
    }

    return {
      dueReviews: dueReviews.map((p) => ({
        ...p.vocabulary,
        progressId: p.id,
        isReview: true,
      })),
      newWords: newWords.map((w) => ({
        ...w,
        progressId: null,
        isReview: false,
      })),
    };
  }

  /**
   * Flashcards
   */
  async getFlashcards(userId: string, count = 20) {
    const saved = await this.db.savedWord.findMany({
      where: { userId },
      include: {
        vocabulary: {
          include: {
            progress: {
              where: { userId },
              take: 1,
            },
          },
        },
      },
      take: count,
    });

    return saved.map((s) => ({
      id: s.vocabulary.id,
      word: s.vocabulary.word,
      meaning: s.vocabulary.meaning,
      notes: s.notes ?? null,
      progress: s.vocabulary.progress[0] ?? null,
    }));
  }

  /**
   * Quiz generator
   */
  async getQuiz(userId: string, count = 10) {
    const userProgress = await this.db.vocabularyProgress.findMany({
      where: { userId },
      include: { vocabulary: true },
      orderBy: { correctCount: "asc" },
      take: count,
    });

    if (userProgress.length < 4) return [];

    const allVocab = await this.db.vocabulary.findMany();

    return userProgress.map((p) => {
      const distractors = allVocab
        .filter((v) => v.id !== p.vocabularyId)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [p.vocabulary, ...distractors].sort(
        () => Math.random() - 0.5
      );

      return {
        id: p.id,
        word: p.vocabulary.word,
        correctAnswer: p.vocabulary.meaning,
        options: options.map((o) => ({
          id: o.id,
          meaning: o.meaning,
        })),
      };
    });
  }

  /**
   * Submit review
   */
  async submitReview(userId: string, vocabularyId: string, quality: number) {
    if (quality < 0 || quality > 5) {
      throw new Error("INVALID_QUALITY");
    }

    const existing = await this.db.vocabularyProgress.findUnique({
      where: {
        userId_vocabularyId: { userId, vocabularyId },
      },
    });

    const repetitions = existing?.repetitions ?? 0;
    const easeFactor = existing?.easeFactor ?? 2.5;
    const interval = existing?.interval ?? 0;

    const result = sm2(quality, repetitions, easeFactor, interval);

    const progress = existing
      ? await this.db.vocabularyProgress.update({
          where: {
            userId_vocabularyId: { userId, vocabularyId },
          },
          data: {
            correctCount: {
              increment: quality >= 3 ? 1 : 0,
            },
            repetitions: result.repetitions,
            easeFactor: result.easeFactor,
            interval: result.interval,
            nextReview: result.nextReview,
          },
        })
      : await this.db.vocabularyProgress.create({
          data: {
            userId,
            vocabularyId,
            correctCount: quality >= 3 ? 1 : 0,
            repetitions: result.repetitions,
            easeFactor: result.easeFactor,
            interval: result.interval,
            nextReview: result.nextReview,
          },
        });

    return {
      ...result,
      correctCount: progress.correctCount,
    };
  }

  /**
   * Toggle save word
   */
  async toggleSave(userId: string, vocabularyId: string, notes?: string) {
    const existing = await this.db.savedWord.findUnique({
      where: {
        userId_vocabularyId: { userId, vocabularyId },
      },
    });

    if (existing) {
      await this.db.savedWord.delete({
        where: {
          userId_vocabularyId: { userId, vocabularyId },
        },
      });

      return { saved: false };
    }

    await this.db.savedWord.create({
      data: {
        userId,
        vocabularyId,
        ...(notes ? { notes } : {}),
      },
    });

    return { saved: true };
  }

  /**
   * Saved words
   */
  async getSavedWords(userId: string) {
    const saved = await this.db.savedWord.findMany({
      where: { userId },
      include: {
        vocabulary: {
          include: {
            progress: {
              where: { userId },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return saved.map((s) => ({
      id: s.vocabulary.id,
      word: s.vocabulary.word,
      meaning: s.vocabulary.meaning,
      notes: s.notes ?? null,
      savedAt: s.createdAt,
      progress: s.vocabulary.progress[0] ?? null,
    }));
  }

  /**
   * Stats
   */
  async getStats(userId: string) {
    const [totalSaved, totalLearned, dueCount] = await Promise.all([
      this.db.savedWord.count({ where: { userId } }),
      this.db.vocabularyProgress.count({
        where: { userId, correctCount: { gte: 3 } },
      }),
      this.db.vocabularyProgress.count({
        where: { userId, nextReview: { lte: new Date() } },
      }),
    ]);

    return {
      totalSaved,
      totalLearned,
      dueCount,
    };
  }
}
