"use client";

import { motion } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import { useRef, useState } from "react";

const s = (i: number) => ({ duration: 0.5, delay: 0.05 + i * 0.12, ease: "easeOut" as const });

export default function ContactForm({ isActive }: { isActive: boolean }) {
  const revealed = useReveal(isActive, 50);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("sent");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%",
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "12px",
    color: "var(--text)",
    outline: "none",
    fontFamily: "var(--font-geist-sans)",
    transition: "border-color 0.15s",
    boxSizing: "border-box" as const,
  };

  return (
    <section
      id="contact"
      style={{ minHeight: "100vh", padding: "80px 72px", borderBottom: "1px solid var(--border)" }}
    >
      <div style={{ maxWidth: "560px" }}>
        {revealed && (
          <>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={s(0)}
              style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}
            >
              // contact
            </motion.p>

            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={s(1)}
              style={{ fontSize: "28px", fontWeight: 600, color: "var(--text)", marginBottom: "12px", letterSpacing: "-0.02em" }}
            >
              Let&apos;s connect.
            </motion.h2>

            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={s(2)}
              style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "48px", lineHeight: 1.7 }}
            >
              Whether you&apos;re a founder ready to scale, have a question, or just
              want to say hello — I&apos;d love to hear from you.
            </motion.p>

            {status === "sent" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "40px 32px",
                  textAlign: "center",
                  background: "var(--bg-surface)",
                }}
              >
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "var(--text-faint)", marginBottom: "8px" }}>
                  // message received
                </p>
                <p style={{ fontSize: "16px", color: "var(--text)", fontWeight: 500, marginBottom: "8px" }}>
                  I&apos;ll be in touch soon.
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>— payton</p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={s(3)}
                style={{ display: "flex", flexDirection: "column", gap: "16px" }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {["name", "email"].map((field) => (
                    <div key={field}>
                      <label style={{ display: "block", fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                        {field}
                      </label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        required
                        placeholder={field === "email" ? "your@email.com" : "Your name"}
                        value={formData[field as "name" | "email"]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--border-hover)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-geist-mono)", fontSize: "9px", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                    message
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="What's on your mind?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ ...inputStyle, resize: "none" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--border-hover)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                </div>

                {status === "error" && (
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "#ef4444" }}>
                    // something went wrong. try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  style={{
                    alignSelf: "flex-start",
                    padding: "11px 28px",
                    background: "var(--text)",
                    color: "var(--bg)",
                    fontSize: "12px",
                    fontWeight: 500,
                    borderRadius: "8px",
                    border: "none",
                    cursor: status === "sending" ? "not-allowed" : "pointer",
                    opacity: status === "sending" ? 0.6 : 1,
                    transition: "opacity 0.15s",
                    letterSpacing: "0.06em",
                  }}
                >
                  {status === "sending" ? "sending..." : "Send Message"}
                </button>
              </motion.form>
            )}
          </>
        )}
      </div>
    </section>
  );
}
