"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PostCard } from "./PostCard";
import {
  CommunityService,
  type Post,
  type Comment,
} from "@/services/community.service";

interface PostsListProps {
  onSelect: (id: string) => void;
  onNew: () => void;
  showToast: (msg: string, type?: "ok" | "err") => void;
  onSelectPostFromComment?: (postId: string) => void;
}

type Tab = "all" | "mine" | "bookmarks" | "mycomments";

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
          borderTopColor: "#2563eb",
          animation: "spin 0.7s linear infinite",
        }}
      />
    </div>
  );
}

// ─── My Comments list ────────────────────────────────────────────────────────

function MyCommentsList({
  showToast,
  onGoToPost,
}: {
  showToast: (msg: string, type?: "ok" | "err") => void;
  onGoToPost: (postId: string) => void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchComments = useCallback(
    async (p = 1) => {
      setLoading(true);
      try {
        const res = await CommunityService.getMyComments({
          page: p,
          limit: 10,
        });
        const items = res.data ?? (res as any).items ?? [];
        const totalPgs =
          res.pagination?.totalPages ??
          (res as any).totalPages ??
          (res as any).meta?.totalPages ??
          1;
        setComments(items);
        setTotalPages(totalPgs);
        setPage(p);
      } catch {
        showToast("Failed to load comments", "err");
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  if (loading) return <Spinner />;

  if (comments.length === 0) {
    return (
      <div
        style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#64748b",
            marginBottom: 6,
          }}
        >
          No comments yet
        </div>
        <div style={{ fontSize: 13, color: "#94a3b8" }}>
          Your comments on posts will appear here.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {comments.map((c) => (
          <div
            key={c.id}
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1.5px solid #e2e8f0",
              padding: "16px 18px",
              transition: "all 0.18s ease",
              cursor: "pointer",
            }}
            onClick={() => {
              const id = c.postId ?? c.post?.id;
              if (id) onGoToPost(id);
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#93c5fd";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 16px rgba(37,99,235,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            {/* Post title context */}
            {c.post?.title && (
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#2563eb",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span>📄</span>
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 280,
                  }}
                >
                  {c.post.title}
                </span>
              </div>
            )}

            {/* Comment content */}
            <p
              style={{
                margin: "0 0 10px",
                fontSize: 14,
                color: "#334155",
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {c.content}
            </p>

            {/* Meta */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                🕒{" "}
                {new Date(c.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 11, color: "#93c5fd", fontWeight: 600 }}>
                View post →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
            onClick={() => fetchComments(page - 1)}
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
            onClick={() => fetchComments(page + 1)}
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

// ─── PostsList ────────────────────────────────────────────────────────────────

export function PostsList({
  onSelect,
  onNew,
  showToast,
  onSelectPostFromComment,
}: PostsListProps) {
  const [tab, setTab] = useState<Tab>("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQ, setSearchQ] = useState("");
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToastRef = useRef(showToast);
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  const tabRef = useRef(tab);
  useEffect(() => {
    tabRef.current = tab;
  }, [tab]);

  const fetchPosts = useCallback(async (p = 1, q = "") => {
    setLoading(true);
    try {
      let res;
      const currentTab = tabRef.current;
      if (q.trim()) {
        res = await CommunityService.searchPosts({
          q: q.trim(),
          page: p,
          limit: 10,
        });
      } else if (currentTab === "mine") {
        res = await CommunityService.getMyPosts({ page: p, limit: 10 });
      } else if (currentTab === "bookmarks") {
        res = await CommunityService.getMyBookmarks({ page: p, limit: 10 });
      } else {
        res = await CommunityService.getPosts({ page: p, limit: 10 });
      }
      const posts = res.data ?? (res as any).items ?? [];
      const totalPgs =
        res.pagination?.totalPages ??
        (res as any).totalPages ??
        (res as any).meta?.totalPages ??
        1;
      setPosts(posts);
      setTotalPages(totalPgs);
      setPage(p);
    } catch (err: any) {
      showToastRef.current("Failed to load posts", "err");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab !== "mycomments") {
      fetchPosts(1, "");
      setSearchQ("");
    }
  }, [tab]);

  function handleSearch(q: string) {
    setSearchQ(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      await fetchPosts(1, q);
      setSearching(false);
    }, 420);
  }

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "all", label: "All Posts", icon: "◎" },
    { key: "mine", label: "My Posts", icon: "✦" },
    { key: "mycomments", label: "My Comments", icon: "💬" },
    { key: "bookmarks", label: "Saved", icon: "🔖" },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Community
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#94a3b8" }}>
              Ask questions, share ideas, connect.
            </p>
          </div>
          <button
            onClick={onNew}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 18px",
              borderRadius: 12,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(37,99,235,0.30)",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
          >
            <span style={{ fontSize: 16 }}>+</span>
            New Post
          </button>
        </div>

        {/* Search — hidden on mycomments tab */}
        {tab !== "mycomments" && (
          <div style={{ position: "relative", marginBottom: 16 }}>
            <span
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 15,
                color: "#94a3b8",
                pointerEvents: "none",
              }}
            >
              🔍
            </span>
            <input
              value={searchQ}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search posts…"
              style={{
                width: "100%",
                padding: "11px 14px 11px 40px",
                borderRadius: 12,
                border: "1.5px solid #e2e8f0",
                background: "#f8fafc",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                color: "#0f172a",
                transition: "border-color 0.15s",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#93c5fd")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
            {searching && (
              <div
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: "2px solid #e2e8f0",
                  borderTopColor: "#2563eb",
                  animation: "spin 0.7s linear infinite",
                }}
              />
            )}
          </div>
        )}

        {/* Tabs */}
        {!searchQ && (
          <div
            style={{
              display: "flex",
              gap: 4,
              background: "#f8fafc",
              borderRadius: 14,
              padding: 4,
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key);
                  setPage(1);
                }}
                style={{
                  flex: 1,
                  padding: "7px 10px",
                  borderRadius: 10,
                  border: "none",
                  background: tab === t.key ? "#fff" : "transparent",
                  color: tab === t.key ? "#2563eb" : "#64748b",
                  fontWeight: tab === t.key ? 700 : 500,
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  boxShadow:
                    tab === t.key ? "0 1px 6px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* My Comments tab — delegates to its own component */}
      {tab === "mycomments" && !searchQ ? (
        <MyCommentsList
          showToast={showToast}
          onGoToPost={onSelectPostFromComment ?? onSelect}
        />
      ) : loading ? (
        <Spinner />
      ) : (posts?.length ?? 0) === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#94a3b8",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>
            {tab === "bookmarks" ? "🔖" : tab === "mine" ? "✏️" : "💬"}
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#64748b",
              marginBottom: 6,
            }}
          >
            {searchQ
              ? "No posts found"
              : tab === "bookmarks"
              ? "No saved posts yet"
              : tab === "mine"
              ? "You haven't posted yet"
              : "No posts yet"}
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>
            {!searchQ &&
              tab === "all" &&
              "Be the first to start a conversation!"}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onSelect={onSelect}
              showToast={showToast}
              onRefresh={() => fetchPosts(page, searchQ)}
            />
          ))}
        </div>
      )}

      {/* Pagination — not shown for mycomments (handled internally) */}
      {tab !== "mycomments" && !loading && totalPages > 1 && (
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
            onClick={() => fetchPosts(page - 1, searchQ)}
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
            onClick={() => fetchPosts(page + 1, searchQ)}
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
