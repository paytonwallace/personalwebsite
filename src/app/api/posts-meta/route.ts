import { NextRequest, NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const slugsParam = req.nextUrl.searchParams.get("slugs");
  if (!slugsParam) {
    return NextResponse.json({});
  }

  const slugs = slugsParam.split(",").filter(Boolean);
  if (slugs.length === 0) {
    return NextResponse.json({});
  }

  const result: Record<string, { likes: number; comments: number }> = {};

  // Fetch all likes and comments in two parallel queries
  const slugFilter = slugs.map((s) => `"${s}"`).join(",");

  const [likesRes, commentsRes] = await Promise.all([
    supabaseFetch(
      `mrwallace_likes?select=article_slug&article_slug=in.(${slugFilter})`,
      { headers: { Prefer: "count=exact" } as Record<string, string> }
    ),
    supabaseFetch(
      `mrwallace_comments?select=article_slug&article_slug=in.(${slugFilter})`,
      { headers: { Prefer: "count=exact" } as Record<string, string> }
    ),
  ]);

  // Initialize all slugs
  for (const slug of slugs) {
    result[slug] = { likes: 0, comments: 0 };
  }

  // Count likes per slug
  if (likesRes.ok) {
    const likesData: { article_slug: string }[] = await likesRes.json();
    for (const row of likesData) {
      if (result[row.article_slug]) {
        result[row.article_slug].likes++;
      }
    }
  }

  // Count comments per slug
  if (commentsRes.ok) {
    const commentsData: { article_slug: string }[] = await commentsRes.json();
    for (const row of commentsData) {
      if (result[row.article_slug]) {
        result[row.article_slug].comments++;
      }
    }
  }

  return NextResponse.json(result);
}
