"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ── 8-bit arrow cursor pixel map ──────────────────────────────────────────────
// 0 = transparent  |  1 = outline (#f0f0f0)  |  2 = fill (#22c55e)
const PIXELS = [
  [1,0,0,0,0,0,0],
  [1,2,0,0,0,0,0],
  [1,2,2,0,0,0,0],
  [1,2,2,2,0,0,0],
  [1,2,2,2,2,0,0],
  [1,2,2,2,2,2,0],
  [1,2,2,1,1,2,1],
  [1,2,1,0,0,1,1],
  [1,1,0,0,0,0,0],
];
const PX = 2; // px per pixel

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true); };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);

    document.addEventListener("mousemove",   onMove);
    document.addEventListener("mousedown",   onDown);
    document.addEventListener("mouseup",     onUp);
    document.addEventListener("mouseleave",  onLeave);
    document.addEventListener("mouseenter",  onEnter);
    return () => {
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mousedown",  onDown);
      document.removeEventListener("mouseup",    onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  const w = PIXELS[0].length * PX;
  const h = PIXELS.length * PX;

  return (
    <motion.div
      className="custom-cursor"
      style={{
        position:      "fixed",
        left:          pos.x,
        top:           pos.y,
        pointerEvents: "none",
        zIndex:        99999,
        opacity:       visible ? 1 : 0,
        filter:        "drop-shadow(0px 1px 3px rgba(0,0,0,0.85))",
      }}
      animate={{ scale: clicking ? 0.75 : 1 }}
      transition={{ duration: 0.08 }}
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ display: "block", shapeRendering: "crispEdges" }}
      >
        {PIXELS.flatMap((row, y) =>
          row.map((pixel, x) => {
            if (pixel === 0) return null;
            return (
              <rect
                key={`${x}-${y}`}
                x={x * PX}
                y={y * PX}
                width={PX}
                height={PX}
                fill={pixel === 1 ? "#f0f0f0" : "#22c55e"}
              />
            );
          })
        )}
      </svg>
    </motion.div>
  );
}
