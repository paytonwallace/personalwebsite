"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import type { SectionProps } from "@/app/page";
import TerminalWindow from "./TerminalWindow";
import { TOOLS_TEMPLATES, TOOLS_TECH, TOOLS_BOOKS } from "@/content";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
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

// ── Coming Soon Modal ─────────────────────────────────────────────────────────
function ComingSoonModal({ templateName, onClose }: { templateName: string; onClose: () => void }) {
  const [step, setStep] = useState<"prompt" | "name" | "email" | "done">("prompt");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, [step]);

  const advance = () => {
    if (step === "prompt") { setStep("name"); setInput(""); return; }
    if (step === "name") { setName(input); setStep("email"); setInput(""); return; }
    if (step === "email" && input.trim()) {
      setEmail(input);
      setSubmitting(true);
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: input, message: `Template waitlist signup for: ${templateName}` }),
      }).finally(() => { setSubmitting(false); setStep("done"); });
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); advance(); }
    if (e.key === "Escape") onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
        style={{ width: "100%", maxWidth: "480px", border: "1px solid var(--border)", borderRadius: "10px", background: "var(--bg)", overflow: "hidden" }}>
        {/* Title bar */}
        <div style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", padding: "10px 14px", display: "flex", alignItems: "center", gap: "6px" }}>
          <button onClick={onClose} style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", border: "none", cursor: "pointer", flexShrink: 0 }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", flex: 1, textAlign: "center" }}>{templateName}</span>
        </div>
        {/* Body */}
        <div style={{ padding: "20px 24px", fontFamily: "var(--font-geist-mono)", fontSize: "12px" }}>
          <p style={{ color: "var(--text-faint)", marginBottom: "6px" }}>{`> accessing template...`}</p>
          <p style={{ color: "#f59e0b", marginBottom: "16px" }}>{`> status: coming_soon`}</p>

          {step === "prompt" && (
            <>
              <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>{`> this template is in development. drop your info and i'll notify you when it's ready.`}</p>
              <button onClick={advance} style={{ padding: "8px 20px", background: "var(--text)", color: "var(--bg)", border: "none", borderRadius: "6px", fontFamily: "var(--font-geist-mono)", fontSize: "11px", cursor: "pointer" }}>
                get notified →
              </button>
            </>
          )}

          {step === "name" && (
            <>
              <p style={{ color: "var(--text-muted)", marginBottom: "8px" }}>{`> what's your first name?`}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "var(--text)" }}>›</span>
                <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
                  placeholder="enter to continue" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "var(--text)" }} />
              </div>
            </>
          )}

          {step === "email" && (
            <>
              <p style={{ color: "var(--text-faint)", marginBottom: "4px" }}>{`> first_name: ${name}`}</p>
              <p style={{ color: "var(--text-muted)", marginBottom: "8px" }}>{`> email address?`}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "var(--text)" }}>›</span>
                <input ref={inputRef} type="email" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
                  placeholder="enter to submit" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "var(--text)" }} />
              </div>
            </>
          )}

          {submitting && <p style={{ color: "var(--text-faint)" }}>{`> sending...`}</p>}

          {step === "done" && (
            <>
              <p style={{ color: "#22c55e", marginBottom: "4px" }}>✓ you&apos;re on the list.</p>
              <p style={{ color: "var(--text-faint)" }}>{`> i'll reach out when ${templateName} drops.`}</p>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Template hero card ────────────────────────────────────────────────────────
const TEMPLATE_ACCENTS = ["#3b5bdb", "#b5891f", "#1a7f4b", "#7c3aed", "#0e7490", "#b91c1c"];
const TEMPLATE_ICONS   = ["⬡", "◈", "⟁", "◎", "⬢", "◇"];

type TemplateItem = typeof TOOLS_TEMPLATES[number];

function TemplateCard({ item, index, onOpen }: { item: TemplateItem; index: number; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);
  const accent = TEMPLATE_ACCENTS[index % TEMPLATE_ACCENTS.length];
  const icon   = TEMPLATE_ICONS[index % TEMPLATE_ICONS.length];

  return (
    <div onClick={onOpen} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", background: "var(--bg-surface)", height: "100%", display: "flex", flexDirection: "column",
        transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 12px 32px rgba(0,0,0,0.35)` : "none",
        borderColor: hovered ? accent : "var(--border)",
      }}>
      <div style={{ height: "6px", background: accent, flexShrink: 0 }} />
      <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
          <span style={{ fontSize: "22px", lineHeight: 1, color: accent }}>{icon}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", marginBottom: "6px" }}>{item.name}</p>
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: "#f59e0b", border: "1px solid #f59e0b44", borderRadius: "4px", padding: "2px 6px", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
              coming soon
            </span>
          </div>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.75, flex: 1, marginBottom: "20px" }}>{item.desc}</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "9px 18px", background: hovered ? accent : "transparent", border: `1px solid ${hovered ? accent : "var(--border)"}`, borderRadius: "6px", fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: hovered ? "#fff" : "var(--text-faint)", transition: "all 0.15s", alignSelf: "flex-start" }}>
          get template →
        </div>
      </div>
    </div>
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
  { text: "found: templates    [6]",   delay: 900,  color: "#22c55e" },
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
  const [scanDone, setScanDone] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const revealTriggered = useReveal(isActive, 50);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isActive) setScanDone(false);
  }, [isActive]);

  return (
    <section id="tools" className="site-section section-pad" style={{ minHeight: "100vh", padding: scanDone ? (isMobile ? "40px 20px" : "64px 56px") : "0", borderBottom: "1px solid var(--border)" }}>
      <AnimatePresence>
        {activeModal && (
          <ComingSoonModal templateName={activeModal} onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>

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
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "16px", alignItems: "stretch" }}>
              {TOOLS_TEMPLATES.map((t, i) => (
                <TemplateCard key={t.name} item={t} index={i} onOpen={() => setActiveModal(t.name)} />
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
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: "12px" }}>
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
