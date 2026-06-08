import { prisma } from "../../config/db.js";
import {
  getPagination,
  paginatedResponse,
} from "../../utils/pagination.utils.js";
import { AnalyticsService } from "../analytics/analytics.service.js";
import { evaluateWriting } from "./writing-evaluator.js";

const analyticsService = new AnalyticsService();

export class WritingService {
  async getPrompts(task?: "TASK1" | "TASK2") {
    return prisma.writingPrompt.findMany({
      ...(task && {
        where: { task },
      }),
      orderBy: { id: "asc" },
    });
  }

  async getPrompt(promptId: string) {
    const p = await prisma.writingPrompt.findUnique({
      where: { id: promptId },
    });
    if (!p) throw new Error("Prompt not found");
    return p;
  }

  async submit(
    userId: string,
    promptId: string,
    essay: string,
    wordCount: number
  ) {
    const prompt = await prisma.writingPrompt.findUnique({
      where: { id: promptId },
    });
    if (!prompt) throw new Error("Prompt not found");

    // Create submission immediately with null scores (pending)
    const submission = await prisma.writingSubmission.create({
      data: { userId, promptId, essay, wordCount },
    });

    // Kick off AI evaluation in background — do NOT await
    this.runAIEvaluation(
      submission.id,
      prompt.task,
      prompt.instruction,
      essay,
      userId
    ).catch(console.error);

    return { submissionId: submission.id, status: "PENDING" };
  }

  private async runAIEvaluation(
    submissionId: string,
    task: "TASK1" | "TASK2",
    instruction: string,
    essay: string,
    userId: string
  ) {
    try {
      const result = await evaluateWriting(task, instruction, essay);

      await prisma.writingSubmission.update({
        where: { id: submissionId },
        data: {
          overallBand: result.overallBand,
          taskResponse: result.taskResponse,
          coherence: result.coherence,
          lexical: result.lexical,
          grammar: result.grammar,
          feedback: result as any,
        },
      });

      await analyticsService.upsertBandFromAttempt(
        userId,
        "writing",
        result.overallBand
      );
      await analyticsService.updateStreak(userId);

      // Track AI token usage
      await prisma.aiTokenUsage.create({
        data: {
          userId,
          feature: "writing_evaluation",
          model: "gpt-4o",
          tokens: 2000,
        },
      });
    } catch (err) {
      console.error("[WritingAI] Evaluation failed for", submissionId, err);
    }
  }

  async getSubmission(userId: string, submissionId: string) {
    const sub = await prisma.writingSubmission.findFirst({
      where: { id: submissionId, userId },
      include: { prompt: true },
    });
    if (!sub) throw new Error("Submission not found");

    // Return shape matches WritingResult type
    const feedback = sub.feedback as any;
    return {
      submissionId: sub.id,
      overallBand: sub.overallBand,
      taskResponse: sub.taskResponse,
      coherence: sub.coherence,
      lexical: sub.lexical,
      grammar: sub.grammar,
      wordCount: sub.wordCount,
      feedback: feedback?.feedback ?? [],
      improvedVersion: feedback?.improvedVersion ?? null,
    };
  }

  async getMySubmissions(
    userId: string,
    query: { page?: string; limit?: string }
  ) {
    const { page, limit, skip } = getPagination(query);

    const [subs, total] = await Promise.all([
      prisma.writingSubmission.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { id: "desc" },
        include: { prompt: { select: { title: true, task: true } } },
      }),
      prisma.writingSubmission.count({ where: { userId } }),
    ]);

    const items = subs.map((s) => ({
      id: s.id,
      promptTitle: s.prompt.title,
      task: s.prompt.task,
      overallBand: s.overallBand,
      wordCount: s.wordCount,
      createdAt: new Date().toISOString(),
      status: s.overallBand !== null ? "EVALUATED" : "PENDING",
    }));

    return paginatedResponse(items, total, page, limit);
  }
}
