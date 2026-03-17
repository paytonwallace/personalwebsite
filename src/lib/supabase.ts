const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export async function supabaseFetch(
  path: string,
  options?: RequestInit,
) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string>),
    },
  });
  return res;
}

export async function getLikesCount(slug: string): Promise<number> {
  const res = await supabaseFetch(
    `mrwallace_likes?article_slug=eq.${encodeURIComponent(slug)}&select=id`,
    { headers: { Prefer: "count=exact" } as Record<string, string> }
  );
  const count = res.headers.get("content-range");
  if (count) {
    const total = count.split("/")[1];
    return total === "*" ? 0 : parseInt(total, 10);
  }
  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}

export async function getCommentsCount(slug: string): Promise<number> {
  const res = await supabaseFetch(
    `mrwallace_comments?article_slug=eq.${encodeURIComponent(slug)}&select=id`,
    { headers: { Prefer: "count=exact" } as Record<string, string> }
  );
  const count = res.headers.get("content-range");
  if (count) {
    const total = count.split("/")[1];
    return total === "*" ? 0 : parseInt(total, 10);
  }
  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}

export async function addLike(slug: string): Promise<void> {
  await supabaseFetch("mrwallace_likes", {
    method: "POST",
    body: JSON.stringify({ article_slug: slug }),
  });
}
