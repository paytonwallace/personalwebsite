import { notFound } from "next/navigation";
import Script from "next/script";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import ArticleClient from "./ArticleClient";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = `https://paytonwallace.com/mrwallace/${post.slug}`;
  const keywords = [post.category, ...post.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3)];
  return {
    title: `${post.title} — /mrwallace`,
    description: post.excerpt,
    alternates: { canonical: url },
    keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: ["Payton Wallace"],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    author: { "@type": "Person", name: "Payton Wallace" },
    datePublished: new Date(post.date).toISOString(),
    url: `https://paytonwallace.com/mrwallace/${post.slug}`,
    description: post.excerpt,
  };

  return (
    <>
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleClient
        slug={post.slug}
        title={post.title}
        category={post.category}
        date={post.date}
        readTime={post.readTime}
        content={post.content}
      />
    </>
  );
}
