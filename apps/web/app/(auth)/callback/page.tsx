"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tokenStorage } from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

// This page handles: /auth/callback?accessToken=...&refreshToken=...
// The backend redirects here after a successful Google OAuth flow

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchMe } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      router.replace(`/auth/login?error=${encodeURIComponent(oauthError)}`);
      return;
    }

    if (!accessToken || !refreshToken) {
      router.replace("/auth/login?error=oauth_failed");
      return;
    }

    // Store tokens
    tokenStorage.setTokens(accessToken, refreshToken);

    // Hydrate user in store, then redirect
    fetchMe()
      .then(() => {
        router.replace("/dashboard");
      })
      .catch(() => {
        tokenStorage.clear();
        router.replace("/auth/login?error=oauth_failed");
      });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm text-gray-500">Completing sign in…</p>
      </div>
    </div>
  );
}
