import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "./env.js";

// ── OpenRouter (GPT models, Claude, etc.) ───────────────
export const openrouter = new OpenAI({
  apiKey: ENV.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// ── Groq (fast LLaMA models) ────────────────────────────
export const groq = new OpenAI({
  apiKey: ENV.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ── Gemini ───────────────────────────────────────────────
export const gemini = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
