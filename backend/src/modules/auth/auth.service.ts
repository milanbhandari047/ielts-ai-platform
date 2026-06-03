import { generateTokens } from "../../utils/jwt.utils.js";

import {
  storeRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllTokensForUser,
} from "./session.service.js";

import { generateSecureToken, hashToken } from "../../utils/crypto.utils.js";
import { hashPassword, verifyPassword } from "../../utils/password.utils.js";
import { EmailService } from "../../services/email/email.service.js";

import type { RegisterDTO } from "./dto/register.dto.js";
import type { LoginDTO } from "./dto/login.dto.js";
import type { ForgotPasswordDTO } from "./dto/forgot-password.dto.js";
import type { ResetPasswordDTO } from "./dto/reset-password.dto.js";
import type { ChangePasswordDTO } from "./dto/change-password.dto.js";
import { prisma } from "../../config/db.js";
import { getGoogleOAuthTokens, getGoogleUser } from "./oauth/google-oauth.js";

// Single shared instance — no need to re-instantiate on every call
const emailService = new EmailService();

export class AuthService {
  // ─────────────────────────────────────────
  // REGISTER
  // ─────────────────────────────────────────
  async register(data: RegisterDTO) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) throw new Error("User already exists");

    const password = hashPassword(data.password);
    const verifyToken = generateSecureToken();

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password,
        emailVerifyToken: hashToken(verifyToken),
        emailVerifyExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        emailVerified: false,
      },
    });

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await storeRefreshToken(user.id, tokens.refreshToken);

    // Send verification email — fire and forget, don't block registration
    emailService
      .sendVerificationEmail(user.email, user.name, verifyToken)
      .catch((err) => console.error("Failed to send verification email:", err));

    // Strip password from returned user object — never expose it
    const { password: _, ...safeUser } = user;

    return { user: safeUser, tokens };
  }

  // ─────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────
  async login(data: LoginDTO) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Same error message for both "user not found" and "wrong password"
    // to avoid leaking which emails are registered
    if (!user) throw new Error("Invalid credentials");

    const valid = verifyPassword(data.password, user.password!);
    if (!valid) throw new Error("Invalid credentials");

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await storeRefreshToken(user.id, tokens.refreshToken);

    const { password: _, ...safeUser } = user;

    return { user: safeUser, tokens };
  }

  // ─────────────────────────────────────────
  // REFRESH TOKEN
  // ─────────────────────────────────────────
  async refreshToken(token: string) {
    return rotateRefreshToken(token);
  }

  // ─────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────
  async logout(token: string) {
    await revokeRefreshToken(token);
    return { message: "Logged out" };
  }

  async logoutAll(userId: string) {
    await revokeAllTokensForUser(userId);
    return { message: "Logged out from all devices" };
  }

  // ─────────────────────────────────────────
  // PROFILE
  // ─────────────────────────────────────────

  // FIX: was named profile() — controller calls getProfile(), now consistent
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        avatar: true,
        targetBand: true,
        streak: true,
        createdAt: true,
      },
    });

    if (!user) throw new Error("User not found");

    return user;
  }

  // ─────────────────────────────────────────
  // EMAIL VERIFY
  // ─────────────────────────────────────────
  async verifyEmail(token: string) {
    const hashed = hashToken(token);

    const user = await prisma.user.findFirst({
      where: {
        emailVerifyToken: hashed,
        emailVerifyExpiry: { gt: new Date() },
      },
    });

    if (!user) throw new Error("Invalid or expired verification token");

    if (user.emailVerified) {
      return { message: "Email already verified" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpiry: null,
      },
    });

    return { message: "Email verified successfully" };
  }

  // ─────────────────────────────────────────
  // RESEND VERIFICATION EMAIL
  // ─────────────────────────────────────────
  async resendVerification(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error("User not found");
    if (user.emailVerified) throw new Error("Email is already verified");

    const verifyToken = generateSecureToken();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifyToken: hashToken(verifyToken),
        emailVerifyExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    await emailService.sendVerificationEmail(
      user.email,
      user.name,
      verifyToken
    );

    return { message: "Verification email sent" };
  }

  // ─────────────────────────────────────────
  // FORGOT PASSWORD
  // ─────────────────────────────────────────
  async forgotPassword(data: ForgotPasswordDTO) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Always return the same message — don't reveal whether the email exists
    if (!user) {
      return {
        message: "If that email is registered, a reset link has been sent",
      };
    }

    const token = generateSecureToken();

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: hashToken(token),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send reset email — fire and forget
    emailService
      .sendPasswordResetEmail(user.email, user.name, token)
      .catch((err) =>
        console.error("Failed to send password reset email:", err)
      );

    // FIX: raw token removed from response — it now only goes via email
    return {
      message: "If that email is registered, a reset link has been sent",
    };
  }

  // ─────────────────────────────────────────
  // RESET PASSWORD
  // ─────────────────────────────────────────
  async resetPassword(data: ResetPasswordDTO) {
    const hashed = hashToken(data.token);

    const record = await prisma.passwordReset.findFirst({
      where: {
        token: hashed,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) throw new Error("Invalid or expired reset token");

    const user = await prisma.user.findUnique({ where: { id: record.userId } });
    if (!user) throw new Error("User not found");

    const newPassword = hashPassword(data.newPassword);

    await prisma.user.update({
      where: { id: record.userId },
      data: { password: newPassword },
    });

    await prisma.passwordReset.update({
      where: { id: record.id },
      data: { used: true },
    });

    // Revoke all sessions — user must log in again after resetting
    await revokeAllTokensForUser(record.userId);

    // Notify user that password was changed
    emailService
      .sendPasswordChangedEmail(user.email, user.name)
      .catch((err) =>
        console.error("Failed to send password changed email:", err)
      );

    return { message: "Password reset successfully. Please log in again." };
  }

  // ─────────────────────────────────────────
  // CHANGE PASSWORD
  // ─────────────────────────────────────────

  // FIX: DTO field was "oldPassword" in service but "currentPassword" in validator.
  // Standardised to "currentPassword" here — update ChangePasswordDTO to match.
  async changePassword(userId: string, data: ChangePasswordDTO) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error("User not found");

    // OAuth users may have no password set
    if (!user.password) {
      throw new Error("No password set. Please use your social login.");
    }

    const valid = verifyPassword(data.currentPassword, user.password);
    if (!valid) throw new Error("Current password is incorrect");

    if (data.currentPassword === data.newPassword) {
      throw new Error("New password must be different from current password");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashPassword(data.newPassword) },
    });

    // Revoke all other sessions — force re-login on other devices
    await revokeAllTokensForUser(userId);

    // Notify user
    emailService
      .sendPasswordChangedEmail(user.email, user.name)
      .catch((err) =>
        console.error("Failed to send password changed email:", err)
      );

    return { message: "Password changed successfully. Please log in again." };
  }

  // ─────────────────────────────────────────
  // GOOGLE OAUTH URL
  // ─────────────────────────────────────────
  getGoogleOAuthUrl(redirectUri: string) {
    const root = "https://accounts.google.com/o/oauth2/v2/auth";

    const params = {
      redirect_uri: redirectUri,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      response_type: "code",
      scope: "email profile",
      access_type: "offline",
      prompt: "consent",
    };

    return `${root}?${new URLSearchParams(params).toString()}`;
  }

  // ─────────────────────────────────────────
  // GOOGLE OAUTH CALLBACK
  // ─────────────────────────────────────────
  async googleOAuthCallback(code: string, redirectUri: string) {
    const tokensResponse = await getGoogleOAuthTokens(code, redirectUri);

    if (!tokensResponse.id_token) {
      throw new Error("Google did not return an ID token");
    }

    const googleUser = await getGoogleUser(tokensResponse.id_token);

    const { id: oauthId, email, name, picture, verified_email } = googleUser;
    if (!email) {
      throw new Error("Google account has no email");
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: oauthId, // Use Google ID as user ID to ensure uniqueness
          email,
          name,
          avatar: picture ?? null,
          oauthProvider: "GOOGLE",
          emailVerified: verified_email,
        },
      });
    } else if (!user.oauthId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          oauthProvider: "GOOGLE",
          oauthId,
          avatar: user.avatar ?? picture ?? null,
          emailVerified: true,
        },
      });
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await storeRefreshToken(user.id, tokens.refreshToken);

    const { password: _, ...safeUser } = user;

    return {
      user: safeUser,
      tokens,
    };
  }
}
