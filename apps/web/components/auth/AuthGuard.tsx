"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { tokenStorage } from "@/lib/axios";
import { authService } from "@/services/auth.service";

interface AuthGuardProps {
  children: React.ReactNode;
}

let isFetchingMe = false;

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isHydrated, setUser, clearAuth } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    const token = tokenStorage.getAccess();

    if (!token) {
      clearAuth();
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // ✅ Already authenticated — don't overwrite store with stale getMe()
    if (isAuthenticated) {
      setChecked(true);
      return;
    }

    // Token exists but not authenticated — fetch user once
    if (isFetchingMe) return;
    isFetchingMe = true;

    authService
      .getMe()
      .then((res) => {
        setUser(res.data);
        setChecked(true);
      })
      .catch(() => {
        tokenStorage.clear();
        clearAuth();
        router.replace("/login");
      })
      .finally(() => {
        isFetchingMe = false;
      });
  }, [isHydrated, isAuthenticated]);

  if (!isHydrated || (!isAuthenticated && !checked)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}

// ─── GuestGuard ───────────────────────────────────────────────────────────────

export function GuestGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isHydrated, isAuthenticated]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return <>{children}</>;
}
