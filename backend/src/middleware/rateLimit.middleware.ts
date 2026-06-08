import rateLimit from "express-rate-limit";

// General API — 200 req/15 min per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

// Auth endpoints — 20 req/15 min per IP (brute-force protection)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempts, please try again later.",
  },
});

// AI endpoints — 30 req/hour per IP (cost control)
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "AI evaluation limit reached. Please try again in an hour.",
  },
});
