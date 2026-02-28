"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Boot Sound ───────────────────────────────────────────────
function playBootChime() {
  try {
    const ac = new AudioContext();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(660, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ac.currentTime + 0.3);
    gain.gain.setValueAtTime(0.08, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.6);
  } catch {}
}

// ─── MW Console Boot ──────────────────────────────────────────
function MWBoot({ onComplete }: { onComplete: () => void }) {
  const [line, setLine] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const [typed, setTyped] = useState("");
  const [fadeOut, setFadeOut] = useState(false);
  const done = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lines = [
    { text: 'mr.wallace console  v1.0', style: { color: "#fff", fontSize: "18px" } },
    { text: 'initializing game room...', style: { color: "#6a6a6a", fontSize: "13px" } },
    { text: '__BAR__', style: {} },
    { text: 'system ready.', style: { color: "#6a6a6a", fontSize: "13px" } },
  ];

  const skip = useCallback(() => {
    if (done.current) return;
    done.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    setFadeOut(true);
    setTimeout(() => onComplete(), 400);
  }, [onComplete]);

  useEffect(() => {
    if (done.current) return;
    let cancelled = false;
    let currentLine = 0;
    let charIdx = 0;
    let bar = 0;
    let chimePlayed = false;

    function typeNext() {
      if (cancelled || done.current) return;
      if (currentLine >= lines.length) {
        // All lines done, wait then fade
        timerRef.current = setTimeout(() => {
          if (!cancelled && !done.current) {
            done.current = true;
            setFadeOut(true);
            setTimeout(() => { if (!cancelled) onComplete(); }, 400);
          }
        }, 600);
        return;
      }

      const l = lines[currentLine];
      if (l.text === '__BAR__') {
        // Animate loading bar
        setLine(currentLine + 1);
        function fillBar() {
          if (cancelled || done.current) return;
          bar += 2;
          setBarWidth(Math.min(bar, 100));
          if (bar < 100) {
            timerRef.current = setTimeout(fillBar, 30);
          } else {
            if (!chimePlayed) { chimePlayed = true; playBootChime(); }
            currentLine++;
            charIdx = 0;
            timerRef.current = setTimeout(typeNext, 300);
          }
        }
        timerRef.current = setTimeout(fillBar, 200);
        return;
      }

      // Type out text char by char
      if (charIdx === 0) {
        setLine(currentLine + 1);
        setTyped("");
      }
      if (charIdx < l.text.length) {
        charIdx++;
        const ci = charIdx;
        setTyped(l.text.slice(0, ci));
        timerRef.current = setTimeout(typeNext, 35);
      } else {
        currentLine++;
        charIdx = 0;
        timerRef.current = setTimeout(typeNext, 400);
      }
    }

    timerRef.current = setTimeout(typeNext, 500);
    return () => { cancelled = true; if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const barStr = useCallback((w: number) => {
    const total = 20;
    const filled = Math.round((w / 100) * total);
    return "[" + "=".repeat(filled) + " ".repeat(total - filled) + "]";
  }, []);

  return (
    <motion.div
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "fixed", inset: 0, zIndex: 100, background: "#000",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* MW logo top-left */}
      <div style={{
        position: "absolute", top: 24, left: 24,
        width: 40, height: 40, background: "#111", borderRadius: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-geist-mono)", fontSize: 14, fontWeight: 700,
        color: "#fff", letterSpacing: 1,
      }}>
        MW
      </div>

      {/* Terminal text center */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontFamily: "var(--font-geist-mono)", display: "flex", flexDirection: "column", gap: 10 }}>
          {line >= 1 && (
            <div style={{ ...lines[0].style }}>
              {line === 1 ? typed : lines[0].text}
              {line === 1 && <span style={{ animation: "blink 1s step-end infinite" }}>_</span>}
            </div>
          )}
          {line >= 2 && (
            <div style={{ ...lines[1].style }}>
              {line === 2 ? typed : lines[1].text}
              {line === 2 && <span style={{ animation: "blink 1s step-end infinite" }}>_</span>}
            </div>
          )}
          {line >= 3 && (
            <div style={{ color: "#22c55e", fontSize: "13px", fontFamily: "var(--font-geist-mono)" }}>
              {barStr(barWidth)}
            </div>
          )}
          {line >= 4 && (
            <div style={{ ...lines[3].style }}>
              {line === 4 ? typed : lines[3].text}
              {line === 4 && <span style={{ animation: "blink 1s step-end infinite" }}>_</span>}
            </div>
          )}
        </div>
      </div>

      {/* Skip button */}
      <button
        onClick={skip}
        style={{
          position: "absolute", bottom: 24, right: 24,
          fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#6a6a6a",
          background: "none", border: "none", cursor: "pointer",
          padding: "4px 8px",
        }}
      >
        skip
      </button>

      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </motion.div>
  );
}

// ─── Snake ────────────────────────────────────────────────────
const CELL = 20;
const COLS = 20;
const ROWS = 18;

function randomFood(snake: { x: number; y: number }[]): { x: number; y: number } {
  let p: { x: number; y: number };
  do {
    p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

interface SnakeState {
  snake: { x: number; y: number }[];
  dir: string;
  nextDir: string;
  food: { x: number; y: number };
  score: number;
  dead: boolean;
  started: boolean;
}

function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<SnakeState>({
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
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, ROWS * CELL); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(COLS * CELL, y * CELL); ctx.stroke(); }
    ctx.fillStyle = "#ff3333";
    ctx.fillRect(s.food.x * CELL + 3, s.food.y * CELL + 3, CELL - 6, CELL - 6);
    s.snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#22c55e" : i % 2 === 0 ? "#16a34a" : "#15803d";
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
    if (!s.started) {
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 22px monospace";
      ctx.textAlign = "center";
      ctx.fillText("SNAKE", COLS * CELL / 2, ROWS * CELL / 2 - 20);
      ctx.fillStyle = "#fff";
      ctx.font = "13px monospace";
      ctx.fillText("press enter or tap to start", COLS * CELL / 2, ROWS * CELL / 2 + 14);
    }
    if (s.dead) {
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
      ctx.fillStyle = "#ff3333";
      ctx.font = "bold 22px monospace";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", COLS * CELL / 2, ROWS * CELL / 2 - 20);
      ctx.fillStyle = "#ffcc00";
      ctx.font = "15px monospace";
      ctx.fillText(`score: ${s.score}`, COLS * CELL / 2, ROWS * CELL / 2 + 10);
      ctx.fillStyle = "#fff";
      ctx.font = "12px monospace";
      ctx.fillText("press enter or tap to retry", COLS * CELL / 2, ROWS * CELL / 2 + 34);
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
  useEffect(() => { const id = setInterval(tick, 120); return () => clearInterval(id); }, [tick]);

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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: COLS * CELL, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--text-faint)" }}>// snake</span>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--text)", fontWeight: 600 }}>score: {score}</span>
      </div>
      <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL}
        style={{ border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", display: "block" }}
        onClick={() => { const s = stateRef.current; if (!s.started || s.dead) reset(); }}
      />
      {dead && <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--text-faint)" }}>arrow keys / wasd</p>}
    </div>
  );
}

// ─── Pong ─────────────────────────────────────────────────────
const PONG_W = 400;
const PONG_H = 300;

interface PongState {
  px: number; py: number; // player paddle
  ax: number; ay: number; // ai paddle
  bx: number; by: number; // ball
  bvx: number; bvy: number;
  pScore: number; aScore: number;
  paused: boolean;
  rally: number;
}

function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<PongState>({
    px: 10, py: PONG_H / 2 - 30,
    ax: PONG_W - 20, ay: PONG_H / 2 - 30,
    bx: PONG_W / 2, by: PONG_H / 2,
    bvx: 3, bvy: 2,
    pScore: 0, aScore: 0,
    paused: true, rally: 0,
  });
  const [scores, setScores] = useState({ p: 0, a: 0 });
  const keysRef = useRef<Set<string>>(new Set());

  const resetBall = useCallback((dir: number) => {
    const s = stateRef.current;
    s.bx = PONG_W / 2;
    s.by = PONG_H / 2;
    s.bvx = 3 * dir;
    s.bvy = (Math.random() * 2 - 1) * 2;
    s.rally = 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const PW = 10; // paddle width
    const PH = 60; // paddle height

    let raf: number;

    function draw() {
      const s = stateRef.current;
      ctx!.fillStyle = "#0a0a0a";
      ctx!.fillRect(0, 0, PONG_W, PONG_H);
      // Center line
      ctx!.setLineDash([4, 4]);
      ctx!.strokeStyle = "#333";
      ctx!.beginPath();
      ctx!.moveTo(PONG_W / 2, 0);
      ctx!.lineTo(PONG_W / 2, PONG_H);
      ctx!.stroke();
      ctx!.setLineDash([]);
      // Paddles
      ctx!.fillStyle = "#fff";
      ctx!.fillRect(s.px, s.py, PW, PH);
      ctx!.fillRect(s.ax, s.ay, PW, PH);
      // Ball
      ctx!.beginPath();
      ctx!.arc(s.bx, s.by, 5, 0, Math.PI * 2);
      ctx!.fill();
      // Score
      ctx!.font = "bold 20px monospace";
      ctx!.textAlign = "center";
      ctx!.fillStyle = "#666";
      ctx!.fillText(`${s.pScore}`, PONG_W / 2 - 30, 28);
      ctx!.fillText(`${s.aScore}`, PONG_W / 2 + 30, 28);

      if (s.paused) {
        ctx!.fillStyle = "rgba(0,0,0,0.6)";
        ctx!.fillRect(0, 0, PONG_W, PONG_H);
        ctx!.fillStyle = "#fff";
        ctx!.font = "bold 18px monospace";
        ctx!.textAlign = "center";
        ctx!.fillText("PONG", PONG_W / 2, PONG_H / 2 - 14);
        ctx!.font = "12px monospace";
        ctx!.fillStyle = "#aaa";
        ctx!.fillText("press enter or tap to start", PONG_W / 2, PONG_H / 2 + 12);
      }
    }

    function tick() {
      const s = stateRef.current;
      if (!s.paused) {
        // Player movement
        const speed = 5;
        if (keysRef.current.has("w") || keysRef.current.has("ArrowUp")) s.py = Math.max(0, s.py - speed);
        if (keysRef.current.has("s") || keysRef.current.has("ArrowDown")) s.py = Math.min(PONG_H - PH, s.py + speed);

        // AI movement
        const aiCenter = s.ay + PH / 2;
        const diff = s.by - aiCenter;
        const aiSpeed = 3.2;
        if (Math.abs(diff) > 8) s.ay += (diff > 0 ? aiSpeed : -aiSpeed);
        s.ay = Math.max(0, Math.min(PONG_H - PH, s.ay));

        // Ball movement
        s.bx += s.bvx;
        s.by += s.bvy;

        // Top/bottom bounce
        if (s.by <= 5) { s.by = 5; s.bvy = Math.abs(s.bvy); }
        if (s.by >= PONG_H - 5) { s.by = PONG_H - 5; s.bvy = -Math.abs(s.bvy); }

        // Paddle collisions
        if (s.bx - 5 <= s.px + PW && s.by >= s.py && s.by <= s.py + PH && s.bvx < 0) {
          s.bvx = Math.abs(s.bvx);
          s.rally++;
          if (s.rally % 4 === 0) { s.bvx *= 1.1; s.bvy *= 1.1; }
          const hitPos = (s.by - s.py) / PH - 0.5;
          s.bvy += hitPos * 2;
        }
        if (s.bx + 5 >= s.ax && s.by >= s.ay && s.by <= s.ay + PH && s.bvx > 0) {
          s.bvx = -Math.abs(s.bvx);
          s.rally++;
          if (s.rally % 4 === 0) { s.bvx *= 1.1; s.bvy *= 1.1; }
          const hitPos = (s.by - s.ay) / PH - 0.5;
          s.bvy += hitPos * 2;
        }

        // Scoring
        if (s.bx < 0) { s.aScore++; setScores({ p: s.pScore, a: s.aScore }); resetBall(1); }
        if (s.bx > PONG_W) { s.pScore++; setScores({ p: s.pScore, a: s.aScore }); resetBall(-1); }
      }
      draw();
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [resetBall]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === "Enter" || e.key === " ") {
        stateRef.current.paused = false;
      }
      if (["ArrowUp", "ArrowDown", "w", "s"].includes(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: PONG_W, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--text-faint)" }}>// pong</span>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--text)", fontWeight: 600 }}>{scores.p} : {scores.a}</span>
      </div>
      <canvas ref={canvasRef} width={PONG_W} height={PONG_H}
        style={{ border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", display: "block" }}
        onClick={() => { stateRef.current.paused = false; }}
      />
      <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--text-faint)" }}>W/S or arrows to move</p>
    </div>
  );
}

// ─── Breakout ─────────────────────────────────────────────────
const BRK_W = 400;
const BRK_H = 300;
const BRK_ROWS = 5;
const BRK_COLS = 8;
const BRICK_W = BRK_W / BRK_COLS;
const BRICK_H = 16;
const BRICK_COLORS = ["#eab308", "#22c55e", "#3b82f6", "#a855f7", "#ef4444"];

interface BrkState {
  padX: number;
  bx: number; by: number; bvx: number; bvy: number;
  bricks: boolean[][];
  score: number;
  lives: number;
  started: boolean;
  dead: boolean;
}

function initBricks(): boolean[][] {
  return Array.from({ length: BRK_ROWS }, () => Array(BRK_COLS).fill(true));
}

function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<BrkState>({
    padX: BRK_W / 2 - 30,
    bx: BRK_W / 2, by: BRK_H - 40,
    bvx: 2.5, bvy: -2.5,
    bricks: initBricks(),
    score: 0, lives: 3, started: false, dead: false,
  });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const keysRef = useRef<Set<string>>(new Set());

  const resetBall = useCallback(() => {
    const s = stateRef.current;
    s.bx = BRK_W / 2;
    s.by = BRK_H - 40;
    s.bvx = 2.5 * (Math.random() > 0.5 ? 1 : -1);
    s.bvy = -2.5;
  }, []);

  const fullReset = useCallback(() => {
    stateRef.current = {
      padX: BRK_W / 2 - 30,
      bx: BRK_W / 2, by: BRK_H - 40,
      bvx: 2.5, bvy: -2.5,
      bricks: initBricks(),
      score: 0, lives: 3, started: true, dead: false,
    };
    setScore(0);
    setLives(3);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const PAD_W = 60;
    const PAD_H = 8;
    const BRICK_TOP = 30;
    let raf: number;
    let mouseX: number | null = null;

    function handleMouse(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
    }
    canvas.addEventListener("mousemove", handleMouse);

    function draw() {
      const s = stateRef.current;
      ctx!.fillStyle = "#0a0a0a";
      ctx!.fillRect(0, 0, BRK_W, BRK_H);

      // Bricks
      for (let r = 0; r < BRK_ROWS; r++) {
        for (let c = 0; c < BRK_COLS; c++) {
          if (s.bricks[r][c]) {
            ctx!.fillStyle = BRICK_COLORS[r];
            ctx!.fillRect(c * BRICK_W + 1, BRICK_TOP + r * BRICK_H + 1, BRICK_W - 2, BRICK_H - 2);
          }
        }
      }

      // Paddle
      ctx!.fillStyle = "#fff";
      ctx!.fillRect(s.padX, BRK_H - 20, PAD_W, PAD_H);

      // Ball
      ctx!.beginPath();
      ctx!.arc(s.bx, s.by, 4, 0, Math.PI * 2);
      ctx!.fill();

      // Lives
      ctx!.font = "10px monospace";
      ctx!.fillStyle = "#666";
      ctx!.textAlign = "left";
      ctx!.fillText("♥".repeat(s.lives), 6, 16);

      if (!s.started || s.dead) {
        ctx!.fillStyle = "rgba(0,0,0,0.7)";
        ctx!.fillRect(0, 0, BRK_W, BRK_H);
        ctx!.fillStyle = "#fff";
        ctx!.font = "bold 18px monospace";
        ctx!.textAlign = "center";
        if (s.dead) {
          ctx!.fillStyle = "#ef4444";
          ctx!.fillText("GAME OVER", BRK_W / 2, BRK_H / 2 - 14);
          ctx!.fillStyle = "#eab308";
          ctx!.font = "14px monospace";
          ctx!.fillText(`score: ${s.score}`, BRK_W / 2, BRK_H / 2 + 8);
          ctx!.fillStyle = "#aaa";
          ctx!.font = "11px monospace";
          ctx!.fillText("enter or tap to retry", BRK_W / 2, BRK_H / 2 + 28);
        } else {
          ctx!.fillText("BREAKOUT", BRK_W / 2, BRK_H / 2 - 14);
          ctx!.font = "12px monospace";
          ctx!.fillStyle = "#aaa";
          ctx!.fillText("enter or tap to start", BRK_W / 2, BRK_H / 2 + 12);
        }
      }
    }

    function tick() {
      const s = stateRef.current;
      if (s.started && !s.dead) {
        // Paddle movement
        if (mouseX !== null) {
          s.padX = Math.max(0, Math.min(BRK_W - PAD_W, mouseX - PAD_W / 2));
        }
        if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a")) s.padX = Math.max(0, s.padX - 5);
        if (keysRef.current.has("ArrowRight") || keysRef.current.has("d")) s.padX = Math.min(BRK_W - PAD_W, s.padX + 5);

        // Ball
        s.bx += s.bvx;
        s.by += s.bvy;

        // Wall bounce
        if (s.bx <= 4) { s.bx = 4; s.bvx = Math.abs(s.bvx); }
        if (s.bx >= BRK_W - 4) { s.bx = BRK_W - 4; s.bvx = -Math.abs(s.bvx); }
        if (s.by <= 4) { s.by = 4; s.bvy = Math.abs(s.bvy); }

        // Paddle collision
        if (s.by >= BRK_H - 20 - 4 && s.by <= BRK_H - 20 + PAD_H && s.bx >= s.padX && s.bx <= s.padX + PAD_W && s.bvy > 0) {
          s.bvy = -Math.abs(s.bvy);
          const hitPos = (s.bx - s.padX) / PAD_W - 0.5;
          s.bvx = hitPos * 5;
        }

        // Brick collision
        for (let r = 0; r < BRK_ROWS; r++) {
          for (let c = 0; c < BRK_COLS; c++) {
            if (!s.bricks[r][c]) continue;
            const bx = c * BRICK_W;
            const by2 = BRICK_TOP + r * BRICK_H;
            if (s.bx >= bx && s.bx <= bx + BRICK_W && s.by >= by2 && s.by <= by2 + BRICK_H) {
              s.bricks[r][c] = false;
              s.bvy = -s.bvy;
              s.score += 10;
              setScore(s.score);
              // Check win
              if (s.bricks.every((row) => row.every((b) => !b))) {
                s.bricks = initBricks();
                resetBall();
              }
            }
          }
        }

        // Ball out
        if (s.by > BRK_H) {
          s.lives--;
          setLives(s.lives);
          if (s.lives <= 0) {
            s.dead = true;
          } else {
            resetBall();
          }
        }
      }
      draw();
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); canvas.removeEventListener("mousemove", handleMouse); };
  }, [resetBall, fullReset]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === "Enter" || e.key === " ") {
        const s = stateRef.current;
        if (!s.started || s.dead) fullReset();
      }
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [fullReset]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: BRK_W, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--text-faint)" }}>// breakout</span>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--text)", fontWeight: 600 }}>score: {score} | ♥{lives}</span>
      </div>
      <canvas ref={canvasRef} width={BRK_W} height={BRK_H}
        style={{ border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", display: "block" }}
        onClick={() => { const s = stateRef.current; if (!s.started || s.dead) fullReset(); }}
      />
      <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--text-faint)" }}>mouse or arrow keys to move paddle</p>
    </div>
  );
}

// ─── Tic-Tac-Toe ──────────────────────────────────────────────
type Cell = "X" | "O" | null;
type Board = Cell[];

const WINS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function checkWin(board: Board): { winner: Cell; line: number[] | null } {
  for (const combo of WINS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combo };
    }
  }
  return { winner: null, line: null };
}

function minimax(board: Board, isMax: boolean): number {
  const { winner } = checkWin(board);
  if (winner === "O") return 10;
  if (winner === "X") return -10;
  if (board.every((c) => c !== null)) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "O";
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "X";
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function aiMove(board: Board): number {
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = "O";
      const score = minimax(board, false);
      board[i] = null;
      if (score > bestScore) { bestScore = score; move = i; }
    }
  }
  return move;
}

const TTT_SIZE = 300;
const TTT_CELL = TTT_SIZE / 3;

function TicTacToeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [winLine, setWinLine] = useState<number[] | null>(null);

  const reset = useCallback(() => {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setResult(null);
    setWinLine(null);
  }, []);

  // Draw board
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, TTT_SIZE, TTT_SIZE);

    // Grid lines
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(i * TTT_CELL, 0); ctx.lineTo(i * TTT_CELL, TTT_SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * TTT_CELL); ctx.lineTo(TTT_SIZE, i * TTT_CELL); ctx.stroke();
    }

    // Draw X and O
    for (let i = 0; i < 9; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const cx = col * TTT_CELL + TTT_CELL / 2;
      const cy = row * TTT_CELL + TTT_CELL / 2;
      if (board[i] === "X") {
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 3;
        const off = 25;
        ctx.beginPath(); ctx.moveTo(cx - off, cy - off); ctx.lineTo(cx + off, cy + off); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + off, cy - off); ctx.lineTo(cx - off, cy + off); ctx.stroke();
      } else if (board[i] === "O") {
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, 25, 0, Math.PI * 2); ctx.stroke();
      }
    }

    // Win line
    if (winLine) {
      const [a, , c] = winLine;
      const ax = (a % 3) * TTT_CELL + TTT_CELL / 2;
      const ay = Math.floor(a / 3) * TTT_CELL + TTT_CELL / 2;
      const cx2 = (c % 3) * TTT_CELL + TTT_CELL / 2;
      const cy2 = Math.floor(c / 3) * TTT_CELL + TTT_CELL / 2;
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(cx2, cy2); ctx.stroke();
    }

    // Result overlay
    if (gameOver && result) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, TTT_SIZE, TTT_SIZE);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px monospace";
      ctx.textAlign = "center";
      ctx.fillText(result, TTT_SIZE / 2, TTT_SIZE / 2 - 10);
      ctx.font = "12px monospace";
      ctx.fillStyle = "#aaa";
      ctx.fillText("tap to play again", TTT_SIZE / 2, TTT_SIZE / 2 + 16);
    }
  }, [board, winLine, gameOver, result]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameOver) { reset(); return; }
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / TTT_CELL);
    const row = Math.floor(y / TTT_CELL);
    const idx = row * 3 + col;
    if (board[idx] !== null) return;

    const newBoard = [...board];
    newBoard[idx] = "X";

    const { winner, line } = checkWin(newBoard);
    if (winner) {
      setBoard(newBoard);
      setWinLine(line);
      setResult("you win!");
      setGameOver(true);
      return;
    }
    if (newBoard.every((c) => c !== null)) {
      setBoard(newBoard);
      setResult("draw");
      setGameOver(true);
      return;
    }

    // AI turn
    const ai = aiMove(newBoard);
    if (ai >= 0) newBoard[ai] = "O";
    const { winner: w2, line: l2 } = checkWin(newBoard);
    if (w2) {
      setBoard(newBoard);
      setWinLine(l2);
      setResult("AI wins!");
      setGameOver(true);
      return;
    }
    if (newBoard.every((c) => c !== null)) {
      setBoard(newBoard);
      setResult("draw");
      setGameOver(true);
      return;
    }
    setBoard(newBoard);
  }, [board, gameOver, reset]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: TTT_SIZE, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--text-faint)" }}>// tic-tac-toe</span>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--text)", fontWeight: 600 }}>
          <span style={{ color: "#22c55e" }}>X</span> you vs <span style={{ color: "#3b82f6" }}>O</span> ai
        </span>
      </div>
      <canvas ref={canvasRef} width={TTT_SIZE} height={TTT_SIZE}
        style={{ border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", display: "block" }}
        onClick={handleClick}
      />
      <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--text-faint)" }}>click to place X</p>
    </div>
  );
}

// ─── Game Cards ───────────────────────────────────────────────
interface GameCard {
  id: string;
  icon: string;
  name: string;
  description: string;
}

const GAMES: GameCard[] = [
  { id: "snake", icon: "🐍", name: "snake", description: "classic snake · arrow keys / wasd" },
  { id: "pong", icon: "🏓", name: "pong", description: "player vs AI · W/S to move" },
  { id: "breakout", icon: "🧱", name: "breakout", description: "break all bricks · 3 lives" },
  { id: "tictactoe", icon: "❌", name: "tic-tac-toe", description: "X vs O · minimax AI" },
];

function GameCardButton({ game, onClick }: { game: GameCard; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8,
        padding: "20px", borderRadius: 8, border: "1px solid var(--border)",
        background: "var(--bg-surface)", cursor: "pointer", textAlign: "left",
        width: "100%", transition: "border-color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-hover)";
        e.currentTarget.style.background = "var(--bg-surface-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.background = "var(--bg-surface)";
      }}
    >
      <span style={{ fontSize: 28 }}>{game.icon}</span>
      <div>
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{game.name}</p>
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--text-faint)" }}>{game.description}</p>
      </div>
      <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--text-faint)", marginTop: 4 }}>play →</span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────
type Phase = "boot" | "room" | "snake" | "pong" | "breakout" | "tictactoe";

export default function Games() {
  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("mw-console-booted")) {
      return "room";
    }
    return "boot";
  });

  const handleBootComplete = useCallback(() => {
    if (typeof window !== "undefined") sessionStorage.setItem("mw-console-booted", "1");
    setPhase("room");
  }, []);

  const activeGame = phase !== "boot" && phase !== "room" ? phase : null;

  return (
    <div style={{ padding: "32px 24px", minHeight: "100vh" }}>
      <AnimatePresence mode="wait">
        {phase === "boot" && (
          <MWBoot key="boot" onComplete={handleBootComplete} />
        )}
      </AnimatePresence>

      {phase !== "boot" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--text-faint)", marginBottom: 6 }}>// game room</p>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>mr.wallace console</h1>
          </div>

          {/* Game grid or active game */}
          <AnimatePresence mode="wait">
            {!activeGame && (
              <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12,
                  maxWidth: 480,
                }}>
                  {GAMES.map((g) => (
                    <GameCardButton key={g.id} game={g} onClick={() => setPhase(g.id as Phase)} />
                  ))}
                </div>
                <button
                  onClick={() => {
                    sessionStorage.removeItem("mw-console-booted");
                    setPhase("boot");
                  }}
                  style={{
                    marginTop: 16, padding: "8px 14px", borderRadius: 6,
                    border: "1px solid var(--border)", background: "transparent",
                    cursor: "pointer", fontFamily: "var(--font-geist-mono)",
                    fontSize: 11, color: "var(--text-faint)",
                  }}
                >
                  ↺ replay boot
                </button>
              </motion.div>
            )}

            {activeGame && (
              <motion.div key={activeGame} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <button
                  onClick={() => setPhase("room")}
                  style={{
                    marginBottom: 16, padding: "7px 12px", borderRadius: 6,
                    border: "1px solid var(--border)", background: "transparent",
                    cursor: "pointer", fontFamily: "var(--font-geist-mono)",
                    fontSize: 11, color: "var(--text-faint)",
                  }}
                >
                  ← back
                </button>
                {activeGame === "snake" && <SnakeGame />}
                {activeGame === "pong" && <PongGame />}
                {activeGame === "breakout" && <BreakoutGame />}
                {activeGame === "tictactoe" && <TicTacToeGame />}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
