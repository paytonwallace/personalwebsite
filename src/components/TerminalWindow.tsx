"use client";

import { ReactNode } from "react";

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  noPadding?: boolean;
  style?: React.CSSProperties;
}

export default function TerminalWindow({ title = "zsh", children, noPadding, style }: TerminalWindowProps) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "10px",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* macOS-style title bar */}
      <div
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border)",
          padding: "9px 14px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          flexShrink: 0,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block", flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block", flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block", flexShrink: 0 }} />
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "11px",
            color: "var(--text-faint)",
            flex: 1,
            textAlign: "center",
            letterSpacing: "0.02em",
          }}
        >
          {title}
        </span>
      </div>
      <div style={noPadding ? undefined : { padding: "28px 32px" }}>
        {children}
      </div>
    </div>
  );
}
