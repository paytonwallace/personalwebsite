"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Leaderboard Types & Helpers ─────────────────────────────
interface ScoreEntry {
  id: number;
  game: string;
  name: string;
  score: number;
  created_at: string;
}

const GAME_NAMES: Record<string, string> = {
  snake: "snake", pong: "pong", breakout: "breakout", tictactoe: "tic-tac-toe",
  tetris: "tetris", "2048": "2048", flappy: "flappy", invaders: "invaders",
};

async function fetchScores(game: string): Promise<ScoreEntry[]> {
  try {
    const res = await fetch(`/api/scores?game=${game}`);
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

async function submitScore(game: string, name: string, score: number): Promise<boolean> {
  try {
    const res = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game, name, score }),
    });
    return res.ok;
  } catch { return false; }
}

// ─── Leaderboard Panel ───────────────────────────────────────
function LeaderboardPanel({ game, onBack, onPlayAgain, message }: {
  game: string;
  onBack: () => void;
  onPlayAgain?: () => void;
  message?: string;
}) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchScores(game).then((s) => { setScores(s); setLoading(false); });
  }, [game]);

  return (
    <div style={{
      background: "#0a0a0a", border: "1px solid var(--border)", borderRadius: 8,
      padding: "24px", maxWidth: 400, width: "100%", fontFamily: "var(--font-geist-mono)",
    }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: message ? 8 : 16 }}>
        {GAME_NAMES[game] || game} — top 10
      </p>
      {message && (
        <p style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 12, fontStyle: "italic" }}>
          {message}
        </p>
      )}
      {loading ? (
        <p style={{ fontSize: 12, color: "var(--text-faint)" }}>loading...</p>
      ) : scores.length === 0 ? (
        <p style={{ fontSize: 12, color: "var(--text-faint)" }}>no scores yet. be the first!</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ color: "var(--text-faint)", fontSize: 11 }}>
              <th style={{ textAlign: "left", padding: "4px 0", fontWeight: 400 }}>#</th>
              <th style={{ textAlign: "left", padding: "4px 0", fontWeight: 400 }}>name</th>
              <th style={{ textAlign: "right", padding: "4px 0", fontWeight: 400 }}>score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr key={s.id} style={{ background: i % 2 === 0 ? "transparent" : "#111" }}>
                <td style={{
                  padding: "6px 8px 6px 0",
                  color: i < 3 ? "#B5945A" : "var(--text-faint)",
                  fontWeight: i < 3 ? 700 : 400,
                }}>{i + 1}</td>
                <td style={{ padding: "6px 0", color: "var(--text)" }}>{s.name}</td>
                <td style={{ padding: "6px 0", textAlign: "right", color: "var(--text)" }}>{s.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button onClick={onBack} style={{
          padding: "7px 12px", borderRadius: 6, border: "1px solid var(--border)",
          background: "transparent", cursor: "pointer", fontFamily: "var(--font-geist-mono)",
          fontSize: 11, color: "var(--text-faint)",
        }}>
          ← back to game room
        </button>
        {onPlayAgain && (
          <button onClick={onPlayAgain} style={{
            padding: "7px 12px", borderRadius: 6, border: "1px solid var(--border)",
            background: "transparent", cursor: "pointer", fontFamily: "var(--font-geist-mono)",
            fontSize: 11, color: "var(--text-faint)",
          }}>
            play again
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Score Submit Form ───────────────────────────────────────
function ScoreSubmitForm({ game, score, onDone, onSkip }: {
  game: string;
  score: number;
  onDone: () => void;
  onSkip: () => void;
}) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    await submitScore(game, name.trim(), score);
    setSubmitting(false);
    onDone();
  };

  return (
    <div style={{
      background: "#0a0a0a", border: "1px solid var(--border)", borderRadius: 8,
      padding: "20px", maxWidth: 320, width: "100%", fontFamily: "var(--font-geist-mono)",
    }}>
      <p style={{ fontSize: 13, color: "var(--text)", marginBottom: 4 }}>
        score: <span style={{ color: "#eab308", fontWeight: 700 }}>{score}</span>
      </p>
      <p style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 12 }}>submit to leaderboard</p>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          maxLength={12}
          placeholder="your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          style={{
            flex: 1, padding: "6px 10px", borderRadius: 4,
            border: "1px solid var(--border)", background: "#1a1a1a",
            fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "#fff",
            outline: "none",
          }}
        />
        <button onClick={handleSubmit} disabled={submitting || !name.trim()} style={{
          padding: "6px 12px", borderRadius: 4, border: "1px solid var(--border)",
          background: submitting ? "#333" : "#1a1a1a", cursor: "pointer",
          fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#fff",
          opacity: submitting || !name.trim() ? 0.5 : 1,
        }}>
          {submitting ? "..." : "submit"}
        </button>
      </div>
      <button onClick={onSkip} style={{
        marginTop: 8, background: "none", border: "none", cursor: "pointer",
        fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--text-faint)",
        padding: 0, textDecoration: "underline",
      }}>
        skip → view leaderboard
      </button>
    </div>
  );
}

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

function SnakeGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
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
      onGameOver?.(s.score);
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

function PongGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
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
        if (s.bx < 0) {
          s.aScore++;
          setScores({ p: s.pScore, a: s.aScore });
          if (s.aScore >= 7) { s.paused = true; onGameOver?.(s.pScore); }
          else resetBall(1);
        }
        if (s.bx > PONG_W) {
          s.pScore++;
          setScores({ p: s.pScore, a: s.aScore });
          if (s.pScore >= 7) { s.paused = true; onGameOver?.(s.pScore); }
          else resetBall(-1);
        }
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

function BreakoutGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
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
            onGameOver?.(s.score);
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

// ─── Tetris ───────────────────────────────────────────────────
const TET_COLS = 12;
const TET_ROWS = 24;
const TET_CELL = 20;

const TETROMINOES: { shape: number[][]; color: string }[] = [
  { shape: [[1,1,1,1]], color: "#06b6d4" },           // I
  { shape: [[1,1],[1,1]], color: "#eab308" },          // O
  { shape: [[0,1,0],[1,1,1]], color: "#a855f7" },      // T
  { shape: [[0,1,1],[1,1,0]], color: "#22c55e" },      // S
  { shape: [[1,1,0],[0,1,1]], color: "#ef4444" },      // Z
  { shape: [[1,0,0],[1,1,1]], color: "#3b82f6" },      // J
  { shape: [[0,0,1],[1,1,1]], color: "#f97316" },      // L
];

interface TetState {
  grid: (string | null)[][];
  piece: { shape: number[][]; color: string; x: number; y: number };
  next: number;
  score: number;
  lines: number;
  level: number;
  over: boolean;
  started: boolean;
}

function randomPiece() {
  const idx = Math.floor(Math.random() * TETROMINOES.length);
  const t = TETROMINOES[idx];
  return { shape: t.shape.map(r => [...r]), color: t.color, x: Math.floor(TET_COLS / 2) - 1, y: 0 };
}

function collides(grid: (string | null)[][], shape: number[][], px: number, py: number) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nx = px + c, ny = py + r;
      if (nx < 0 || nx >= TET_COLS || ny >= TET_ROWS) return true;
      if (ny >= 0 && grid[ny][nx]) return true;
    }
  }
  return false;
}

function rotateShape(shape: number[][]) {
  const rows = shape.length, cols = shape[0].length;
  const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      rotated[c][rows - 1 - r] = shape[r][c];
  return rotated;
}

function ghostY(grid: (string | null)[][], piece: TetState["piece"]) {
  let gy = piece.y;
  while (!collides(grid, piece.shape, piece.x, gy + 1)) gy++;
  return gy;
}

function TetrisGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<TetState>({
    grid: Array.from({ length: TET_ROWS }, () => Array(TET_COLS).fill(null)),
    piece: randomPiece(),
    next: Math.floor(Math.random() * TETROMINOES.length),
    score: 0, lines: 0, level: 1, over: false, started: false,
  });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    stateRef.current = {
      grid: Array.from({ length: TET_ROWS }, () => Array(TET_COLS).fill(null)),
      piece: randomPiece(),
      next: Math.floor(Math.random() * TETROMINOES.length),
      score: 0, lines: 0, level: 1, over: false, started: true,
    };
    setScore(0);
    setLevel(1);
  }, []);

  const lock = useCallback(() => {
    const s = stateRef.current;
    const { shape, color, x, y } = s.piece;
    for (let r = 0; r < shape.length; r++)
      for (let c = 0; c < shape[r].length; c++)
        if (shape[r][c] && y + r >= 0) s.grid[y + r][x + c] = color;
    // Clear lines
    let cleared = 0;
    for (let r = TET_ROWS - 1; r >= 0; r--) {
      if (s.grid[r].every(c => c !== null)) {
        s.grid.splice(r, 1);
        s.grid.unshift(Array(TET_COLS).fill(null));
        cleared++;
        r++;
      }
    }
    const pts = [0, 100, 300, 500, 800];
    s.score += (pts[cleared] || 0) * s.level;
    s.lines += cleared;
    s.level = Math.floor(s.lines / 10) + 1;
    setScore(s.score);
    setLevel(s.level);
    // Next piece
    const t = TETROMINOES[s.next];
    s.piece = { shape: t.shape.map(r => [...r]), color: t.color, x: Math.floor(TET_COLS / 2) - 1, y: 0 };
    s.next = Math.floor(Math.random() * TETROMINOES.length);
    if (collides(s.grid, s.piece.shape, s.piece.x, s.piece.y)) {
      s.over = true;
      onGameOver?.(s.score);
    }
  }, [onGameOver]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    const W = TET_COLS * TET_CELL + 100;
    const H = TET_ROWS * TET_CELL;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, W, H);
    // Grid lines
    ctx.strokeStyle = "#151515";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= TET_COLS; x++) { ctx.beginPath(); ctx.moveTo(x * TET_CELL, 0); ctx.lineTo(x * TET_CELL, H); ctx.stroke(); }
    for (let y = 0; y <= TET_ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * TET_CELL); ctx.lineTo(TET_COLS * TET_CELL, y * TET_CELL); ctx.stroke(); }
    // Placed blocks
    for (let r = 0; r < TET_ROWS; r++)
      for (let c = 0; c < TET_COLS; c++)
        if (s.grid[r][c]) {
          ctx.fillStyle = s.grid[r][c]!;
          ctx.fillRect(c * TET_CELL + 1, r * TET_CELL + 1, TET_CELL - 2, TET_CELL - 2);
        }
    if (s.started && !s.over) {
      // Ghost
      const gy = ghostY(s.grid, s.piece);
      ctx.globalAlpha = 0.2;
      for (let r = 0; r < s.piece.shape.length; r++)
        for (let c = 0; c < s.piece.shape[r].length; c++)
          if (s.piece.shape[r][c]) {
            ctx.fillStyle = s.piece.color;
            ctx.fillRect((s.piece.x + c) * TET_CELL + 1, (gy + r) * TET_CELL + 1, TET_CELL - 2, TET_CELL - 2);
          }
      ctx.globalAlpha = 1;
      // Active piece
      for (let r = 0; r < s.piece.shape.length; r++)
        for (let c = 0; c < s.piece.shape[r].length; c++)
          if (s.piece.shape[r][c]) {
            ctx.fillStyle = s.piece.color;
            ctx.fillRect((s.piece.x + c) * TET_CELL + 1, (s.piece.y + r) * TET_CELL + 1, TET_CELL - 2, TET_CELL - 2);
          }
    }
    // Next piece preview
    const nx = TET_COLS * TET_CELL + 10;
    ctx.fillStyle = "#666";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.fillText("NEXT", nx, 20);
    const nt = TETROMINOES[s.next];
    for (let r = 0; r < nt.shape.length; r++)
      for (let c = 0; c < nt.shape[r].length; c++)
        if (nt.shape[r][c]) {
          ctx.fillStyle = nt.color;
          ctx.fillRect(nx + c * 16 + 1, 30 + r * 16 + 1, 14, 14);
        }
    // Overlays
    if (!s.started) {
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      ctx.fillRect(0, 0, TET_COLS * TET_CELL, H);
      ctx.fillStyle = "#a855f7";
      ctx.font = "bold 22px monospace";
      ctx.textAlign = "center";
      ctx.fillText("TETRIS", TET_COLS * TET_CELL / 2, H / 2 - 20);
      ctx.fillStyle = "#fff";
      ctx.font = "13px monospace";
      ctx.fillText("press enter to start", TET_COLS * TET_CELL / 2, H / 2 + 14);
    }
    if (s.over) {
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillRect(0, 0, TET_COLS * TET_CELL, H);
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 22px monospace";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", TET_COLS * TET_CELL / 2, H / 2 - 20);
      ctx.fillStyle = "#eab308";
      ctx.font = "15px monospace";
      ctx.fillText(`score: ${s.score}`, TET_COLS * TET_CELL / 2, H / 2 + 10);
      ctx.fillStyle = "#fff";
      ctx.font = "12px monospace";
      ctx.fillText("enter to retry", TET_COLS * TET_CELL / 2, H / 2 + 34);
    }
  }, []);

  // Game loop
  useEffect(() => {
    let cancelled = false;
    function loop() {
      if (cancelled) return;
      const s = stateRef.current;
      if (s.started && !s.over) {
        if (!collides(s.grid, s.piece.shape, s.piece.x, s.piece.y + 1)) {
          s.piece.y++;
        } else {
          lock();
        }
      }
      draw();
      const speed = Math.max(100, 500 - (s.level - 1) * 40);
      tickRef.current = setTimeout(loop, speed);
    }
    draw();
    tickRef.current = setTimeout(loop, 500);
    return () => { cancelled = true; if (tickRef.current) clearTimeout(tickRef.current); };
  }, [draw, lock]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === "Enter") { if (!s.started || s.over) { reset(); return; } }
      if (!s.started || s.over) return;
      if (e.key === "ArrowLeft") {
        if (!collides(s.grid, s.piece.shape, s.piece.x - 1, s.piece.y)) s.piece.x--;
      } else if (e.key === "ArrowRight") {
        if (!collides(s.grid, s.piece.shape, s.piece.x + 1, s.piece.y)) s.piece.x++;
      } else if (e.key === "ArrowDown") {
        if (!collides(s.grid, s.piece.shape, s.piece.x, s.piece.y + 1)) s.piece.y++;
      } else if (e.key === "ArrowUp") {
        const rotated = rotateShape(s.piece.shape);
        if (!collides(s.grid, rotated, s.piece.x, s.piece.y)) s.piece.shape = rotated;
      } else if (e.key === " ") {
        s.piece.y = ghostY(s.grid, s.piece);
        lock();
      }
      draw();
      e.preventDefault();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [reset, draw, lock]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: TET_COLS * TET_CELL + 100, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--text-faint)" }}>// tetris.exe</span>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--text)", fontWeight: 600 }}>score: {score} · lvl {level}</span>
      </div>
      <canvas ref={canvasRef} width={TET_COLS * TET_CELL + 100} height={TET_ROWS * TET_CELL}
        style={{ border: "1px solid var(--border)", borderRadius: 4, display: "block" }}
        onClick={() => { const s = stateRef.current; if (!s.started || s.over) reset(); }}
      />
      <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--text-faint)" }}>← → move · ↑ rotate · ↓ soft drop · space hard drop</p>
    </div>
  );
}

// ─── 2048 ─────────────────────────────────────────────────────
const G48_SIZE = 4;
const G48_CELL = 100;
const G48_GAP = 8;
const G48_W = G48_SIZE * G48_CELL + (G48_SIZE + 1) * G48_GAP;

const TILE_COLORS: Record<number, { bg: string; fg: string }> = {
  2: { bg: "#1a2e1a", fg: "#4ade80" },
  4: { bg: "#1e3a1e", fg: "#86efac" },
  8: { bg: "#2d4a1e", fg: "#a3e635" },
  16: { bg: "#3a4a1e", fg: "#facc15" },
  32: { bg: "#4a3a1e", fg: "#fb923c" },
  64: { bg: "#4a2e1e", fg: "#f97316" },
  128: { bg: "#4a3a2e", fg: "#fbbf24" },
  256: { bg: "#4a4a1e", fg: "#fde047" },
  512: { bg: "#3a4a2e", fg: "#a3e635" },
  1024: { bg: "#2e4a3a", fg: "#34d399" },
  2048: { bg: "#1e4a4a", fg: "#22d3ee" },
};

interface G48State {
  grid: number[][];
  score: number;
  won: boolean;
  over: boolean;
  started: boolean;
  continued: boolean;
}

function emptyGrid48(): number[][] {
  return Array.from({ length: G48_SIZE }, () => Array(G48_SIZE).fill(0));
}

function spawnTile(grid: number[][]) {
  const empty: [number, number][] = [];
  for (let r = 0; r < G48_SIZE; r++)
    for (let c = 0; c < G48_SIZE; c++)
      if (grid[r][c] === 0) empty.push([r, c]);
  if (empty.length === 0) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function canMove48(grid: number[][]): boolean {
  for (let r = 0; r < G48_SIZE; r++)
    for (let c = 0; c < G48_SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c < G48_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < G48_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  return false;
}

function slideLine(line: number[]): { result: number[]; score: number } {
  const filtered = line.filter(v => v !== 0);
  let sc = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const val = filtered[i] * 2;
      merged.push(val);
      sc += val;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i++;
    }
  }
  while (merged.length < G48_SIZE) merged.push(0);
  return { result: merged, score: sc };
}

function move48(grid: number[][], dir: string): { grid: number[][]; score: number; moved: boolean } {
  const g = grid.map(r => [...r]);
  let totalScore = 0;
  let moved = false;

  if (dir === "left" || dir === "right") {
    for (let r = 0; r < G48_SIZE; r++) {
      const line = dir === "right" ? [...g[r]].reverse() : [...g[r]];
      const { result, score: sc } = slideLine(line);
      const final = dir === "right" ? result.reverse() : result;
      if (final.some((v, i) => v !== g[r][i])) moved = true;
      g[r] = final;
      totalScore += sc;
    }
  } else {
    for (let c = 0; c < G48_SIZE; c++) {
      const col = Array.from({ length: G48_SIZE }, (_, r) => g[r][c]);
      const line = dir === "down" ? [...col].reverse() : [...col];
      const { result, score: sc } = slideLine(line);
      const final = dir === "down" ? result.reverse() : result;
      if (final.some((v, i) => v !== g[i][c])) moved = true;
      for (let r = 0; r < G48_SIZE; r++) g[r][c] = final[r];
      totalScore += sc;
    }
  }
  return { grid: g, score: totalScore, moved };
}

function Game2048({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<G48State>({
    grid: emptyGrid48(), score: 0, won: false, over: false, started: false, continued: false,
  });
  const [score, setScore] = useState(0);
  const [overlay, setOverlay] = useState<string | null>(null);

  const initGame = useCallback(() => {
    const g = emptyGrid48();
    spawnTile(g);
    spawnTile(g);
    stateRef.current = { grid: g, score: 0, won: false, over: false, started: true, continued: false };
    setScore(0);
    setOverlay(null);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, G48_W, G48_W);
    // Grid bg
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.roundRect(0, 0, G48_W, G48_W, 8);
    ctx.fill();

    for (let r = 0; r < G48_SIZE; r++)
      for (let c = 0; c < G48_SIZE; c++) {
        const x = G48_GAP + c * (G48_CELL + G48_GAP);
        const y = G48_GAP + r * (G48_CELL + G48_GAP);
        const val = s.grid[r][c];
        const colors = val ? (TILE_COLORS[val] || { bg: "#4a1e4a", fg: "#e879f9" }) : { bg: "#1a1a1a", fg: "#333" };
        ctx.fillStyle = colors.bg;
        ctx.beginPath();
        ctx.roundRect(x, y, G48_CELL, G48_CELL, 6);
        ctx.fill();
        if (val) {
          ctx.fillStyle = colors.fg;
          ctx.font = val >= 1024 ? "bold 24px monospace" : val >= 128 ? "bold 28px monospace" : "bold 32px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(val), x + G48_CELL / 2, y + G48_CELL / 2);
        }
      }

    if (!s.started) {
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      ctx.fillRect(0, 0, G48_W, G48_W);
      ctx.fillStyle = "#eab308";
      ctx.font = "bold 28px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("2048", G48_W / 2, G48_W / 2 - 20);
      ctx.fillStyle = "#fff";
      ctx.font = "13px monospace";
      ctx.fillText("press enter to start", G48_W / 2, G48_W / 2 + 16);
    }
  }, []);

  useEffect(() => { draw(); }, [draw, score, overlay]);

  const doMove = useCallback((dir: string) => {
    const s = stateRef.current;
    if (!s.started || s.over) return;
    if (s.won && !s.continued) return;
    const { grid: ng, score: sc, moved } = move48(s.grid, dir);
    if (!moved) return;
    s.grid = ng;
    s.score += sc;
    setScore(s.score);
    spawnTile(s.grid);
    // Check win
    if (!s.won && s.grid.some(row => row.some(v => v >= 2048))) {
      s.won = true;
      setOverlay("won");
    }
    // Check game over
    if (!canMove48(s.grid)) {
      s.over = true;
      setOverlay("over");
      onGameOver?.(s.score);
    }
    draw();
  }, [draw]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === "Enter") {
        if (!s.started || s.over) { initGame(); return; }
        if (s.won && !s.continued) { s.continued = true; setOverlay(null); draw(); return; }
      }
      const dirMap: Record<string, string> = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
      const dir = dirMap[e.key];
      if (dir) { doMove(dir); e.preventDefault(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [initGame, doMove, draw]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: G48_W, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--text-faint)" }}>// 2048.exe</span>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--text)", fontWeight: 600 }}>score: {score}</span>
      </div>
      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef} width={G48_W} height={G48_W}
          style={{ border: "1px solid var(--border)", borderRadius: 4, display: "block" }}
          onClick={() => { const s = stateRef.current; if (!s.started || s.over) initGame(); }}
        />
        {overlay === "won" && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            borderRadius: 4,
          }}>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 24, fontWeight: 700, color: "#eab308" }}>you won!</p>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "#aaa", marginTop: 8 }}>press enter to continue</p>
          </div>
        )}
        {overlay === "over" && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            borderRadius: 4,
          }}>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 22, fontWeight: 700, color: "#ef4444" }}>game over</p>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "#eab308", marginTop: 4 }}>score: {score}</p>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "#aaa", marginTop: 8 }}>enter to retry</p>
          </div>
        )}
      </div>
      <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--text-faint)" }}>arrow keys to slide tiles</p>
    </div>
  );
}

// ─── Flappy Bird ──────────────────────────────────────────────
const FLP_W = 400;
const FLP_H = 500;
const GRAVITY = 0.25;
const FLAP_VEL = -5.5;
const PIPE_W = 50;
const PIPE_GAP = 160;
const PIPE_SPEED = 2.0;

interface FlpPipe { x: number; gapY: number; scored: boolean }

interface FlpState {
  birdY: number; birdVel: number;
  pipes: FlpPipe[];
  score: number; highScore: number;
  over: boolean; started: boolean;
  frame: number;
  groundX: number;
}

function FlappyGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<FlpState>({
    birdY: FLP_H / 2 - 50, birdVel: 0,
    pipes: [], score: 0, highScore: 0,
    over: false, started: false, frame: 0, groundX: 0,
  });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const reset = useCallback(() => {
    const hs = stateRef.current.highScore;
    stateRef.current = {
      birdY: FLP_H / 2 - 50, birdVel: 0,
      pipes: [], score: 0, highScore: hs,
      over: false, started: true, frame: 0, groundX: 0,
    };
    setScore(0);
  }, []);

  const flap = useCallback(() => {
    const s = stateRef.current;
    if (s.over) { reset(); return; }
    if (!s.started) { reset(); return; }
    s.birdVel = FLAP_VEL;
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    const GROUND_H = 40;
    const BIRD_X = 80;
    const BIRD_SIZE = 16;

    function draw() {
      const s = stateRef.current;
      // Sky
      ctx!.fillStyle = "#0a0a0a";
      ctx!.fillRect(0, 0, FLP_W, FLP_H);
      // Stars (parallax bg)
      ctx!.fillStyle = "#1a1a1a";
      for (let i = 0; i < 30; i++) {
        const sx = ((i * 137 + s.frame * 0.2) % (FLP_W + 20)) - 10;
        const sy = (i * 73) % (FLP_H - GROUND_H);
        ctx!.fillRect(sx, sy, 2, 2);
      }
      // Pipes
      for (const pipe of s.pipes) {
        ctx!.fillStyle = "#16a34a";
        // Top pipe
        ctx!.fillRect(pipe.x, 0, PIPE_W, pipe.gapY);
        ctx!.fillStyle = "#22c55e";
        ctx!.fillRect(pipe.x - 3, pipe.gapY - 16, PIPE_W + 6, 16);
        // Bottom pipe
        ctx!.fillStyle = "#16a34a";
        ctx!.fillRect(pipe.x, pipe.gapY + PIPE_GAP, PIPE_W, FLP_H - GROUND_H - pipe.gapY - PIPE_GAP);
        ctx!.fillStyle = "#22c55e";
        ctx!.fillRect(pipe.x - 3, pipe.gapY + PIPE_GAP, PIPE_W + 6, 16);
      }
      // Ground
      ctx!.fillStyle = "#1a1a1a";
      ctx!.fillRect(0, FLP_H - GROUND_H, FLP_W, GROUND_H);
      ctx!.fillStyle = "#333";
      for (let i = -1; i < FLP_W / 20 + 1; i++) {
        const gx = (i * 20 - (s.groundX % 20));
        ctx!.fillRect(gx, FLP_H - GROUND_H, 10, 3);
      }
      // Bird
      const by = s.birdY;
      ctx!.fillStyle = "#eab308";
      ctx!.fillRect(BIRD_X - BIRD_SIZE / 2, by - BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
      // Wing
      const wingUp = Math.sin(s.frame * 0.3) > 0;
      ctx!.fillStyle = "#facc15";
      ctx!.fillRect(BIRD_X - BIRD_SIZE / 2 - 4, by + (wingUp ? -6 : 2), 6, 6);
      // Eye
      ctx!.fillStyle = "#fff";
      ctx!.fillRect(BIRD_X + 3, by - 5, 5, 5);
      ctx!.fillStyle = "#000";
      ctx!.fillRect(BIRD_X + 5, by - 4, 2, 3);

      // Overlays
      if (!s.started) {
        ctx!.fillStyle = "rgba(0,0,0,0.7)";
        ctx!.fillRect(0, 0, FLP_W, FLP_H);
        ctx!.fillStyle = "#eab308";
        ctx!.font = "bold 24px monospace";
        ctx!.textAlign = "center";
        ctx!.fillText("FLAPPY", FLP_W / 2, FLP_H / 2 - 20);
        ctx!.fillStyle = "#fff";
        ctx!.font = "13px monospace";
        ctx!.fillText("space or click to flap", FLP_W / 2, FLP_H / 2 + 14);
      }
      if (s.over) {
        ctx!.fillStyle = "rgba(0,0,0,0.75)";
        ctx!.fillRect(0, 0, FLP_W, FLP_H);
        ctx!.fillStyle = "#ef4444";
        ctx!.font = "bold 24px monospace";
        ctx!.textAlign = "center";
        ctx!.fillText("GAME OVER", FLP_W / 2, FLP_H / 2 - 30);
        ctx!.fillStyle = "#eab308";
        ctx!.font = "16px monospace";
        ctx!.fillText(`score: ${s.score}`, FLP_W / 2, FLP_H / 2);
        ctx!.fillStyle = "#aaa";
        ctx!.font = "12px monospace";
        ctx!.fillText(`best: ${s.highScore}`, FLP_W / 2, FLP_H / 2 + 20);
        ctx!.fillStyle = "#fff";
        ctx!.font = "12px monospace";
        ctx!.fillText("space or click to retry", FLP_W / 2, FLP_H / 2 + 46);
      }
    }

    function tick() {
      const s = stateRef.current;
      if (s.started && !s.over) {
        s.birdVel += GRAVITY;
        s.birdY += s.birdVel;
        s.frame++;
        s.groundX += PIPE_SPEED;
        // Spawn pipes
        if (s.pipes.length === 0 || s.pipes[s.pipes.length - 1].x < FLP_W - 200) {
          const gapY = 80 + Math.random() * (FLP_H - 80 - PIPE_GAP - 60);
          s.pipes.push({ x: FLP_W, gapY, scored: false });
        }
        // Move pipes
        for (const pipe of s.pipes) {
          pipe.x -= PIPE_SPEED;
          if (!pipe.scored && pipe.x + PIPE_W < BIRD_X) {
            pipe.scored = true;
            s.score++;
            setScore(s.score);
          }
        }
        s.pipes = s.pipes.filter(p => p.x > -PIPE_W);
        // Collisions
        const BIRD_R = 8;
        const bx = BIRD_X, by = s.birdY;
        // Ground/ceiling
        if (by + BIRD_R >= FLP_H - 40 || by - BIRD_R <= 0) {
          s.over = true;
          if (s.score > s.highScore) { s.highScore = s.score; setHighScore(s.highScore); }
          onGameOver?.(s.score);
        }
        // Pipes
        for (const pipe of s.pipes) {
          if (bx + BIRD_R > pipe.x && bx - BIRD_R < pipe.x + PIPE_W) {
            if (by - BIRD_R < pipe.gapY || by + BIRD_R > pipe.gapY + PIPE_GAP) {
              s.over = true;
              if (s.score > s.highScore) { s.highScore = s.score; setHighScore(s.highScore); }
              onGameOver?.(s.score);
            }
          }
        }
      }
      draw();
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reset, onGameOver]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") { flap(); e.preventDefault(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [flap]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: FLP_W, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--text-faint)" }}>// flappy.exe</span>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--text)", fontWeight: 600 }}>score: {score} · best: {highScore}</span>
      </div>
      <canvas ref={canvasRef} width={FLP_W} height={FLP_H}
        style={{ border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", display: "block" }}
        onClick={flap}
      />
      <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--text-faint)" }}>space or click to flap</p>
    </div>
  );
}

// ─── Space Invaders ───────────────────────────────────────────
const INV_W = 480;
const INV_H = 400;
const INV_COLS = 10;
const INV_ROWS = 4;
const ALIEN_W = 28;
const ALIEN_H = 20;
const ALIEN_PAD = 10;
const PLAYER_W = 30;
const PLAYER_H = 16;
const BULLET_SPEED = 5;
const ALIEN_BULLET_SPEED = 3;

interface Alien { x: number; y: number; type: number; alive: boolean }
interface Bullet { x: number; y: number; active: boolean }
interface Shield { x: number; y: number; pixels: boolean[][] }

interface InvState {
  player: number;
  aliens: Alien[];
  alienDx: number;
  alienSpeed: number;
  bullets: Bullet[];
  alienBullets: Bullet[];
  shields: Shield[];
  score: number;
  lives: number;
  over: boolean;
  won: boolean;
  started: boolean;
  wave: number;
  moveTimer: number;
}

function createAliens(): Alien[] {
  const aliens: Alien[] = [];
  const startX = 40;
  const startY = 50;
  for (let r = 0; r < INV_ROWS; r++)
    for (let c = 0; c < INV_COLS; c++)
      aliens.push({
        x: startX + c * (ALIEN_W + ALIEN_PAD),
        y: startY + r * (ALIEN_H + ALIEN_PAD),
        type: r === 0 ? 2 : r === 1 ? 1 : 0,
        alive: true,
      });
  return aliens;
}

function createShields(): Shield[] {
  const shields: Shield[] = [];
  const sw = 36, sh = 24;
  for (let i = 0; i < 4; i++) {
    const x = 60 + i * 105;
    shields.push({
      x, y: INV_H - 80,
      pixels: Array.from({ length: sh }, () => Array(sw).fill(true)),
    });
  }
  return shields;
}

function InvadersGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<InvState>({
    player: INV_W / 2 - PLAYER_W / 2,
    aliens: createAliens(), alienDx: 1, alienSpeed: 30,
    bullets: [], alienBullets: [],
    shields: createShields(),
    score: 0, lives: 3, over: false, won: false, started: false,
    wave: 1, moveTimer: 0,
  });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const keysRef = useRef<Set<string>>(new Set());

  const reset = useCallback(() => {
    stateRef.current = {
      player: INV_W / 2 - PLAYER_W / 2,
      aliens: createAliens(), alienDx: 1, alienSpeed: 30,
      bullets: [], alienBullets: [],
      shields: createShields(),
      score: 0, lives: 3, over: false, won: false, started: true,
      wave: 1, moveTimer: 0,
    };
    setScore(0);
    setLives(3);
  }, []);

  const nextWave = useCallback(() => {
    const s = stateRef.current;
    s.wave++;
    s.aliens = createAliens();
    s.alienDx = 1;
    s.alienSpeed = Math.max(10, 30 - (s.wave - 1) * 4);
    s.bullets = [];
    s.alienBullets = [];
    s.shields = createShields();
    s.won = false;
    s.moveTimer = 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;

    function draw() {
      const s = stateRef.current;
      ctx!.fillStyle = "#0a0a0a";
      ctx!.fillRect(0, 0, INV_W, INV_H);

      // Shields
      for (const sh of s.shields) {
        ctx!.fillStyle = "#22c55e";
        for (let r = 0; r < sh.pixels.length; r++)
          for (let c = 0; c < sh.pixels[r].length; c++)
            if (sh.pixels[r][c])
              ctx!.fillRect(sh.x + c * 2, sh.y + r * 2, 2, 2);
      }

      // Aliens
      const alienColors = ["#22c55e", "#3b82f6", "#a855f7"];
      for (const a of s.aliens) {
        if (!a.alive) continue;
        ctx!.fillStyle = alienColors[a.type];
        ctx!.fillRect(a.x + 4, a.y, ALIEN_W - 8, ALIEN_H - 4);
        ctx!.fillRect(a.x, a.y + 4, ALIEN_W, ALIEN_H - 8);
        ctx!.fillRect(a.x + 2, a.y + ALIEN_H - 6, 4, 4);
        ctx!.fillRect(a.x + ALIEN_W - 6, a.y + ALIEN_H - 6, 4, 4);
        ctx!.fillStyle = "#0a0a0a";
        ctx!.fillRect(a.x + 8, a.y + 6, 4, 4);
        ctx!.fillRect(a.x + ALIEN_W - 12, a.y + 6, 4, 4);
      }

      // Player
      ctx!.fillStyle = "#fff";
      ctx!.fillRect(s.player, INV_H - 36, PLAYER_W, PLAYER_H);
      ctx!.fillRect(s.player + PLAYER_W / 2 - 2, INV_H - 42, 4, 6);

      // Player bullets
      ctx!.fillStyle = "#eab308";
      for (const b of s.bullets) if (b.active) ctx!.fillRect(b.x - 1, b.y, 2, 8);

      // Alien bullets
      ctx!.fillStyle = "#ef4444";
      for (const b of s.alienBullets) if (b.active) ctx!.fillRect(b.x - 1, b.y, 2, 8);

      // Lives
      ctx!.fillStyle = "#666";
      ctx!.font = "10px monospace";
      ctx!.textAlign = "left";
      ctx!.fillText("\u2665".repeat(s.lives), 6, INV_H - 6);

      // Overlays
      if (!s.started) {
        ctx!.fillStyle = "rgba(0,0,0,0.75)";
        ctx!.fillRect(0, 0, INV_W, INV_H);
        ctx!.fillStyle = "#22c55e";
        ctx!.font = "bold 22px monospace";
        ctx!.textAlign = "center";
        ctx!.fillText("SPACE INVADERS", INV_W / 2, INV_H / 2 - 20);
        ctx!.fillStyle = "#fff";
        ctx!.font = "13px monospace";
        ctx!.fillText("press enter to start", INV_W / 2, INV_H / 2 + 14);
      }
      if (s.over) {
        ctx!.fillStyle = "rgba(0,0,0,0.8)";
        ctx!.fillRect(0, 0, INV_W, INV_H);
        ctx!.fillStyle = "#ef4444";
        ctx!.font = "bold 22px monospace";
        ctx!.textAlign = "center";
        ctx!.fillText("GAME OVER", INV_W / 2, INV_H / 2 - 20);
        ctx!.fillStyle = "#eab308";
        ctx!.font = "15px monospace";
        ctx!.fillText(`score: ${s.score}`, INV_W / 2, INV_H / 2 + 10);
        ctx!.fillStyle = "#fff";
        ctx!.font = "12px monospace";
        ctx!.fillText("enter to retry", INV_W / 2, INV_H / 2 + 34);
      }
    }

    function tick() {
      const s = stateRef.current;
      if (s.started && !s.over) {
        // Player movement
        if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a")) s.player = Math.max(0, s.player - 4);
        if (keysRef.current.has("ArrowRight") || keysRef.current.has("d")) s.player = Math.min(INV_W - PLAYER_W, s.player + 4);

        // Player bullets
        for (const b of s.bullets) {
          if (!b.active) continue;
          b.y -= BULLET_SPEED;
          if (b.y < 0) { b.active = false; continue; }
          for (const a of s.aliens) {
            if (!a.alive) continue;
            if (b.x >= a.x && b.x <= a.x + ALIEN_W && b.y >= a.y && b.y <= a.y + ALIEN_H) {
              a.alive = false;
              b.active = false;
              s.score += (a.type + 1) * 10;
              setScore(s.score);
              break;
            }
          }
          if (!b.active) continue;
          for (const sh of s.shields) {
            const lx = Math.floor((b.x - sh.x) / 2);
            const ly = Math.floor((b.y - sh.y) / 2);
            if (lx >= 0 && lx < sh.pixels[0].length && ly >= 0 && ly < sh.pixels.length && sh.pixels[ly][lx]) {
              sh.pixels[ly][lx] = false;
              if (ly > 0) sh.pixels[ly - 1][lx] = false;
              if (ly + 1 < sh.pixels.length) sh.pixels[ly + 1][lx] = false;
              b.active = false;
              break;
            }
          }
        }
        s.bullets = s.bullets.filter(b => b.active);

        // Alien bullets
        for (const b of s.alienBullets) {
          if (!b.active) continue;
          b.y += ALIEN_BULLET_SPEED;
          if (b.y > INV_H) { b.active = false; continue; }
          if (b.x >= s.player && b.x <= s.player + PLAYER_W && b.y >= INV_H - 42 && b.y <= INV_H - 20) {
            b.active = false;
            s.lives--;
            setLives(s.lives);
            if (s.lives <= 0) { s.over = true; onGameOver?.(s.score); }
          }
          if (!b.active) continue;
          for (const sh of s.shields) {
            const lx = Math.floor((b.x - sh.x) / 2);
            const ly = Math.floor((b.y - sh.y) / 2);
            if (lx >= 0 && lx < sh.pixels[0].length && ly >= 0 && ly < sh.pixels.length && sh.pixels[ly][lx]) {
              sh.pixels[ly][lx] = false;
              if (ly > 0) sh.pixels[ly - 1][lx] = false;
              if (ly + 1 < sh.pixels.length) sh.pixels[ly + 1][lx] = false;
              b.active = false;
              break;
            }
          }
        }
        s.alienBullets = s.alienBullets.filter(b => b.active);

        // Alien movement
        s.moveTimer++;
        if (s.moveTimer >= s.alienSpeed) {
          s.moveTimer = 0;
          let hitEdge = false;
          const liveAliens = s.aliens.filter(a => a.alive);
          for (const a of liveAliens) {
            if ((a.x + ALIEN_W + s.alienDx * 8 > INV_W - 5) || (a.x + s.alienDx * 8 < 5)) {
              hitEdge = true;
              break;
            }
          }
          if (hitEdge) {
            s.alienDx = -s.alienDx;
            for (const a of liveAliens) a.y += ALIEN_H;
          } else {
            for (const a of liveAliens) a.x += s.alienDx * 8;
          }

          if (liveAliens.length > 0 && s.alienBullets.filter(b => b.active).length < 3) {
            const shooter = liveAliens[Math.floor(Math.random() * liveAliens.length)];
            s.alienBullets.push({ x: shooter.x + ALIEN_W / 2, y: shooter.y + ALIEN_H, active: true });
          }

          for (const a of liveAliens) {
            if (a.y + ALIEN_H >= INV_H - 50) {
              s.over = true;
              onGameOver?.(s.score);
              break;
            }
          }
        }

        // Check win
        if (s.aliens.every(a => !a.alive)) {
          nextWave();
        }
      }
      draw();
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reset, nextWave]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      const s = stateRef.current;
      if (e.key === "Enter") { if (!s.started || s.over) reset(); }
      if (e.key === " " && s.started && !s.over) {
        if (s.bullets.filter(b => b.active).length < 3) {
          s.bullets.push({ x: s.player + PLAYER_W / 2, y: INV_H - 42, active: true });
        }
      }
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [reset]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: INV_W, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--text-faint)" }}>// invaders.exe</span>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--text)", fontWeight: 600 }}>score: {score} · ♥{lives}</span>
      </div>
      <canvas ref={canvasRef} width={INV_W} height={INV_H}
        style={{ border: "1px solid var(--border)", borderRadius: 4, display: "block" }}
        onClick={() => { const s = stateRef.current; if (!s.started || s.over) reset(); }}
      />
      <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--text-faint)" }}>← → move · space shoot</p>
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
  { id: "tetris", icon: "🧩", name: "tetris", description: "7 tetrominoes · ghost piece" },
  { id: "2048", icon: "🔢", name: "2048", description: "slide & merge to 2048" },
  { id: "flappy", icon: "🐤", name: "flappy", description: "tap to flap · dodge pipes" },
  { id: "invaders", icon: "👾", name: "invaders", description: "defend earth · 4 waves" },
];

function GameCardButton({ game, onClick, onViewScores }: { game: GameCard; onClick: () => void; onViewScores: () => void }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8,
      padding: "20px", borderRadius: 8, border: "1px solid var(--border)",
      background: "var(--bg-surface)", textAlign: "left", width: "100%",
      transition: "border-color 0.15s, background 0.15s", cursor: "pointer",
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-hover)";
        e.currentTarget.style.background = "var(--bg-surface-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.background = "var(--bg-surface)";
      }}
      onClick={onClick}
    >
      <span style={{ fontSize: 28 }}>{game.icon}</span>
      <div>
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{game.name}</p>
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--text-faint)" }}>{game.description}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: 4 }}>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--text-faint)" }}>play →</span>
        {game.id !== "tictactoe" && (
          <span
            onClick={(e) => { e.stopPropagation(); onViewScores(); }}
            style={{
              fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--text-faint)",
              cursor: "pointer", textDecoration: "underline",
            }}
          >
            view scores →
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
type Phase = "boot" | "room" | "snake" | "pong" | "breakout" | "tictactoe" | "tetris" | "2048" | "flappy" | "invaders";
type ScoreFlow = "none" | "submit" | "leaderboard";

export default function Games() {
  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("mw-console-booted")) {
      return "room";
    }
    return "boot";
  });
  const [scoreFlow, setScoreFlow] = useState<ScoreFlow>("none");
  const [lastScore, setLastScore] = useState(0);
  const [leaderboardGame, setLeaderboardGame] = useState<string | null>(null);
  const [leaderboardMessage, setLeaderboardMessage] = useState<string | undefined>(undefined);
  const gameOverFired = useRef(false);

  const handleBootComplete = useCallback(() => {
    if (typeof window !== "undefined") sessionStorage.setItem("mw-console-booted", "1");
    setPhase("room");
  }, []);

  const activeGame = phase !== "boot" && phase !== "room" ? phase : null;

  const handleGameOver = useCallback(async (game: string, score: number) => {
    if (gameOverFired.current) return;
    gameOverFired.current = true;
    setLastScore(score);
    setLeaderboardGame(game);
    const top10 = await fetchScores(game);
    const qualifies = top10.length < 10 || score > top10[top10.length - 1].score;
    if (qualifies) {
      setLeaderboardMessage(undefined);
      setScoreFlow("submit");
    } else {
      setLeaderboardMessage("you didn't crack the top 10 — keep going");
      setScoreFlow("leaderboard");
    }
  }, []);

  const handlePlayAgain = useCallback(() => {
    setScoreFlow("none");
    setLeaderboardGame(null);
    setLeaderboardMessage(undefined);
    gameOverFired.current = false;
    // Re-mount game by toggling phase
    const current = phase;
    setPhase("room");
    setTimeout(() => setPhase(current), 10);
  }, [phase]);

  const handleBackToRoom = useCallback(() => {
    setScoreFlow("none");
    setLeaderboardGame(null);
    setLeaderboardMessage(undefined);
    gameOverFired.current = false;
    setPhase("room");
  }, []);

  // Reset gameOverFired when switching games
  useEffect(() => {
    gameOverFired.current = false;
    setScoreFlow("none");
    setLeaderboardGame(null);
    setLeaderboardMessage(undefined);
  }, [phase]);

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

          {/* Leaderboard overlay on game room */}
          {phase === "room" && leaderboardGame && (
            <div style={{
              position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.8)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }} onClick={() => setLeaderboardGame(null)}>
              <div onClick={(e) => e.stopPropagation()}>
                <LeaderboardPanel game={leaderboardGame} onBack={() => setLeaderboardGame(null)} />
              </div>
            </div>
          )}

          {/* Game grid or active game */}
          <AnimatePresence mode="wait">
            {!activeGame && (
              <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12,
                  maxWidth: 640,
                }}>
                  {GAMES.map((g) => (
                    <GameCardButton
                      key={g.id}
                      game={g}
                      onClick={() => setPhase(g.id as Phase)}
                      onViewScores={() => setLeaderboardGame(g.id)}
                    />
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
                  onClick={handleBackToRoom}
                  style={{
                    marginBottom: 16, padding: "7px 12px", borderRadius: 6,
                    border: "1px solid var(--border)", background: "transparent",
                    cursor: "pointer", fontFamily: "var(--font-geist-mono)",
                    fontSize: 11, color: "var(--text-faint)",
                  }}
                >
                  ← back
                </button>

                {scoreFlow === "none" && (
                  <>
                    {activeGame === "snake" && <SnakeGame onGameOver={(s) => handleGameOver("snake", s)} />}
                    {activeGame === "pong" && <PongGame onGameOver={(s) => handleGameOver("pong", s)} />}
                    {activeGame === "breakout" && <BreakoutGame onGameOver={(s) => handleGameOver("breakout", s)} />}
                    {activeGame === "tictactoe" && <TicTacToeGame />}
                    {activeGame === "tetris" && <TetrisGame onGameOver={(s) => handleGameOver("tetris", s)} />}
                    {activeGame === "2048" && <Game2048 onGameOver={(s) => handleGameOver("2048", s)} />}
                    {activeGame === "flappy" && <FlappyGame onGameOver={(s) => handleGameOver("flappy", s)} />}
                    {activeGame === "invaders" && <InvadersGame onGameOver={(s) => handleGameOver("invaders", s)} />}
                  </>
                )}

                {scoreFlow === "submit" && leaderboardGame && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 24 }}>
                    <ScoreSubmitForm
                      game={leaderboardGame}
                      score={lastScore}
                      onDone={() => { setLeaderboardMessage(undefined); setScoreFlow("leaderboard"); }}
                      onSkip={() => { setLeaderboardMessage(undefined); setScoreFlow("leaderboard"); }}
                    />
                  </div>
                )}

                {scoreFlow === "leaderboard" && leaderboardGame && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 24 }}>
                    <LeaderboardPanel
                      game={leaderboardGame}
                      onBack={handleBackToRoom}
                      onPlayAgain={handlePlayAgain}
                      message={leaderboardMessage}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
