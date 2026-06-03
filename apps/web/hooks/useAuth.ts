import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { tokenStorage } from "@/lib/axios";
import type {
  RegisterDTO,
  LoginDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  ChangePasswordDTO,
} from "@/types/auth.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Extract the message from an Axios error or plain Error
const extractError = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message ?? "Something went wrong";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
};

// ─── useAuth ──────────────────────────────────────────────────────────────────

export function useAuth() {
  const router = useRouter();
  const { setUser, setLoading, clearAuth, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const withLoading = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setError(null);
    setLoading(true);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      setError(extractError(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ─── Register ───────────────────────────────────────────────────────────

  const register = async (data: RegisterDTO) =>
    withLoading(async () => {
      const res = await authService.register(data);
      setUser(res.data.user);
      router.push("/dashboard");
      return res;
    });

  // ─── Login ──────────────────────────────────────────────────────────────

  const login = async (data: LoginDTO) =>
    withLoading(async () => {
      const res = await authService.login(data);
      setUser(res.data.user);
      router.push("/dashboard");
      return res;
    });

  // ─── Logout ─────────────────────────────────────────────────────────────

  const logout = async () =>
    withLoading(async () => {
      await authService.logout();
      clearAuth();
      router.push("/auth/login");
    });

  // ─── Logout All ─────────────────────────────────────────────────────────

  const logoutAll = async () =>
    withLoading(async () => {
      await authService.logoutAll();
      clearAuth();
      router.push("/auth/login");
    });

  // ─── Fetch /me and hydrate store ────────────────────────────────────────

  const fetchMe = async () =>
    withLoading(async () => {
      const res = await authService.getMe();
      setUser(res.data);
      return res.data;
    });

  // ─── Forgot Password ─────────────────────────────────────────────────────

  const forgotPassword = async (data: ForgotPasswordDTO) =>
    withLoading(async () => {
      const res = await authService.forgotPassword(data);
      return res;
    });

  // ─── Reset Password ──────────────────────────────────────────────────────

  const resetPassword = async (data: ResetPasswordDTO) =>
    withLoading(async () => {
      const res = await authService.resetPassword(data);
      return res;
    });

  // ─── Change Password ─────────────────────────────────────────────────────

  const changePassword = async (data: ChangePasswordDTO) =>
    withLoading(async () => {
      const res = await authService.changePassword(data);
      // clearAuth done inside service (tokens cleared)
      clearAuth();
      router.push("/auth/login?reason=password_changed");
      return res;
    });

  // ─── Verify Email ────────────────────────────────────────────────────────

  const verifyEmail = async (token: string) =>
    withLoading(async () => {
      const res = await authService.verifyEmail(token);
      // Refetch profile to update emailVerified in store
      const hasToken = !!tokenStorage.getAccess();
      if (hasToken) await fetchMe();
      return res;
    });

  // ─── Resend Verification ─────────────────────────────────────────────────

  const resendVerification = async () =>
    withLoading(async () => {
      const res = await authService.resendVerification();
      return res;
    });

  // ─── Google OAuth ────────────────────────────────────────────────────────

  const loginWithGoogle = () => {
    authService.initiateGoogleOAuth();
  };

  return {
    // State
    isLoading,
    error,
    clearError: () => setError(null),

    // Actions
    register,
    login,
    logout,
    logoutAll,
    fetchMe,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
    resendVerification,
    loginWithGoogle,
  };
}
