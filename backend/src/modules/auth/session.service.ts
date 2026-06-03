/**
 * session.service.ts
 *
 * Manages refresh tokens in the database:
 *  - Store hashed refresh token on issue
 *  - Validate token (hash-compare, expiry, not revoked)
 *  - Rotate on use
 *  - Revoke single token on logout
 *  - Revoke all tokens for a user
 *  - Periodic pruning of expired/revoked records
 */

import { PrismaClient } from "@prisma/client";
import ms from "ms";

import { ENV } from "../../config/env.js";

import type { JwtPayload } from "./auth.types.js";
import type { AuthTokens } from "./dto/auth-response.dto.js";

import { generateTokens, verifyRefreshToken } from "../../utils/jwt.utils.js";

import { hashToken } from "../../utils/crypto.utils.js";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function refreshExpiryDate(): Date {
  const ttl = ms(ENV.JWT_REFRESH_EXPIRES_IN as ms.StringValue);

  return new Date(Date.now() + ttl);
}
// ─────────────────────────────────────────────────────────────
// Store refresh token
// ─────────────────────────────────────────────────────────────

/**
 * Persist a newly issued refresh token (hashed).
 */
export async function storeRefreshToken(
  userId: string,
  rawToken: string
): Promise<void> {
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(rawToken),
      expiresAt: refreshExpiryDate(),
    },
  });
}

// ─────────────────────────────────────────────────────────────
// Rotate refresh token
// ─────────────────────────────────────────────────────────────

/**
 * Validate and rotate refresh token.
 */
export async function rotateRefreshToken(
  rawToken: string
): Promise<AuthTokens> {
  // 1. Verify JWT
  let payload: JwtPayload;

  try {
    payload = verifyRefreshToken(rawToken);
  } catch {
    throw new Error("Invalid or expired refresh token");
  }

  // 2. Hash token
  const hash = hashToken(rawToken);

  // 3. Find token in DB
  const record = await prisma.refreshToken.findUnique({
    where: {
      tokenHash: hash,
    },
  });

  // 4. Validate token
  if (!record || record.revokedAt !== null) {
    // Possible token reuse attack
    if (record?.revokedAt !== null) {
      await revokeAllTokensForUser(payload.userId);
    }

    throw new Error("Refresh token already used or revoked");
  }

  // 5. Check expiry
  if (record.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  // 6. Revoke old token
  await prisma.refreshToken.update({
    where: {
      id: record.id,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  // 7. Generate new tokens
  const tokens = generateTokens({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  });

  // 8. Store new refresh token
  await storeRefreshToken(payload.userId, tokens.refreshToken);

  return tokens;
}

// ─────────────────────────────────────────────────────────────
// Revoke single token
// ─────────────────────────────────────────────────────────────

/**
 * Logout current device.
 */
export async function revokeRefreshToken(rawToken: string): Promise<void> {
  const hash = hashToken(rawToken);

  await prisma.refreshToken.updateMany({
    where: {
      tokenHash: hash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

// ─────────────────────────────────────────────────────────────
// Revoke all tokens
// ─────────────────────────────────────────────────────────────

/**
 * Logout from all devices.
 */
export async function revokeAllTokensForUser(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

// ─────────────────────────────────────────────────────────────
// Cleanup expired tokens
// ─────────────────────────────────────────────────────────────

/**
 * Remove expired/revoked tokens.
 * Run daily via cron job.
 */
export async function pruneExpiredTokens(): Promise<number> {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const { count } = await prisma.refreshToken.deleteMany({
    where: {
      OR: [
        {
          expiresAt: {
            lt: new Date(),
          },
        },
        {
          revokedAt: {
            lt: cutoff,
          },
        },
      ],
    },
  });

  return count;
}
