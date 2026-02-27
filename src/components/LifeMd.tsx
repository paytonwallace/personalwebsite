"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import type { SectionProps } from "@/app/page";
import Script from "next/script";
import { useState, useEffect, useRef } from "react";

const BEHOLD_WIDGET_ID = "sds8Vb2FNDibTHnW8ZDP";

// ── Scramble animation ────────────────────────────────────────────────────────
const CHARS = "0123456789ABCDEF!@#$%^&*░▓█▒";
const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)];
const scramble = (len: number) => Array.from({ length: len }, rand).join("");

const FIELDS = [
  { label: "TARGET  ", value: "paytoncwallace",   crackAt: 800  },
  { label: "LOCATION", value: "dallas, tx",        crackAt: 1350 },
  { label: "CONTENT ", value: "instagram + blog",  crackAt: 1850 },
  { label: "ACCESS  ", value: "GRANTED",           crackAt: 2250 },
];

function CrackField({ label, value, crackAt, startedAt }: { label: string; value: string; crackAt: number; startedAt: number | null }) {
  const [display, setDisplay] = useState(scramble(value.length));
  const [cracked, setCracked] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAccess = label.trim() === "ACCESS";

  useEffect(() => {
    if (startedAt === null) return;
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(0, crackAt - elapsed);
    intervalRef.current = setInterval(() => setDisplay(scramble(value.length)), 55);
    const crackTimer = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplay(value.toUpperCase());
      setCracked(true);
    }, remaining);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(crackTimer);
    };
  }, [startedAt, crackAt, value]);

  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
      style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "14px" }}>
      <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", width: "76px", flexShrink: 0, letterSpacing: "0.06em" }}>
        [{label}]
      </span>
      <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "13px", fontWeight: cracked ? 600 : 400, color: cracked ? (isAccess ? "#22c55e" : "var(--text)") : "#555", minWidth: "180px", transition: "color 0.2s" }}>
        {display}
      </span>
      {cracked && (
        <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
          style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: "#22c55e", border: "1px solid #22c55e44", borderRadius: "4px", padding: "2px 7px", letterSpacing: "0.1em" }}>
          {isAccess ? "UNLOCKED" : "CRACKED"}
        </motion.span>
      )}
    </motion.div>
  );
}

function HackAnimation({ onDone }: { onDone: () => void }) {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStartedAt(Date.now()), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (startedAt === null) return;
    const lastCrack = Math.max(...FIELDS.map((f) => f.crackAt));
    const barStart = setTimeout(() => setShowBar(true), lastCrack + 200);
    return () => clearTimeout(barStart);
  }, [startedAt]);

  useEffect(() => {
    if (!showBar) return;
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setShowDone(true), 200);
        setTimeout(onDone, 800);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [showBar, onDone]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 56px" }}>
      <div style={{ maxWidth: "520px", width: "100%" }}>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", marginBottom: "28px", letterSpacing: "0.08em" }}>
          INITIATING BREACH PROTOCOL...
        </motion.p>
        {FIELDS.map((field) => (
          <CrackField key={field.label} label={field.label} value={field.value} crackAt={field.crackAt} startedAt={startedAt} />
        ))}
        {showBar && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: "28px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ flex: 1, height: "3px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                <motion.div style={{ height: "100%", background: "#22c55e", borderRadius: "2px" }} animate={{ width: `${progress}%` }} transition={{ duration: 0 }} />
              </div>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "#22c55e", width: "34px", textAlign: "right" }}>{progress}%</span>
            </div>
            {showDone && (
              <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", letterSpacing: "0.06em" }}>
                loading life.md...
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Blog posts ────────────────────────────────────────────────────────────────
interface Post {
  title: string;
  tag: string;
  tagColor: string;
  date: string;
  readTime: string;
  excerpt: string;
  paragraphs: string[];
}

const POSTS: Post[] = [
  {
    title: "why it's important to build a second brain (and how i use it)",
    tag: "systems",
    tagColor: "#3b5bdb",
    date: "feb 26, 2026",
    readTime: "4 min read",
    excerpt: "the human mind is built for ideation, not information storage. when you try to hold everything internally, you're using your most powerful tool for the wrong job.",
    paragraphs: [
      "a second brain is a system outside your head that stores what you know, what you're doing, and where you're going. the human mind is built for ideation — not information storage. when you try to hold everything internally — tasks, ideas, knowledge, decisions — you're using your most powerful tool for the wrong job.",
      "the concept comes from tiago forte's building a second brain: capture, organize, distill, express. but beyond the framework, the principle is simple. offload everything that doesn't need to live in your working memory so your mind is free to actually think.",
      "practically, this means using a connected system — one place where ideas land, projects live, decisions get documented, and knowledge is retrievable. not because you'll forget everything, but because retrieval without friction changes how you work. you stop losing ideas at 11pm. you stop re-solving problems you already solved. you stop showing up to meetings underprepared.",
      "the difference between someone who has a second brain and someone who doesn't isn't intelligence. it's leverage. the system compounds. everything you capture, connect, and revisit makes the next idea sharper and the next decision faster.",
      "start with three things: one place for all your notes, one place for all your tasks, and one place for all your reference material. they don't have to be perfect. they just have to be consistent.",
    ],
  },
  {
    title: "how to build and deploy ai agents safely using human intelligence",
    tag: "ai",
    tagColor: "#22c55e",
    date: "feb 26, 2026",
    readTime: "5 min read",
    excerpt: "the question isn't what can an ai agent do — it's what should it do, and with what oversight? the difference between those two questions is the difference between a tool and a liability.",
    paragraphs: [
      "the rush to automate everything is the wrong instinct. the question isn't 'what can an ai agent do?' — it's 'what should it do, and with what oversight?' the difference between those two questions is the difference between a tool and a liability.",
      "a well-deployed agent needs three things: memory, guardrails, and a human in the loop.",
      "memory is what makes an agent useful over time. without persistent memory — a record of what it knows, what happened, what decisions were made — every session starts from zero. build structured memory: daily logs, a long-term summary file, decision records. context windows disappear. files don't.",
      "guardrails are what keep it safe. define what the agent can and cannot do without explicit approval. drafting is not sending. researching is not acting. every external action — email, post, api call, file deletion — should require a human to confirm it. write these rules in plain language and store them in a file the agent reads every single session.",
      "human intelligence is the final filter. agents are fast and consistent, but they miss nuance, context, and consequence. the goal isn't to replace your judgment — it's to handle the volume so your judgment gets applied to what actually matters.",
      "build lean. give agents one domain of responsibility. review their output before it touches the world. the best ai deployment is invisible to everyone except the person it's serving — and it never acts faster than the human behind it.",
    ],
  },
  {
    title: "the growth method explained and how to build a generous company",
    tag: "faith + business",
    tagColor: "#b5891f",
    date: "feb 26, 2026",
    readTime: "5 min read",
    excerpt: "most business frameworks are about growth. the growth method is about why. there's a difference — and it changes everything about how you build.",
    paragraphs: [
      "most business frameworks are about growth. the growth method is about why.",
      "G.R.O.W.T.H. stands for God-Sized Vision, Revenue vs. Profit, Operational Authority, Wise Counsel, Time Management, and Healthy Habits. six pillars that work together — not as a performance checklist, but as a foundation for building a company worth building. the goal isn't seven figures. the goal is a company that runs on purpose, stays profitable, and gives beyond what's expected.",
      "let's start with the first pillar because it changes everything: God-Sized Vision. a vision that's only as big as what you can accomplish yourself isn't a vision — it's a plan. the companies that do the most good are the ones built around a purpose so large that it requires help beyond human capacity. that's where faith enters the framework.",
      "revenue vs. profit is the second pillar because most founders confuse the two. a company can grow in revenue and shrink in health. profit is oxygen. you cannot be generous with money you don't have, and you cannot sustain a mission on a margin that's always underwater. the growth method teaches founders to build for profitability first — because generosity requires resources.",
      "which brings us to the vision that drives everything we do: what would happen if enough companies decided that generosity wasn't a line item — it was the strategy? not a yearly donation. not 10% of net profit as an afterthought. but a structural commitment to give back at a scale that changes things.",
      "our goal is to work alongside enough generous companies to return over a billion dollars to the kingdom. schools in unreached places. clean water. churches planted. dignified work in communities that need it most. the mechanism is profit. the mission is eternity. you don't have to be a nonprofit to change the world. you just have to build something worth building — and decide early what it's for.",
    ],
  },
];

function BlogPost({ post, index }: { post: Post; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
    >
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "12px",
          transition: "border-color 0.15s",
        }}
      >
        {/* Clickable header */}
        <button
          onClick={() => setOpen((p) => !p)}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "20px 22px",
            background: "var(--bg-surface)",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            transition: "background 0.1s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-surface-hover)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-surface)")}
        >
          {/* Tag + meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "9px",
              color: "#fff",
              background: post.tagColor,
              borderRadius: "4px",
              padding: "3px 8px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              flexShrink: 0,
            }}>
              {post.tag}
            </span>
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>
              {post.readTime}
            </span>
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>
              · {post.date}
            </span>
            <span style={{
              marginLeft: "auto",
              fontFamily: "var(--font-geist-mono)",
              fontSize: "10px",
              color: "var(--text-faint)",
              transition: "transform 0.2s",
              display: "inline-block",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
            }}>▶</span>
          </div>

          {/* Title */}
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", lineHeight: 1.45, margin: 0 }}>
            {post.title}
          </h3>

          {/* Excerpt */}
          {!open && (
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>
              {post.excerpt}
            </p>
          )}
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ padding: "20px 22px 28px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "16px" }}>
                {post.paragraphs.map((p, i) => (
                  <p key={i} style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.85, margin: 0 }}>
                    {p}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LifeMd({ isActive }: SectionProps) {
  const [hackDone, setHackDone] = useState(false);
  const revealTriggered = useReveal(isActive, 50);

  useEffect(() => {
    if (isActive) setHackDone(false);
  }, [isActive]);

  return (
    <section id="life" className="site-section" style={{ minHeight: "100vh", borderBottom: "1px solid var(--border)" }}>
      {revealTriggered && !hackDone && <HackAnimation onDone={() => setHackDone(true)} />}

      {hackDone && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
          className="section-pad" style={{ padding: "64px 56px" }}>
          <div style={{ maxWidth: "720px" }}>

            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", marginBottom: "32px" }}>
              life.md
            </p>

            <h2 style={{ fontSize: "28px", fontWeight: 600, color: "var(--text)", marginBottom: "10px", letterSpacing: "-0.02em" }}>
              life outside the desk
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "40px" }}>
              what&apos;s actually going on. follow along →{" "}
              <a href="https://instagram.com/paytoncwallace" target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--text)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                @paytoncwallace
              </a>
            </p>

            {/* Instagram feed */}
            <div style={{ marginBottom: "56px" }}>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", marginBottom: "20px" }}>
                // instagram — recent posts
              </p>
              <div dangerouslySetInnerHTML={{ __html: `<behold-widget feed-id="${BEHOLD_WIDGET_ID}"></behold-widget>` }} />
              <Script src="https://w.behold.so/widget.js" type="module" strategy="afterInteractive" />
            </div>

            {/* Field notes */}
            <div>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", marginBottom: "20px" }}>
                // field notes — writing
              </p>
              {POSTS.map((post, i) => (
                <BlogPost key={post.title} post={post} index={i} />
              ))}
            </div>

          </div>
        </motion.div>
      )}
    </section>
  );
}
