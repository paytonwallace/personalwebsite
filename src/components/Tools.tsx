"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import type { SectionProps } from "@/app/page";
import TerminalWindow from "./TerminalWindow";
import { TOOLS_TEMPLATES, TOOLS_TECH, TOOLS_BOOKS } from "@/content";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useIsMobile";

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

// ── Tech card ─────────────────────────────────────────────────────────────────
type TechItem = typeof TOOLS_TECH[number];

function TechCard({ item }: { item: TechItem }) {
  const [hovered, setHovered] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{
        border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", background: "var(--bg-surface)",
        transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.3)" : "none",
        borderColor: hovered ? "var(--border-hover)" : "var(--border)", cursor: "pointer",
      }}>
        <div style={{ height: "64px", background: item.color, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />
          {!logoError ? (
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", overflow: "hidden", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.logo} alt={item.name} width={24} height={24} style={{ objectFit: "contain" }} onError={() => setLogoError(true)} />
            </div>
          ) : (
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "15px", fontWeight: 700, color: "rgba(255,255,255,0.9)", zIndex: 1 }}>{item.name[0]}</span>
          )}
        </div>
        <div style={{ padding: "10px 12px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)" }}>{item.name}</p>
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "8px", color: "var(--text-faint)", border: "1px solid var(--border)", borderRadius: "3px", padding: "1px 5px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{item.category}</span>
          </div>
          <p style={{ fontSize: "10px", color: "var(--text-muted)", lineHeight: 1.6 }}>{item.desc}</p>
        </div>
      </div>
    </a>
  );
}

// ── Folder section (collapsible) ─────────────────────────────────────────────
function FolderSection({ name, count, defaultOpen = false, children }: { name: string; count: number; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: "4px" }}>
      <button onClick={() => setOpen(!open)} style={{
        background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center",
        gap: "8px", padding: "6px 0", width: "100%", textAlign: "left",
      }}>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", width: "10px", flexShrink: 0 }}>{open ? "▾" : "▸"}</span>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-muted)" }}>/{name}</span>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>({count})</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            style={{ paddingLeft: "18px", overflow: "hidden" }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Template highlight card (main page) ──────────────────────────────────────
const TEMPLATE_ACCENTS = ["#3b5bdb", "#b5891f", "#1a7f4b", "#7c3aed", "#0e7490", "#b91c1c"];

type TemplateItem = typeof TOOLS_TEMPLATES[number];

function TemplateCard({ item, index, onSelect }: { item: TemplateItem; index: number; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  const accent = TEMPLATE_ACCENTS[index % TEMPLATE_ACCENTS.length];

  return (
    <div onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden",
        background: "var(--bg-surface)", display: "flex", flexDirection: "column",
        transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 12px 32px rgba(0,0,0,0.35)` : "none",
        borderColor: hovered ? accent : "var(--border)",
      }}>
      <div style={{ height: "4px", background: accent, flexShrink: 0 }} />
      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "10px" }}>
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: accent, border: `1px solid ${accent}44`, borderRadius: "4px", padding: "2px 6px", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
            {item.tag}
          </span>
        </div>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "8px", letterSpacing: "-0.01em" }}>{item.name}</p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.7, flex: 1, marginBottom: "16px" }}>{item.desc}</p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-geist-mono)",
          fontSize: "11px", color: hovered ? accent : "var(--text-faint)", transition: "color 0.15s",
        }}>
          {item.purchaseLink ? "get template →" : "view template →"}
        </div>
      </div>
    </div>
  );
}

// ── Template detail page ──────────────────────────────────────────────────────
function TemplateDetail({ item, index, onBack, isMobile }: { item: TemplateItem; index: number; onBack: () => void; isMobile: boolean }) {
  const accent = TEMPLATE_ACCENTS[index % TEMPLATE_ACCENTS.length];
  const [notifyStep, setNotifyStep] = useState<"idle" | "name" | "email" | "done">("idle");
  const [name, setName] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (notifyStep === "name" || notifyStep === "email") inputRef.current?.focus();
  }, [notifyStep]);

  const advanceNotify = () => {
    if (notifyStep === "idle") { setNotifyStep("name"); setInputVal(""); return; }
    if (notifyStep === "name" && inputVal.trim()) { setName(inputVal); setNotifyStep("email"); setInputVal(""); return; }
    if (notifyStep === "email" && inputVal.trim()) {
      setSubmitting(true);
      fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: inputVal, message: `Template waitlist: ${item.name}` }),
      }).finally(() => { setSubmitting(false); setNotifyStep("done"); });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Back button */}
      <button onClick={onBack} style={{
        background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
        fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", marginBottom: "32px", padding: 0,
      }}>
        ← tools.md
      </button>

      {/* Two-column layout */}
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "32px" : "56px", alignItems: "flex-start" }}>

        {/* LEFT — image area */}
        <div style={{ flexShrink: 0, width: isMobile ? "100%" : "400px" }}>
          {item.images.length > 0 ? (
            <div style={{ border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", background: "var(--bg-surface)" }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "4/3" }}>
                <Image src={item.images[0]} alt={item.name} fill style={{ objectFit: "cover" }} />
              </div>
            </div>
          ) : (
            <div style={{
              border: "1px solid var(--border)", borderRadius: "10px", background: "var(--bg-surface)",
              aspectRatio: "4/3", display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: "12px", overflow: "hidden", position: "relative",
            }}>
              {/* Accent top bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: accent }} />
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "32px", color: accent, opacity: 0.4 }}>◈</span>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", textAlign: "center" }}>
                {item.filename}
              </p>
              <p style={{ fontSize: "11px", color: "var(--text-faint)", opacity: 0.6 }}>screenshots coming soon</p>
            </div>
          )}
        </div>

        {/* RIGHT — info + purchase */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Tag */}
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: accent, border: `1px solid ${accent}44`, borderRadius: "4px", padding: "2px 8px", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
            {item.tag}
          </span>

          {/* Name */}
          <h1 style={{ fontSize: isMobile ? "26px" : "32px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginTop: "12px", marginBottom: "12px" }}>
            {item.name}
          </h1>

          {/* Description */}
          <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: "28px" }}>
            {item.desc}
          </p>

          {/* Features */}
          <div style={{ marginBottom: "32px" }}>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", marginBottom: "12px", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
              what&apos;s inside
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {item.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: accent, flexShrink: 0, marginTop: "2px", fontSize: "12px" }}>→</span>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>{f}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase / Coming Soon CTA */}
          {item.purchaseLink ? (
            <a href={item.purchaseLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 28px",
                background: accent, borderRadius: "8px", fontWeight: 600, fontSize: "14px", color: "#fff",
                cursor: "pointer", transition: "opacity 0.15s",
              }}>
                get template →
              </div>
            </a>
          ) : (
            <div style={{ border: "1px solid var(--border)", borderRadius: "10px", background: "var(--bg-surface)", overflow: "hidden" }}>
              {/* Terminal header */}
              <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg)", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", marginLeft: "8px" }}>{item.filename}</span>
              </div>
              <div style={{ padding: "16px 20px", fontFamily: "var(--font-geist-mono)", fontSize: "12px" }}>
                <p style={{ color: "#f59e0b", marginBottom: "4px" }}>{`> status: coming_soon`}</p>

                {notifyStep === "idle" && (
                  <>
                    <p style={{ color: "var(--text-muted)", marginBottom: "14px" }}>{`> this template is in development. drop your info and i'll notify you when it drops.`}</p>
                    <button onClick={() => setNotifyStep("name")} style={{
                      padding: "8px 20px", background: "var(--text)", color: "var(--bg)", border: "none",
                      borderRadius: "6px", fontFamily: "var(--font-geist-mono)", fontSize: "11px", cursor: "pointer",
                    }}>
                      notify me →
                    </button>
                  </>
                )}

                {notifyStep === "name" && (
                  <>
                    <p style={{ color: "var(--text-muted)", marginBottom: "8px" }}>{`> what's your first name?`}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ color: "var(--text)" }}>›</span>
                      <input ref={inputRef} value={inputVal} onChange={(e) => setInputVal(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") advanceNotify(); if (e.key === "Escape") setNotifyStep("idle"); }}
                        placeholder="enter to continue" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "var(--text)" }} />
                    </div>
                  </>
                )}

                {notifyStep === "email" && (
                  <>
                    <p style={{ color: "var(--text-faint)", marginBottom: "4px" }}>{`> name: ${name}`}</p>
                    <p style={{ color: "var(--text-muted)", marginBottom: "8px" }}>{`> email address?`}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ color: "var(--text)" }}>›</span>
                      <input ref={inputRef} type="email" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") advanceNotify(); if (e.key === "Escape") setNotifyStep("idle"); }}
                        placeholder="enter to submit" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "var(--text)" }} />
                    </div>
                  </>
                )}

                {submitting && <p style={{ color: "var(--text-faint)" }}>{`> sending...`}</p>}

                {notifyStep === "done" && (
                  <>
                    <p style={{ color: "#22c55e", marginBottom: "4px" }}>{`> you're on the list.`}</p>
                    <p style={{ color: "var(--text-faint)" }}>{`> i'll reach out when ${item.name} drops.`}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Tools scan animation ──────────────────────────────────────────────────────
const SCAN_LINES = [
  { text: "initializing tools.sh...", delay: 0,    color: "var(--text-faint)" },
  { text: "scanning categories...",   delay: 400,  color: "var(--text-faint)" },
  { text: `found: tech-stack  [${TOOLS_TECH.length}]`,   delay: 900,  color: "#22c55e" },
  { text: `found: books        [${TOOLS_BOOKS.length}]`,  delay: 1300, color: "#22c55e" },
  { text: `found: templates    [${TOOLS_TEMPLATES.length}]`, delay: 1700, color: "#22c55e" },
  { text: "loading tools...",         delay: 2100, color: "var(--text-faint)" },
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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <TerminalWindow title="tools.sh — initializing">
        <div style={{ minWidth: "280px", maxWidth: "100%" }}>
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
  const [scanDone, setScanDone]         = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const revealTriggered                 = useReveal(isActive, 50);
  const isMobile                        = useIsMobile();

  useEffect(() => {
    if (isActive) { setScanDone(false); setActiveTemplate(null); }
  }, [isActive]);

  const pad = isMobile ? "40px 20px" : "64px 56px";

  const selectedItem   = TOOLS_TEMPLATES.find((t) => t.id === activeTemplate) ?? null;
  const selectedIndex  = TOOLS_TEMPLATES.findIndex((t) => t.id === activeTemplate);

  return (
    <section id="tools" className="site-section section-pad"
      style={{ minHeight: "100vh", padding: scanDone ? pad : "0", borderBottom: "1px solid var(--border)" }}>

      {revealTriggered && !scanDone && <ToolsLoadAnimation onDone={() => setScanDone(true)} />}

      {scanDone && (
        <AnimatePresence mode="wait">

          {/* ── TEMPLATE DETAIL PAGE ── */}
          {selectedItem && (
            <motion.div key={`detail-${selectedItem.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ maxWidth: "860px" }}>
              <TemplateDetail item={selectedItem} index={selectedIndex} onBack={() => setActiveTemplate(null)} isMobile={isMobile} />
            </motion.div>
          )}

          {/* ── MAIN TOOLS PAGE ── */}
          {!selectedItem && (
            <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ maxWidth: "860px" }}>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={s(0)}
                style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", marginBottom: "32px" }}>
                tools.md
              </motion.p>

              {/* ── TECH STACK ── */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={s(1)} style={{ marginBottom: "48px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
                  <div>
                    <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "6px" }}>tech stack</h2>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>tools I run on every day</p>
                  </div>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>{TOOLS_TECH.length} tools</span>
                </div>
                <FileBlock path="~/tech-stack">
                  {(["ai", "dev", "productivity", "crm", "comms", "meetings", "automation"] as const).map((cat) => {
                    const items = TOOLS_TECH.filter((t) => t.category === cat);
                    if (!items.length) return null;
                    return (
                      <FolderSection key={cat} name={cat} count={items.length}>
                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
                          {items.map((item) => <TechCard key={item.name} item={item} />)}
                        </div>
                      </FolderSection>
                    );
                  })}
                </FileBlock>
              </motion.div>

              {/* ── LIBRARY ── */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={s(2)} style={{ marginBottom: "48px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
                  <div>
                    <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "6px" }}>library</h2>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>what I recommend to every founder I work with</p>
                  </div>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>{TOOLS_BOOKS.length} books</span>
                </div>
                <FileBlock path="~/books.md">
                  {(["business", "leadership", "faith", "personal growth"] as const).map((cat) => {
                    const books = TOOLS_BOOKS.filter((b) => b.category === cat);
                    if (!books.length) return null;
                    return (
                      <FolderSection key={cat} name={cat} count={books.length}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1px", paddingTop: "4px", paddingBottom: "8px" }}>
                          {books.map((b) => (
                            <a key={b.title} href={b.link} target="_blank" rel="noopener noreferrer"
                              style={{ display: "flex", gap: "10px", textDecoration: "none", padding: "10px 8px", borderRadius: "6px", transition: "background 0.1s", alignItems: "flex-start" }}
                              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-surface-hover)")}
                              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: "var(--text-faint)", flexShrink: 0, marginTop: "2px" }}>📖</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "2px" }}>
                                  <p style={{ fontSize: "12px", color: "var(--text)", fontWeight: 500 }}>{b.title}</p>
                                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "8px", color: "var(--text-faint)", border: "1px solid var(--border)", borderRadius: "3px", padding: "1px 5px", textTransform: "uppercase" as const, letterSpacing: "0.05em", flexShrink: 0 }}>{b.category}</span>
                                </div>
                                <p style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "5px" }}>{b.author}</p>
                                {"desc" in b && b.desc && (
                                  <p style={{ fontSize: "10px", color: "var(--text-faint)", lineHeight: 1.65 }}>{b.desc}</p>
                                )}
                              </div>
                              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: "var(--text-faint)", flexShrink: 0, marginTop: "2px" }}>↗</span>
                            </a>
                          ))}
                        </div>
                      </FolderSection>
                    );
                  })}
                </FileBlock>
              </motion.div>

              {/* ── NOTION TEMPLATES ── */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={s(3)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
                  <div>
                    <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "6px" }}>notion templates</h2>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>systems I actually use — built for founders scaling with intention</p>
                  </div>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>{TOOLS_TEMPLATES.length} templates</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "16px" }}>
                  {TOOLS_TEMPLATES.map((t, i) => (
                    <TemplateCard key={t.id} item={t} index={i} onSelect={() => setActiveTemplate(t.id)} />
                  ))}
                </div>
              </motion.div>

            </motion.div>
          )}

        </AnimatePresence>
      )}
    </section>
  );
}
