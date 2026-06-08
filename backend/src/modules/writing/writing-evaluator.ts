import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { ENV } from "../../config/env.js";

/* ───────────────────────── TYPES ───────────────────────── */

export interface WritingEvaluationResult {
  overallBand: number;
  taskResponse: number;
  coherence: number;
  lexical: number;
  grammar: number;
  feedback: Array<{
    criterion: string;
    score: number;
    comment: string;
    suggestions: string[];
  }>;
  improvedVersion: string;
}

/* ───────────────────────── PROVIDERS ───────────────────────── */

const openrouter = new OpenAI({
  apiKey: ENV.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const groq = new OpenAI({
  apiKey: ENV.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const gemini = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

/* ───────────────────────── SYSTEM PROMPT ───────────────────────── */

const SYSTEM_PROMPT = `
You are an expert IELTS writing examiner.
Return ONLY valid JSON.
No markdown.
Strict IELTS band descriptors.
`;

/* ───────────────────────── PROMPT BUILDER ───────────────────────── */

function buildPrompt(
  task: "TASK1" | "TASK2",
  instruction: string,
  essay: string
) {
  return `
IELTS Writing ${task}

Instruction:
${instruction}

Essay:
${essay}

Return JSON exactly:
{
  "overallBand": number,
  "taskResponse": number,
  "coherence": number,
  "lexical": number,
  "grammar": number,
  "feedback": [
    {
      "criterion": "taskResponse",
      "score": number,
      "comment": "",
      "suggestions": []
    }
  ],
  "improvedVersion": ""
}
`;
}

/* ───────────────────────── UTIL ───────────────────────── */

function cleanJSON(raw: string) {
  return raw.replace(/```json|```/g, "").trim();
}

function clamp(n: number) {
  return Math.round(Math.max(1, Math.min(9, Number(n))) * 2) / 2;
}

function parse(raw: string): WritingEvaluationResult {
  const json = JSON.parse(cleanJSON(raw));

  const tr = clamp(json.taskResponse ?? 5);
  const cc = clamp(json.coherence ?? 5);
  const lr = clamp(json.lexical ?? 5);
  const gr = clamp(json.grammar ?? 5);

  return {
    taskResponse: tr,
    coherence: cc,
    lexical: lr,
    grammar: gr,
    overallBand: clamp((tr + cc + lr + gr) / 4),
    feedback: json.feedback ?? [],
    improvedVersion: json.improvedVersion ?? "",
  };
}

/* ───────────────────────── PROVIDERS ───────────────────────── */

async function askOpenRouter(prompt: string) {
  const res = await openrouter.chat.completions.create({
    model: "openai/gpt-4o-mini",
    temperature: 0.2,
    max_tokens: 1500,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
  });

  return res.choices[0]?.message?.content ?? "{}";
}

async function askGroq(prompt: string) {
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    max_tokens: 1500,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
  });

  return res.choices[0]?.message?.content ?? "{}";
}

async function askGemini(prompt: string) {
  const model = gemini.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const result = await model.generateContent(`${SYSTEM_PROMPT}\n\n${prompt}`);
  return result.response.text();
}

/* ───────────────────────── MAIN FUNCTION ───────────────────────── */

export async function evaluateWriting(
  task: "TASK1" | "TASK2",
  instruction: string,
  essay: string
): Promise<WritingEvaluationResult> {
  const prompt = buildPrompt(task, instruction, essay);

  try {
    return parse(await askOpenRouter(prompt));
  } catch (e) {
    console.error("OpenRouter failed");
  }

  try {
    return parse(await askGroq(prompt));
  } catch (e) {
    console.error("Groq failed");
  }

  try {
    return parse(await askGemini(prompt));
  } catch (e) {
    console.error("Gemini failed");
  }

  throw new Error("All AI providers failed");
}
