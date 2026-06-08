import fs from "fs";
import path from "path";
import { prisma } from "../../config/db.js";
import { transcribeAudio, evaluateSpeaking } from "./speaking-evaluator.js";
import { AnalyticsService } from "../analytics/analytics.service.js";
import {
  getPagination,
  paginatedResponse,
} from "../../utils/pagination.utils.js";

const analyticsService = new AnalyticsService();

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "audio");

export class SpeakingService {
  async getCueCards(part?: "PART1" | "PART2" | "PART3") {
    return prisma.speakingCueCard.findMany({
      ...(part && { where: { part } }),
      orderBy: { id: "asc" },
    });
  }

  async getCueCard(cueCardId: string) {
    const card = await prisma.speakingCueCard.findUnique({
      where: { id: cueCardId },
    });

    if (!card) throw new Error("Cue card not found");
    return card;
  }

  async submit(userId: string, cueCardId: string, file: Express.Multer.File) {
    const cueCard = await prisma.speakingCueCard.findUnique({
      where: { id: cueCardId },
    });

    if (!cueCard) throw new Error("Cue card not found");

    const audioUrl = `/uploads/audio/${file.filename}`;

    const submission = await prisma.speakingSubmission.create({
      data: {
        userId,
        cueCardId,
        audioUrl,
      },
    });

    this.runPipeline(
      submission.id,
      file.path,
      cueCard.part,
      cueCard.topic,
      userId
    ).catch(console.error);

    return {
      submissionId: submission.id,
      status: "PENDING",
    };
  }

  private async runPipeline(
    submissionId: string,
    audioFilePath: string,
    part: "PART1" | "PART2" | "PART3",
    topic: string,
    userId: string
  ) {
    try {
      const transcript = await transcribeAudio(audioFilePath);

      const evaluation = await evaluateSpeaking(part, topic, transcript);

      const band = evaluation.overallBand;

      await prisma.speakingSubmission.update({
        where: { id: submissionId },
        data: {
          transcript,
          fluency: evaluation.fluency,
          pronunciation: evaluation.pronunciation,
          grammar: evaluation.grammar,
          vocabulary: evaluation.vocabulary,
        },
      });

      await analyticsService.upsertBandFromAttempt(userId, "speaking", band);

      await analyticsService.updateStreak(userId);

      await prisma.aiTokenUsage.create({
        data: {
          userId,
          feature: "speaking_evaluation",
          model: "multi-provider-ai",
          tokens: 1500,
        },
      });

      fs.unlink(audioFilePath, () => {});
    } catch (err) {
      console.error("[SpeakingAI] pipeline failed:", err);
    }
  }

  async getSubmission(userId: string, submissionId: string) {
    const sub = await prisma.speakingSubmission.findFirst({
      where: { id: submissionId, userId },
      include: { cueCard: true },
    });

    if (!sub) throw new Error("Submission not found");

    const band =
      sub.fluency && sub.pronunciation && sub.grammar && sub.vocabulary
        ? Math.round(
            ((sub.fluency + sub.pronunciation + sub.grammar + sub.vocabulary) /
              4) *
              2
          ) / 2
        : null;

    return {
      submissionId: sub.id,
      transcript: sub.transcript,
      fluency: sub.fluency,
      pronunciation: sub.pronunciation,
      grammar: sub.grammar,
      vocabulary: sub.vocabulary,
      overallBand: band,
      feedback: {
        fluency: "",
        pronunciation: "",
        grammar: "",
        vocabulary: "",
      },
      suggestions: [],
    };
  }

  async getMySubmissions(
    userId: string,
    query: { page?: string; limit?: string }
  ) {
    const { page, limit, skip } = getPagination(query);

    const [subs, total] = await Promise.all([
      prisma.speakingSubmission.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { id: "desc" },
        include: {
          cueCard: { select: { topic: true, part: true } },
        },
      }),
      prisma.speakingSubmission.count({
        where: { userId },
      }),
    ]);

    const items = subs.map((s) => {
      const band =
        s.fluency && s.pronunciation && s.grammar && s.vocabulary
          ? Math.round(
              ((s.fluency + s.pronunciation + s.grammar + s.vocabulary) / 4) * 2
            ) / 2
          : null;

      return {
        id: s.id,
        topic: s.cueCard.topic,
        part: s.cueCard.part,
        overallBand: band,
        // createdAt: s.createdAt,
        status: band ? "EVALUATED" : "PENDING",
      };
    });

    return paginatedResponse(items, total, page, limit);
  }
}
