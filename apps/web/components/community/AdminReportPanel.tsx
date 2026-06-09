"use client";

import { useState, useEffect, useCallback } from "react";
import { CommunityService, type Report } from "@/services/community.service";
import { Avatar } from "./Avatar";
import { timeAgo } from "@/lib/timeAgo";

interface AdminReportsPanelProps {
  onViewPost: (postId: string) => void;
  showToast: (msg: string, type?: "ok" | "err") => void;
}

function Spinner() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "3px solid #e2e8f0",
          borderTopColor: "#dc2626",
          animation: "spin 0.7s linear infinite",
        }}
      />
    </div>
  );
}

export function AdminReportsPanel({
  onViewPost,
  showToast,
}: AdminReportsPanelProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const grouped = reports.reduce<Record<string, Report[]>>((acc, r) => {
    const key = r.postId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});
  const groupedEntries = Object.entries(grouped);

  const fetchReports = useCallback(
    async (p = 1) => {
      setLoading(true);
      try {
        const res = await CommunityService.getReports({ page: p, limit: 50 });
        const items: Report[] = res.data ?? (res as any).items ?? [];
        const totalPgs =
          res.pagination?.totalPages ??
          (res as any).totalPages ??
          (res as any).meta?.totalPages ??
          1;
        setReports(items);
        setTotalPages(totalPgs);
        setPage(p);
      } catch {
        showToast("Failed to load reports", "err");
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchReports(1);
  }, [fetchReports]);

  async function handleDeletePost(postId: string) {
    if (
      !confirm(
        "Delete this post permanently? All its reports will also be removed."
      )
    )
      return;
    setActioningId(postId);
    try {
      await CommunityService.adminDeletePost(postId);
      setReports((prev) => prev.filter((r) => r.postId !== postId));
      showToast("Post deleted");
    } catch {
      showToast("Failed to delete post", "err");
    } finally {
      setActioningId(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.02em",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              🚩 Reports
              {reports.length > 0 && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 24,
                    height: 24,
                    borderRadius: 12,
                    background: "#dc2626",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "0 7px",
                  }}
                >
                  {reports.length}
                </span>
              )}
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>
              {groupedEntries.length} reported{" "}
              {groupedEntries.length === 1 ? "post" : "posts"} ·{" "}
              {reports.length} total{" "}
              {reports.length === 1 ? "report" : "reports"}
            </p>
          </div>
          <button
            onClick={() => fetchReports(page)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 10,
              border: "1.5px solid #e2e8f0",
              background: "#f8fafc",
              color: "#64748b",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#cbd5e1";
              e.currentTarget.style.color = "#334155";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.color = "#64748b";
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Spinner />
      ) : groupedEntries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#64748b",
              marginBottom: 6,
            }}
          >
            No reports
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>
            The community is all clear.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {groupedEntries.map(([postId, postReports]) => {
            const first = postReports[0];
            const post = first.post;
            const isActioning = actioningId === postId;

            return (
              <div
                key={postId}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1.5px solid #fecaca",
                  overflow: "hidden",
                }}
              >
                {/* Post preview — clicking navigates to PostDetailView via onViewPost */}
                <div
                  style={{
                    padding: "16px 18px",
                    borderBottom: "1px solid #f1f5f9",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onClick={() => onViewPost(postId)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f8fafc")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#dc2626",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span>📄</span> Reported Post
                    <span
                      style={{
                        marginLeft: "auto",
                        color: "#94a3b8",
                        fontWeight: 400,
                        fontSize: 11,
                        letterSpacing: 0,
                        textTransform: "none",
                      }}
                    >
                      click to view →
                    </span>
                  </div>
                  {post ? (
                    <>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#0f172a",
                          marginBottom: 4,
                          lineHeight: 1.3,
                        }}
                      >
                        {post.title}
                      </div>
                      {post.content && (
                        <div
                          style={{
                            fontSize: 13,
                            color: "#64748b",
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {post.content}
                        </div>
                      )}
                      {post.author?.name && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            marginTop: 6,
                          }}
                        >
                          by {post.author.name}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ fontSize: 13, color: "#94a3b8" }}>
                      Post ID: {postId}
                    </div>
                  )}
                </div>

                {/* Reports list */}
                <div style={{ padding: "12px 18px" }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94a3b8",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    {postReports.length}{" "}
                    {postReports.length === 1 ? "Report" : "Reports"}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    {postReports.map((r) => (
                      <div
                        key={r.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "9px 12px",
                          background: "#fef2f2",
                          borderRadius: 10,
                          border: "1px solid #fecaca",
                        }}
                      >
                        <Avatar
                          name={r.user?.name ?? "User"}
                          avatar={r.user?.avatar}
                          size={26}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#0f172a",
                            }}
                          >
                            {r.user?.name ?? "User"}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              color: "#64748b",
                              marginLeft: 6,
                            }}
                          >
                            · {timeAgo(r.createdAt)}
                          </span>
                        </div>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "3px 10px",
                            borderRadius: 20,
                            background: "#fff",
                            border: "1px solid #fca5a5",
                            color: "#dc2626",
                            fontSize: 11,
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          🚩 {r.reason}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => onViewPost(postId)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "8px 16px",
                        borderRadius: 9,
                        border: "1.5px solid #bfdbfe",
                        background: "#eff6ff",
                        color: "#2563eb",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#dbeafe")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#eff6ff")
                      }
                    >
                      👁 View Post
                    </button>

                    <button
                      onClick={() => handleDeletePost(postId)}
                      disabled={isActioning}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "8px 16px",
                        borderRadius: 9,
                        border: "1.5px solid #fecaca",
                        background: "#fef2f2",
                        color: "#dc2626",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: isActioning ? "default" : "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.15s",
                        opacity: isActioning ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActioning)
                          e.currentTarget.style.background = "#fee2e2";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActioning)
                          e.currentTarget.style.background = "#fef2f2";
                      }}
                    >
                      {isActioning ? "Deleting…" : "🗑 Delete Post"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 28,
          }}
        >
          <button
            onClick={() => fetchReports(page - 1)}
            disabled={page <= 1}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: "1.5px solid #e2e8f0",
              background: page <= 1 ? "#f8fafc" : "#fff",
              color: page <= 1 ? "#cbd5e1" : "#334155",
              fontSize: 13,
              fontWeight: 600,
              cursor: page <= 1 ? "default" : "pointer",
              fontFamily: "inherit",
            }}
          >
            ← Prev
          </button>
          <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => fetchReports(page + 1)}
            disabled={page >= totalPages}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: "1.5px solid #e2e8f0",
              background: page >= totalPages ? "#f8fafc" : "#fff",
              color: page >= totalPages ? "#cbd5e1" : "#334155",
              fontSize: 13,
              fontWeight: 600,
              cursor: page >= totalPages ? "default" : "pointer",
              fontFamily: "inherit",
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
