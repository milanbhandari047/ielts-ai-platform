"use client";

import { useState } from "react";
import { CommunityService, type Post } from "@/services/community.service";

interface PostFormProps {
  existingPost?: { id: string; title: string; content: string };
  onBack: () => void;
  onSuccess: (post: Post) => void;
  showToast: (msg: string, type?: "ok" | "err") => void;
}

export default function PostForm({
  existingPost,
  onBack,
  onSuccess,
  showToast,
}: PostFormProps) {
  const [title, setTitle] = useState(existingPost?.title ?? "");
  const [content, setContent] = useState(existingPost?.content ?? "");
  const [loading, setLoading] = useState(false);

  const isEdit = !!existingPost;
  const titleLeft = 200 - title.length;
  const contentLeft = 10000 - content.length;
  const canSubmit = title.trim() && content.trim() && !loading;

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      showToast("Title and content are required", "err");
      return;
    }
    setLoading(true);
    try {
      let post: Post;
      if (isEdit) {
        post = await CommunityService.updatePost(existingPost.id, {
          title,
          content,
        });
        showToast("Post updated!");
      } else {
        post = await CommunityService.createPost({ title, content });
        showToast("Post published!");
      }
      onSuccess(post);
    } catch (e: any) {
      showToast(e?.response?.data?.message || "Something went wrong", "err");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Back button */}
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
          fontWeight: 600,
          padding: "0 0 20px",
          fontFamily: "inherit",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#0f172a")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
      >
        ← Back
      </button>

      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "28px 24px",
          border: "1.5px solid #e2e8f0",
          boxShadow: "0 4px 24px rgba(37,99,235,0.05)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h2
            style={{
              margin: "0 0 4px",
              fontSize: 22,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.02em",
            }}
          >
            {isEdit ? "Edit Post" : "New Post"}
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
            {isEdit
              ? "Update your post below."
              : "Share a question, tip, or idea with the community."}
          </p>
        </div>

        {/* Title field */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#64748b",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Title
            </label>
            <span
              style={{
                fontSize: 11,
                color: titleLeft < 20 ? "#dc2626" : "#94a3b8",
                fontWeight: titleLeft < 20 ? 600 : 400,
                transition: "color 0.15s",
              }}
            >
              {titleLeft} left
            </span>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 200))}
            placeholder="Give your post a clear, descriptive title…"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 12,
              border: "1.5px solid #e2e8f0",
              fontSize: 15,
              fontWeight: 600,
              color: "#0f172a",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
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
        </div>

        {/* Content field */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#64748b",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Content
            </label>
            <span
              style={{
                fontSize: 11,
                color: contentLeft < 200 ? "#dc2626" : "#94a3b8",
                fontWeight: contentLeft < 200 ? 600 : 400,
                transition: "color 0.15s",
              }}
            >
              {contentLeft.toLocaleString()} left
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 10000))}
            placeholder="Share your thoughts, questions, or ideas…"
            rows={10}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 12,
              border: "1.5px solid #e2e8f0",
              fontSize: 14,
              lineHeight: 1.7,
              color: "#334155",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
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
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onBack}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 12,
              border: "1.5px solid #e2e8f0",
              background: "#f8fafc",
              color: "#64748b",
              fontWeight: 600,
              fontSize: 14,
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
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              flex: 2,
              padding: "12px",
              borderRadius: 12,
              border: "none",
              background: canSubmit ? "#2563eb" : "#e2e8f0",
              color: canSubmit ? "#fff" : "#94a3b8",
              fontWeight: 700,
              fontSize: 15,
              cursor: canSubmit ? "pointer" : "default",
              boxShadow: canSubmit ? "0 4px 14px rgba(37,99,235,0.30)" : "none",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              if (canSubmit) e.currentTarget.style.background = "#1d4ed8";
            }}
            onMouseLeave={(e) => {
              if (canSubmit) e.currentTarget.style.background = "#2563eb";
            }}
          >
            {loading
              ? isEdit
                ? "Saving…"
                : "Publishing…"
              : isEdit
              ? "Save Changes"
              : "Publish Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
