import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "missing slug" }, { status: 400 });
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/mrwallace_comments?article_slug=eq.${encodeURIComponent(slug)}&order=created_at.asc`,
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
  const { slug, author_name, content } = body;

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "invalid slug" }, { status: 400 });
  }
  if (!author_name || typeof author_name !== "string" || author_name.length > 50) {
    return NextResponse.json({ error: "invalid name" }, { status: 400 });
  }
  if (!content || typeof content !== "string" || content.length > 1000) {
    return NextResponse.json({ error: "invalid content" }, { status: 400 });
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/mrwallace_comments`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      article_slug: slug,
      author_name,
      content,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "insert failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
