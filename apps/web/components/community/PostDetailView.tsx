import { useState, useEffect } from "react";
import { Avatar } from "./Avatar";
import {
  CommunityService,
  type Post,
  type Comment,
} from "@/services/community.service";
import { timeAgo } from "@/lib/timeAgo";
import { ReportModal } from "./ReportModal";

// ─── Props ────────────────────────────────────────────────────────────────────

interface PostDetailViewProps {
  postId: string;
  onBack: () => void;
  onEdit: (post: Post) => void;
  showToast: (msg: string, type?: "ok" | "err") => void;
  isAdmin?: boolean;
}

// ─── CommentItem ──────────────────────────────────────────────────────────────

interface CommentItemProps {
  comment: Comment;
  postId: string;
  showToast: (msg: string, type?: "ok" | "err") => void;
  onDeleted: (id: string) => void;
  onUpdated: (c: Comment) => void;
  isAdmin?: boolean;
}

function CommentItem({
  comment,
  postId,
  showToast,
  onDeleted,
  onUpdated,
  isAdmin,
}: CommentItemProps) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(comment.content);
  const [saving, setSaving] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  async function saveEdit() {
    if (!editVal.trim()) return;
    setSaving(true);
    try {
      const updated = await CommunityService.updateComment(postId, comment.id, {
        content: editVal.trim(),
      });
      onUpdated(updated);
      setEditing(false);
      showToast("Comment updated");
    } catch {
      showToast("Failed to update", "err");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      if (isAdmin) {
        await CommunityService.adminDeleteComment(comment.id);
      } else {
        await CommunityService.deleteComment(postId, comment.id);
      }
      onDeleted(comment.id);
      showToast("Comment deleted");
    } catch {
      showToast("Failed to delete", "err");
    }
  }

  const canEdit = comment.isOwn;
  const canDelete = comment.isOwn || isAdmin;

  return (
    <div
      style={{
        padding: "16px 0",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <Avatar
          name={comment.author?.name ?? "User"}
          avatar={comment.author?.avatar}
          size={32}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Author + time + menu */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
              {comment.author?.name ?? "User"}
            </span>
            {isAdmin && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: "#dbeafe",
                  color: "#1d4ed8",
                  padding: "1px 6px",
                  borderRadius: 4,
                  letterSpacing: "0.04em",
                }}
              >
                {comment.author?.role}
              </span>
            )}
            <span style={{ fontSize: 11, color: "#94a3b8" }}>
              {timeAgo(comment.createdAt)}
            </span>
            <div style={{ flex: 1 }} />
            {(canEdit || canDelete) && (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowMenu((v) => !v)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    fontSize: 16,
                    padding: "0 4px",
                    lineHeight: 1,
                  }}
                >
                  ···
                </button>
                {showMenu && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 4px)",
                      background: "#fff",
                      borderRadius: 10,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      overflow: "hidden",
                      minWidth: 130,
                      zIndex: 10,
                    }}
                  >
                    {canEdit && (
                      <button
                        onClick={() => {
                          setEditing(true);
                          setShowMenu(false);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "9px 14px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 13,
                          textAlign: "left",
                          color: "#334155",
                          fontFamily: "inherit",
                        }}
                      >
                        ✏️ Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => {
                          handleDelete();
                          setShowMenu(false);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "9px 14px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 13,
                          textAlign: "left",
                          color: "#dc2626",
                          fontFamily: "inherit",
                        }}
                      >
                        🗑 Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Edit mode */}
          {editing ? (
            <div>
              <textarea
                value={editVal}
                onChange={(e) => setEditVal(e.target.value.slice(0, 2000))}
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1.5px solid #93c5fd",
                  fontSize: 13,
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: 8,
                  color: "#0f172a",
                }}
              />
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setEditing(false)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    color: "#64748b",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {saving ? "…" : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#334155",
                lineHeight: 1.6,
              }}
            >
              {comment.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PostDetailView ───────────────────────────────────────────────────────────

export function PostDetailView({
  postId,
  onBack,
  onEdit,
  showToast,
  isAdmin,
}: PostDetailViewProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentVal, setCommentVal] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pinning, setPinning] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    setLoading(true);
    CommunityService.getPost(postId)
      .then((p) => {
        setPost(p);
        setComments(p.comments ?? []);
        setLiked(p.isLiked ?? false);
        setLikeCount(p._count?.likes ?? p.likeCount ?? 0);
        setBookmarked(p.isBookmarked ?? false);
      })
      .catch(() => showToast("Failed to load post", "err"))
      .finally(() => setLoading(false));
  }, [postId]);

  async function toggleLike() {
    if (!post) return;
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
    }
  }

  async function toggleBookmark() {
    if (!post) return;
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
    }
  }

  async function togglePin() {
    if (!post) return;
    setPinning(true);
    try {
      if (post.isPinned) {
        const updated = await CommunityService.unpinPost(post.id);
        setPost(updated);
        showToast("Post unpinned");
      } else {
        const updated = await CommunityService.pinPost(post.id);
        setPost(updated);
        showToast("Post pinned");
      }
    } catch {
      showToast("Failed to update pin", "err");
    } finally {
      setPinning(false);
    }
  }

  async function submitComment() {
    if (!post || !commentVal.trim()) return;
    setSubmitting(true);
    try {
      const c = await CommunityService.createComment(post.id, {
        content: commentVal.trim(),
      });
      setComments((prev) => [...prev, c]);
      setCommentVal("");
      showToast("Comment added");
    } catch (e: any) {
      showToast(e?.response?.data?.message || "Failed to comment", "err");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeletePost() {
    if (!post) return;
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(true);
    try {
      if (isAdmin) {
        await CommunityService.adminDeletePost(post.id);
      } else {
        await CommunityService.deletePost(post.id);
      }
      showToast("Post deleted");
      onBack();
    } catch {
      showToast("Failed to delete", "err");
      setDeleting(false);
    }
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div>
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#64748b",
            fontSize: 14,
            padding: "0 0 20px",
            fontFamily: "inherit",
          }}
        >
          ← Back
        </button>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[200, 120].map((h, i) => (
            <div
              key={i}
              style={{
                height: h,
                borderRadius: 20,
                background: "#f1f5f9",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#64748b",
            fontSize: 14,
            fontFamily: "inherit",
          }}
        >
          ← Back
        </button>
        <p style={{ color: "#94a3b8", textAlign: "center", marginTop: 40 }}>
          Post not found.
        </p>
      </div>
    );
  }

  const canEdit = post.isOwn;
  const canDelete = post.isOwn || isAdmin;
  const canPin = isAdmin;
  const canReport = !post.isOwn && !isAdmin;

  function timeAgoFull(d: string) {
    return new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div>
      {/* Report Modal */}
      {showReport && (
        <ReportModal
          postId={post.id}
          onClose={() => setShowReport(false)}
          showToast={showToast}
        />
      )}

      {/* Back */}
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#64748b",
          fontSize: 14,
          padding: "0 0 20px",
          fontFamily: "inherit",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#0f172a")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
      >
        ← Back to Community
      </button>

      {/* Post card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1.5px solid #e2e8f0",
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        {/* Pinned banner */}
        {post.isPinned && (
          <div
            style={{
              background: "linear-gradient(90deg, #1d4ed8, #2563eb)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              padding: "8px 22px",
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            📌 PINNED POST
          </div>
        )}

        <div style={{ padding: "24px 22px" }}>
          {/* Author row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <Avatar
              name={post.author?.name ?? "User"}
              avatar={post.author?.avatar}
              size={42}
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}
                >
                  {post.author?.name ?? "User"}
                </span>
                {post.author?.role !== "STUDENT" && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      background: "#dbeafe",
                      color: "#1d4ed8",
                      padding: "2px 7px",
                      borderRadius: 4,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {post.author?.role}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                {timeAgoFull(post.createdAt)}
              </div>
            </div>
            <div style={{ flex: 1 }} />

            {/* Action buttons row */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* Pin/Unpin — admin only */}
              {canPin && (
                <button
                  onClick={togglePin}
                  disabled={pinning}
                  title={post.isPinned ? "Unpin post" : "Pin post"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: `1.5px solid ${
                      post.isPinned ? "#93c5fd" : "#e2e8f0"
                    }`,
                    background: post.isPinned ? "#eff6ff" : "#f8fafc",
                    color: post.isPinned ? "#2563eb" : "#64748b",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
                  {pinning ? (
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        border: "2px solid #e2e8f0",
                        borderTopColor: "#2563eb",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                  ) : (
                    <span>{post.isPinned ? "📌 Unpin" : "📌 Pin"}</span>
                  )}
                </button>
              )}

              {/* Report — non-owner, non-admin */}
              {canReport && (
                <button
                  onClick={() => setShowReport(true)}
                  title="Report post"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "1.5px solid #e2e8f0",
                    background: "#f8fafc",
                    color: "#64748b",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#fca5a5";
                    e.currentTarget.style.color = "#dc2626";
                    e.currentTarget.style.background = "#fef2f2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.color = "#64748b";
                    e.currentTarget.style.background = "#f8fafc";
                  }}
                >
                  🚩 Report
                </button>
              )}

              {/* Edit / Delete menu */}
              {(canEdit || canDelete) && (
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowMenu((v) => !v)}
                    style={{
                      background: "none",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 8,
                      cursor: "pointer",
                      color: "#64748b",
                      fontSize: 16,
                      padding: "5px 10px",
                      lineHeight: 1,
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
                    ···
                  </button>
                  {showMenu && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 6px)",
                        background: "#fff",
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                        overflow: "hidden",
                        minWidth: 150,
                        zIndex: 10,
                      }}
                    >
                      {canEdit && (
                        <button
                          onClick={() => {
                            onEdit(post);
                            setShowMenu(false);
                          }}
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "11px 16px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 13,
                            textAlign: "left",
                            color: "#334155",
                            fontFamily: "inherit",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#f8fafc")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "none")
                          }
                        >
                          ✏️ Edit Post
                        </button>
                      )}
                      {isAdmin && canPin && (
                        <button
                          onClick={() => {
                            togglePin();
                            setShowMenu(false);
                          }}
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "11px 16px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 13,
                            textAlign: "left",
                            color: "#334155",
                            fontFamily: "inherit",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#f8fafc")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "none")
                          }
                        >
                          📌 {post.isPinned ? "Unpin" : "Pin"} Post
                        </button>
                      )}
                      {canDelete && (
                        <>
                          <div
                            style={{
                              height: 1,
                              background: "#f1f5f9",
                              margin: "2px 0",
                            }}
                          />
                          <button
                            onClick={() => {
                              handleDeletePost();
                              setShowMenu(false);
                            }}
                            disabled={deleting}
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "11px 16px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: 13,
                              textAlign: "left",
                              color: "#dc2626",
                              fontFamily: "inherit",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#fef2f2")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "none")
                            }
                          >
                            🗑 {deleting ? "Deleting…" : "Delete Post"}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h1
            style={{
              margin: "0 0 14px",
              fontSize: 22,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
            }}
          >
            {post.title}
          </h1>

          {/* Content */}
          <div
            style={{
              fontSize: 15,
              color: "#334155",
              lineHeight: 1.75,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {post.content}
          </div>
        </div>

        {/* Actions bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 22px",
            borderTop: "1px solid #f1f5f9",
            background: "#f8fafc",
          }}
        >
          <button
            onClick={toggleLike}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 14px",
              borderRadius: 20,
              border: "none",
              background: liked ? "#dbeafe" : "#e2e8f0",
              color: liked ? "#2563eb" : "#64748b",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 15 }}>{liked ? "❤️" : "♡"}</span>
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 14px",
              borderRadius: 20,
              background: "#e2e8f0",
              color: "#64748b",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <span>💬</span> {comments.length}
          </div>
          <div style={{ flex: 1 }} />
          <button
            onClick={toggleBookmark}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              color: bookmarked ? "#2563eb" : "#cbd5e1",
              padding: "4px 8px",
              transition: "color 0.15s",
            }}
          >
            {bookmarked ? "🔖" : "🏷"}
          </button>
        </div>
      </div>

      {/* Comments */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1.5px solid #e2e8f0",
          padding: "20px 22px",
        }}
      >
        <h3
          style={{
            margin: "0 0 4px",
            fontSize: 15,
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h3>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "#94a3b8" }}>
          {comments.length === 0
            ? "No comments yet — be the first!"
            : "Join the discussion below."}
        </p>

        {comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            postId={post.id}
            showToast={showToast}
            onDeleted={(id) =>
              setComments((prev) => prev.filter((x) => x.id !== id))
            }
            onUpdated={(updated) =>
              setComments((prev) =>
                prev.map((x) => (x.id === updated.id ? updated : x))
              )
            }
            isAdmin={isAdmin}
          />
        ))}

        {/* Comment box */}
        <div
          style={{ marginTop: 20, paddingTop: comments.length > 0 ? 16 : 0 }}
        >
          <textarea
            value={commentVal}
            onChange={(e) => setCommentVal(e.target.value.slice(0, 2000))}
            placeholder="Write a comment…"
            rows={3}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1.5px solid #e2e8f0",
              fontSize: 14,
              fontFamily: "inherit",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: 10,
              color: "#0f172a",
              background: "#f8fafc",
              transition: "border-color 0.15s, background 0.15s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#93c5fd";
              e.target.style.background = "#fff";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.background = "#f8fafc";
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 12, color: "#94a3b8" }}>
              {2000 - commentVal.length} chars left
            </span>
            <button
              onClick={submitComment}
              disabled={submitting || !commentVal.trim()}
              style={{
                padding: "9px 20px",
                borderRadius: 10,
                border: "none",
                background: commentVal.trim() ? "#2563eb" : "#e2e8f0",
                color: commentVal.trim() ? "#fff" : "#94a3b8",
                fontWeight: 700,
                fontSize: 13,
                cursor: commentVal.trim() ? "pointer" : "default",
                transition: "all 0.2s",
                fontFamily: "inherit",
                boxShadow: commentVal.trim()
                  ? "0 4px 14px rgba(37,99,235,0.25)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (commentVal.trim())
                  e.currentTarget.style.background = "#1d4ed8";
              }}
              onMouseLeave={(e) => {
                if (commentVal.trim())
                  e.currentTarget.style.background = "#2563eb";
              }}
            >
              {submitting ? "Posting…" : "Post Comment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
