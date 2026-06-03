"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useAuth } from "@/hooks/useAuth";

export function VerificationBanner() {
  const { user } = useAuthStore();
  const { resendVerification, isLoading } = useAuth();
  const [sent, setSent] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!user || user.emailVerified || dismissed) return null;

  const handleResend = async () => {
    const res = await resendVerification();
    if (res) setSent(true);
  };

  return (
    <div className="flex items-center justify-between gap-4 bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
      <div className="flex items-center gap-2">
        <svg
          className="h-4 w-4 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
          />
        </svg>
        <span>
          Please verify your email address to unlock all features.{" "}
          {sent ? (
            <span className="font-medium text-green-700">Email sent!</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="font-medium underline hover:no-underline disabled:opacity-60"
            >
              {isLoading ? "Sending…" : "Resend email"}
            </button>
          )}
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-amber-500 hover:text-amber-700"
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
  );
}
