import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

const VALID_GAMES = ["snake", "pong", "breakout", "tictactoe", "tetris", "2048", "flappy", "invaders"];

export async function GET(req: NextRequest) {
  const game = req.nextUrl.searchParams.get("game");
  if (!game || !VALID_GAMES.includes(game)) {
    return NextResponse.json({ error: "invalid game" }, { status: 400 });
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/scores?game=eq.${game}&order=score.desc&limit=10`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    },
  );

  if (!res.ok) {
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { game, name, score } = body;

  if (!game || !VALID_GAMES.includes(game)) {
    return NextResponse.json({ error: "invalid game" }, { status: 400 });
  }
  if (!name || typeof name !== "string" || name.length > 12) {
    return NextResponse.json({ error: "invalid name" }, { status: 400 });
  }
  if (typeof score !== "number" || score < 0) {
    return NextResponse.json({ error: "invalid score" }, { status: 400 });
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ game, name, score }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "insert failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
