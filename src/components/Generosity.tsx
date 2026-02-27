"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import type { SectionProps } from "@/app/page";
import Image from "next/image";
import { useState, useEffect } from "react";

// ── Digital Globe SVG ─────────────────────────────────────────────────────────
function Globe() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: "160px", height: "160px" }} fill="none">
      {/* Outer glow circle */}
      <motion.circle
        cx="100" cy="100" r="88"
        stroke="#22c55e" strokeWidth="1"
        animate={{ opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Latitude lines */}
      <ellipse cx="100" cy="100" rx="88" ry="20" stroke="#22c55e" strokeWidth="0.7" opacity="0.45" />
      <ellipse cx="100" cy="72"  rx="76" ry="16" stroke="#22c55e" strokeWidth="0.7" opacity="0.35" />
      <ellipse cx="100" cy="128" rx="76" ry="16" stroke="#22c55e" strokeWidth="0.7" opacity="0.35" />
      <ellipse cx="100" cy="50"  rx="52" ry="11" stroke="#22c55e" strokeWidth="0.6" opacity="0.25" />
      <ellipse cx="100" cy="150" rx="52" ry="11" stroke="#22c55e" strokeWidth="0.6" opacity="0.25" />

      {/* Rotating meridian lines */}
      <motion.g
        style={{ transformOrigin: "100px 100px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      >
        <ellipse cx="100" cy="100" rx="22" ry="88" stroke="#22c55e" strokeWidth="0.8" opacity="0.5" />
        <ellipse cx="100" cy="100" rx="52" ry="88" stroke="#22c55e" strokeWidth="0.7" opacity="0.35" />
      </motion.g>

      {/* Vertical axis */}
      <line x1="100" y1="12" x2="100" y2="188" stroke="#22c55e" strokeWidth="0.5" opacity="0.2" />

      {/* Pole dots */}
      <motion.circle cx="100" cy="12" r="3" fill="#22c55e"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.circle cx="100" cy="188" r="3" fill="#22c55e"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />

      {/* Grid cross-hairs */}
      <line x1="12" y1="100" x2="188" y2="100" stroke="#22c55e" strokeWidth="0.4" opacity="0.15" />
    </svg>
  );
}

// ── Globe loading stage ───────────────────────────────────────────────────────
function GlobeAnimation({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1600);
    const t3 = setTimeout(onDone, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const statusLines = [
    "connecting to mission feed...",
    "signal acquired.",
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 56px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <Globe />
        </motion.div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", minHeight: "60px" }}>
          {statusLines.slice(0, step).map((line, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "11px",
                color: i === step - 1 ? "#22c55e" : "var(--text-faint)",
                textAlign: "center",
                letterSpacing: "0.06em",
              }}>
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Isaiah 58:6–12 lines ──────────────────────────────────────────────────────
const ISAIAH_LINES = [
  { text: "Is not this the fast that I choose:", verse: "6" },
  { text: "to loose the bonds of wickedness,", verse: "" },
  { text: "to undo the straps of the yoke,", verse: "" },
  { text: "to let the oppressed go free,", verse: "" },
  { text: "and to break every yoke?", verse: "" },
  { text: "", verse: "" },
  { text: "Is it not to share your bread with the hungry", verse: "7" },
  { text: "and bring the homeless poor into your house;", verse: "" },
  { text: "when you see the naked, to cover him,", verse: "" },
  { text: "and not to hide yourself from your own flesh?", verse: "" },
  { text: "", verse: "" },
  { text: "Then shall your light break forth like the dawn,", verse: "8" },
  { text: "and your healing shall spring up speedily;", verse: "" },
  { text: "your righteousness shall go before you;", verse: "" },
  { text: "the glory of the LORD shall be your rear guard.", verse: "" },
  { text: "", verse: "" },
  { text: "Then you shall call, and the LORD will answer;", verse: "9" },
  { text: "you shall cry, and he will say, 'Here I am.'", verse: "" },
  { text: "", verse: "" },
  { text: "if you pour yourself out for the hungry", verse: "10" },
  { text: "and satisfy the desire of the afflicted,", verse: "" },
  { text: "then shall your light rise in the darkness", verse: "" },
  { text: "and your gloom be as the noonday.", verse: "" },
  { text: "", verse: "" },
  { text: "And the LORD will guide you continually", verse: "11" },
  { text: "and satisfy your desire in scorched places", verse: "" },
  { text: "and make your bones strong;", verse: "" },
  { text: "and you shall be like a watered garden,", verse: "" },
  { text: "like a spring of water, whose waters do not fail.", verse: "" },
  { text: "", verse: "" },
  { text: "And your ancient ruins shall be rebuilt;", verse: "12" },
  { text: "you shall raise up the foundations of many generations;", verse: "" },
  { text: "you shall be called the repairer of the breach,", verse: "" },
  { text: "the restorer of streets to dwell in.", verse: "" },
];

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Generosity({ isActive }: SectionProps) {
  const [globeDone, setGlobeDone] = useState(false);
  const revealTriggered = useReveal(isActive, 50);

  useEffect(() => {
    if (isActive) setGlobeDone(false);
  }, [isActive]);

  return (
    <section id="generosity" className="site-section" style={{ minHeight: "100vh", borderBottom: "1px solid var(--border)" }}>

      {/* Globe loading */}
      <AnimatePresence>
        {revealTriggered && !globeDone && (
          <motion.div key="globe" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <GlobeAnimation onDone={() => setGlobeDone(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {globeDone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          className="section-pad" style={{ padding: "64px 56px" }}>
          <div style={{ maxWidth: "720px" }}>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", marginBottom: "40px" }}>
              generosity.md
            </motion.p>

            {/* Isaiah 58:6-12 — staggered line reveal */}
            <motion.div style={{ marginBottom: "48px" }}>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", marginBottom: "20px" }}>
                // isaiah 58:6–12
              </motion.p>
              <div style={{ borderLeft: "2px solid var(--border)", paddingLeft: "20px" }}>
                {ISAIAH_LINES.map((line, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.055, duration: 0.3 }}
                    style={{ display: "flex", gap: "12px", minHeight: line.text ? "auto" : "12px" }}
                  >
                    <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: "#22c55e", width: "12px", flexShrink: 0, paddingTop: "3px", opacity: line.verse ? 1 : 0 }}>
                      {line.verse}
                    </span>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.85, fontStyle: "italic", margin: 0 }}>
                      {line.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Epiphany Global card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + ISAIAH_LINES.length * 0.055 + 0.2, duration: 0.5 }}
            >
              <div style={{ border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
                {/* Header */}
                <div style={{ padding: "10px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-surface)" }}>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)" }}>~/epiphany-global/</span>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>current project</span>
                </div>

                {/* Full image — no crop */}
                <div style={{ width: "100%", lineHeight: 0 }}>
                  <Image
                    src="/images/generosity.jpg"
                    alt="Epiphany Global — Heaven's Blueprint for Global Impact"
                    width={1200}
                    height={675}
                    style={{ width: "100%", height: "auto", display: "block" }}
                    sizes="720px"
                    priority
                  />
                </div>

                {/* Info + CTA */}
                <div style={{ padding: "28px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text)", marginBottom: "14px", letterSpacing: "-0.01em" }}>
                    Epiphany Global
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "14px" }}>
                    When you build and give to Epiphany Global, you&apos;re not just meeting a need —
                    you&apos;re fulfilling the mandate. Feed the hungry. Clothe the poor. Care for the widows
                    and orphans. Share the hope of Jesus Christ.
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "28px" }}>
                    Our current project: the{" "}
                    <strong style={{ color: "var(--text)" }}>Epiphany Gathering Place in Gulu, Uganda</strong>{" "}
                    — a safe haven where thousands of children will learn, play, dream, and encounter
                    God&apos;s love. Schools. Worship spaces. Sports fields. Skills training. Isaiah 58 in action.
                  </p>
                  <a
                    href="https://donorbox.org/epiphany-global"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "11px 24px",
                      background: "var(--text)",
                      color: "var(--bg)",
                      fontSize: "12px",
                      fontWeight: 500,
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontFamily: "var(--font-geist-mono)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <span style={{ color: "#28c840" }}>■</span>
                    give → epiphany-global
                  </a>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </section>
  );
}
