"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { mockTestService } from "@/services/mocktest.service";
import { BandBadge } from "@/components/ui/BandBadge";
import { SectionLoader } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { MockTestResult } from "@/types";

export default function MockTestResultPage() {
  const { sessionId } = useParams() as { sessionId: string };
  const [result, setResult] = useState<MockTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    mockTestService
      .getResult(sessionId)
      .then(setResult)
      .finally(() => setIsLoading(false));
  }, [sessionId]);

  if (isLoading) return <SectionLoader />;
  if (!result) return null;

  const skills = [
    {
      label: "Listening",
      band: result.listeningBand,
      icon: "🎧",
      color: "bg-purple-500",
    },
    {
      label: "Reading",
      band: result.readingBand,
      icon: "📖",
      color: "bg-blue-500",
    },
    {
      label: "Writing",
      band: result.writingBand,
      icon: "✍️",
      color: "bg-emerald-500",
    },
    {
      label: "Speaking",
      band: result.speakingBand,
      icon: "🎙️",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Overall */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-center text-white shadow-lg">
        <p className="text-sm font-medium opacity-80">Overall IELTS Band</p>
        <p className="mt-2 text-7xl font-black">
          {result.overallBand.toFixed(1)}
        </p>
        <p className="mt-2 text-sm opacity-70">
          Full Mock Test ·{" "}
          {new Date(result.completedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Section breakdown */}
      <div className="grid gap-4 sm:grid-cols-2">
        {skills.map(({ label, band, icon, color }) => (
          <div
            key={label}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span>{icon}</span>
                {label}
              </span>
              <BandBadge band={band} size="sm" />
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  color
                )}
                style={{ width: `${((band ?? 0) / 9) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href="/mock-test"
          className="flex-1 rounded-xl border border-gray-200 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Take Another Test
        </Link>
        <Link
          href="/analytics"
          className="flex-1 rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700"
        >
          View Analytics
        </Link>
      </div>
    </div>
  );
}
