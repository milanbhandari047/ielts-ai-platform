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
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const payload = jwt.verify(token, ENV.JWT_SECRET) as unknown as JwtPayload;

    req.user = payload;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ─────────────────────────────────────────────
// Authorize (Role-Based Access Control)
// Use after authenticate
// ─────────────────────────────────────────────

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
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
