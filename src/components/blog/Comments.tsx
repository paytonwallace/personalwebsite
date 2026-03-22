"use client";

import { useEffect, useState } from "react";

interface Comment {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
}

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadComments() {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch {
      // silently fail
    }
  }

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, author_name: name.trim(), content: content.trim() }),
      });
      if (!res.ok) throw new Error("failed");
      setName("");
      setContent("");
      await loadComments();
    } catch {
      setError("failed to post comment. try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function timeAgo(dateStr: string) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div style={{ marginTop: "48px" }}>
      <h3
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "14px",
          color: "var(--text-muted)",
          marginBottom: "20px",
          textTransform: "lowercase",
        }}
      >
        comments ({comments.length})
      </h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "32px" }}>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            color: "var(--text)",
            fontFamily: "var(--font-geist-sans)",
            fontSize: "14px",
            marginBottom: "8px",
            outline: "none",
          }}
        />
        <textarea
          placeholder="write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          rows={3}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            color: "var(--text)",
            fontFamily: "var(--font-geist-sans)",
            fontSize: "14px",
            marginBottom: "8px",
            outline: "none",
            resize: "vertical",
          }}
        />
        {error && (
          <p style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting || !name.trim() || !content.trim()}
          style={{
            padding: "8px 20px",
            background: submitting ? "#333" : "#22c55e",
            border: "none",
            borderRadius: "6px",
            color: "#000",
            fontFamily: "var(--font-geist-mono)",
            fontSize: "12px",
            fontWeight: 600,
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: !name.trim() || !content.trim() ? 0.4 : 1,
            transition: "opacity 0.15s ease",
          }}
        >
          {submitting ? "posting..." : "post comment"}
        </button>
      </form>

      {/* Comment list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {comments.map((c) => (
          <div
            key={c.id}
            style={{
              padding: "14px 16px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "12px",
                  color: "#22c55e",
                  fontWeight: 600,
                }}
              >
                {c.author_name}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "12px",
                  color: "var(--text-faint)",
                }}
              >
                {timeAgo(c.created_at)}
              </span>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text)",
                lineHeight: 1.5,
              }}
            >
              {c.content}
            </p>
          </div>
        ))}
        {comments.length === 0 && (
          <p
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "12px",
              color: "var(--text-faint)",
            }}
          >
            no comments yet. be the first.
          </p>
        )}
      </div>
    </div>
  );
}
