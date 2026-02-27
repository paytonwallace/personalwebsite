"use client";

import { motion } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import type { SectionProps } from "@/app/page";
import TerminalWindow from "./TerminalWindow";

const s = (i: number) => ({ duration: 0.45, delay: 0.05 + i * 0.11, ease: "easeOut" as const });

const templates = [
  {
    name: "ceo-operating-system.notion",
    desc: "Complete Notion workspace for the faith-driven CEO — weekly planning, client tracking, goals, decisions.",
    size: "4.2 KB",
    status: "free",
    tag: "productivity",
    link: "#",
  },
  {
    name: "growth-framework.notion",
    desc: "Guided template built around the six pillars — God-Sized Vision through Healthy Habits.",
    size: "2.8 KB",
    status: "free",
    tag: "strategy",
    link: "#",
  },
  {
    name: "client-relationship-vault.notion",
    desc: "Track every client touchpoint, meeting note, and action item. Nothing falls through the cracks.",
    size: "6.1 KB",
    status: "premium",
    tag: "client ops",
    link: "#",
  },
];

export default function Templates({ isActive }: SectionProps) {
  const revealed = useReveal(isActive, 50);

  return (
    <section id="templates" style={{ minHeight: "100vh", padding: "64px 56px", borderBottom: "1px solid var(--border)" }}>
      {revealed && (
        <div style={{ maxWidth: "680px" }}>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={s(0)}
            style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "var(--text-faint)", marginBottom: "32px", display: "flex", gap: "10px", alignItems: "center" }}
          >
            <span style={{ color: "var(--text-muted)" }}>$</span>
            <span>ls -la ~/templates</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={s(1)}>
            <TerminalWindow title="~/templates — notion systems">
              <div>
                {/* Directory header */}
                <div style={{ display: "flex", gap: "16px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", width: "80px" }}>permissions</span>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", width: "60px" }}>size</span>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", flex: 1 }}>name</span>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", width: "60px" }}>type</span>
                </div>

                {/* Files */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {templates.map((t, i) => (
                    <motion.a
                      key={t.name}
                      href={t.link}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={s(2 + i)}
                      style={{ textDecoration: "none", display: "block" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          alignItems: "flex-start",
                          padding: "12px 10px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-surface-hover)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                      >
                        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", width: "80px", paddingTop: "1px", letterSpacing: "0.02em" }}>
                          {t.status === "free" ? "-rw-r--r--" : "-rw-------"}
                        </span>
                        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-muted)", width: "60px", paddingTop: "1px" }}>{t.size}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "var(--text)", marginBottom: "5px" }}>{t.name}</p>
                          <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>{t.desc}</p>
                        </div>
                        <span style={{
                          fontFamily: "var(--font-geist-mono)", fontSize: "10px",
                          color: t.status === "free" ? "#22c55e" : "#f59e0b",
                          width: "60px", textAlign: "right", paddingTop: "1px"
                        }}>
                          {t.status}
                        </span>
                      </div>
                    </motion.a>
                  ))}
                </div>

                <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>
                    {templates.length} files &nbsp;|&nbsp; I only share what I actually run my business on.
                  </p>
                </div>
              </div>
            </TerminalWindow>
          </motion.div>
        </div>
      )}
    </section>
  );
}
