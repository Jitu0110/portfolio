import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ReadingList from "./ReadingList";

export const metadata: Metadata = {
  title: "Reading — Jitendra Vasishta",
  description: "Technical papers and blog posts I'm reading — AI, agents, cloud, and engineering.",
};

export default function ReadingPage() {
  return (
    <main className="bg-black min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <p className="text-blue-400 text-sm font-mono tracking-[0.3em] uppercase mb-3">
              Bookshelf
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Papers &amp; Blogs I&apos;m Reading
            </h1>
            <p className="text-white/40 leading-relaxed">
              Things I&apos;ve found worth the time — mostly AI, agents, and cloud engineering.
              Newest additions at the bottom.
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-transparent mt-6" />
          </div>

          <ReadingList />
        </div>
      </div>
      <Footer />
    </main>
  );
}
