"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useIsMobile } from "@/hooks/useIsMobile";

const NAV_ITEMS = [
  { label: "home", href: "/#home" },
  { label: "about", href: "/#about" },
  { label: "tools", href: "/#tools" },
  { label: "generosity", href: "/#generosity" },
  { label: "life.md", href: "/#life" },
  { label: "connect", href: "/#connect" },
  { label: "games", href: "/#games" },
];

export default function BlogNav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isWritingsActive = pathname?.startsWith("/mrwallace");

  useEffect(() => setMounted(true), []);

  function NavContent() {
    return (
      <>
        {/* Identity */}
        <div style={{ padding: "22px 18px 18px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "30px", height: "30px", background: "var(--text)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, fontFamily: "var(--font-geist-mono)", borderRadius: "6px", flexShrink: 0 }}>
                PW
              </div>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)", lineHeight: 1 }}>Payton Wallace</p>
                <p style={{ fontSize: "10px", color: "var(--text-faint)", marginTop: "3px", fontFamily: "var(--font-geist-mono)" }}>payton@paytonwallace.com</p>
              </div>
            </Link>
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
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "8px",
                padding: "9px 10px", borderRadius: "6px", border: "none",
                background: "transparent", textDecoration: "none",
                marginBottom: "2px",
              }}
            >
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "var(--text-muted)", fontWeight: 400 }}>
                {item.label}
              </span>
            </Link>
          ))}

          {/* Writings — active */}
          <div style={{ marginTop: "8px", borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.15em", padding: "0 8px", marginBottom: "6px" }}>
              // writings
            </p>
            <Link
              href="/mrwallace"
              onClick={() => setMobileOpen(false)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "8px",
                padding: "9px 10px", borderRadius: "6px",
                background: isWritingsActive ? "var(--bg-surface-hover)" : "transparent",
                textDecoration: "none",
                marginBottom: "2px", position: "relative",
                border: isWritingsActive ? "1px solid var(--border)" : "none",
              }}
            >
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: isWritingsActive ? "#22c55e" : "var(--text-muted)", fontWeight: isWritingsActive ? 600 : 400 }}>
                /mrwallace
              </span>
              {isWritingsActive && (
                <span className="cursor-blink" style={{ display: "inline-block", width: "5px", height: "11px", background: "#22c55e", borderRadius: "1px", marginLeft: "auto" }} />
              )}
            </Link>
          </div>

          <div style={{ padding: "14px 10px 0", marginTop: "8px", borderTop: "1px solid var(--border)" }}>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: "var(--text-faint)", lineHeight: 1.7 }}>
              // impact · embrace · inspire
            </p>
          </div>
        </nav>

        {/* Bottom */}
        <div style={{ padding: "14px 12px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border)", background: "transparent", cursor: "pointer", width: "100%", transition: "background 0.15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface-hover)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            {mounted && theme === "dark" ? <Sun size={12} color="var(--text-muted)" /> : <Moon size={12} color="var(--text-muted)" />}
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-muted)" }}>
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
      {/* Desktop sidebar */}
      <aside className="blog-sidebar"><NavContent /></aside>

      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(!mobileOpen)} className="blog-mobile-menu-btn"
        style={{ position: "fixed", top: "12px", left: "12px", zIndex: 60, width: "48px", height: "48px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg)", cursor: "pointer", color: "var(--text)", display: "none", alignItems: "center", justifyContent: "center" }}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div key="blog-ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 45 }}
            />
            <motion.aside key="blog-ms" initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ position: "fixed", top: 0, left: 0, height: "100vh", width: "240px", borderRight: "1px solid var(--border)", background: "var(--bg-surface)", display: "flex", flexDirection: "column", zIndex: 50 }}
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
