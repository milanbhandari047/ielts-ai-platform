import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IELTS AI — Smart Mock Test Platform",
  description:
    "AI-powered IELTS preparation with real-time band scoring for Reading, Listening, Writing, and Speaking.",
  keywords: [
    "IELTS",
    "mock test",
    "AI",
    "band score",
    "English test preparation",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
