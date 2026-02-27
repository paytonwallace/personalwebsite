"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import type { SectionProps } from "@/app/page";
import TerminalWindow from "./TerminalWindow";
import { TOOLS_TEMPLATES, TOOLS_TECH, TOOLS_BOOKS } from "@/content";
import { useState, useEffect } from "react";
import Image from "next/image";

const s = (i: number) => ({ duration: 0.45, delay: 0.05 + i * 0.11, ease: "easeOut" as const });

// ── File-viewer container ─────────────────────────────────────────────────────
function FileBlock({ path, meta, children, noPad }: { path: string; meta?: string; children: React.ReactNode; noPad?: boolean }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg-surface)", overflow: "hidden" }}>
      <div style={{ padding: "10px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)" }}>{path}</span>
        {meta && <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>{meta}</span>}
      </div>
      {noPad ? children : <div style={{ padding: "20px 24px" }}>{children}</div>}
    </div>
  );
}

// ── Template hero card ────────────────────────────────────────────────────────
const TEMPLATE_ACCENTS = ["#3b5bdb", "#b5891f", "#1a7f4b"];
const TEMPLATE_ICONS   = ["⬡", "◈", "⟁"];

type TemplateItem = typeof TOOLS_TEMPLATES[number];

function TemplateCard({ item, index }: { item: TemplateItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const accent = TEMPLATE_ACCENTS[index % TEMPLATE_ACCENTS.length];
  const icon   = TEMPLATE_ICONS[index % TEMPLATE_ICONS.length];

  return (
    <a
      href={item.link}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        border: "1px solid var(--border)",
        borderRadius: "10px",
        overflow: "hidden",
        background: "var(--bg-surface)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 12px 32px rgba(0,0,0,0.35)` : "none",
        borderColor: hovered ? accent : "var(--border)",
      }}>
        {/* Accent top */}
        <div style={{
          height: "6px",
          background: accent,
          flexShrink: 0,
        }} />

        <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Icon + filename */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "22px", lineHeight: 1, color: accent }}>{icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", marginBottom: "4px" }}>
                {item.name}
              </p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "9px",
                  color: item.status === "free" ? "#22c55e" : "#f59e0b",
                  border: `1px solid ${item.status === "free" ? "#22c55e44" : "#f59e0b44"}`,
                  borderRadius: "4px",
                  padding: "2px 6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}>
                  {item.status}
                </span>
                <span style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "9px",
                  color: "var(--text-faint)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  padding: "2px 6px",
                }}>
                  {item.size}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.75, flex: 1, marginBottom: "24px" }}>
            {item.desc}
          </p>

          {/* CTA */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 18px",
            background: hovered ? accent : "transparent",
            border: `1px solid ${hovered ? accent : "var(--border)"}`,
            borderRadius: "6px",
            fontFamily: "var(--font-geist-mono)",
            fontSize: "11px",
            color: hovered ? "#fff" : "var(--text-faint)",
            transition: "all 0.15s",
            alignSelf: "flex-start",
          }}>
            get template →
          </div>
        </div>
      </div>
    </a>
  );
}

// ── Notion gallery tech card ──────────────────────────────────────────────────
type TechItem = typeof TOOLS_TECH[number];

function TechCard({ item }: { item: TechItem }) {
  const [hovered, setHovered] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer"
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        border: "1px solid var(--border)",
        borderRadius: "10px",
        overflow: "hidden",
        background: "var(--bg-surface)",
        transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.3)" : "none",
        borderColor: hovered ? "var(--border-hover)" : "var(--border)",
        cursor: "pointer",
      }}>
        <div style={{ height: "72px", background: item.color, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />
          {!logoError ? (
            <div style={{ width: "34px", height: "34px", borderRadius: "8px", overflow: "hidden", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.logo} alt={item.name} width={26} height={26} style={{ objectFit: "contain" }} onError={() => setLogoError(true)} />
            </div>
          ) : (
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "16px", fontWeight: 700, color: "rgba(255,255,255,0.9)", zIndex: 1 }}>{item.name[0]}</span>
          )}
        </div>
        <div style={{ padding: "12px 14px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)" }}>{item.name}</p>
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "8px", color: "var(--text-faint)", border: "1px solid var(--border)", borderRadius: "3px", padding: "1px 5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.category}</span>
          </div>
          <p style={{ fontSize: "10px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "8px" }}>{item.desc}</p>
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "8px", color: "var(--text-faint)", display: "flex", alignItems: "center", gap: "3px" }}>
            <span>{item.url.replace("https://", "")}</span>
            <span style={{ color: hovered ? "var(--text)" : "var(--text-faint)", transition: "color 0.15s" }}>↗</span>
          </p>
        </div>
      </div>
    </a>
  );
}

// ── Tools scan animation ──────────────────────────────────────────────────────
const SCAN_LINES = [
  { text: "initializing tools.sh...", delay: 0,    color: "var(--text-faint)" },
  { text: "scanning categories...",    delay: 400,  color: "var(--text-faint)" },
  { text: "found: templates    [3]",   delay: 900,  color: "#22c55e" },
  { text: "found: tech-stack  [11]",   delay: 1300, color: "#22c55e" },
  { text: "found: books        [6]",   delay: 1700, color: "#22c55e" },
  { text: "loading tools...",          delay: 2100, color: "var(--text-faint)" },
];

function ToolsLoadAnimation({ onDone }: { onDone: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    SCAN_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((p) => [...p, i]);
        if (i === SCAN_LINES.length - 1) setTimeout(() => setShowBar(true), 200);
      }, line.delay);
    });
  }, []);

  useEffect(() => {
    if (!showBar) return;
    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      setProgress(Math.min(p, 100));
      if (p >= 100) { clearInterval(interval); setTimeout(onDone, 300); }
    }, 20);
    return () => clearInterval(interval);
  }, [showBar, onDone]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 56px" }}>
      <TerminalWindow title="tools.sh — initializing">
        <div style={{ minWidth: "320px" }}>
          {SCAN_LINES.map((line, i) => (
            <AnimatePresence key={i}>
              {visibleLines.includes(i) && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: line.color, marginBottom: "6px" }}>
                  {line.text}
                </motion.p>
              )}
            </AnimatePresence>
          ))}
          {showBar && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: "16px" }}>
              <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                <motion.div style={{ height: "100%", background: "var(--text)", borderRadius: "2px" }} animate={{ width: `${progress}%` }} transition={{ duration: 0 }} />
              </div>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", marginTop: "6px" }}>{progress}%</p>
            </motion.div>
          )}
        </div>
      </TerminalWindow>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Tools({ isActive }: SectionProps) {
  const [scanDone, setScanDone] = useState(false);
  const revealTriggered = useReveal(isActive, 50);

  useEffect(() => {
    if (isActive) setScanDone(false);
  }, [isActive]);

  return (
    <section id="tools" className="site-section" style={{ minHeight: "100vh", padding: scanDone ? "64px 56px" : "0", borderBottom: "1px solid var(--border)" }}>
      {revealTriggered && !scanDone && <ToolsLoadAnimation onDone={() => setScanDone(true)} />}

      {scanDone && (
        <div style={{ maxWidth: "860px" }}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={s(0)}
            style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", marginBottom: "32px" }}>
            tools.md
          </motion.p>

          {/* ── TEMPLATES — hero section ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={s(1)} style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "6px" }}>
                  notion templates
                </h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  systems I actually use — built for founders scaling with intention
                </p>
              </div>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>
                {TOOLS_TEMPLATES.length} templates
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", alignItems: "stretch" }}>
              {TOOLS_TEMPLATES.map((t, i) => (
                <TemplateCard key={t.name} item={t} index={i} />
              ))}
            </div>
          </motion.div>

          {/* ── TECH STACK — gallery ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={s(2)} style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "6px" }}>
                  tech stack
                </h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  tools I run on every day
                </p>
              </div>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>
                {TOOLS_TECH.length} tools
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {TOOLS_TECH.map((item) => <TechCard key={item.name} item={item} />)}
            </div>
          </motion.div>

          {/* ── BOOKS ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={s(3)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "6px" }}>
                  reading list
                </h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  what I recommend to every founder I work with
                </p>
              </div>
            </div>
            <FileBlock path="~/books.md" noPad>
              <div style={{ display: "flex", gap: "0", alignItems: "stretch" }}>

                {/* Reading photo — small, on the left */}
                <div style={{ width: "160px", flexShrink: 0, position: "relative", borderRight: "1px solid var(--border)" }}>
                  <Image
                    src="/images/lifestyle-4.jpg"
                    alt="reading"
                    fill
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </div>

                {/* Book list */}
                <div style={{ flex: 1, padding: "20px 24px" }}>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", marginBottom: "14px" }}>
                    // currently recommending
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    {TOOLS_BOOKS.map((b, i) => (
                      <a key={b.title} href={b.link} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", gap: "12px", textDecoration: "none", padding: "9px 8px", borderRadius: "6px", transition: "background 0.1s", alignItems: "flex-start" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-surface-hover)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                      >
                        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", width: "16px", flexShrink: 0, paddingTop: "2px" }}>{i + 1}.</span>
                        <div>
                          <p style={{ fontSize: "12px", color: "var(--text)", fontWeight: 500, marginBottom: "1px" }}>{b.title}</p>
                          <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{b.author}</p>
                        </div>
                        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", marginLeft: "auto", paddingTop: "2px", flexShrink: 0 }}>↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </FileBlock>
          </motion.div>

        </div>
      )}
    </section>
  );
}
