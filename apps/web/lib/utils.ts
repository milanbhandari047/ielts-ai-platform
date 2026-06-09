import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBand(band: number | null | undefined): string {
  if (band == null) return "—";
  return band % 1 === 0 ? band.toFixed(1) : band.toFixed(1);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export function scoreToIELTSBand(correct: number, total: number): number {
  const pct = correct / total;
  if (pct >= 0.9) return 9;
  if (pct >= 0.8) return 8;
  if (pct >= 0.7) return 7;
  if (pct >= 0.6) return 6;
  if (pct >= 0.5) return 5;
  if (pct >= 0.4) return 4;
  return 3.5;
}
