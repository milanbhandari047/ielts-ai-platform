import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { ENV } from "../config/env.js";
import { prisma } from "../config/db.js";
import type { JwtPayload } from "../modules/auth/auth.types.js";

// ─────────────────────────────────────────────
// Extend Express Request
// ─────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// ─────────────────────────────────────────────
// Authenticate
// Verifies JWT and attaches payload to req.user
// ─────────────────────────────────────────────

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
        code: "NO_TOKEN",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
        code: "NO_TOKEN",
      });
    }

    const payload = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;

    req.user = payload;

    next();
  } catch (err: any) {
    // ⭐ IMPORTANT FIX
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
      code: "INVALID_TOKEN",
    });
  }
};

// ─────────────────────────────────────────────
// Authorize (Role-Based Access Control)
// Use after authenticate
// ─────────────────────────────────────────────

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.role) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};

// ─────────────────────────────────────────────
// Require Verified Email
// Use after authenticate
// ─────────────────────────────────────────────

export const requireEmailVerified = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        emailVerified: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before accessing this feature",
      });
    }

    next();
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
