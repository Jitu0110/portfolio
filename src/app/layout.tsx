import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jitendra Vasishta — Software Engineer",
  description:
    "Software Engineer at Medifast in Seattle. Full-stack development, GenAI (LLMs, RAG, agents) and cloud — building scalable software and interactive web experiences.",
  keywords: [
    "Jitendra Vasishta", "Jitu Vasishta", "Software Engineer", "Full Stack Developer",
    "React", "Next.js", "AI", "LLM", "RAG", "Seattle",
  ],
  authors: [{ name: "Jitendra Vasishta" }],
  openGraph: {
    title: "Jitendra Vasishta — Software Engineer",
    description: "Full-stack engineer building AI-powered products at scale.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jitendra Vasishta — Software Engineer",
    description: "Full-stack engineer building AI-powered products at scale.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
