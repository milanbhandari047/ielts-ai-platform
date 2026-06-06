"use client";

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

const extractError = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
    };
    return axiosError.response?.data?.message ?? "Something went wrong";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
};

export function useAuth() {
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [error, setError] = useState<string | null>(null);

  const withLoading = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setError(null);
    setLoading(true);
    try {
      return await fn();
    } catch (err) {
      setError(extractError(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchMeRaw = async () => {
    const res = await authService.getMe();
    setUser(res.data);
    return res.data;
  };

  const register = async (data: RegisterDTO) =>
    withLoading(async () => {
      const res = await authService.register(data);
      setUser(res.data.user);
      router.push("/dashboard");
      return res;
    });

  const login = async (data: LoginDTO) =>
    withLoading(async () => {
      const res = await authService.login(data);
      setUser(res.data.user);
      router.push("/dashboard");
      return res;
    });

  const logout = async () =>
    withLoading(async () => {
      await authService.logout();
      clearAuth();
      router.push("/login");
    });

  const logoutAll = async () =>
    withLoading(async () => {
      await authService.logoutAll();
      clearAuth();
      router.push("/login");
    });

  const fetchMe = async () =>
    withLoading(async () => {
      return await fetchMeRaw();
    });

  const forgotPassword = async (data: ForgotPasswordDTO) =>
    withLoading(async () => {
      return await authService.forgotPassword(data);
    });

  const resetPassword = async (data: ResetPasswordDTO) =>
    withLoading(async () => {
      return await authService.resetPassword(data);
    });

  const changePassword = async (data: ChangePasswordDTO) =>
    withLoading(async () => {
      const res = await authService.changePassword(data);
      clearAuth();
      router.push("/login?reason=password_changed");
      return res;
    });

  // FIX: authService.verifyEmail already returns res.data (the full backend
  // envelope: { success, message, data: { message, tokens } }).
  // Previously useAuth re-assigned `res.data` which tried to read `.data` off
  // the envelope again, producing `{ message, tokens }` — an object with no
  // `.success` property. That made every branch in page.tsx evaluate to false
  // (res.success was undefined), leaving the UI stuck on "verifying" or
  // immediately falling to the error branch.
  //
  // Fix: use `res` directly as the backend envelope.
  // Token storage is consolidated here; removed the duplicate setTokens call
  // from authService.verifyEmail so tokens are only written once.
  // verifyEmail never returns null — it always resolves with { success, message }
  // so page.tsx can branch on it without racing against React state updates.
  const verifyEmail = async (
    token: string
  ): Promise<{ success: boolean; message: string }> => {
    setError(null);
    setLoading(true);

    try {
      const res = await authService.verifyEmail(token);

      if (res.success && res.data?.tokens) {
        const { accessToken, refreshToken } = res.data.tokens;
        tokenStorage.setTokens(accessToken, refreshToken);
      }

      if (res.success) {
        try {
          const user = await fetchMeRaw();
          if (user) setUser(user);
        } catch {
          const currentUser = useAuthStore.getState().user;
          if (currentUser) setUser({ ...currentUser, emailVerified: true });
        }
      }

      return { success: res.success, message: res.message ?? "" };
    } catch (err) {
      const message = extractError(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // FIX: resendVerification requires an authenticated request (Bearer token).
  // On the error page the user may have no access token yet (they arrived via
  // an invalid/expired email link before auto-login). We surface a clear error
  // rather than silently failing with a 401.
  const resendVerification = async () =>
    withLoading(async () => {
      if (!tokenStorage.getAccess()) {
        throw new Error(
          "Please log in first so we can resend the verification email."
        );
      }
      return await authService.resendVerification();
    });

  const loginWithGoogle = () => {
    authService.initiateGoogleOAuth();
  };

  return {
    isLoading,
    error,
    clearError: () => setError(null),
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
