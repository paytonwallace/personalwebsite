"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import type { SectionProps, Page } from "@/app/page";
import Image from "next/image";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const s = (i: number) => ({ duration: 0.4, delay: 0.04 + i * 0.1, ease: "easeOut" as const });

// ── Cycling status ────────────────────────────────────────────────────────────
const STATUS = [
  "online + building",
  "dallas, tx",
  "reading: the score takes care of itself",
  "framework: G.R.O.W.T.H.",
  "working on: mr. wallace agent",
];

// ── Contact form ──────────────────────────────────────────────────────────────
const PROMPTS = [
  { key: "firstName", label: "first_name", question: "what's your first name?"                        },
  { key: "lastName",  label: "last_name",  question: "and your last name?"                             },
  { key: "email",     label: "email",      question: "email address?"                                  },
  { key: "phone",     label: "phone",      question: "phone? (optional — enter to skip)"               },
  { key: "message",   label: "message",    question: "what's on your mind?"                            },
];
type FV = Record<string, string>;

function ContactForm({ onBack }: { onBack: () => void }) {
  const [step, setStep]       = useState(0);
  const [values, setValues]   = useState<FV>({});
  const [current, setCurrent] = useState("");
  const [done, setDone]       = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, [step]);

  const advance = (val: string) => {
    const nv = { ...values, [PROMPTS[step].key]: val };
    setValues(nv); setCurrent("");
    if (step < PROMPTS.length - 1) { setStep((p) => p + 1); return; }
    setSending(true);
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: `${nv.firstName} ${nv.lastName}`, email: nv.email, message: `Phone: ${nv.phone || "n/a"}\n\n${nv.message}` }),
    })
      .then((r) => { if (r.ok) setDone(true); else { setError(true); setSending(false); } })
      .catch(() => { setError(true); setSending(false); });
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;
    if (step === PROMPTS.length - 1) { if (e.ctrlKey || e.metaKey || current.trim()) { e.preventDefault(); advance(current); } }
    else { e.preventDefault(); if (step === 3 || current.trim()) advance(current); }
  };

  return (
    <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Back */}
      <button onClick={onBack} style={{ background: "none", border: "none", color: "var(--text-faint)", fontSize: "10px", fontFamily: "var(--font-geist-mono)", padding: "0 0 12px 0", textAlign: "left", letterSpacing: "0.04em" }}>
        ← back
      </button>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {PROMPTS.slice(0, step).map((p) => (
          <div key={p.key} style={{ marginBottom: "8px" }}>
            <span style={{ color: "var(--text-faint)" }}>{`> ${p.question}`}</span>
            <div style={{ display: "flex", gap: "6px", marginTop: "2px", paddingLeft: "8px" }}>
              <span style={{ color: "var(--text-faint)", width: "80px", flexShrink: 0 }}>{p.label}:</span>
              <span style={{ color: "var(--text)" }}>{values[p.key] || "(skipped)"}</span>
            </div>
          </div>
        ))}

        {sending && !done && (
          <div style={{ color: "var(--text-faint)", display: "flex", gap: "8px", alignItems: "center" }}>
            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>▸</motion.span>
            sending...
          </div>
        )}
        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p style={{ color: "#22c55e" }}>✓ message sent.</p>
            <p style={{ color: "var(--text-faint)", marginTop: "4px" }}>&gt; i&apos;ll be in touch. — payton</p>
          </motion.div>
        )}
        {error && (
          <p style={{ color: "#ef4444" }}>
            &gt; something went wrong.{" "}
            <button onClick={() => { setError(false); setStep(0); setValues({}); setCurrent(""); }}
              style={{ background: "none", border: "none", color: "var(--text-muted)", fontFamily: "inherit", fontSize: "inherit", textDecoration: "underline" }}>
              restart
            </button>
          </p>
        )}

        {!sending && step < PROMPTS.length && (
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <p style={{ color: "var(--text-muted)", marginBottom: "6px" }}>{`> ${PROMPTS[step].question}`}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "var(--text)" }}>›</span>
                {step === PROMPTS.length - 1 ? (
                  <textarea ref={inputRef as React.RefObject<HTMLTextAreaElement>} rows={2} value={current}
                    onChange={(e) => setCurrent(e.target.value)} onKeyDown={handleKey}
                    placeholder="ctrl+enter to send"
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text)", resize: "none" }} />
                ) : (
                  <input ref={inputRef as React.RefObject<HTMLInputElement>} type={step === 2 ? "email" : "text"}
                    value={current} onChange={(e) => setCurrent(e.target.value)} onKeyDown={handleKey}
                    placeholder="enter to continue"
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text)" }} />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ── Filesystem nav bar ────────────────────────────────────────────────────────
interface NavItem { name: string; type: "dir" | "file"; page: Page; children?: NavItem[]; }

const FS: NavItem[] = [
  { name: "home",        type: "dir",  page: "home",       children: [
    { name: "bio.md",         type: "file", page: "home"       },
    { name: "contact.form",   type: "file", page: "connect"    },
  ]},
  { name: "about",       type: "dir",  page: "about",      children: [
    { name: "bio.md",         type: "file", page: "about"      },
    { name: "portfolio/",     type: "dir",  page: "about",     children: [
      { name: "fueled-by-fire",  type: "file", page: "about"   },
      { name: "epiphany-global", type: "file", page: "generosity" },
      { name: "epiphany-ranch",  type: "file", page: "about"   },
      { name: "c45-agency",      type: "file", page: "about"   },
    ]},
    { name: "framework.config.ts", type: "file", page: "about" },
  ]},
  { name: "tools",       type: "dir",  page: "tools",      children: [
    { name: "templates/",     type: "dir",  page: "tools"      },
    { name: "tech-stack.json",type: "file", page: "tools"      },
    { name: "books.md",       type: "file", page: "tools"      },
  ]},
  { name: "generosity",  type: "dir",  page: "generosity", children: [
    { name: "isaiah-58.md",   type: "file", page: "generosity" },
    { name: "epiphany-global/",type: "dir", page: "generosity" },
  ]},
  { name: "life",        type: "dir",  page: "life",       children: [
    { name: "instagram/",     type: "dir",  page: "life"       },
    { name: "field-notes/",   type: "dir",  page: "life"       },
  ]},
  { name: "connect",     type: "dir",  page: "connect",    children: [
    { name: "contact.form",   type: "file", page: "connect"    },
  ]},
];

function NavBar({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [stack, setStack]   = useState<NavItem[]>([]);   // folder path stack
  const [items, setItems]   = useState<NavItem[]>(FS);   // current folder contents

  const pathStr = stack.length === 0 ? "~/site" : `~/site/${stack.map((n) => n.name).join("/")}`;

  const enter = (item: NavItem) => {
    if (item.type === "file") { onNavigate(item.page); return; }
    if (item.children) {
      setStack((s) => [...s, item]);
      setItems(item.children!);
    } else {
      onNavigate(item.page);
    }
  };

  const back = () => {
    if (stack.length === 0) return;
    const newStack = stack.slice(0, -1);
    setStack(newStack);
    setItems(newStack.length === 0 ? FS : newStack[newStack.length - 1].children ?? FS);
  };

  return (
    <div className="hero-nav-bar" style={{
      borderTop: "1px solid var(--border)",
      padding: "10px 56px",
      display: "flex",
      alignItems: "center",
      gap: "0",
      flexShrink: 0,
      background: "var(--bg)",
      overflow: "hidden",
    }}>
      {/* Path */}
      <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", flexShrink: 0, marginRight: "6px" }}>
        {pathStr}
      </span>

      {/* Separator */}
      <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "#22c55e", flexShrink: 0, marginRight: "12px" }}>
        &gt;
      </span>

      {/* Back */}
      {stack.length > 0 && (
        <button onClick={back}
          style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", background: "none", border: "none", padding: "0 12px 0 0", letterSpacing: "0.02em" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-faint)")}
        >
          ../
        </button>
      )}

      {/* Items */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "nowrap", overflow: "hidden" }}>
        {items.map((item) => {
          const isDir = item.type === "dir";
          const label = isDir ? `${item.name}/` : item.name;
          return (
            <button key={item.name} onClick={() => enter(item)}
              style={{
                fontFamily:      "var(--font-geist-mono)",
                fontSize:        "10px",
                color:           isDir ? "var(--text)" : "var(--text-muted)",
                background:      "transparent",
                border:          "1px solid transparent",
                borderRadius:    "4px",
                padding:         "3px 8px",
                letterSpacing:   "0.02em",
                whiteSpace:      "nowrap",
                transition:      "color 0.1s, border-color 0.1s, background 0.1s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "var(--text)";
                el.style.borderColor = "var(--border)";
                el.style.background = "var(--bg-surface)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = isDir ? "var(--text)" : "var(--text-muted)";
                el.style.borderColor = "transparent";
                el.style.background = "transparent";
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
export default function Hero({ isActive, onNavigate }: SectionProps) {
  const revealed  = useReveal(isActive, 50);
  const isMobile  = useIsMobile();
  const [lineIdx, setLineIdx]   = useState(0);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/images/payton.jpg";
    img.onload = () => setHasPhoto(true);
  }, []);

  useEffect(() => {
    if (!revealed) return;
    const t = setInterval(() => setLineIdx((p) => (p + 1) % STATUS.length), 3000);
    return () => clearInterval(t);
  }, [revealed]);

  return (
    <section id="home" className="site-section" style={{
      height:          "100vh",
      display:         "flex",
      flexDirection:   "column",
      overflow:        "hidden",
      position:        "relative",
      borderBottom:    "1px solid var(--border)",
    }}>
      {/* Dot grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, var(--text) 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.03, pointerEvents: "none" }} />

      {/* Main area */}
      <div className="hero-main-pad" style={{ flex: 1, padding: "16px 56px 8px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {revealed && (
          <div className="hero-cols" style={{ display: "flex", gap: "56px", alignItems: "center", flex: 1, minHeight: 0 }}>

            {/* LEFT */}
            <div style={{ flex: 1, minWidth: isMobile ? "0" : "280px", display: "flex", flexDirection: "column" }}>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={s(0)}
                style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", marginBottom: "14px" }}>
                home.md
              </motion.p>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={s(1)}
                style={{ fontSize: "clamp(40px, 5.5vw, 72px)", fontWeight: 600, lineHeight: 1.0, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "10px" }}>
                Payton<br />Wallace
              </motion.h1>

              {/* Cycling status — subtle one-liner */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={s(2)} style={{ marginBottom: "14px" }}>
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "#22c55e" }}>▸</span>
                  <AnimatePresence mode="wait">
                    <motion.span key={lineIdx} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.25 }}>
                      {STATUS[lineIdx]}
                    </motion.span>
                  </AnimatePresence>
                </p>
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={s(3)}
                style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.75, maxWidth: "420px", marginBottom: "20px" }}>
                CEO Mentor &amp; Strategic Architect. Helping entrepreneurs &amp; leaders clarify and fulfill their God sized vision.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={s(4)}
                style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button onClick={() => { setShowForm(true); }}
                  style={{ padding: "10px 24px", background: "var(--text)", color: "var(--bg)", fontSize: "13px", fontWeight: 500, borderRadius: "8px", border: "none", letterSpacing: "0.02em" }}>
                  Work With Me
                </button>
                <button onClick={() => onNavigate?.("tools")}
                  style={{ padding: "10px 24px", background: "transparent", color: "var(--text)", fontSize: "13px", fontWeight: 500, borderRadius: "8px", border: "1px solid var(--border)", letterSpacing: "0.02em" }}>
                  Browse Tools
                </button>
              </motion.div>
            </div>

            {/* RIGHT — image toggles to form */}
            <motion.div className="hero-photo" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
              style={{ flexShrink: 0, width: "260px" }}>

              <AnimatePresence mode="wait">
                {!showForm ? (
                  <motion.div key="photo"
                    initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setShowForm(true)}
                    style={{ position: "relative", cursor: "none" }}
                    title="click to get in touch"
                  >
                    {hasPhoto ? (
                      <div style={{ width: "260px", height: "390px", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border)", position: "relative" }}>
                        <Image src="/images/payton.jpg" alt="Payton Wallace" fill style={{ objectFit: "cover", objectPosition: "center top" }} />
                        {/* Hover hint overlay */}
                        <div className="photo-hover-hint" style={{
                          position: "absolute", inset: 0, borderRadius: "10px",
                          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
                          display: "flex", alignItems: "flex-end", justifyContent: "center",
                          padding: "16px", opacity: 0, transition: "opacity 0.2s",
                        }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0")}
                        >
                          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "#fff", letterSpacing: "0.06em" }}>
                            click to get in touch →
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div style={{ width: "260px", height: "390px", border: "1px dashed var(--border)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>// payton.jpg</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="form"
                    initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    style={{ width: "260px", height: "390px", border: "1px solid var(--border)", borderRadius: "10px", background: "var(--bg-surface)", overflow: "hidden", display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>~/contact</span>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                    </div>
                    <div style={{ padding: "12px 14px", flex: 1, overflow: "hidden" }}>
                      <ContactForm onBack={() => setShowForm(false)} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        )}
      </div>

      {/* Filesystem nav bar — bottom */}
      {revealed && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
          <NavBar onNavigate={(page) => onNavigate?.(page)} />
        </motion.div>
      )}
    </section>
  );
}
