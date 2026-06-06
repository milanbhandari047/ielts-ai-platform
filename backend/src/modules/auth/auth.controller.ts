import type { Request, Response } from "express";

import type { RegisterDTO } from "./dto/register.dto.js";
import type { LoginDTO } from "./dto/login.dto.js";
import type { ForgotPasswordDTO } from "./dto/forgot-password.dto.js";
import type { ResetPasswordDTO } from "./dto/reset-password.dto.js";
import type { ChangePasswordDTO } from "./dto/change-password.dto.js";
import { AuthService } from "./auth.service.js";

export class AuthController {
  private authService = new AuthService();

  // ─────────────────────────────────────────────
  // Register
  // ─────────────────────────────────────────────
  async register(req: Request, res: Response) {
    try {
      const data: RegisterDTO = req.body;
      const result = await this.authService.register(data);
      return res.status(201).json({
        success: true,
        message:
          "Account created. Please check your email to verify your account.",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // ─────────────────────────────────────────────
  // Login
  // ─────────────────────────────────────────────
  async login(req: Request, res: Response) {
    try {
      const data: LoginDTO = req.body;
      const result = await this.authService.login(data);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      return res.status(401).json({ success: false, message: error.message });
    }
  }

  // ─────────────────────────────────────────────
  // Refresh Token
  // ─────────────────────────────────────────────
  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken || typeof refreshToken !== "string") {
        return res
          .status(400)
          .json({ success: false, message: "Refresh token is required" });
      }
      const tokens = await this.authService.refreshToken(refreshToken);
      return res.status(200).json({ success: true, data: tokens });
    } catch (error: any) {
      return res.status(401).json({ success: false, message: error.message });
    }
  }

  // ─────────────────────────────────────────────
  // Logout
  // ─────────────────────────────────────────────
  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken || typeof refreshToken !== "string") {
        return res
          .status(400)
          .json({ success: false, message: "Refresh token is required" });
      }
      const result = await this.authService.logout(refreshToken);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // ─────────────────────────────────────────────
  // Logout All Devices
  // ─────────────────────────────────────────────
  async logoutAll(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const result = await this.authService.logoutAll(userId);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // ─────────────────────────────────────────────
  // Get Profile
  // ─────────────────────────────────────────────
  async getMe(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const user = await this.authService.getProfile(userId);
      return res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  // ─────────────────────────────────────────────
  // Verify Email
  // FIX: The controller was emitting a non-standard double-data shape:
  //   { success, message: result.message, data: result }
  // where result itself was { message, tokens }.
  // That made the frontend read tokens from res.data.data.tokens (three levels
  // deep) while also re-exposing .message at both the top level and inside
  // .data. Flattened to the standard envelope used everywhere else:
  //   { success: true, message, data: { tokens } }
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

      const result = await this.authService.verifyEmail(token);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          tokens: result.tokens, // { accessToken, refreshToken }
        },
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // ─────────────────────────────────────────────
  // Resend Verification Email
  // ─────────────────────────────────────────────
  async resendVerification(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const result = await this.authService.resendVerification(userId);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      const status = error.message === "Email is already verified" ? 409 : 400;
      return res
        .status(status)
        .json({ success: false, message: error.message });
    }
  }

  // ─────────────────────────────────────────────
  // Forgot Password
  // ─────────────────────────────────────────────
  async forgotPassword(req: Request, res: Response) {
    try {
      const data: ForgotPasswordDTO = req.body;
      const result = await this.authService.forgotPassword(data);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // ─────────────────────────────────────────────
  // Reset Password
  // ─────────────────────────────────────────────
  async resetPassword(req: Request, res: Response) {
    try {
      const data: ResetPasswordDTO = req.body;
      const result = await this.authService.resetPassword(data);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // ─────────────────────────────────────────────
  // Change Password
  // ─────────────────────────────────────────────
  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const data: ChangePasswordDTO = req.body;
      const result = await this.authService.changePassword(userId, data);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // ─────────────────────────────────────────────
  // Google OAuth — Redirect
  // ─────────────────────────────────────────────
  async googleOAuthRedirect(req: Request, res: Response) {
    try {
      const redirectUri = `${process.env.SERVER_URL}/auth/oauth/google/callback`;
      const url = this.authService.getGoogleOAuthUrl(redirectUri);
      return res.redirect(url);
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to initiate Google login" });
    }
  }

  // ─────────────────────────────────────────────
  // Google OAuth — Callback
  // ─────────────────────────────────────────────
  async googleOAuthCallback(req: Request, res: Response) {
    try {
      const { code } = req.query;
      if (!code || typeof code !== "string") {
        return res
          .status(400)
          .json({ success: false, message: "Authorization code is required" });
      }
      const redirectUri = `${process.env.SERVER_URL}/auth/oauth/google/callback`;
      const result = await this.authService.googleOAuthCallback(
        code,
        redirectUri
      );
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
