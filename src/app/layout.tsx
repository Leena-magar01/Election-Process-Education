import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/**
 * Inter font loaded via next/font/google for zero-layout-shift,
 * self-hosted font files with optimal caching.
 */
const inter = Inter({ subsets: ["latin"], display: "swap" });

/**
 * SEO and social sharing metadata for the Election Education Assistant.
 * Provides structured data for search engines and social media crawlers.
 */
export const metadata: Metadata = {
  title: "Election Education Assistant | Learn How Elections Work",
  description:
    "Learn how elections work through an interactive, AI-powered chat guide. Understand voter registration, candidate nomination, campaigning, voting day procedures, and election results step by step.",
  keywords: [
    "election education",
    "voting process",
    "democracy",
    "voter registration",
    "election timeline",
    "AI assistant",
    "civic education",
    "Google Cloud",
    "Firebase",
  ],
  authors: [{ name: "Election Education Assistant" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Election Education Assistant | Interactive Democracy Guide",
    description:
      "Your AI-powered interactive guide to understanding elections — from registration to results.",
    type: "website",
    siteName: "Election Education Assistant",
  },
};

/**
 * Viewport configuration for responsive design and mobile optimization.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111827",
};

/**
 * Root layout component for the Election Education Assistant.
 * Provides the HTML document structure, font loading, and global styles.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} The root HTML document structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`h-full antialiased ${inter.className}`}>
        {/* Skip to main content link for keyboard/screen reader accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:outline-none"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
