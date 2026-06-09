"use client";

import { useEffect } from "react";

interface ToastProps {
  msg: string;
  type: "ok" | "err";
  onDone: () => void;
}

export function Toast({ msg, type, onDone }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);

  const isOk = type === "ok";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        animation: "toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}
    >
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.93); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1);    }
        }
      `}</style>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 20px",
          borderRadius: 14,
          background: isOk ? "#0f172a" : "#1e3a8a",
          color: "#fff",
          fontSize: 14,
          fontWeight: 500,
          boxShadow: isOk
            ? "0 8px 32px rgba(15,23,42,0.35)"
            : "0 8px 32px rgba(37,99,235,0.35)",
          border: `1px solid ${
            isOk ? "rgba(255,255,255,0.08)" : "rgba(147,197,253,0.2)"
          }`,
          maxWidth: 360,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: isOk
              ? "rgba(59,130,246,0.25)"
              : "rgba(147,197,253,0.2)",
            fontSize: 11,
            fontWeight: 800,
            flexShrink: 0,
            color: isOk ? "#93c5fd" : "#bfdbfe",
          }}
        >
          {isOk ? "✓" : "✕"}
        </span>
        {msg}
      </div>
    </div>
  );
}
