"use client";

import Link from "next/link";
import { BandBadge } from "@/components/ui/BandBadge";
import { formatRelativeTime, cn } from "@/lib/utils";
import type { DashboardSummary, WeakSkill } from "@/types";

// ─── Recent Tests ────────────────────────────────────────────────────────────

const TYPE_META: Record<
  string,
  { label: string; href: string; color: string }
> = {
  READING: {
    label: "Reading",
    href: "/reading",
    color: "bg-blue-100 text-blue-700",
  },
  LISTENING: {
    label: "Listening",
    href: "/listening",
    color: "bg-purple-100 text-purple-700",
  },
  WRITING: {
    label: "Writing",
    href: "/writing",
    color: "bg-emerald-100 text-emerald-700",
  },
  SPEAKING: {
    label: "Speaking",
    href: "/speaking",
    color: "bg-orange-100 text-orange-700",
  },
  MOCK_TEST: {
    label: "Mock Test",
    href: "/mock-test",
    color: "bg-gray-100 text-gray-700",
  },
};

export function RecentTests({
  activities,
}: {
  activities: DashboardSummary["recentActivity"];
}) {
  if (activities.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Recent Activity
        </h2>
        <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-gray-500">
            No tests yet. Start practicing!
          </p>
          <Link
            href="/reading"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Take your first test →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Recent Activity
      </h2>
      <ul className="divide-y divide-gray-50">
        {activities.slice(0, 6).map((activity) => {
          const meta = TYPE_META[activity.type];
          return (
            <li
              key={activity.id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "rounded px-2 py-0.5 text-xs font-medium",
                    meta.color
                  )}
                >
                  {meta.label}
                </span>
                <span className="max-w-[180px] truncate text-sm text-gray-700">
                  {activity.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <BandBadge band={activity.band} size="sm" />
                <span className="text-xs text-gray-400">
                  {formatRelativeTime(activity.completedAt)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Weak Skills ─────────────────────────────────────────────────────────────

const SKILL_HREF: Record<string, string> = {
  READING: "/reading",
  LISTENING: "/listening",
  WRITING: "/writing",
  SPEAKING: "/speaking",
};

export function WeakSkillCard({ weakSkills }: { weakSkills: WeakSkill[] }) {
  if (weakSkills.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Focus Areas
      </h2>
      <ul className="space-y-3">
        {weakSkills.map((skill) => (
          <li key={skill.skill}>
            <Link
              href={SKILL_HREF[skill.skill]}
              className="flex items-center justify-between rounded-lg border border-orange-100 bg-orange-50 px-4 py-3 transition hover:border-orange-200"
            >
              <div>
                <p className="text-sm font-medium text-orange-800">
                  {skill.label}
                </p>
                <p className="text-xs text-orange-600">Needs improvement</p>
              </div>
              <div className="flex items-center gap-2">
                <BandBadge band={skill.band} size="sm" />
                <svg
                  className="h-4 w-4 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Streak Tracker ───────────────────────────────────────────────────────────

export function StreakTracker({ streak }: { streak: number }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDay(); // 0 = Sunday
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Study Streak
        </h2>
        <div className="flex items-center gap-1.5 text-orange-600">
          <span>🔥</span>
          <span className="text-lg font-bold">{streak}</span>
          <span className="text-xs text-gray-500">days</span>
        </div>
      </div>
      <div className="flex items-end justify-between gap-1">
        {days.map((day, i) => {
          const isActive = i <= todayIndex && i >= todayIndex - (streak - 1);
          const isToday = i === todayIndex;
          return (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "h-8 w-8 rounded-lg",
                  isToday && "ring-2 ring-indigo-400 ring-offset-1",
                  isActive ? "bg-indigo-500" : "bg-gray-100"
                )}
              />
              <span className="text-xs text-gray-400">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Daily Goal ───────────────────────────────────────────────────────────────

export function DailyGoal({ goal }: { goal: DashboardSummary["studyGoal"] }) {
  if (!goal) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-sm">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-200">
          Daily Goal
        </h2>
        <p className="text-sm text-indigo-100">No goal set yet.</p>
        <Link
          href="/profile"
          className="mt-3 inline-block text-sm font-medium text-white underline"
        >
          Set your study goal →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-sm">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-indigo-200">
        Daily Goal
      </h2>
      <p className="text-2xl font-bold">{goal.dailyMinutes} min</p>
      <p className="mt-1 text-sm text-indigo-200">
        Target Band {goal.targetBand} by{" "}
        {new Date(goal.targetDate).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
