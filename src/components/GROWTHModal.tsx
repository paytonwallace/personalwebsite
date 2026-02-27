"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const LETTERS = [
  { letter: "G", def: "God-Sized Vision",        color: "#f0f0f0" },
  { letter: "R", def: "Revenue vs. Profit",       color: "#f0f0f0" },
  { letter: "O", def: "Operational Authority",    color: "#f0f0f0" },
  { letter: "W", def: "Wise Counsel",             color: "#f0f0f0" },
  { letter: "T", def: "Time Management",          color: "#f0f0f0" },
  { letter: "H", def: "Healthy Habits",           color: "#f0f0f0" },
];

const DELAY_PER_LETTER = 620; // ms between each letter reveal

export default function GROWTHModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    if (!open) { setVisibleCount(0); setShowCTA(false); return; }

    setVisibleCount(0);
    setShowCTA(false);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleCount(count);
      if (count >= LETTERS.length) {
        clearInterval(interval);
        setTimeout(() => setShowCTA(true), 600);
      }
    }, DELAY_PER_LETTER);

    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="growth-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          style={{
            position: "fixed", inset: 0,
            background: "#000",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            cursor: "pointer",
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "540px", width: "100%" }}>

            {/* G.R.O.W.T.H. spelled out */}
            <div style={{ marginBottom: "48px" }}>
              {/* Big letter row — builds up */}
              <div style={{ display: "flex", gap: "6px", alignItems: "baseline", marginBottom: "40px", flexWrap: "wrap" }}>
                {LETTERS.map((item, i) => (
                  <AnimatePresence key={item.letter}>
                    {i < visibleCount && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.4, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        style={{ display: "flex", alignItems: "baseline", gap: "0px" }}
                      >
                        <span style={{
                          fontFamily: "var(--font-geist-mono)",
                          fontSize: "clamp(48px, 10vw, 80px)",
                          fontWeight: 700,
                          color: "#fff",
                          lineHeight: 1,
                          letterSpacing: "-0.02em",
                        }}>
                          {item.letter}
                        </span>
                        {i < LETTERS.length - 1 && (
                          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "clamp(24px, 5vw, 40px)", color: "#333", fontWeight: 300 }}>.</span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>

              {/* Definition rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {LETTERS.map((item, i) => (
                  <AnimatePresence key={`def-${item.letter}`}>
                    {i < visibleCount && (
                      <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        style={{ display: "flex", gap: "16px", alignItems: "center" }}
                      >
                        <span style={{
                          fontFamily: "var(--font-geist-mono)",
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#fff",
                          width: "22px",
                          flexShrink: 0,
                        }}>
                          {item.letter}
                        </span>
                        <span style={{
                          fontFamily: "var(--font-geist-mono)",
                          fontSize: "11px",
                          color: "#555",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          marginRight: "8px",
                          width: "16px",
                          flexShrink: 0,
                        }}>
                          —
                        </span>
                        <span style={{ fontSize: "14px", color: "#aaa" }}>{item.def}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>

            {/* CTA section */}
            <AnimatePresence>
              {showCTA && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ borderTop: "1px solid #1a1a1a", paddingTop: "32px" }}
                >
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "#444", marginBottom: "12px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    // powered by fueled by fire
                  </p>
                  <p style={{ fontSize: "15px", color: "#888", lineHeight: 1.75, marginBottom: "24px" }}>
                    The ALL IN Challenge is where the G.R.O.W.T.H. framework comes alive — 3 days to
                    build a profitable, faith-forward business with your life intact.
                  </p>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                    <a
                      href="https://fbfchallenge.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: "11px 28px",
                        background: "#fff",
                        color: "#000",
                        fontSize: "13px",
                        fontWeight: 600,
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontFamily: "var(--font-geist-mono)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      fbfchallenge.com →
                    </a>
                    <button
                      onClick={onClose}
                      style={{ background: "none", border: "none", color: "#444", fontSize: "12px", cursor: "pointer", fontFamily: "var(--font-geist-mono)" }}
                    >
                      [esc] close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
