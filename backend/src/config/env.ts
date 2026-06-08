import dotenv from "dotenv";
import path from "path";

// ✅ This MUST run before any process.env access
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const ENV = {
  // Server
  PORT: Number(process.env.PORT) || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database
  DATABASE_URL: process.env.DATABASE_URL!,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN || "15m") as any,
  JWT_REFRESH_EXPIRES_IN: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as any,

  // Frontend
  CLIENT_URL: process.env.CLIENT_URL!,

  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",

  // Redis
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",

  // Email
  EMAIL_FROM: process.env.EMAIL_FROM!,
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: Number(process.env.SMTP_PORT),
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASS: process.env.SMTP_PASS!,

  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,

  //API KEY
  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY!,
  GROQ_API_KEY: process.env.GROQ_API_KEY!,

  //ADMIN
  ADMIN_NAME: process.env.ADMIN_NAME!,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,

  // STUDENT
  STUDENT_NAME: process.env.STUDENT_NAME!,
  STUDENT_EMAIL: process.env.STUDENT_EMAIL!,
  STUDENT_PASSWORD: process.env.STUDENT_PASSWORD!,
};

// ✅ Crash at startup with a clear message if anything critical is missing
const required: (keyof typeof ENV)[] = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "CLIENT_URL",
  "EMAIL_FROM",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
  "GROQ_API_KEY",
  "GEMINI_API_KEY",
  "OPENROUTER_API_KEY",
];

for (const key of required) {
  if (!ENV[key]) {
    throw new Error(
      `\n❌ Missing required environment variable: ${key}\n` +
        `   Check your .env file at: ${path.resolve(process.cwd(), ".env")}\n`
    );
  }
}
