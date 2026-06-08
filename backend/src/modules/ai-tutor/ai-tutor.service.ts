import { gemini, groq, openrouter } from "../../config/client.js";
import { prisma } from "../../config/db.js";
import {
  getPagination,
  paginatedResponse,
} from "../../utils/pagination.utils.js";

const SYSTEM_PROMPT = `
You are an expert IELTS tutor with 15+ years of experience.
Be clear, structured, and give band-level feedback.
`;

type Provider = "openrouter" | "groq" | "gemini";

// ───────────────────────────────────────────────
// AI ROUTER
// ───────────────────────────────────────────────
async function aiChat(
  provider: Provider,
  messages: { role: "user" | "assistant" | "system"; content: string }[]
): Promise<string> {
  // OpenRouter
  if (provider === "openrouter") {
    const res = await openrouter.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    });

    return res.choices[0]?.message?.content ?? "";
  }

  // Groq (fast)
  if (provider === "groq") {
    const res = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    });

    return res.choices[0]?.message?.content ?? "";
  }

  // Gemini
  if (provider === "gemini") {
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-pro" });

    const chat = model.startChat({
      history: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    });

    const lastMessage = messages.at(-1);

    if (!lastMessage || !lastMessage.content) {
      throw new Error("No valid message to send to Gemini");
    }

    const result = await chat.sendMessage(lastMessage.content);

    return result.response.text();
  }

  return "Invalid provider";
}

export class AiTutorService {
  // choose default provider here
  private provider: Provider = "openrouter";

  async createSession(userId: string, firstMessage: string) {
    const title =
      firstMessage.length > 50 ? firstMessage.slice(0, 50) + "…" : firstMessage;

    const session = await prisma.aiTutorSession.create({
      data: { userId, title },
    });

    const reply = await aiChat(this.provider, [
      { role: "user", content: firstMessage },
    ]);

    return {
      id: session.id,
      title,
      createdAt: session.createdAt.toISOString(),
      messages: [
        {
          role: "user",
          content: firstMessage,
          createdAt: new Date().toISOString(),
        },
        {
          role: "assistant",
          content: reply,
          createdAt: new Date().toISOString(),
        },
      ],
    };
  }

  async sendMessage(
    userId: string,
    sessionId: string,
    message: string,
    history: { role: "user" | "assistant"; content: string }[] = []
  ) {
    const session = await prisma.aiTutorSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) throw new Error("Session not found");

    const reply = await aiChat(this.provider, [
      ...history,
      { role: "user", content: message },
    ]);

    await prisma.aiTokenUsage.create({
      data: {
        userId,
        feature: "ai_tutor",
        model: this.provider,
        tokens: Math.ceil((message.length + reply.length) / 4),
      },
    });

    return { reply, sessionId };
  }

  async streamMessage(
    userId: string,
    sessionId: string,
    message: string,
    history: { role: "user" | "assistant"; content: string }[],
    onChunk: (chunk: string) => void,
    onDone: () => void
  ) {
    // NOTE: streaming differs per provider → simple fallback
    const reply = await aiChat(this.provider, [
      ...history,
      { role: "user", content: message },
    ]);

    reply.split(" ").forEach((word, i) => {
      setTimeout(() => onChunk(word + " "), i * 10);
    });

    setTimeout(onDone, reply.length * 10);
  }

  async getSessions(userId: string, query: any) {
    const { page, limit, skip } = getPagination(query);

    const [sessions, total] = await Promise.all([
      prisma.aiTutorSession.findMany({
        where: { userId },
        orderBy: { id: "desc" },
        skip,
        take: limit,
      }),
      prisma.aiTutorSession.count({ where: { userId } }),
    ]);

    return paginatedResponse(
      sessions.map((s) => ({
        id: s.id,
        title: s.title,
        createdAt: s.createdAt.toISOString(),
      })),
      total,
      page,
      limit
    );
  }

  async getSession(userId: string, sessionId: string) {
    const session = await prisma.aiTutorSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) throw new Error("Session not found");

    return {
      id: session.id,
      title: session.title,
      createdAt: session.createdAt.toISOString(),
      messages: [],
    };
  }

  async deleteSession(userId: string, sessionId: string) {
    await prisma.aiTutorSession.deleteMany({
      where: { id: sessionId, userId },
    });

    return { message: "Session deleted" };
  }
}
