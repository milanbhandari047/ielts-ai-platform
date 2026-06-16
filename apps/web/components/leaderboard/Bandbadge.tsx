"use client";
// components/ui/BandBadge.tsx

import { cn } from "@/lib/utils";

interface BandBadgeProps {
  band: number | null | undefined;
  size?: "sm" | "md" | "lg";
}

function bandLabel(band: number): string {
  if (band >= 9) return "Expert";
  if (band >= 8) return "Very Good";
  if (band >= 7) return "Good";
  if (band >= 6) return "Competent";
  if (band >= 5) return "Modest";
  return "Limited";
}

function bandColors(band: number): string {
  if (band >= 8) return "bg-emerald-100 text-emerald-700 ring-emerald-200";
  if (band >= 7) return "bg-blue-100 text-blue-700 ring-blue-200";
  if (band >= 6) return "bg-violet-100 text-violet-700 ring-violet-200";
  if (band >= 5) return "bg-amber-100 text-amber-700 ring-amber-200";
  return "bg-red-100 text-red-600 ring-red-200";
}

export function BandBadge({ band, size = "md" }: BandBadgeProps) {
  if (!band)
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full ring-1 font-medium bg-gray-100 text-gray-400 ring-gray-200",
          size === "sm"
            ? "px-2 py-0.5 text-xs"
            : size === "lg"
            ? "px-4 py-1 text-base"
            : "px-3 py-0.5 text-xs"
        )}
      >
        —
      </span>
    );

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full ring-1 font-semibold",
        bandColors(band),
        size === "sm"
          ? "px-2 py-0.5 text-xs"
          : size === "lg"
          ? "px-4 py-1 text-base"
          : "px-3 py-0.5 text-sm"
      )}
    >
      <span>{band.toFixed(1)}</span>
      {size !== "sm" && (
        <span className="font-normal opacity-70">· {bandLabel(band)}</span>
      )}
    </span>
  );
}
