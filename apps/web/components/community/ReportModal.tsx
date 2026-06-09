"use client";

import { useState } from "react";
import { CommunityService } from "@/services/community.service";

interface ReportModalProps {
  postId: string;
  onClose: () => void;
  showToast: (msg: string, type?: "ok" | "err") => void;
}

const REASONS = [
  "Spam or advertising",
  "Harassment or bullying",
  "Misinformation",
  "Inappropriate content",
  "Off-topic",
  "Other",
];

export function ReportModal({ postId, onClose, showToast }: ReportModalProps) {
  const [selected, setSelected] = useState("");
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    const reason = selected === "Other" ? custom.trim() : selected;
    if (!reason) return;
    setLoading(true);
    try {
      await CommunityService.reportPost(postId, reason);
      showToast("Report submitted. Thank you.");
      onClose();
    } catch (e: any) {
      showToast(e?.response?.data?.message || "Failed to report", "err");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 28,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: "#1a1a1a",
            }}
          >
            Report Post
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
              color: "#999",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <p style={{ margin: "0 0 16px", fontSize: 13, color: "#666" }}>
          Why are you reporting this post?
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {REASONS.map((r) => (
            <label
              key={r}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 10,
                border: `1.5px solid ${selected === r ? "#E8573F" : "#e8e8e8"}`,
                background: selected === r ? "#FFF5F3" : "#fafafa",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: selected === r ? 600 : 400,
                color: selected === r ? "#E8573F" : "#333",
                transition: "all 0.15s",
              }}
            >
              <input
                type="radio"
                name="reason"
                value={r}
                checked={selected === r}
                onChange={() => setSelected(r)}
                style={{ accentColor: "#E8573F" }}
              />
              {r}
            </label>
          ))}
        </div>

        {selected === "Other" && (
          <textarea
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Describe the issue..."
            rows={3}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1.5px solid #e8e8e8",
              fontSize: 14,
              resize: "vertical",
              outline: "none",
              fontFamily: "inherit",
              marginBottom: 16,
              boxSizing: "border-box",
            }}
          />
        )}

        <button
          onClick={submit}
          disabled={
            !selected || loading || (selected === "Other" && !custom.trim())
          }
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            background: selected ? "#E8573F" : "#e0e0e0",
            color: selected ? "#fff" : "#999",
            fontWeight: 600,
            fontSize: 15,
            cursor: selected ? "pointer" : "default",
            transition: "all 0.2s",
          }}
        >
          {loading ? "Submitting…" : "Submit Report"}
        </button>
      </div>
    </div>
  );
}
