import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * =========================
 * SM-2 Algorithm (optimized)
 * =========================
 */
function sm2(
  quality: number,
  repetitions: number,
  easeFactor: number,
  interval: number
) {
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions++;

    easeFactor =
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    if (easeFactor < 1.3) easeFactor = 1.3;

    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 2;
    else if (repetitions === 3) interval = 4;
    else interval = Math.min(Math.round(interval * easeFactor), 10);
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { repetitions, easeFactor, interval, nextReview };
}

// Example
const result = sm2(5, 0, 2.5, 0);
console.log(result);
/**
 * =========================
 * VOCABULARY SERVICE
 * =========================
 */
export class VocabularyService {
  constructor(private db = prisma) {}

  // -------------------------
  // GET VOCABULARY LIST
  // -------------------------
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
        example: v.example,
        topic: v.topic,
        isSaved: v.savedWords.length > 0,
        progress: v.progress[0] ?? null,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // -------------------------
  // DAILY WORDS
  // -------------------------
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
        id: p.vocabulary.id,
        word: p.vocabulary.word,
        meaning: p.vocabulary.meaning,
        example: p.vocabulary.example,
        topic: p.vocabulary.topic,
        progressId: p.id,
        isReview: true,
      })),
      newWords: newWords.map((w) => ({
        id: w.id,
        word: w.word,
        meaning: w.meaning,
        example: w.example,
        topic: w.topic,
        progressId: null,
        isReview: false,
      })),
    };
  }

  // -------------------------
  // FLASHCARDS
  // -------------------------
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
      example: s.vocabulary.example,
      topic: s.vocabulary.topic,
      notes: s.notes ?? null,
      progress: s.vocabulary.progress[0] ?? null,
    }));
  }

  // -------------------------
  // QUIZ
  // -------------------------
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
        id: p.vocabulary.id,
        word: p.vocabulary.word,
        correctAnswer: p.vocabulary.meaning,
        options: options.map((o) => ({
          id: o.id,
          meaning: o.meaning,
        })),
      };
    });
  }

  // -------------------------
  // REVIEW (SM-2)
  // -------------------------
  async submitReview(userId: string, vocabularyId: string, quality: number) {
    if (quality < 0 || quality > 5) throw new Error("INVALID_QUALITY");

    const existing = await this.db.vocabularyProgress.findUnique({
      where: {
        userId_vocabularyId: { userId, vocabularyId },
      },
    });

    const result = sm2(
      quality,
      existing?.repetitions ?? 0,
      existing?.easeFactor ?? 2.5,
      existing?.interval ?? 0
    );

    const progress = existing
      ? await this.db.vocabularyProgress.update({
          where: {
            userId_vocabularyId: { userId, vocabularyId },
          },
          data: {
            correctCount: {
              increment: quality >= 3 ? 1 : 0,
            },
            ...result,
          },
        })
      : await this.db.vocabularyProgress.create({
          data: {
            userId,
            vocabularyId,
            correctCount: quality >= 3 ? 1 : 0,
            ...result,
          },
        });

    return { ...result, correctCount: progress.correctCount };
  }

  // -------------------------
  // SAVE / UNSAVE
  // -------------------------
  async toggleSave(userId: string, vocabularyId: string, notes?: string) {
    const existing = await this.db.savedWord.findUnique({
      where: {
        userId_vocabularyId: { userId, vocabularyId },
      },
    });

    if (existing) {
      await this.db.savedWord.deleteMany({
        where: { userId, vocabularyId },
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

  // -------------------------
  // SAVED WORDS
  // -------------------------
  async getSavedWords(userId: string) {
    const saved = await this.db.savedWord.findMany({
      where: { userId },
      include: {
        vocabulary: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return saved.map((s) => ({
      id: s.vocabulary.id,
      word: s.vocabulary.word,
      meaning: s.vocabulary.meaning,
      example: s.vocabulary.example,
      topic: s.vocabulary.topic,
      notes: s.notes ?? null,
      savedAt: s.createdAt,
    }));
  }

  // -------------------------
  // STATS
  // -------------------------
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

    return { totalSaved, totalLearned, dueCount };
  }

  // -------------------------
  // MASTERED WORDS
  // -------------------------
  async getMasteredWords(userId: string) {
    const mastered = await this.db.vocabularyProgress.findMany({
      where: {
        userId,
        correctCount: { gte: 3 },
      },
      include: { vocabulary: true },
      orderBy: { correctCount: "desc" },
    });

    return mastered.map((p) => ({
      id: p.vocabulary.id,
      word: p.vocabulary.word,
      meaning: p.vocabulary.meaning,
      example: p.vocabulary.example,
      topic: p.vocabulary.topic,
      correctCount: p.correctCount,
      repetitions: p.repetitions,
      nextReview: p.nextReview,
    }));
  }

  // -------------------------
  // DUE REVIEWS
  // -------------------------
  async getDueReviews(userId: string) {
    const reviews = await this.db.vocabularyProgress.findMany({
      where: {
        userId,
        nextReview: { lte: new Date() },
      },
      include: { vocabulary: true },
      orderBy: { nextReview: "asc" },
    });

    return reviews.map((p) => ({
      id: p.vocabulary.id,
      word: p.vocabulary.word,
      meaning: p.vocabulary.meaning,
      example: p.vocabulary.example,
      topic: p.vocabulary.topic,
      nextReview: p.nextReview,
      correctCount: p.correctCount,
    }));
  }
}
