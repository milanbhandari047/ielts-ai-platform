"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TimerProps {
  seconds: number;
  onTick?: (seconds: number) => void;
  onExpire?: () => void;
  running?: boolean;
  className?: string;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function TimerCountdown({
  seconds,
  onTick,
  onExpire,
  running = true,
  className,
}: TimerProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRef = useRef(seconds);

  useEffect(() => {
    secondsRef.current = seconds;
  }, [seconds]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      secondsRef.current -= 1;
      onTick?.(secondsRef.current);
      if (secondsRef.current <= 0) {
        clearInterval(intervalRef.current!);
        onExpire?.();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const isWarning = seconds <= 300; // 5 minutes
  const isDanger = seconds <= 60;

  return (
    <div
      className={cn(
        "font-mono font-semibold tabular-nums",
        isDanger && "text-red-600 animate-pulse",
        isWarning && !isDanger && "text-orange-500",
        !isWarning && "text-gray-700",
        className
      )}
    >
      {formatTime(seconds)}
    </div>
  );
}
