"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";

export function VerificationBanner() {
  const user = useAuthStore((state) => state.user);
  console.log("Banner user:", user);
  const setUser = useAuthStore((state) => state.setUser);
  const [sent, setSent] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Listen for verification from another tab
  useEffect(() => {
    if (!user || user.emailVerified) return;

    const channel = new BroadcastChannel("email_verification");

    channel.onmessage = async (event) => {
      if (event.data?.verified) {
        try {
          const res = await authService.getMe();
          // Backend may still return emailVerified: false due to a timing
          // issue. Since the broadcast only fires on confirmed success,
          // force the flag to true so the banner disappears correctly.
          setUser({ ...res.data, emailVerified: true });
        } catch {
          // If getMe fails, still trust the broadcast and patch the store
          if (user) setUser({ ...user, emailVerified: true });
        }
      }
    };

    return () => channel.close();
  }, [user]);

  if (!user || user.emailVerified || dismissed) return null;

  const handleResend = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resendVerification();
      setSent(true);
    } catch {
      setError("Failed to send. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50">
          <svg
            className="h-5 w-5 text-amber-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            Verify your email address
          </p>
          <p className="mt-0.5 text-sm text-gray-500 leading-relaxed">
            We sent a verification link to your email. Check your inbox and
            click the link to activate all features.
          </p>

          <div className="mt-2.5 flex items-center gap-3 flex-wrap">
            {sent ? (
              <span className="text-sm font-medium text-green-600">
                ✓ Verification email sent! Check your inbox.
              </span>
            ) : (
              <>
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-sm font-medium px-3.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 disabled:opacity-60 transition-colors"
                >
                  {isLoading ? "Sending…" : "Resend email"}
                </button>
                {error && <span className="text-sm text-red-500">{error}</span>}
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
          aria-label="Dismiss"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
