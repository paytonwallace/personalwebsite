"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { motion, AnimatePresence } from "framer-motion";
import type { Page } from "@/app/page";

const navItems: { label: string; page: Page }[] = [
  { label: "home",        page: "home"        },
  { label: "about",       page: "about"       },
  { label: "tools",       page: "tools"       },
  { label: "generosity",  page: "generosity"  },
  { label: "life.md",     page: "life"        },
  { label: "connect",     page: "connect"     },
];

// Black & white Instagram SVG icon
function InstagramIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" />
    </svg>
  );
}

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => setMounted(true), []);

  function SidebarContent() {
    return (
      <>
        {/* Identity */}
        <div style={{ padding: "22px 18px 18px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "30px", height: "30px", background: "var(--text)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, fontFamily: "var(--font-geist-mono)", borderRadius: "6px", flexShrink: 0 }}>
              PW
            </div>
            <div>
              <p style={{ fontSize: isMobile ? "15px" : "12px", fontWeight: 600, color: "var(--text)", lineHeight: 1 }}>Payton Wallace</p>
              <p style={{ fontSize: isMobile ? "12px" : "10px", color: "var(--text-faint)", marginTop: "3px", fontFamily: "var(--font-geist-mono)" }}>payton@paytonwallace.com</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div style={{ padding: "8px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "6px" }}>
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", flexShrink: 0 }}
          />
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>mr.wallace online</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.15em", padding: "0 8px", marginBottom: "6px" }}>
            // nav
          </p>
          {navItems.map((item) => {
            const isActive = activePage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => { onNavigate(item.page); setMobileOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "8px",
                  padding: "9px 10px", borderRadius: "6px", border: "none",
                  background: "transparent", cursor: "pointer", textAlign: "left",
                  marginBottom: "2px", position: "relative",
                }}
              >
                {isActive && (
                  <motion.div layoutId="nav-active"
                    style={{ position: "absolute", inset: 0, borderRadius: "6px", background: "var(--bg-surface-hover)", border: "1px solid var(--border)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: isMobile ? "16px" : "12px", color: isActive ? "var(--text)" : "var(--text-muted)", fontWeight: isActive ? 500 : 400, position: "relative", zIndex: 1 }}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="cursor-blink" style={{ display: "inline-block", width: "5px", height: "11px", background: "var(--text-muted)", borderRadius: "1px", marginLeft: "auto", position: "relative", zIndex: 1 }} />
                )}
              </button>
            );
          })}

          <div style={{ padding: "14px 10px 0", marginTop: "8px", borderTop: "1px solid var(--border)" }}>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: "var(--text-faint)", lineHeight: 1.7 }}>
              // impact · embrace · inspire
            </p>
          </div>
        </nav>

        {/* Bottom — only Instagram + theme toggle */}
        <div style={{ padding: "14px 12px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Instagram */}
          <a
            href="https://instagram.com/paytoncwallace"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 10px", borderRadius: "6px", border: "1px solid var(--border)",
              background: "transparent", textDecoration: "none",
              color: "var(--text-muted)", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = "var(--text)"; el.style.borderColor = "var(--border-hover)"; el.style.background = "var(--bg-surface-hover)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = "var(--text-muted)"; el.style.borderColor = "var(--border)"; el.style.background = "transparent"; }}
          >
            <InstagramIcon size={13} color="currentColor" />
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: isMobile ? "14px" : "11px" }}>@paytoncwallace</span>
          </a>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border)", background: "transparent", cursor: "pointer", width: "100%", transition: "background 0.15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface-hover)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            {mounted && theme === "dark" ? <Sun size={12} color="var(--text-muted)" /> : <Moon size={12} color="var(--text-muted)" />}
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: isMobile ? "13px" : "10px", color: "var(--text-muted)" }}>
              {mounted ? (theme === "dark" ? "light mode" : "dark mode") : "theme"}
            </span>
          </button>

          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: "var(--text-faint)", textAlign: "center" }}>built by mr.wallace</p>
        </div>
      </>
    );
  }

  return (
    <>
      <aside className="sidebar"><SidebarContent /></aside>

      <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-btn"
        style={{ position: "fixed", top: "12px", left: "12px", zIndex: 60, width: "48px", height: "48px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg)", cursor: "pointer", color: "var(--text)", display: "none", alignItems: "center", justifyContent: "center" }}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 45 }}
            />
            <motion.aside key="ms" initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ position: "fixed", top: 0, left: 0, height: "100vh", width: "240px", borderRight: "1px solid var(--border)", background: "var(--bg-surface)", display: "flex", flexDirection: "column", zIndex: 50 }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
