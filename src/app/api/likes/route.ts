import { NextRequest, NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = body.slug;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    const res = await supabaseFetch("mrwallace_likes", {
      method: "POST",
      body: JSON.stringify({ article_slug: slug }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "failed to add like" }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
}
