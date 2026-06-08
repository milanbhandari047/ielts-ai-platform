import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import fs from "fs";
import { ENV } from "../../config/env.js";

/* ───────────────────────── TYPES ───────────────────────── */

export interface SpeakingEvaluationResult {
  transcript: string;
  fluency: number;
  pronunciation: number;
  grammar: number;
  vocabulary: number;
  overallBand: number;
  feedback: {
    fluency: string;
    pronunciation: string;
    grammar: string;
    vocabulary: string;
  };
  suggestions: string[];
}

/* ───────────────────────── PROVIDERS ───────────────────────── */

/** OpenRouter (PRIMARY AI) */
const openrouter = new OpenAI({
  apiKey: ENV.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

/** Groq (fallback + transcription) */
const groq = new OpenAI({
  apiKey: ENV.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/** Gemini (final fallback) */
const gemini = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

/* ───────────────────────── SYSTEM PROMPT ───────────────────────── */

const SYSTEM = `
You are an IELTS speaking examiner.
Return ONLY valid JSON.
No markdown.
Strict IELTS band scoring.
`;

/* ───────────────────────── PROMPT BUILDER ───────────────────────── */

function buildPrompt(
  part: "PART1" | "PART2" | "PART3",
  topic: string,
  transcript: string
) {
  return `
IELTS Speaking ${part}
Topic: ${topic}

Transcript:
${transcript}

Return JSON exactly:
{
  "fluency": number,
  "pronunciation": number,
  "grammar": number,
  "vocabulary": number,
  "feedback": {
    "fluency": "string",
    "pronunciation": "string",
    "grammar": "string",
    "vocabulary": "string"
  },
  "suggestions": ["string"]
}
`;
}

/* ───────────────────────── UTIL ───────────────────────── */

function cleanJSON(raw: string) {
  return raw.replace(/```json|```/g, "").trim();
}

function clamp(n: number) {
  const v = Number(n);
  if (isNaN(v)) return 5;
  return Math.round(Math.max(1, Math.min(9, v)) * 2) / 2;
}

function parse(raw: string): SpeakingEvaluationResult {
  const j = JSON.parse(cleanJSON(raw));

  const fluency = clamp(j.fluency);
  const pronunciation = clamp(j.pronunciation);
  const grammar = clamp(j.grammar);
  const vocabulary = clamp(j.vocabulary);

  const overallBand = clamp(
    (fluency + pronunciation + grammar + vocabulary) / 4
  );

  return {
    transcript: j.transcript ?? "",
    fluency,
    pronunciation,
    grammar,
    vocabulary,
    overallBand,
    feedback: j.feedback ?? {
      fluency: "",
      pronunciation: "",
      grammar: "",
      vocabulary: "",
    },
    suggestions: j.suggestions ?? [],
  };
}

/* ───────────────────────── 1. TRANSCRIPTION (GROQ WHISPER) ───────────────────────── */

export async function transcribeAudio(audioFilePath: string): Promise<string> {
  const file = fs.createReadStream(audioFilePath);

  const res = await groq.audio.transcriptions.create({
    file,
    model: "whisper-large-v3",
    response_format: "text",
  });

  return typeof res === "string" ? res : (res as any).text ?? "";
}

/* ───────────────────────── 2. AI PROVIDERS ───────────────────────── */

async function askOpenRouter(prompt: string) {
  const res = await openrouter.chat.completions.create({
    model: "openai/gpt-4o-mini",
    temperature: 0.2,
    max_tokens: 1200,
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: prompt },
    ],
  });

  return res.choices[0]?.message?.content ?? "{}";
}

async function askGroq(prompt: string) {
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    max_tokens: 1200,
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: prompt },
    ],
  });

  return res.choices[0]?.message?.content ?? "{}";
}

async function askGemini(prompt: string) {
  const model = gemini.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const res = await model.generateContent(`${SYSTEM}\n\n${prompt}`);
  return res.response.text();
}

/* ───────────────────────── 3. MAIN EVALUATION ───────────────────────── */

export async function evaluateSpeaking(
  part: "PART1" | "PART2" | "PART3",
  topic: string,
  transcript: string
): Promise<SpeakingEvaluationResult> {
  const prompt = buildPrompt(part, topic, transcript);

  try {
    return parse(await askOpenRouter(prompt));
  } catch (e) {
    console.error("OpenRouter failed", e);
  }

  try {
    return parse(await askGroq(prompt));
  } catch (e) {
    console.error("Groq failed", e);
  }

  try {
    return parse(await askGemini(prompt));
  } catch (e) {
    console.error("Gemini failed", e);
  }

  throw new Error("All AI providers failed");
}
