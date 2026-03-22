"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const lines = [
  { text: "mr.wallace.agent [v1.0]", delay: 0, color: "#666" },
  { text: "> booting paytonwallace.com...", delay: 450 },
  { text: "> loading operator profile...", delay: 950 },
  { text: "> name:         Payton Wallace", delay: 1450, color: "#aaa" },
  { text: "> role:         CEO Mentor & Strategic Architect", delay: 1850, color: "#aaa" },
  { text: "> mission:      impact · embrace · inspire", delay: 2250, color: "#aaa" },
  { text: "> focus:        reflecting heaven on earth", delay: 2650, color: "#aaa" },
  { text: "> status:       online", delay: 3050, color: "#22c55e" },
  { text: "// all systems ready.", delay: 3600, color: "#666" },
];

const CHAR_SPEED = 22;

function TypewriterLine({
  text,
  startDelay,
  color = "#d4d4d4",
  onDone,
}: {
  text: string;
  startDelay: number;
  color?: string;
  onDone?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setStarted(true);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          onDone?.();
        }
      }, CHAR_SPEED);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(t);
  }, [text, startDelay, onDone]);

  if (!started) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", minHeight: "20px" }}>
      <span
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "12px",
          color,
          lineHeight: "20px",
        }}
      >
        {displayed}
      </span>
      {displayed.length < text.length && (
        <span
          className="cursor-blink"
          style={{
            display: "inline-block",
            width: "7px",
            height: "14px",
            background: "#fff",
            marginLeft: "1px",
            verticalAlign: "middle",
          }}
        />
      )}
    </div>
  );
}

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const [lastLineDone, setLastLineDone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [exiting, setExiting] = useState(false);

  const lastLineDelay = lines[lines.length - 1].delay;
  const lastLineDuration = lines[lines.length - 1].text.length * CHAR_SPEED;

  // Show press-enter prompt after last line finishes
  useEffect(() => {
    if (!lastLineDone) return;
    const t = setTimeout(() => setShowPrompt(true), 400);
    return () => clearTimeout(t);
  }, [lastLineDone]);

  const handleContinue = useCallback(() => {
    if (!showPrompt || exiting) return;
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 300);
  }, [showPrompt, exiting, onComplete]);

  // Listen for Enter key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleContinue();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleContinue]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
          onClick={handleContinue}
        >
          <div style={{ width: "100%", maxWidth: "520px" }}>
            {/* Terminal window */}
            <div
              style={{
                border: "1px solid #222",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 0 80px rgba(255,255,255,0.03)",
              }}
            >
              {/* Title bar */}
              <div
                style={{
                  background: "#111",
                  borderBottom: "1px solid #222",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "11px",
                    color: "#555",
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  mr.wallace — zsh
                </span>
              </div>

              {/* Terminal body */}
              <div
                style={{
                  background: "#000",
                  padding: "24px 24px 28px",
                  minHeight: "260px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  cursor: showPrompt ? "pointer" : "default",
                }}
              >
                {lines.map((line, i) => (
                  <TypewriterLine
                    key={i}
                    text={line.text}
                    startDelay={line.delay}
                    color={line.color}
                    onDone={i === lines.length - 1 ? () => setLastLineDone(true) : undefined}
                  />
                ))}

                {/* Empty line spacer */}
                {lastLineDone && <div style={{ height: "8px" }} />}

                {/* Press enter prompt */}
                <AnimatePresence>
                  {showPrompt && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-geist-mono)",
                          fontSize: "12px",
                          color: "#555",
                        }}
                      >
                        {exiting ? "> entering..." : "> press [enter] or click to continue"}
                      </span>
                      {!exiting && (
                        <span
                          className="cursor-blink"
                          style={{
                            display: "inline-block",
                            width: "7px",
                            height: "14px",
                            background: "#fff",
                            verticalAlign: "middle",
                          }}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
