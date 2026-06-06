"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams, useRouter } from "next/navigation";

// inside component

type Status = "verifying" | "success" | "error" | "already_verified";

export default function VerifyEmailPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Debug log to check token value

  const { verifyEmail, resendVerification, isLoading } = useAuth();
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMsg, setErrorMsg] = useState("");
  const [resentSuccess, setResentSuccess] = useState(false);
  const ran = useRef(false);
  // app/verify-email/page.tsx  (or wherever your VerifyEmailPage is)

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (!token) {
      setStatus("error");
      setErrorMsg("Verification token is missing.");

      return;
    }

    verifyEmail(token).then(async (res) => {
      if (!res) {

        setStatus("error");
        setErrorMsg("Invalid or expired verification link.");
      } else if (res.message === "Email already verified") {
        setStatus("already_verified");
      } else {
        setStatus("success");

        // Notify other tabs (e.g. dashboard showing the verification banner)
        const channel = new BroadcastChannel("email_verification");
        channel.postMessage({ verified: true });
        channel.close();

        // verifyEmail() already called fetchMeRaw() internally and updated
        // the store with the fresh user (emailVerified: true). Zustand's
        // persist middleware will sync localStorage automatically — no
        // manual write needed. Just redirect.
        router.replace("/dashboard");
      }
    });
  }, []);

  const handleResend = async () => {
    const res = await resendVerification();
    if (res) setResentSuccess(true);
  };

  // ─── Verifying ───────────────────────────────────────────────────────────

  if (status === "verifying") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-gray-500">Verifying your email…</p>
        </div>
      </div>
    );
  }

  // ─── Success ─────────────────────────────────────────────────────────────

  if (status === "success" || status === "already_verified") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-7 w-7 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {status === "already_verified"
              ? "Already verified!"
              : "Email verified!"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {status === "already_verified"
              ? "Your email was already verified."
              : "Your account is fully activated. You're ready to go!"}
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-7 w-7 text-red-500"
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
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Verification failed
        </h2>
        <p className="mt-2 text-sm text-gray-500">{errorMsg}</p>

        {resentSuccess ? (
          <p className="mt-4 text-sm font-medium text-green-600">
            New verification email sent! Check your inbox.
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={isLoading}
            className="mt-4 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isLoading ? "Sending…" : "Resend verification email"}
          </button>
        )}

        <div className="mt-4">
          <Link
            href="/login"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
