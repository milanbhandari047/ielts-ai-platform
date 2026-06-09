"use client";

import { useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import { PostsList } from "@/components/community/PostsList";
import { PostDetailView } from "@/components/community/PostDetailView";
import PostForm from "@/components/community/PostForm";
import { Toast } from "@/components/community/Toast";
import { AdminReportsPanel } from "@/components/community/AdminReportPanel";
import type { Post } from "@/services/community.service";

type View =
  | { type: "list" }
  | { type: "detail"; postId: string; from?: "list" | "reports" }
  | { type: "form"; post?: Post }
  | { type: "reports" };

interface ToastState {
  msg: string;
  type: "ok" | "err";
  key: number;
}

export default function CommunityPage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";

  const [view, setView] = useState<View>({ type: "list" });
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type, key: Date.now() });
  }, []);

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .5 } }
      `}</style>

      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "24px 16px 80px",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* ── Admin bar — only visible to admins ─────────────────────────── */}
        {isAdmin && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 20,
              padding: "10px 16px",
              background: "#eff6ff",
              borderRadius: 12,
              border: "1.5px solid #bfdbfe",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#1d4ed8",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Admin
            </span>
            <div style={{ flex: 1 }} />
            <button
              onClick={() =>
                setView(
                  view.type === "reports"
                    ? { type: "list" }
                    : { type: "reports" }
                )
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 8,
                border: "none",
                background: view.type === "reports" ? "#2563eb" : "#dbeafe",
                color: view.type === "reports" ? "#fff" : "#1d4ed8",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              🚩 {view.type === "reports" ? "← Back to Posts" : "Reports"}
            </button>
          </div>
        )}

        {/* ── Views ────────────────────────────────────────────────────────── */}

        {view.type === "list" && (
          <PostsList
            onSelect={(postId) =>
              setView({ type: "detail", postId, from: "list" })
            }
            onNew={() => setView({ type: "form" })}
            showToast={showToast}
            onSelectPostFromComment={(postId) =>
              setView({ type: "detail", postId, from: "list" })
            }
          />
        )}

        {view.type === "detail" && (
          <PostDetailView
            postId={view.postId}
            isAdmin={isAdmin}
            onBack={() =>
              view.from === "reports"
                ? setView({ type: "reports" })
                : setView({ type: "list" })
            }
            onEdit={(post) => setView({ type: "form", post })}
            showToast={showToast}
          />
        )}

        {view.type === "form" && (
          <PostForm
            existingPost={
              view.post
                ? {
                    id: view.post.id,
                    title: view.post.title,
                    content: view.post.content,
                  }
                : undefined
            }
            onBack={() =>
              view.post
                ? setView({ type: "detail", postId: view.post.id })
                : setView({ type: "list" })
            }
            onSuccess={(post) => setView({ type: "detail", postId: post.id })}
            showToast={showToast}
          />
        )}

        {view.type === "reports" && isAdmin && (
          <AdminReportsPanel
            onViewPost={(postId) =>
              setView({ type: "detail", postId, from: "reports" })
            }
            showToast={showToast}
          />
        )}

        {/* ── Toast ──────────────────────────────────────────────────────── */}
        {toast && (
          <Toast
            key={toast.key}
            msg={toast.msg}
            type={toast.type}
            onDone={() => setToast(null)}
          />
        )}
      </div>
    </>
  );
}
