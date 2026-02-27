"use client";

import { motion } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import type { SectionProps } from "@/app/page";
import GROWTHModal from "./GROWTHModal";
import { ABOUT, PORTFOLIO } from "@/content";
import Image from "next/image";
import { useState, useEffect } from "react";

const s = (i: number) => ({ duration: 0.45, delay: 0.05 + i * 0.11, ease: "easeOut" as const });

// ── Shared file-viewer container (no Mac chrome) ──────────────────────────────
function FileBlock({
  path,
  meta,
  children,
  noPad,
}: {
  path: string;
  meta?: string;
  children: React.ReactNode;
  noPad?: boolean;
}) {
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

export default function About({ isActive }: SectionProps) {
  const revealed = useReveal(isActive, 50);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [growthOpen, setGrowthOpen] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/images/about.jpg";
    img.onload = () => setHasPhoto(true);
  }, []);

  return (
    <>
      <GROWTHModal open={growthOpen} onClose={() => setGrowthOpen(false)} />

      <section id="about" className="site-section section-pad" style={{ minHeight: "100vh", padding: "64px 56px", borderBottom: "1px solid var(--border)" }}>
        {revealed && (
          <div style={{ maxWidth: "720px" }}>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={s(0)}
              style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", marginBottom: "32px" }}
            >
              about.md
            </motion.p>

            {/* Bio */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={s(1)}>
              <FileBlock path="~/paytoncwallace/about.md" meta="utf-8">
                <div style={{ display: "flex", gap: "36px", flexWrap: "wrap", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, minWidth: "240px" }}>
                    <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "16px" }}>{ABOUT.bio1}</p>
                    <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "16px" }}>{ABOUT.bio2}</p>
                    <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "24px" }}>{ABOUT.bio3}</p>
                    <div style={{ borderLeft: "2px solid var(--border)", paddingLeft: "16px" }}>
                      <p style={{ fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic", lineHeight: 1.7 }}>{ABOUT.quote}</p>
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {hasPhoto ? (
                      <div style={{ width: "190px", height: "340px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)", position: "relative" }}>
                        <Image
                          src="/images/about.jpg"
                          alt="Payton Wallace"
                          fill
                          style={{ objectFit: "cover", objectPosition: "center top" }}
                        />
                      </div>
                    ) : (
                      <div style={{ width: "190px", height: "340px", border: "1px dashed var(--border)", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: "var(--text-faint)", textAlign: "center", lineHeight: 1.6 }}>// about.jpg</p>
                      </div>
                    )}
                  </div>
                </div>
              </FileBlock>
            </motion.div>

            {/* Portfolio */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={s(2)} style={{ marginTop: "20px" }}>
              <FileBlock path="~/package.json" meta={`${PORTFOLIO.length} ventures`} >
                <div>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", marginBottom: "16px" }}>
                    // 4 ventures · 3 current · 1 past
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {PORTFOLIO.map((co) => (
                      <PortfolioCard key={co.id} co={co} onGrowth={() => setGrowthOpen(true)} />
                    ))}
                  </div>
                </div>
              </FileBlock>
            </motion.div>

          </div>
        )}
      </section>
    </>
  );
}

type Co = typeof PORTFOLIO[number];

function PortfolioCard({ co, onGrowth }: { co: Co; onGrowth: () => void }) {
  const isClickable = co.action !== "none";

  const handleClick = () => {
    if (co.action === "growth") { onGrowth(); return; }
    if (co.action === "link" && co.link) window.open(co.link, "_blank");
  };

  return (
    <div
      onClick={isClickable ? handleClick : undefined}
      style={{
        border: "1px solid var(--border)",
        borderRadius: "8px",
        background: "transparent",
        cursor: isClickable ? "pointer" : "default",
        overflow: "hidden",
        transition: "border-color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!isClickable) return;
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border-hover)";
        el.style.background = "var(--bg-surface-hover)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border)";
        el.style.background = "transparent";
      }}
    >
      {/* Logo strip — shown when logo is present */}
      {"logo" in co && co.logo && (
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: "120px", height: "48px" }}>
            <Image src={co.logo as string} alt={co.name} fill style={{ objectFit: "contain" }} />
          </div>
        </div>
      )}

      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{co.name}</p>
          <span style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "9px",
            color: co.status === "current" ? "#22c55e" : "var(--text-faint)",
            border: `1px solid ${co.status === "current" ? "#22c55e44" : "var(--border)"}`,
            borderRadius: "4px",
            padding: "2px 6px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}>
            {co.status}
          </span>
        </div>
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: "var(--text-faint)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {co.role}
        </p>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.6 }}>{co.description}</p>
        {co.action === "growth" && (
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: "var(--text-faint)", marginTop: "10px" }}>
            click → G.R.O.W.T.H. ↗
          </p>
        )}
      </div>
    </div>
  );
}
