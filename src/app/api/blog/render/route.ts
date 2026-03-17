import { NextRequest, NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

export async function POST(req: NextRequest) {
  const { content } = await req.json();

  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "missing content" }, { status: 400 });
  }

  const source = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  });

  return NextResponse.json({ source });
}
