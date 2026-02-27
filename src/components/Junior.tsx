"use client";

import {
  motion,
  useMotionValue,
  useAnimationFrame,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ── Stardew Valley-style orange tabby ──────────────────────────────────────
// Round, chunky, simple — 44x50 rendered. In memory of the real Junior.
function JuniorSprite({ running, happy, blinking }: { running: boolean; happy: boolean; blinking: boolean }) {
  const O = "#F07820";  // orange
  const L = "#F5A850";  // light orange / face area
  const S = "#A84800";  // dark stripe
  const B = "#1A1A1A";  // black / outline
  const P = "#FFB3C6";  // pink (inner ears, blush)
  const C = "#FEF3C7";  // cream / belly
  const N = "#F87171";  // nose

  return (
    <svg
      viewBox="0 0 48 56"
      width="44"
      height="51"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      style={{ overflow: "visible" }}
    >
      {/* ── TAIL ──────────────────────────────────────── */}
      {running ? (
        <motion.path
          d="M 38 48 Q 48 36 46 50 Q 44 58 36 54"
          stroke={O} strokeWidth="5" fill="none" strokeLinecap="round"
          animate={{ d: ["M 38 48 Q 48 36 46 50 Q 44 58 36 54", "M 38 48 Q 50 40 47 54 Q 45 60 36 54"] }}
          transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
        />
      ) : (
        <path d="M 38 48 Q 48 38 46 52 Q 44 58 36 54" stroke={O} strokeWidth="5" fill="none" strokeLinecap="round" />
      )}
      <path d="M 38 48 Q 48 38 46 52 Q 44 58 36 54" stroke={S} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4" />

      {/* ── BODY ──────────────────────────────────────── */}
      <rect x="8" y="36" width="32" height="22" rx="10" fill={B} />
      <rect x="9" y="37" width="30" height="20" rx="9" fill={O} />
      {/* Belly */}
      <ellipse cx="24" cy="47" rx="10" ry="8" fill={C} opacity="0.75" />
      {/* Body stripes */}
      <rect x="9" y="41" width="4" height="14" rx="2" fill={S} opacity="0.45" />
      <rect x="35" y="41" width="4" height="14" rx="2" fill={S} opacity="0.45" />

      {/* Paws */}
      {running ? (
        <>
          <motion.ellipse cx="16" rx="5" ry="4" fill={O}
            animate={{ cy: [54, 48, 54] }} transition={{ duration: 0.22, repeat: Infinity }} />
          <motion.ellipse cx="32" rx="5" ry="4" fill={O}
            animate={{ cy: [48, 54, 48] }} transition={{ duration: 0.22, repeat: Infinity }} />
        </>
      ) : (
        <>
          <ellipse cx="16" cy="54" rx="6" ry="4" fill={B} />
          <ellipse cx="16" cy="54" rx="5" ry="3" fill={O} />
          <ellipse cx="32" cy="54" rx="6" ry="4" fill={B} />
          <ellipse cx="32" cy="54" rx="5" ry="3" fill={O} />
        </>
      )}

      {/* ── EARS ──────────────────────────────────────── */}
      {/* Left ear */}
      <polygon points="8,20 14,6 21,20" fill={B} />
      <polygon points="9,19 14,8 20,19" fill={O} />
      <polygon points="10,18 14,10 18,18" fill={P} opacity="0.85" />
      {/* Right ear */}
      <polygon points="27,20 34,6 40,20" fill={B} />
      <polygon points="28,19 34,8 39,19" fill={O} />
      <polygon points="29,18 34,10 38,18" fill={P} opacity="0.85" />

      {/* ── HEAD ──────────────────────────────────────── */}
      <rect x="4" y="14" width="40" height="28" rx="14" fill={B} />
      <rect x="5" y="15" width="38" height="26" rx="13" fill={O} />
      {/* Forehead stripes */}
      <rect x="14" y="15" width="3" height="9" rx="1" fill={S} opacity="0.5" />
      <rect x="31" y="15" width="3" height="9" rx="1" fill={S} opacity="0.5" />
      <rect x="22" y="15" width="4" height="6" rx="1" fill={S} opacity="0.35" />
      {/* Face lighter area */}
      <ellipse cx="24" cy="30" rx="13" ry="8" fill={L} opacity="0.4" />

      {/* ── EYES ──────────────────────────────────────── */}
      {happy ? (
        // Happy — curved squint lines
        <>
          <path d="M 12 27 Q 17 23 22 27" stroke={B} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 26 27 Q 31 23 36 27" stroke={B} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      ) : blinking ? (
        // Blink — flat lines
        <>
          <rect x="12" y="27" width="10" height="2.5" rx="1.5" fill={B} />
          <rect x="26" y="27" width="10" height="2.5" rx="1.5" fill={B} />
        </>
      ) : (
        // Normal — round black eyes with shine
        <>
          <ellipse cx="17" cy="27" rx="5" ry="5" fill={B} />
          <ellipse cx="31" cy="27" rx="5" ry="5" fill={B} />
          <circle cx="15" cy="25" r="1.5" fill="white" opacity="0.9" />
          <circle cx="29" cy="25" r="1.5" fill="white" opacity="0.9" />
        </>
      )}

      {/* ── NOSE & MOUTH ──────────────────────────────── */}
      <ellipse cx="24" cy="34" rx="3" ry="2" fill={N} />
      {!blinking && !happy && (
        <path d="M 21 36 Q 24 39 27 36" stroke={B} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
      )}
      {happy && (
        <path d="M 20 36 Q 24 41 28 36" stroke={B} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}

      {/* ── BLUSH (idle only) ─────────────────────────── */}
      {!running && !happy && (
        <>
          <circle cx="11" cy="33" r="3.5" fill={P} opacity="0.35" />
          <circle cx="37" cy="33" r="3.5" fill={P} opacity="0.35" />
        </>
      )}

      {/* ── HAPPY STARS ───────────────────────────────── */}
      <AnimatePresence>
        {happy && (
          <>
            {[[-10, -12, 0], [10, -16, 0.1], [0, -22, 0.2]].map(([dx, , delay], i) => (
              <motion.text
                key={i}
                x={24 + dx}
                y={14}
                fontSize="9"
                textAnchor="middle"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: [-8, -22] }}
                transition={{ duration: 1.4, delay: delay as number }}
              >
                ✦
              </motion.text>
            ))}
          </>
        )}
      </AnimatePresence>
    </svg>
  );
}

// ── Tooltip ──────────────────────────────────────────────────────────────────
function Tooltip({ show, chasing }: { show: boolean; chasing: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 4 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "absolute",
            bottom: "60px",
            right: "0px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "7px 11px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 100,
          }}
        >
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-muted)" }}>
            junior 🐾
          </p>
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)", marginTop: "2px" }}>
            {chasing ? "click to stop" : "click to chase cursor"}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Junior() {
  const [mounted, setMounted] = useState(false);
  const [chasing, setChasing] = useState(false);
  const [happy, setHappy] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const catX = useMotionValue(0);
  const catY = useMotionValue(0);

  const chasingRef = useRef(false);
  const happyRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Init position
  useEffect(() => {
    setMounted(true);
    catX.set(window.innerWidth - 100);
    catY.set(window.innerHeight - 100);
    mouseRef.current = { x: window.innerWidth - 100, y: window.innerHeight - 100 };
  }, [catX, catY]);

  useEffect(() => { chasingRef.current = chasing; }, [chasing]);
  useEffect(() => { happyRef.current = happy; }, [happy]);

  // Mouse tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX - 22, y: e.clientY - 22 };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Idle blink animation — blink every ~4 seconds
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 3000;
      return setTimeout(() => {
        if (!chasingRef.current) {
          setBlinking(true);
          setTimeout(() => setBlinking(false), 200);
        }
        blinkTimerRef.current = scheduleBlink();
      }, delay);
    };
    blinkTimerRef.current = scheduleBlink();
    return () => clearTimeout(blinkTimerRef.current);
  }, []);

  const blinkTimerRef = useRef<ReturnType<typeof setTimeout>>(
    null as unknown as ReturnType<typeof setTimeout>
  );

  // Chase loop via motion values (no React re-renders)
  useAnimationFrame(() => {
    if (!chasingRef.current || happyRef.current) return;

    const cx = catX.get();
    const cy = catY.get();
    const tx = mouseRef.current.x;
    const ty = mouseRef.current.y;
    const dx = tx - cx;
    const dy = ty - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (Math.abs(dx) > 3) setFlipped(dx < 0);

    if (dist < 44) {
      chasingRef.current = false;
      happyRef.current = true;
      setChasing(false);
      setHappy(true);

      setTimeout(() => {
        happyRef.current = false;
        setHappy(false);
        setFlipped(false);
        catX.set(window.innerWidth - 100);
        catY.set(window.innerHeight - 100);
      }, 2200);
      return;
    }

    const speed = Math.min(6, Math.max(2.5, dist * 0.055));
    catX.set(cx + (dx / dist) * speed);
    catY.set(cy + (dy / dist) * speed);
  });

  const handleClick = () => {
    if (happyRef.current) return;
    if (chasingRef.current) {
      chasingRef.current = false;
      setChasing(false);
      setFlipped(false);
      catX.set(window.innerWidth - 100);
      catY.set(window.innerHeight - 100);
    } else {
      setShowTooltip(false);
      setChasing(true);
      chasingRef.current = true;
    }
  };

  if (!mounted) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        zIndex: 95,
        cursor: "pointer",
        userSelect: "none",
        touchAction: "none",
        x: catX,
        y: catY,
      }}
      onClick={handleClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        style={{
          transform: flipped ? "scaleX(-1)" : "scaleX(1)",
          transition: "transform 0.08s",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
        }}
      >
        <JuniorSprite running={chasing} happy={happy} blinking={blinking} />
      </div>
      <Tooltip show={showTooltip} chasing={chasing} />
    </motion.div>
  );
}
