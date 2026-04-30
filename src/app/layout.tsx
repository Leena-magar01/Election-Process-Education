import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Election Education Assistant",
  description:
    "Learn how elections work through an interactive, AI-powered chat guide. Understand registration, nomination, campaigning, voting, and results step by step.",
  keywords: ["election", "voting", "democracy", "education", "AI assistant"],
  authors: [{ name: "Election Education Assistant" }],
  openGraph: {
    title: "Election Education Assistant",
    description: "Your interactive guide to understanding elections.",
    type: "website",
  },
};

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`h-full antialiased ${inter.className}`}>{children}</body>
    </html>
  );
}
