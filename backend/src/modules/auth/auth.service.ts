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

export class AuthService {
  private emailService = new EmailService();

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
        emailVerifyExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
        emailVerified: false,
      },
    });

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await storeRefreshToken(user.id, tokens.refreshToken);

    this.emailService
      .sendVerificationEmail(user.email, user.name, verifyToken)
      .catch((err) => console.error("Failed to send verification email:", err));

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
  // VERIFY EMAIL
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

    this.emailService
      .sendEmailVerifiedEmail(user.email, user.name)
      .catch((err) => console.error("Failed to send verified email:", err));

    // ✅ Return tokens so frontend can auto-login from any tab
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await storeRefreshToken(user.id, tokens.refreshToken);

    return { message: "Email verified successfully", tokens };
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
        emailVerifyExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await this.emailService.sendVerificationEmail(
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
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    this.emailService
      .sendPasswordResetEmail(user.email, user.name, token)
      .catch((err) =>
        console.error("Failed to send password reset email:", err)
      );

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

    const user = await prisma.user.findUnique({
      where: { id: record.userId },
    });
    if (!user) throw new Error("User not found");

    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashPassword(data.newPassword) },
    });

    await prisma.passwordReset.update({
      where: { id: record.id },
      data: { used: true },
    });

    await revokeAllTokensForUser(record.userId);

    this.emailService
      .sendPasswordChangedEmail(user.email, user.name)
      .catch((err) =>
        console.error("Failed to send password changed email:", err)
      );

    return { message: "Password reset successfully. Please log in again." };
  }

  // ─────────────────────────────────────────
  // CHANGE PASSWORD
  // ─────────────────────────────────────────
  async changePassword(userId: string, data: ChangePasswordDTO) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error("User not found");

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

    await revokeAllTokensForUser(userId);

    this.emailService
      .sendPasswordChangedEmail(user.email, user.name)
      .catch((err) =>
        console.error("Failed to send password changed email:", err)
      );

    return { message: "Password changed successfully. Please log in again." };
  }

  // ─────────────────────────────────────────
  // GOOGLE OAUTH — GET URL
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
  // GOOGLE OAUTH — CALLBACK
  // ─────────────────────────────────────────
  async googleOAuthCallback(code: string, redirectUri: string) {
    const tokensResponse = await getGoogleOAuthTokens(code, redirectUri);

    if (!tokensResponse.id_token) {
      throw new Error("Google did not return an ID token");
    }

    const googleUser = await getGoogleUser(tokensResponse.id_token);

    const { id: oauthId, email, name, picture, verified_email } = googleUser;

    if (!email) throw new Error("Google account has no email");

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: oauthId,
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

    return { user: safeUser, tokens };
  }
}
