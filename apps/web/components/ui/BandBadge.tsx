"use client";

import { cn } from "@/lib/utils";

interface BandBadgeProps {
  band: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getBandColor(band: number | null): string {
  if (band === null) return "bg-gray-100 text-gray-500";
  if (band >= 8)
    return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  if (band >= 7) return "bg-blue-100 text-blue-700 border border-blue-200";
  if (band >= 6)
    return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  if (band >= 5)
    return "bg-orange-100 text-orange-700 border border-orange-200";
  return "bg-red-100 text-red-700 border border-red-200";
}

const sizes = {
  sm: "text-xs px-2 py-0.5 rounded",
  md: "text-sm px-2.5 py-1 rounded-md font-semibold",
  lg: "text-2xl px-4 py-2 rounded-lg font-bold",
};

export function BandBadge({ band, size = "md", className }: BandBadgeProps) {
  return (
    <span className={cn(getBandColor(band), sizes[size], className)}>
      {band !== null ? `Band ${band.toFixed(1)}` : "—"}
    </span>
  );
}
