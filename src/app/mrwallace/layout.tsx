import type { Metadata } from "next";
import BlogNav from "@/components/blog/BlogNav";

export const metadata: Metadata = {
  title: "writings — Payton Wallace",
  description:
    "From the desk of Mr. Wallace. Tactical writing on building AI second brains, tools, frameworks, and lessons from the field.",
  alternates: { canonical: "https://paytonwallace.com/mrwallace" },
  openGraph: {
    title: "writings — Payton Wallace",
    description:
      "From the desk of Mr. Wallace. Tactical writing on building AI second brains, tools, frameworks, and lessons from the field.",
    url: "https://paytonwallace.com/mrwallace",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "writings — Payton Wallace",
    description:
      "From the desk of Mr. Wallace. Tactical writing on building AI second brains, tools, frameworks, and lessons from the field.",
  },
};

export default function MrWallaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-layout-root">
      <BlogNav />
      <div className="blog-main-content">{children}</div>
    </div>
  );
}
