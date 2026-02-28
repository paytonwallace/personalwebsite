"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// N64 Sound
function useN64Sound() {
  const ctx = useRef<AudioContext | null>(null);
  const playBoot = useCallback(() => {
    try {
      ctx.current = new AudioContext();
      const ac = ctx.current;
      const buf = ac.createBuffer(1, ac.sampleRate * 1.5, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ac.sampleRate;
        const freq = 60 * Math.exp(-t * 8);
        data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 5) * 0.6;
        data[i] += (Math.random() * 2 - 1) * Math.exp(-t * 20) * 0.3;
      }
      const src = ac.createBufferSource();
      src.buffer = buf;
      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.8, 0);
      gain.gain.exponentialRampToValueAtTime(0.001, 1.5);
      src.connect(gain);
      gain.connect(ac.destination);
      src.start();
      setTimeout(() => {
        const osc = ac.createOscillator();
        const g2 = ac.createGain();
        osc.frequency.setValueAtTime(880, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ac.currentTime + 0.3);
        g2.gain.setValueAtTime(0.3, ac.currentTime);
        g2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.8);
        osc.connect(g2);
        g2.connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.8);
      }, 200);
    } catch (_) {}
  }, []);
  return playBoot;
}

function N64Boot({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playBoot = useN64Sound();
  const done = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const c = ctx!;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const W = canvas.width;
    const H = canvas.height;
    let frame = 0;
    let raf: number;
    let soundPlayed = false;

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5, alpha: Math.random(),
      twinkle: Math.random() * 0.02 + 0.005,
    }));

    function drawLogo(x: number, y: number, scale: number, alpha: number) {
      ctx!.save();
      ctx!.globalAlpha = alpha;
      ctx!.translate(x, y);
      ctx!.scale(scale, scale);
      ctx!.fillStyle = "#cc0000";
      ctx!.fillRect(-55, -55, 110, 110);
      ctx!.fillStyle = "#ffffff";
      ctx!.font = "bold 72px Arial";
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.fillText("N", 0, -4);
      ctx!.font = "bold 20px Arial";
      ctx!.fillText("64", 0, 40);
      ctx!.restore();
    }

    function animate() {
      frame++;
      ctx!.fillStyle = "#000";
      ctx!.fillRect(0, 0, W, H);
      stars.forEach((s) => {
        s.alpha += s.twinkle * (Math.random() > 0.5 ? 1 : -1);
        s.alpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx!.globalAlpha = s.alpha * Math.min(1, frame / 30);
        ctx!.fillStyle = "#fff";
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fill();
      });
      ctx!.globalAlpha = 1;

      if (frame >= 20 && frame < 40) {
        const p = (frame - 20) / 20;
        const e = 1 - Math.pow(1 - p, 3);
        drawLogo(-80 + (W / 2 + 80) * e, H / 2, 1, p);
        if (!soundPlayed && frame === 25) { soundPlayed = true; playBoot(); }
      } else if (frame >= 40 && frame < 80) {
        const pulse = 1 + Math.sin((frame - 40) * 0.15) * 0.04;
        drawLogo(W / 2, H / 2, pulse, 1);
      } else if (frame >= 80 && frame < 110) {
        drawLogo(W / 2, H / 2 - 20, 1, 1);
        ctx!.globalAlpha = (frame - 80) / 30;
        ctx!.fillStyle = "#ffcc00";
        ctx!.font = "bold 16px monospace";
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillText("PRESS START", W / 2, H / 2 + 86);
      } else if (frame >= 110 && frame < 160) {
        drawLogo(W / 2, H / 2 - 20, 1, 1);
        if (Math.floor((frame - 110) / 15) % 2 === 0) {
          ctx!.fillStyle = "#ffcc00";
          ctx!.font = "bold 16px monospace";
          ctx!.textAlign = "center";
          ctx!.textBaseline = "middle";
          ctx!.fillText("PRESS START", W / 2, H / 2 + 86);
        }
      } else if (frame >= 160) {
        const fade = 1 - (frame - 160) / 20;
        drawLogo(W / 2, H / 2 - 20, 1, Math.max(0, fade));
        if (!done.current && frame >= 180) {
          done.current = true;
          onComplete();
          return;
        }
      }

      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [onComplete, playBoot]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block", cursor: "pointer" }}
      onClick={() => { if (!done.current) { done.current = true; onComplete(); } }}
    />
  );
}

// Snake Game
const CELL = 20;
const COLS = 20;
const ROWS = 18;

function randomFood(snake: {x:number,y:number}[]): {x:number,y:number} {
  let p: {x:number,y:number} = {x:0,y:0};
  do { p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
  while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{snake:{x:number,y:number}[];dir:string;nextDir:string;food:{x:number,y:number};score:number;dead:boolean;started:boolean}>({
    snake: [{ x: 10, y: 9 }, { x: 9, y: 9 }, { x: 8, y: 9 }],
    dir: "RIGHT", nextDir: "RIGHT",
    food: { x: 15, y: 9 },
    score: 0, dead: false, started: false,
  });
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);

  const reset = useCallback(() => {
    stateRef.current = {
      snake: [{ x: 10, y: 9 }, { x: 9, y: 9 }, { x: 8, y: 9 }],
      dir: "RIGHT", nextDir: "RIGHT",
      food: { x: 15, y: 9 },
      score: 0, dead: false, started: true,
    };
    setScore(0);
    setDead(false);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    ctx!.fillStyle = "#0a0a0a";
    ctx!.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    ctx!.strokeStyle = "#111";
    ctx!.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) { ctx!.beginPath(); ctx!.moveTo(x * CELL, 0); ctx!.lineTo(x * CELL, ROWS * CELL); ctx!.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx!.beginPath(); ctx!.moveTo(0, y * CELL); ctx!.lineTo(COLS * CELL, y * CELL); ctx!.stroke(); }
    ctx!.fillStyle = "#ff3333";
    ctx!.fillRect(s.food.x * CELL + 3, s.food.y * CELL + 3, CELL - 6, CELL - 6);
    s.snake.forEach((seg, i) => {
      ctx!.fillStyle = i === 0 ? "#22c55e" : i % 2 === 0 ? "#16a34a" : "#15803d";
      ctx!.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
    if (!s.started) {
      ctx!.fillStyle = "rgba(0,0,0,0.75)";
      ctx!.fillRect(0, 0, COLS * CELL, ROWS * CELL);
      ctx!.fillStyle = "#22c55e";
      ctx!.font = "bold 22px monospace";
      ctx!.textAlign = "center";
      ctx!.fillText("SNAKE", COLS * CELL / 2, ROWS * CELL / 2 - 20);
      ctx!.fillStyle = "#fff";
      ctx!.font = "13px monospace";
      ctx!.fillText("press enter or tap to start", COLS * CELL / 2, ROWS * CELL / 2 + 14);
    }
    if (s.dead) {
      ctx!.fillStyle = "rgba(0,0,0,0.8)";
      ctx!.fillRect(0, 0, COLS * CELL, ROWS * CELL);
      ctx!.fillStyle = "#ff3333";
      ctx!.font = "bold 22px monospace";
      ctx!.textAlign = "center";
      ctx!.fillText("GAME OVER", COLS * CELL / 2, ROWS * CELL / 2 - 20);
      ctx!.fillStyle = "#ffcc00";
      ctx!.font = "15px monospace";
      ctx!.fillText(`score: ${s.score}`, COLS * CELL / 2, ROWS * CELL / 2 + 10);
      ctx!.fillStyle = "#fff";
      ctx!.font = "12px monospace";
      ctx!.fillText("press enter or tap to retry", COLS * CELL / 2, ROWS * CELL / 2 + 34);
    }
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s.started || s.dead) return;
    s.dir = s.nextDir;
    const head = { ...s.snake[0] };
    if (s.dir === "UP") head.y--;
    if (s.dir === "DOWN") head.y++;
    if (s.dir === "LEFT") head.x--;
    if (s.dir === "RIGHT") head.x++;
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      s.dead = true;
      setDead(true);
      draw();
      return;
    }
    const ate = head.x === s.food.x && head.y === s.food.y;
    s.snake = [head, ...s.snake];
    if (ate) { s.score++; s.food = randomFood(s.snake); setScore(s.score); }
    else s.snake.pop();
    draw();
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  useEffect(() => {
    const id = setInterval(tick, 120);
    return () => clearInterval(id);
  }, [tick]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === "Enter" || e.key === " ") { if (!s.started || s.dead) reset(); return; }
      if (!s.started) return;
      const map: Record<string, string> = { ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT", w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT" };
      const newDir = map[e.key];
      if (!newDir) return;
      const opp: Record<string, string> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      if (newDir !== opp[s.dir]) s.nextDir = newDir;
      e.preventDefault();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [reset]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <div style={{ width: COLS * CELL, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)" }}>// snake.exe</span>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "13px", color: "var(--text)", fontWeight: 600 }}>score: {score}</span>
      </div>
      <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL}
        style={{ border: "1px solid var(--border)", borderRadius: "4px", cursor: "pointer", display: "block" }}
        onClick={() => { const s = stateRef.current; if (!s.started || s.dead) reset(); }}
      />
      <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>
        arrow keys / wasd · enter to start
      </p>
    </div>
  );
}

export default function Games() {
  const [phase, setPhase] = useState("boot");

  const handleBootComplete = useCallback(() => {
    setTimeout(() => setPhase("select"), 300);
  }, []);

  return (
    <div style={{ padding: "32px 24px", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", marginBottom: "6px" }}>// games</p>
        <h1 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>game room</h1>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>yes, there are games on this site.</p>
      </div>

      <AnimatePresence mode="wait">
        {phase === "boot" && (
          <motion.div key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ width: "100%", maxWidth: "480px", height: "360px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)", background: "#000" }}>
            <N64Boot onComplete={handleBootComplete} />
          </motion.div>
        )}
        {phase === "select" && (
          <motion.div key="select" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "480px" }}>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)" }}>// select game</p>
            <button onClick={() => setPhase("snake")}
              style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 18px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface)", cursor: "pointer", textAlign: "left", width: "100%" }}>
              <span style={{ fontSize: "26px" }}>🐍</span>
              <div>
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "3px" }}>snake.exe</p>
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--text-faint)" }}>classic · arrow keys · beat 20</p>
              </div>
              <span style={{ marginLeft: "auto", fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)" }}>→</span>
            </button>
            <button onClick={() => setPhase("boot")}
              style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border)", background: "transparent", cursor: "pointer", fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)", textAlign: "left" }}>
              ↺ replay boot sequence
            </button>
          </motion.div>
        )}
        {phase === "snake" && (
          <motion.div key="snake" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <button onClick={() => setPhase("select")}
              style={{ marginBottom: "16px", padding: "7px 12px", borderRadius: "6px", border: "1px solid var(--border)", background: "transparent", cursor: "pointer", fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-faint)" }}>
              ← back
            </button>
            <SnakeGame />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}





