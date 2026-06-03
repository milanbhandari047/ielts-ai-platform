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
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as any,

  // JWT_REFRESH_EXPIRES_IN_MS: parseMs(process.env.JWT_REFRESH_EXPIRES_IN, "7d"),

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
};
