import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

export async function GET() {
  const posts = getAllPosts();
  // Return metadata only (no content)
  const meta = posts.map(({ content: _content, ...rest }) => rest);
  return NextResponse.json(meta);
}
