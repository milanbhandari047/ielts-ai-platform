import type { Request, Response } from "express";

import type { RegisterDTO } from "./dto/register.dto.js";
import type { LoginDTO } from "./dto/login.dto.js";
import type { ForgotPasswordDTO } from "./dto/forgot-password.dto.js";
import type { ResetPasswordDTO } from "./dto/reset-password.dto.js";
import type { ChangePasswordDTO } from "./dto/change-password.dto.js";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

export class AuthController {
  // ─────────────────────────────────────────────
  // Register
  // ─────────────────────────────────────────────

  async register(req: Request, res: Response) {
    try {
      const data: RegisterDTO = req.body;

      const result = await authService.register(data);

      return res.status(201).json({
        success: true,
        message:
          "Account created. Please check your email to verify your account.",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ─────────────────────────────────────────────
  // Login
  // ─────────────────────────────────────────────

  async login(req: Request, res: Response) {
    try {
      const data: LoginDTO = req.body;

      const result = await authService.login(data);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ─────────────────────────────────────────────
  // Refresh Token
  // ─────────────────────────────────────────────

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken || typeof refreshToken !== "string") {
        return res.status(400).json({
          success: false,
          message: "Refresh token is required",
        });
      }

      const tokens = await authService.refreshToken(refreshToken);

      return res.status(200).json({
        success: true,
        data: tokens,
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ─────────────────────────────────────────────
  // Logout
  // ─────────────────────────────────────────────

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken || typeof refreshToken !== "string") {
        return res.status(400).json({
          success: false,
          message: "Refresh token is required",
        });
      }

      const result = await authService.logout(refreshToken);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ─────────────────────────────────────────────
  // Logout All Devices
  // ─────────────────────────────────────────────

  async logoutAll(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;

      const result = await authService.logoutAll(userId);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ─────────────────────────────────────────────
  // Get Profile
  // ─────────────────────────────────────────────

  async getMe(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;

      const user = await authService.getProfile(userId);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ─────────────────────────────────────────────
  // Verify Email
  // ─────────────────────────────────────────────

  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.query;

      if (!token || typeof token !== "string") {
        return res.status(400).json({
          success: false,
          message: "Verification token is required",
        });
      }

      const result = await authService.verifyEmail(token);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ─────────────────────────────────────────────
  // Resend Verification Email
  // ─────────────────────────────────────────────

  async resendVerification(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;

      const result = await authService.resendVerification(userId);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      // 409 Conflict if already verified, 400 for everything else
      const status = error.message === "Email is already verified" ? 409 : 400;

      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ─────────────────────────────────────────────
  // Forgot Password
  // ─────────────────────────────────────────────

  async forgotPassword(req: Request, res: Response) {
    try {
      const data: ForgotPasswordDTO = req.body;

      const result = await authService.forgotPassword(data);

      // Always 200 — never reveal whether the email exists
      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ─────────────────────────────────────────────
  // Reset Password
  // ─────────────────────────────────────────────

  async resetPassword(req: Request, res: Response) {
    try {
      const data: ResetPasswordDTO = req.body;

      const result = await authService.resetPassword(data);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ─────────────────────────────────────────────
  // Change Password
  // ─────────────────────────────────────────────

  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const data: ChangePasswordDTO = req.body;

      const result = await authService.changePassword(userId, data);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ─────────────────────────────────────────────
  // Google OAuth — Redirect
  // ─────────────────────────────────────────────

  async googleOAuthRedirect(req: Request, res: Response) {
    try {
      const redirectUri = `${process.env.SERVER_URL}/auth/oauth/google/callback`;

      const url = authService.getGoogleOAuthUrl(redirectUri);

      return res.redirect(url);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Failed to initiate Google login",
      });
    }
  }

  // ─────────────────────────────────────────────
  // Google OAuth — Callback
  // ─────────────────────────────────────────────

  async googleOAuthCallback(req: Request, res: Response) {
    try {
      const { code } = req.query;

      if (!code || typeof code !== "string") {
        return res.status(400).json({
          success: false,
          message: "Authorization code is required",
        });
      }

      const redirectUri = `${process.env.SERVER_URL}/auth/oauth/google/callback`;

      const result = await authService.googleOAuthCallback(code, redirectUri);

      // Option A — API response (for mobile / SPA clients that handle the callback)
      // return res.status(200).json({ success: true, data: result });

      // Option B — redirect to frontend with tokens in query params (for web browser flow)
      const { accessToken, refreshToken } = result.tokens;

      return res.redirect(
        `${process.env.CLIENT_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (error: any) {
      return res.redirect(
        `${process.env.CLIENT_URL}/auth/login?error=${encodeURIComponent(
          error.message
        )}`
      );
    }
  }
}
