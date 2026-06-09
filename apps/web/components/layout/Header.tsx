"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { NotificationBell } from "../ui/NotificationBall";
import { useAuthStore } from "@/store/auth.store";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";

  return "Good evening";
}

function getPageTitle(pathname: string) {
  const segment = pathname.split("/")[1];

  switch (segment) {
    case "dashboard":
      return "Dashboard";
    case "reading":
      return "Reading Practice";
    case "listening":
      return "Listening Practice";
    case "writing":
      return "Writing Practice";
    case "speaking":
      return "Speaking Practice";
    case "vocabulary":
      return "Vocabulary Builder";
    case "mock-test":
      return "Mock Tests";
    case "analytics":
      return "Analytics";
    case "community":
      return "Community";
    case "leaderboard":
      return "Leaderboard";
    case "profile":
      return "Profile";
    case "ai-tutor":
      return "AI Tutor";
    default:
      return "IELTS AI";
  }
}

export function Header() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();

  const firstName = user?.name?.split(" ")[0] ?? "User";

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white/90 px-6 backdrop-blur">
      {/* Left */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          {getPageTitle(pathname)}
        </h1>

        <p className="text-sm text-gray-500">
          {getGreeting()}, {firstName} 👋
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {(user?.streak ?? 0) > 0 && (
          <div className="hidden items-center gap-1 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-600 lg:flex">
            🔥 {user?.streak} day streak
          </div>
        )}

        {user?.targetBand && (
          <div className="hidden items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 md:flex">
            🎯 Band {user.targetBand}
          </div>
        )}

        <NotificationBell />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-2 py-1.5 transition hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>

              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            <svg
              className={`hidden h-4 w-4 text-gray-400 transition-transform sm:block ${
                open ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="font-medium text-gray-900">{user?.name}</p>

                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              <div className="p-2">
                <Link
                  href="/profile"
                  className="flex items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  👤 My Profile
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  ⚙️ Settings
                </Link>

                <Link
                  href="/analytics"
                  className="flex items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  📊 Analytics
                </Link>

                <div className="my-2 border-t border-gray-100" />

                <button
                  onClick={logout}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
