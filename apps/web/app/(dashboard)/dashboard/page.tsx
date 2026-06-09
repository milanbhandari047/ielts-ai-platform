"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BandPredictionCard } from "@/components/dashboard/BandPredictionCard";
import {
  RecentTests,
  WeakSkillCard,
  StreakTracker,
  DailyGoal,
} from "@/components/dashboard/DashboardWidgets";
import { SectionLoader } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/auth.store";
import type { DashboardSummary } from "@/types";
import { dashboardService } from "@/services/dashboard.service";

const QUICK_LINKS = [
  {
    label: "Reading Test",
    href: "/reading",
    emoji: "📖",
    color: "bg-blue-50 hover:bg-blue-100 text-blue-700",
  },
  {
    label: "Listening Test",
    href: "/listening",
    emoji: "🎧",
    color: "bg-purple-50 hover:bg-purple-100 text-purple-700",
  },
  {
    label: "Writing Task",
    href: "/writing",
    emoji: "✍️",
    color: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700",
  },
  {
    label: "Speaking Practice",
    href: "/speaking",
    emoji: "🎙️",
    color: "bg-orange-50 hover:bg-orange-100 text-orange-700",
  },
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardService
      .getSummary()
      .then(setSummary)
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setIsLoading(false));
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting()}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Let&apos;s keep making progress toward Band {user?.targetBand ?? 7}.
          </p>
        </div>
        <Link
          href="/mock-test"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
        >
          Full Mock Test
        </Link>
      </div>

      {/* Quick start */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-2 rounded-xl p-4 text-center text-sm font-medium transition ${link.color}`}
          >
            <span className="text-2xl">{link.emoji}</span>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Main content */}
      {isLoading ? (
        <SectionLoader />
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm font-medium text-red-700 underline"
          >
            Try again
          </button>
        </div>
      ) : summary ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left col — band + streak */}
          <div className="space-y-6 lg:col-span-2">
            <BandPredictionCard summary={summary} />
            <RecentTests activities={summary.recentActivity} />
          </div>

          {/* Right col */}
          <div className="space-y-6">
            <DailyGoal goal={summary.studyGoal} />
            <StreakTracker streak={summary.streak} />
            <WeakSkillCard weakSkills={summary.weakSkills} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
