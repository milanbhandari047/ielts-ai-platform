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

  // ← select each value individually to prevent re-renders
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
    const res = await authService.getMe(); // returns ProfileResponse
    setUser(res.data); // ProfileResponse.data = AuthUser ✅
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

  const verifyEmail = async (token: string) =>
    withLoading(async () => {
      console.log("Calling verifyEmail with token:", token);
      const res = await authService.verifyEmail(token);
      console.log("verifyEmail response:", res);

      // Fetch fresh user from /auth/me
      const user = await fetchMeRaw();

      // Backend sometimes returns emailVerified: false even after a successful
      // verification due to a timing/caching issue on the server side.
      // If the verify API call itself succeeded (no error thrown), we trust
      // that verification worked and patch the store directly.
      if (user) {
        setUser({ ...user, emailVerified: true });
      }

      return res;
    });

  const resendVerification = async () =>
    withLoading(async () => {
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
