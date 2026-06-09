"use client";

import { useState } from "react";
import { Avatar } from "./Avatar";
import { CommunityService, type Post } from "@/services/community.service";

interface PostCardProps {
  post: Post;
  onSelect: (id: string) => void;
  showToast: (msg: string, type?: "ok" | "err") => void;
  onRefresh?: () => void;
  isAdmin?: boolean;
}

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function PostCard({
  post,
  onSelect,
  showToast,
  onRefresh,
  isAdmin,
}: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(
    post._count?.likes ?? post.likeCount ?? 0
  );
  const [bookmarked, setBookmarked] = useState(post.isBookmarked ?? false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const commentCount =
    post._count?.comments ?? post.commentCount ?? post.comments?.length ?? 0;

  async function toggleLike(e: React.MouseEvent) {
    e.stopPropagation();
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      if (liked) {
        const r = await CommunityService.unlikePost(post.id);
        setLiked(false);
        setLikeCount(r.likeCount);
      } else {
        const r = await CommunityService.likePost(post.id);
        setLiked(true);
        setLikeCount(r.likeCount);
      }
    } catch {
      showToast("Action failed", "err");
    } finally {
      setLikeLoading(false);
    }
  }

  async function toggleBookmark(e: React.MouseEvent) {
    e.stopPropagation();
    if (bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      if (bookmarked) {
        await CommunityService.unbookmarkPost(post.id);
        setBookmarked(false);
        showToast("Removed from bookmarks");
      } else {
        await CommunityService.bookmarkPost(post.id);
        setBookmarked(true);
        showToast("Saved to bookmarks");
      }
    } catch {
      showToast("Action failed", "err");
    } finally {
      setBookmarkLoading(false);
    }
  }

  const preview =
    post.content.length > 160
      ? post.content.slice(0, 160).trimEnd() + "…"
      : post.content;

  return (
    <article
      onClick={() => onSelect(post.id)}
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "18px 20px",
        cursor: "pointer",
        border: "1.5px solid #e2e8f0",
        transition: "all 0.18s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#93c5fd";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 6px 24px rgba(37,99,235,0.09)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Pinned badge */}
      {post.isPinned && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: "#2563eb",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            padding: "4px 10px",
            borderBottomLeftRadius: 8,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          📌 Pinned
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <Avatar
          name={post.author?.name ?? "User"}
          avatar={post.author?.avatar}
          size={34}
        />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
            {post.author?.name ?? "Unknown"}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>
            {timeAgo(post.createdAt)}
          </div>
        </div>
      </div>

      {/* Title */}
      <h2
        style={{
          margin: "0 0 6px",
          fontSize: 15,
          fontWeight: 700,
          color: "#0f172a",
          lineHeight: 1.35,
        }}
      >
        {post.title}
      </h2>

      {/* Preview */}
      <p
        style={{
          margin: "0 0 14px",
          fontSize: 13,
          color: "#64748b",
          lineHeight: 1.6,
        }}
      >
        {preview}
      </p>

      {/* Footer actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          paddingTop: 12,
          borderTop: "1px solid #f1f5f9",
        }}
      >
        {/* Like */}
        <button
          onClick={toggleLike}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 12px",
            borderRadius: 20,
            border: "none",
            background: liked ? "#dbeafe" : "#f1f5f9",
            color: liked ? "#2563eb" : "#64748b",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {likeLoading ? (
            <div
              style={{
                width: 13,
                height: 13,
                borderRadius: "50%",
                border: "2px solid #e2e8f0",
                borderTopColor: "#2563eb",
                animation: "spin 0.7s linear infinite",
              }}
            />
          ) : (
            <span style={{ fontSize: 13 }}>{liked ? "❤️" : "♡"}</span>
          )}
          {likeCount}
        </button>
        {/* <button
          onClick={toggleLike}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "7px 14px",
            borderRadius: 20,
            border: "none",
            background: liked ? "#fee2e2" : "#e2e8f0",
            color: liked ? "#dc2626" : "#64748b",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <span style={{ fontSize: 15 }}>{liked ? "❤️" : "🤍"}</span>
          {likeCount}
        </button> */}
        {/* Comments */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 12px",
            borderRadius: 20,
            background: "#f1f5f9",
            color: "#64748b",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <span>💬</span>
          {commentCount}
        </div>

        <div style={{ flex: 1 }} />

        {/* Bookmark */}
        <button
          onClick={toggleBookmark}
          title={bookmarked ? "Remove bookmark" : "Bookmark"}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 17,
            color: bookmarked ? "#2563eb" : "#cbd5e1",
            padding: "4px 6px",
            borderRadius: 8,
            transition: "color 0.15s",
          }}
        >
          {bookmarkLoading ? (
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid #e2e8f0",
                borderTopColor: "#2563eb",
                animation: "spin 0.7s linear infinite",
                display: "inline-block",
              }}
            />
          ) : bookmarked ? (
            "🔖"
          ) : (
            "🏷"
          )}
        </button>

        {/* Arrow */}
        <span style={{ color: "#cbd5e1", fontSize: 16, lineHeight: 1 }}>›</span>
      </div>
    </article>
  );
}
