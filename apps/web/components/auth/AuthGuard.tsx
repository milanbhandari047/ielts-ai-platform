"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { tokenStorage } from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const { fetchMe } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;

    const token = tokenStorage.getAccess();

    if (!token) {
      const redirect = encodeURIComponent(pathname);
      router.replace(`/auth/login?redirect=${redirect}`);
      return;
    }

    // Token exists but store is empty (e.g. hard refresh) — refetch
    if (!isAuthenticated) {
      fetchMe().catch(() => {
        tokenStorage.clear();
        router.replace("/auth/login");
      });
    }
  }, [isHydrated, isAuthenticated]);

  // Wait for zustand rehydration before rendering
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}

// ─── GuestGuard — redirect authenticated users away from /auth/* ──────────────

export function GuestGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isHydrated, isAuthenticated]);

  if (!isHydrated) return null;
  if (isAuthenticated) return null;

  return <>{children}</>;
}
