"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import type { SectionProps } from "@/app/page";
import TerminalWindow from "./TerminalWindow";
import Image from "next/image";
import { useState, useEffect, useRef, KeyboardEvent } from "react";

// B&W Instagram icon
function IGIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

const s = (i: number) => ({ duration: 0.45, delay: 0.05 + i * 0.12, ease: "easeOut" as const });

// ── Terminal form ─────────────────────────────────────────────────────────────
const PROMPTS = [
  { key: "firstName", label: "first_name", question: "what's your first name?" },
  { key: "lastName",  label: "last_name",  question: "and your last name?"      },
  { key: "email",     label: "email",      question: "email address?"            },
  { key: "phone",     label: "phone",      question: "phone number? (optional — press enter to skip)" },
  { key: "message",   label: "message",    question: "what's on your mind?"      },
];

type FormValues = Record<string, string>;

function TerminalForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>({});
  const [current, setCurrent] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const advance = (val: string) => {
    const newVals = { ...values, [PROMPTS[step].key]: val };
    setValues(newVals);
    setCurrent("");

    if (step < PROMPTS.length - 1) {
      setStep((p) => p + 1);
    } else {
      // Submit
      setSending(true);
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${newVals.firstName} ${newVals.lastName}`,
          email: newVals.email,
          message: `Phone: ${newVals.phone || "n/a"}\n\n${newVals.message}`,
        }),
      })
        .then((r) => {
          if (r.ok) { setDone(true); }
          else { setError(true); setSending(false); }
        })
        .catch(() => { setError(true); setSending(false); });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;
    if (step === PROMPTS.length - 1) {
      // message can be multiline — submit on Ctrl+Enter or Enter with value
      if (e.ctrlKey || e.metaKey || current.trim()) {
        e.preventDefault();
        advance(current);
      }
    } else {
      e.preventDefault();
      // phone is optional — allow empty
      if (step === 3 || current.trim()) advance(current);
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px" }}>

      {/* Completed lines */}
      {PROMPTS.slice(0, step).map((p) => (
        <div key={p.key} style={{ marginBottom: "12px" }}>
          <span style={{ color: "var(--text-faint)" }}>{`> ${p.question}`}</span>
          <div style={{ display: "flex", gap: "8px", marginTop: "4px", paddingLeft: "8px" }}>
            <span style={{ color: "var(--text-faint)", width: "100px", flexShrink: 0 }}>{p.label}:</span>
            <span style={{ color: "var(--text)" }}>{values[p.key] || "(skipped)"}</span>
          </div>
        </div>
      ))}

      {/* Sending / done / error */}
      {sending && !done && (
        <div style={{ color: "var(--text-faint)", display: "flex", alignItems: "center", gap: "8px" }}>
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
            ▸
          </motion.span>
          sending...
        </div>
      )}

      {done && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p style={{ color: "#22c55e" }}>✓ message sent.</p>
          <p style={{ color: "var(--text-faint)", marginTop: "6px" }}>&gt; i&apos;ll be in touch. — payton</p>
        </motion.div>
      )}

      {error && (
        <p style={{ color: "#ef4444" }}>
          &gt; something went wrong. try again.
          <button
            onClick={() => { setError(false); setStep(0); setValues({}); setCurrent(""); }}
            style={{ marginLeft: "12px", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", textDecoration: "underline" }}
          >
            restart
          </button>
        </p>
      )}

      {/* Current prompt */}
      {!sending && step < PROMPTS.length && (
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p style={{ color: "var(--text-muted)", marginBottom: "10px" }}>
              {`> ${PROMPTS[step].question}`}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "var(--text)" }}>›</span>
              {step === PROMPTS.length - 1 ? (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  rows={3}
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="type your message... ctrl+enter to send"
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "12px",
                    color: "var(--text)",
                    resize: "none",
                    lineHeight: 1.6,
                  }}
                />
              ) : (
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type={step === 2 ? "email" : "text"}
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="type and press enter..."
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "12px",
                    color: "var(--text)",
                  }}
                />
              )}
              <span className="cursor-blink" style={{ display: "inline-block", width: "6px", height: "13px", background: "var(--text)", verticalAlign: "middle", flexShrink: 0 }} />
            </div>
            <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid var(--border)" }}>
              <p style={{ fontSize: "10px", color: "var(--text-faint)" }}>
                {step < PROMPTS.length - 1 ? `step ${step + 1}/${PROMPTS.length} — press enter to continue` : "ctrl+enter to send"}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function Connect({ isActive }: SectionProps) {
  const revealed = useReveal(isActive, 50);
  const [hasPhoto, setHasPhoto] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/images/payton-bw.jpg";
    img.onload = () => setHasPhoto(true);
  }, []);

  return (
    <section id="connect" className="section-pad" style={{ minHeight: "100vh", padding: "64px 56px", borderBottom: "1px solid var(--border)" }}>
      {revealed && (
        <div style={{ maxWidth: "720px" }}>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={s(0)}
            style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", marginBottom: "32px" }}
          >
            connect.md
          </motion.p>

          {/* Headshot + Instagram row */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={s(1)}
            style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}
          >
            {/* B&W headshot */}
            <div style={{ flexShrink: 0 }}>
              {hasPhoto ? (
                <div style={{ width: "160px", height: "200px", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border)", position: "relative" }}>
                  <Image src="/images/payton-bw.jpg" alt="Payton Wallace" fill style={{ objectFit: "cover", filter: "grayscale(100%)" }} />
                </div>
              ) : (
                <div style={{ width: "160px", height: "200px", border: "1px dashed var(--border)", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span style={{ fontSize: "28px" }}>🖤</span>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: "var(--text-faint)", textAlign: "center", lineHeight: 1.7 }}>
                    // b&w headshot<br />payton-bw.jpg
                  </p>
                </div>
              )}
            </div>

            {/* Instagram card */}
            <div style={{ flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center" }}>
              <TerminalWindow title="instagram" style={{ flex: "none" }}>
                <div>
                  <a
                    href="https://instagram.com/paytoncwallace"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      textDecoration: "none",
                      padding: "14px 16px",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      background: "var(--bg-surface)",
                      transition: "border-color 0.15s, background 0.15s",
                      color: "var(--text)",
                      marginBottom: "10px",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "var(--border-hover)";
                      el.style.background = "var(--bg-surface-hover)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "var(--border)";
                      el.style.background = "var(--bg-surface)";
                    }}
                  >
                    <IGIcon size={22} />
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "2px" }}>@paytoncwallace</p>
                      <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>most active · behind the scenes ↗</p>
                    </div>
                  </a>
                </div>
              </TerminalWindow>
            </div>
          </motion.div>

          {/* Terminal contact form */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={s(2)}>
            <TerminalWindow title="contact.sh — send a message">
              <TerminalForm />
            </TerminalWindow>
          </motion.div>

        </div>
      )}
    </section>
  );
}
