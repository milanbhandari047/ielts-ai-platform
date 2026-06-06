import api, { tokenStorage } from "@/lib/axios";
import type {
  RegisterDTO,
  LoginDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  ChangePasswordDTO,
  AuthResponse,
  ProfileResponse,
  MessageResponse,
  TokensResponse,
} from "@/types/auth.types";

class AuthService {
  // ─── Register ─────────────────────────────────────────────────────────────

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/register", data);
    const { accessToken, refreshToken } = res.data.data.tokens;
    tokenStorage.setTokens(accessToken, refreshToken);
    return res.data;
  }

  // ─── Login ────────────────────────────────────────────────────────────────

  async login(data: LoginDTO): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/login", data);
    const { accessToken, refreshToken } = res.data.data.tokens;
    tokenStorage.setTokens(accessToken, refreshToken);
    return res.data;
  }

  // ─── Refresh ──────────────────────────────────────────────────────────────

  async refresh(): Promise<TokensResponse> {
    const refreshToken = tokenStorage.getRefresh();
    if (!refreshToken) throw new Error("No refresh token");
    const res = await api.post<TokensResponse>("/auth/refresh", {
      refreshToken,
    });
    const { accessToken, refreshToken: newRefresh } = res.data.data;
    tokenStorage.setTokens(accessToken, newRefresh);
    return res.data;
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefresh();
    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch {
      // Clear local tokens even if server call fails
    } finally {
      tokenStorage.clear();
    }
  }

  // ─── Logout All Devices ───────────────────────────────────────────────────

  async logoutAll(): Promise<MessageResponse> {
    const res = await api.post<MessageResponse>("/auth/logout-all");
    tokenStorage.clear();
    return res.data;
  }

  // ─── Get Profile ──────────────────────────────────────────────────────────

  async getMe(): Promise<ProfileResponse> {
    const res = await api.get<ProfileResponse>("/auth/me");
    return res.data;
  }

  // ─── Verify Email ─────────────────────────────────────────────────────────
  // FIX: Removed the duplicate tokenStorage.setTokens call that used to live
  // here. Token persistence is now the single responsibility of useAuth's
  // verifyEmail(), which calls this method and then stores tokens. Having two
  // writers caused a race: if useAuth's fetchMeRaw() ran between the two
  // setTokens calls it could use a stale (or absent) token.
  // This method now just fetches and returns the raw backend envelope.
  async verifyEmail(token: string): Promise<any> {
    const res = await api.get(`/auth/verify-email?token=${token}`);
    return res.data;
  }

  // ─── Resend Verification ──────────────────────────────────────────────────

  async resendVerification(): Promise<MessageResponse> {
    const res = await api.post<MessageResponse>("/auth/resend-verification");
    return res.data;
  }

  // ─── Forgot Password ──────────────────────────────────────────────────────

  async forgotPassword(data: ForgotPasswordDTO): Promise<MessageResponse> {
    const res = await api.post<MessageResponse>("/auth/forgot-password", data);
    return res.data;
  }

  // ─── Reset Password ───────────────────────────────────────────────────────

  async resetPassword(data: ResetPasswordDTO): Promise<MessageResponse> {
    const res = await api.post<MessageResponse>("/auth/reset-password", data);
    return res.data;
  }

  // ─── Change Password ──────────────────────────────────────────────────────

  async changePassword(data: ChangePasswordDTO): Promise<MessageResponse> {
    const res = await api.post<MessageResponse>("/auth/change-password", data);
    tokenStorage.clear();
    return res.data;
  }

  // ─── Google OAuth ─────────────────────────────────────────────────────────

  initiateGoogleOAuth(): void {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/google`;
  }
}

export const authService = new AuthService();
