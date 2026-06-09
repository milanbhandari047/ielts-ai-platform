"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { EnhancedAnalytics } from "@/types";
import { analyticsService } from "@/services/mocktest.service";
import { SectionLoader } from "../ui/spinner";

// ─── Simple SVG Radar Chart ───────────────────────────────────────────────────
function RadarChart({
  data,
}: {
  data: { skill: string; band: number; fullMark: number }[];
}) {
  const cx = 150;
  const cy = 150;
  const r = 110;
  const levels = 5;
  const n = data.length;

  const getCoords = (index: number, value: number, max: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const dist = (value / max) * r;
    return {
      x: cx + dist * Math.cos(angle),
      y: cy + dist * Math.sin(angle),
    };
  };

  const levelPolygons = Array.from({ length: levels }, (_, i) => {
    const ratio = (i + 1) / levels;
    const points = data
      .map((_, j) => {
        const angle = (Math.PI * 2 * j) / n - Math.PI / 2;
        return `${cx + r * ratio * Math.cos(angle)},${
          cy + r * ratio * Math.sin(angle)
        }`;
      })
      .join(" ");
    return points;
  });

  const dataPoints = data
    .map((d, i) => {
      const { x, y } = getCoords(i, d.band, d.fullMark);
      return `${x},${y}`;
    })
    .join(" ");

  const axisLines = data.map((_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x2: cx + r * Math.cos(angle),
      y2: cy + r * Math.sin(angle),
    };
  });

  const labels = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const labelR = r + 22;
    return {
      x: cx + labelR * Math.cos(angle),
      y: cy + labelR * Math.sin(angle),
      label: d.skill,
      band: d.band,
    };
  });

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto">
      {/* Grid polygons */}
      {levelPolygons.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={i === levels - 1 ? 1.5 : 0.8}
        />
      ))}

      {/* Axis lines */}
      {axisLines.map((line, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={line.x2}
          y2={line.y2}
          stroke="#e5e7eb"
          strokeWidth={0.8}
        />
      ))}

      {/* Data polygon */}
      <polygon
        points={dataPoints}
        fill="rgba(99,102,241,0.2)"
        stroke="#6366f1"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Data points */}
      {data.map((d, i) => {
        const { x, y } = getCoords(i, d.band, d.fullMark);
        return <circle key={i} cx={x} cy={y} r={4} fill="#6366f1" />;
      })}

      {/* Labels */}
      {labels.map((l, i) => (
        <text
          key={i}
          x={l.x}
          y={l.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs"
          fontSize={10}
          fill="#374151"
          fontWeight="600"
        >
          {l.label}
        </text>
      ))}
    </svg>
  );
}

// ─── Band Progression Mini Chart ──────────────────────────────────────────────
function BandProgressionChart({
  data,
}: {
  data: { date: string; band: number }[];
}) {
  if (data.length === 0) return null;
  const max = 9;
  const min = 3;
  const w = 500;
  const h = 120;
  const pad = { left: 30, right: 10, top: 10, bottom: 20 };

  const xScale = (i: number) =>
    pad.left + (i / Math.max(data.length - 1, 1)) * (w - pad.left - pad.right);
  const yScale = (v: number) =>
    pad.top + ((max - v) / (max - min)) * (h - pad.top - pad.bottom);

  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(d.band)}`)
    .join(" ");

  const areaD =
    pathD +
    ` L ${xScale(data.length - 1)} ${h - pad.bottom} L ${xScale(0)} ${
      h - pad.bottom
    } Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {/* Y gridlines */}
      {[4, 5, 6, 7, 8, 9].map((v) => (
        <g key={v}>
          <line
            x1={pad.left}
            y1={yScale(v)}
            x2={w - pad.right}
            y2={yScale(v)}
            stroke="#f3f4f6"
            strokeWidth={1}
          />
          <text
            x={pad.left - 4}
            y={yScale(v)}
            textAnchor="end"
            fontSize={8}
            fill="#9ca3af"
            dominantBaseline="middle"
          >
            {v}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaD} fill="rgba(99,102,241,0.08)" />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="#6366f1"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Points */}
      {data.map((d, i) => (
        <circle
          key={i}
          cx={xScale(i)}
          cy={yScale(d.band)}
          r={3}
          fill="#6366f1"
        />
      ))}

      {/* X labels */}
      {data
        .filter(
          (_, i) =>
            i === 0 ||
            i === data.length - 1 ||
            i % Math.ceil(data.length / 4) === 0
        )
        .map((d, _, arr) => {
          const i = data.indexOf(d);
          return (
            <text
              key={i}
              x={xScale(i)}
              y={h - 4}
              textAnchor="middle"
              fontSize={8}
              fill="#9ca3af"
            >
              {new Date(d.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </text>
          );
        })}
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EnhancedAnalyticsPage() {
  const [data, setData] = useState<EnhancedAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analyticsService
      .getEnhanced()
      .then(setData)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <SectionLoader />;
  if (!data) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Deep insights into your IELTS preparation journey.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          {
            label: "Practice Hours",
            value: data.totalPracticeHours.toFixed(1),
            unit: "hrs",
            icon: "⏱",
            color: "from-blue-500 to-indigo-500",
          },
          {
            label: "Tests Taken",
            value: data.testsTaken,
            unit: "",
            icon: "📝",
            color: "from-purple-500 to-violet-500",
          },
          {
            label: "Avg Band",
            value: data.averageBand?.toFixed(1) ?? "—",
            unit: "",
            icon: "📊",
            color: "from-emerald-500 to-teal-500",
          },
          {
            label: "Improvement",
            value:
              data.improvementRate !== null
                ? `${
                    data.improvementRate > 0 ? "+" : ""
                  }${data.improvementRate.toFixed(1)}%`
                : "—",
            unit: "",
            icon:
              data.improvementRate !== null && data.improvementRate >= 0
                ? "📈"
                : "📉",
            color:
              data.improvementRate !== null && data.improvementRate >= 0
                ? "from-emerald-500 to-green-500"
                : "from-red-500 to-rose-500",
          },
        ].map(({ label, value, unit, icon, color }) => (
          <div
            key={label}
            className={`rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-sm`}
          >
            <p className="text-2xl font-black">
              {value}
              <span className="text-base font-normal opacity-80">{unit}</span>
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium opacity-90">
              <span>{icon}</span>
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">
            Skill Radar
          </h2>
          {data.radarData.every((d) => d.band === 0) ? (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400">
              Complete some tests to see your skill radar.
            </div>
          ) : (
            <RadarChart data={data.radarData} />
          )}
        </div>

        {/* Band progression */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">
            Band Progression
          </h2>
          {data.bandProgression.length < 2 ? (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400">
              Complete more tests to see your progression.
            </div>
          ) : (
            <BandProgressionChart data={data.bandProgression} />
          )}
        </div>
      </div>

      {/* Time spent per skill */}
      {data.timeSpent.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">
            Time Spent by Skill (last 7 days)
          </h2>
          <div className="space-y-3">
            {(["reading", "listening", "writing", "speaking"] as const).map(
              (skill) => {
                const total = data.timeSpent.reduce(
                  (s, d) => s + (d[skill] ?? 0),
                  0
                );
                const maxTotal = Math.max(
                  ...["reading", "listening", "writing", "speaking"].map((s) =>
                    data.timeSpent.reduce(
                      (sum, d) => sum + ((d as any)[s] ?? 0),
                      0
                    )
                  )
                );
                const pct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
                const colors: Record<string, string> = {
                  reading: "bg-blue-500",
                  listening: "bg-purple-500",
                  writing: "bg-emerald-500",
                  speaking: "bg-orange-500",
                };
                const icons: Record<string, string> = {
                  reading: "📖",
                  listening: "🎧",
                  writing: "✍️",
                  speaking: "🎙️",
                };
                return (
                  <div key={skill} className="flex items-center gap-4">
                    <span className="w-24 flex items-center gap-1.5 text-sm capitalize text-gray-600">
                      {icons[skill]} {skill}
                    </span>
                    <div className="flex-1 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          colors[skill]
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-16 text-right text-sm font-medium text-gray-700">
                      {total.toFixed(0)} min
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
}
