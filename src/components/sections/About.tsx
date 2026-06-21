"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

export default function About() {
  return (
    <SectionWrapper id="about" className="pt-8 pb-24">
      <div className="grid lg:grid-cols-[320px_1fr] gap-8 items-start">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative h-80 lg:h-96 rounded-2xl overflow-hidden border border-white/10 group"
        >
          <Image
            src="/jitendra.jpg"
            alt="Jitendra Vasishta at Big Sur, California"
            fill
            sizes="(max-width: 1024px) 100vw, 320px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: "68% center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="text-white font-semibold">Jitendra Vasishta</p>
            <p className="text-white/60 text-xs">Somewhere in Big Sur, California</p>
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <p className="text-white/60 leading-relaxed text-sm">
            I&apos;m Jitendra — most people call me Jitu. I&apos;m a Software Engineer at{" "}
            <a href="https://medifastinc.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-white font-medium hover:text-blue-300 transition-colors">Medifast Inc.<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" className="w-2 h-2 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3.5 1H11m0 0v7.5M11 1 1 11"/></svg></a> in Seattle, where I build
            full-stack applications and AI-powered tools used by{" "}
            <span className="text-blue-300 font-semibold">25,000+ health coaches</span> every day.
          </p>
          <p className="text-white/60 leading-relaxed text-sm">
            I&apos;m also part of the core AI initiative team —{" "}
            <span className="text-white font-medium">AI Ninjas</span> — working on integrating AI
            across cross-functional teams in the org. So far we&apos;ve saved{" "}
            <span className="text-blue-300 font-semibold">$40k+ in SaaS subscriptions</span> and
            improved work efficiency by{" "}
            <span className="text-blue-300 font-semibold">70%+</span> across engineering, analytics,
            HR, and other teams.
          </p>
          <p className="text-white/60 leading-relaxed text-sm">
            Before this, I spent two years at{" "}
            <a href="https://home.neustar/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-white font-medium hover:text-blue-300 transition-colors">Neustar<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" className="w-2 h-2 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3.5 1H11m0 0v7.5M11 1 1 11"/></svg></a> where I built the centralized
            file metadata store that helped cross-team ML and Data Engineering teams across the
            Identity resolution pipeline —{" "}
            <span className="text-blue-300 font-semibold">processing 10M+ records daily</span>.
          </p>
          <p className="text-white/40 leading-relaxed text-sm">
            Lately I&apos;m deep in the GenAI space — LLMs, RAG pipelines, agentic workflows — and
            I love building products where that power meets a clean, fast user experience. When
            I&apos;m not shipping code, I&apos;m probably out on a weekend hike, planning my next
            road trip, or chasing another national park off my list.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="https://www.linkedin.com/in/jitendravasishta/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2.5 border border-blue-500/40 text-blue-300 rounded-lg hover:bg-blue-500/10 hover:border-blue-400 transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://github.com/Jitu0110"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-2.5 border border-white/20 text-white/70 rounded-lg hover:bg-white/5 hover:border-white/40 transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm border border-white/20 text-white/70 rounded-lg hover:bg-white/5 hover:border-white/40 transition-all"
            >
              Résumé ↓
            </a>
          </div>
        </motion.div>
      </div>

    </SectionWrapper>
  );
}
