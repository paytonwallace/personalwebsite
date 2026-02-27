export default function Footer() {
  return (
    <footer
      style={{
        padding: "40px 72px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "11px",
            color: "var(--text-faint)",
          }}
        >
          © {new Date().getFullYear()} Payton Wallace
        </p>
        <p
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "11px",
            color: "var(--text-faint)",
          }}
        >
          // built by mr.wallace agent
        </p>
      </div>
    </footer>
  );
}
