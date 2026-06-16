"use client";
// components/teacher/DashboardView.tsx

import { useEffect } from "react";
import { useTeacherStore } from "@/store/teacher.store";
import {
  Users,
  TrendingUp,
  PenLine,
  Trophy,
  Flame,
  BookOpen,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  onClick,
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3",
        onClick &&
          "cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          color
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs font-medium text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SkillBar({
  label,
  band,
  color,
}: {
  label: string;
  band: number | null;
  color: string;
}) {
  const pct = band ? Math.round((band / 9) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-16 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-gray-700 w-6 text-right">
        {band ?? "—"}
      </span>
    </div>
  );
}

export function DashboardView() {
  const { dashboardStats, dashboardLoading, error, fetchDashboard, setView } =
    useTeacherStore();

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (dashboardLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!dashboardStats)
    return (
      <div className="p-6 flex items-center gap-3 bg-red-50 rounded-2xl border border-red-100">
        <AlertCircle className="w-5 h-5 text-red-400" />
        <p className="text-sm text-red-700">
          {error ?? "Failed to load dashboard."}
        </p>
        <button
          onClick={fetchDashboard}
          className="ml-auto text-xs text-red-600 underline flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </div>
    );

  const s = dashboardStats;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Overview of your class performance
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          label="Total Students"
          value={s.totalStudents}
          sub={`${s.activeThisWeek} active this week`}
          color="bg-blue-50 text-blue-600"
          onClick={() => setView("students")}
        />
        <StatCard
          icon={TrendingUp}
          label="Class Avg Band"
          value={s.classAvgBand ?? "—"}
          sub="Across all skills"
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={PenLine}
          label="Ungraded Writing"
          value={s.ungradedWriting}
          sub={`of ${s.totalWritingSubmissions} total`}
          color={
            s.ungradedWriting > 0
              ? "bg-amber-50 text-amber-600"
              : "bg-gray-50 text-gray-400"
          }
          onClick={() => setView("writing-review")}
        />
        <StatCard
          icon={Trophy}
          label="Mock Tests Done"
          value={s.totalMockSessions}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          icon={Flame}
          label="Active This Month"
          value={s.activeThisMonth}
          sub="Students with activity"
          color="bg-orange-50 text-orange-600"
        />
        <StatCard
          icon={BookOpen}
          label="Weekly Activities"
          value={s.weeklyActivity}
          sub="Submissions this week"
          color="bg-indigo-50 text-indigo-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Avg by skill */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Class average by skill
          </h2>
          <div className="space-y-3">
            <SkillBar
              label="Reading"
              band={s.avgBySkill.reading}
              color="bg-blue-500"
            />
            <SkillBar
              label="Listening"
              band={s.avgBySkill.listening}
              color="bg-purple-500"
            />
            <SkillBar
              label="Writing"
              band={s.avgBySkill.writing}
              color="bg-emerald-500"
            />
            <SkillBar
              label="Speaking"
              band={s.avgBySkill.speaking}
              color="bg-rose-500"
            />
          </div>
        </div>

        {/* Band distribution */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Band distribution
          </h2>
          {s.bandDistribution.some((b) => b.count > 0) ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={s.bandDistribution}
                margin={{ top: 0, right: 0, bottom: 0, left: -20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    fontSize: 12,
                  }}
                  formatter={(v: any) => [`${v} students`, "Count"]}
                />
                <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-sm text-gray-400">
              No analytics data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
