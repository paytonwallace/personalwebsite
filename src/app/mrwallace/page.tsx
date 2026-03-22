"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import BlogLoadingScreen from "@/components/blog/BlogLoadingScreen";

interface PostMeta {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  readTime: string;
}

interface PostsMeta {
  [slug: string]: { likes: number; comments: number };
}

const CATEGORIES = [
  { id: "all", label: "all" },
  { id: "mr/build", label: "mr/build" },
  { id: "mr/frameworks", label: "mr/frameworks" },
  { id: "mr/tools", label: "mr/tools" },
  { id: "mr/lessons", label: "mr/lessons" },
  { id: "mr/brain", label: "mr/brain" },
  { id: "mr/strategy", label: "mr/strategy" },
  { id: "mr/market", label: "mr/market" },
];

function HeartIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function MrWallacePage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [filter, setFilter] = useState("all");
  const [meta, setMeta] = useState<PostsMeta>({});

  const onLoadingComplete = useCallback(() => setLoading(false), []);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data: PostMeta[]) => {
        setPosts(data);
        // Fetch likes/comments counts
        if (data.length > 0) {
          const slugs = data.map((p) => p.slug).join(",");
          fetch(`/api/posts-meta?slugs=${encodeURIComponent(slugs)}`)
            .then((r) => r.json())
            .then((m: PostsMeta) => setMeta(m))
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  const filtered = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  function formatDate(d: string) {
    const [year, month, day] = d.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (loading) return <BlogLoadingScreen onComplete={onLoadingComplete} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "0",
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "24px 24px 20px",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img src="/mr-wallace-logo.png" alt="Mr. Wallace" style={{ maxWidth: "200px", height: "auto" }} />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "28px",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "6px",
              letterSpacing: "-0.02em",
            }}
          >
            /mrwallace
          </h1>
          <p
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "12px",
              color: "var(--text-faint)",
            }}
          >
            thoughts on building, tools, frameworks, and lessons from the field
          </p>
        </div>
      </header>

      {/* Category filter */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "12px 24px",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            display: "flex",
            gap: "8px",
            flexWrap: "nowrap",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              style={{
                padding: "5px 14px",
                borderRadius: "20px",
                border: "1px solid",
                borderColor: filter === cat.id ? "#22c55e" : "var(--border)",
                background: filter === cat.id ? "rgba(34,197,94,0.1)" : "transparent",
                color: filter === cat.id ? "#22c55e" : "var(--text-muted)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "12px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts feed */}
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "16px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            // recent writings
          </p>
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>
            {filtered.length} {filtered.length === 1 ? "post" : "posts"}
          </p>
        </div>
        <AnimatePresence mode="popLayout">
          {filtered.map((post, i) => {
            const postMeta = meta[post.slug];
            return (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
              >
                <Link
                  href={`/mrwallace/${post.slug}`}
                  style={{ textDecoration: "none", color: "inherit", display: "block" }}
                >
                  <article
                    style={{
                      padding: "20px 0",
                      borderBottom: "1px solid var(--border)",
                      transition: "background 0.12s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--bg-surface)";
                      e.currentTarget.style.margin = "0 -16px";
                      e.currentTarget.style.padding = "20px 16px";
                      e.currentTarget.style.borderRadius = "8px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.margin = "0";
                      e.currentTarget.style.padding = "20px 0";
                      e.currentTarget.style.borderRadius = "0";
                    }}
                  >
                    {/* Meta row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          padding: "2px 10px",
                          borderRadius: "12px",
                          background: "rgba(34,197,94,0.1)",
                          border: "1px solid rgba(34,197,94,0.3)",
                          color: "#22c55e",
                          fontFamily: "var(--font-geist-mono)",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        {post.category}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-geist-mono)",
                          fontSize: "12px",
                          color: "var(--text-faint)",
                        }}
                      >
                        {formatDate(post.date)}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-geist-mono)",
                          fontSize: "12px",
                          color: "var(--text-faint)",
                        }}
                      >
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h2
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "var(--text)",
                        marginBottom: "6px",
                        lineHeight: 1.3,
                      }}
                    >
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--text-muted)",
                        lineHeight: 1.5,
                        marginBottom: "8px",
                      }}
                    >
                      {post.excerpt}
                    </p>

                    {/* Likes & Comments */}
                    {postMeta && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          color: "var(--text-faint)",
                          fontFamily: "var(--font-geist-mono)",
                          fontSize: "11px",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <HeartIcon />
                          {postMeta.likes}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <CommentIcon />
                          {postMeta.comments}
                        </span>
                      </div>
                    )}
                  </article>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <p
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "14px",
              color: "var(--text-faint)",
              textAlign: "center",
              padding: "60px 0",
            }}
          >
            no posts yet in this category.
          </p>
        )}
      </main>
    </motion.div>
  );
}
