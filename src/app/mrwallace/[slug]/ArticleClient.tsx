"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Link from "next/link";
import ShareButton from "@/components/blog/ShareButton";
import Comments from "@/components/blog/Comments";

interface Props {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  content: string;
}

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default function ArticleClient({ slug, title, category, date, readTime, content }: Props) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Serialize MDX on client via API
    fetch("/api/blog/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
      .then((r) => r.json())
      .then((data) => setMdxSource(data.source))
      .catch(() => {});
  }, [content]);

  // Fetch likes count
  useEffect(() => {
    fetch(`/api/posts-meta?slugs=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data[slug]) {
          setLikes(data[slug].likes);
        }
      })
      .catch(() => {});
  }, [slug]);

  async function handleLike() {
    if (liked) return;
    setLiked(true);
    setLikes((prev) => prev + 1);
    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
    } catch {
      // revert on failure
      setLiked(false);
      setLikes((prev) => prev - 1);
    }
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
      }}
    >
      {/* Nav */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "16px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/mrwallace"
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "12px",
              color: "var(--text-faint)",
              textDecoration: "none",
              transition: "color 0.15s ease",
            }}
          >
            &larr; /mrwallace
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Like button */}
            <button
              onClick={handleLike}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                background: liked ? "rgba(34,197,94,0.1)" : "transparent",
                color: liked ? "#22c55e" : "var(--text-faint)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "12px",
                cursor: liked ? "default" : "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <HeartIcon filled={liked} />
              {likes}
            </button>
            <ShareButton title={title} slug={slug} />
          </div>
        </div>
      </header>

      {/* Article */}
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "16px",
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
            {category}
          </span>
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "12px",
              color: "var(--text-faint)",
            }}
          >
            {formatDate(date)}
          </span>
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "12px",
              color: "var(--text-faint)",
            }}
          >
            {readTime}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "var(--text)",
            lineHeight: 1.3,
            marginBottom: "40px",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>

        {/* MDX Content */}
        <div className="mrw-article">
          {mdxSource ? <MDXRemote {...mdxSource} /> : (
            <p style={{ color: "var(--text-faint)", fontFamily: "var(--font-geist-mono)", fontSize: "12px" }}>
              loading article...
            </p>
          )}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: "56px",
            padding: "24px",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            background: "var(--bg-surface)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "14px",
              color: "var(--text)",
              marginBottom: "12px",
            }}
          >
            want to build this for your business? dm payton on instagram
          </p>
          <a
            href="https://instagram.com/paytoncwallace"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "10px 24px",
              background: "#22c55e",
              color: "#000",
              borderRadius: "6px",
              fontFamily: "var(--font-geist-mono)",
              fontSize: "12px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "opacity 0.15s ease",
            }}
          >
            @paytoncwallace
          </a>
        </div>

        {/* Comments */}
        <Comments slug={slug} />
      </main>
    </motion.div>
  );
}
