"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const lines = [
  { text: "mr.wallace.blog [v1.0]", delay: 0, color: "#666" },
  { text: "> booting /mrwallace...", delay: 400 },
  { text: "> loading thoughts...", delay: 800 },
  { text: "> indexing posts...", delay: 1200, color: "#aaa" },
  { text: "> status: ready", delay: 1600, color: "#22c55e" },
];

const CHAR_SPEED = 18;

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
          fontSize: "13px",
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

export default function BlogLoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const [lastLineDone, setLastLineDone] = useState(false);

  useEffect(() => {
    if (!lastLineDone) return;
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 400);
    }, 600);
    return () => clearTimeout(t);
  }, [lastLineDone, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="blog-loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
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
        >
          <div style={{ width: "100%", maxWidth: "480px" }}>
            <div
              style={{
                border: "1px solid #222",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 0 80px rgba(255,255,255,0.03)",
              }}
            >
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
                  mr.wallace — blog
                </span>
              </div>

              <div
                style={{
                  background: "#000",
                  padding: "24px 24px 28px",
                  minHeight: "160px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
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
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
