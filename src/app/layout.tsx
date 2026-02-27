import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Payton Wallace",
  description:
    "CEO Mentor & Strategic Architect. Helping faith-driven founders scale to 7-8 figures.",
  openGraph: {
    title: "Payton Wallace",
    description: "CEO Mentor & Strategic Architect. Helping faith-driven founders scale to 7-8 figures.",
    url: "https://paytonwallace.com",
    siteName: "Payton Wallace",
    images: [
      {
        url: "https://paytonwallace.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Payton Wallace",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Payton Wallace",
    description: "CEO Mentor & Strategic Architect. Helping faith-driven founders scale to 7-8 figures.",
    images: ["https://paytonwallace.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
