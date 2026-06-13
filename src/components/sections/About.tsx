"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionWrapper, { SectionTitle } from "@/components/ui/SectionWrapper";

const cards = [
  {
    icon: "⚡",
    title: "Full Stack Engineering",
    body: "Building business-critical applications end to end — React, Next.js and TypeScript frontends with Node.js, Spring Boot and FastAPI backends.",
  },
  {
    icon: "🤖",
    title: "AI & GenAI",
    body: "Shipped an enterprise AI business-intelligence agent using LLMs, RAG, tool calling and vector databases — letting teams query company data in plain English.",
  },
  {
    icon: "☁️",
    title: "Cloud & DevOps",
    body: "Serverless and containerized systems on AWS (Lambda, Redshift, API Gateway) and GCP, with Docker, Kubernetes and GitHub Actions CI/CD.",
  },
  {
    icon: "🎯",
    title: "Products at Scale",
    body: "Led the beta launch of Connect-Web onboarding 25,000+ coaches with Okta OIDC auth, and built REST APIs at Neustar handling millions of requests daily.",
  },
];

export default function About() {
  return (
    <SectionWrapper id="about">
      <SectionTitle accent="Who I am">About Me</SectionTitle>

      <div className="grid lg:grid-cols-[320px_1fr] gap-8 items-start mb-10">
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
          <p className="text-white/70 leading-relaxed">
            I&apos;m Jitendra — most people call me Jitu. I&apos;m a Software Engineer at{" "}
            <span className="text-blue-300">Medifast Inc.</span> in Seattle, where I build
            full-stack applications and AI-powered tools used by 25,000+ health coaches every day.
          </p>
          <p className="text-white/50 leading-relaxed text-sm">
            Before this, I spent two years at <span className="text-white/70">Neustar (a TransUnion company) </span> building
            identity products and microservices that handled millions of requests daily. I hold a
            Master&apos;s in Computer Engineering from <span className="text-white/70">Syracuse University</span>.
          </p>
          <p className="text-white/50 leading-relaxed text-sm">
            Lately I&apos;m deep in the GenAI space — LLMs, RAG pipelines, agentic workflows — and
            I love building products where that power meets a clean, fast user experience.
            When I&apos;m not shipping code, I&apos;m probably out on a weekend hike, planning my
            next road trip, or chasing another national park off my list.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="https://www.linkedin.com/in/jitendravasishta/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm border border-blue-500/40 text-blue-300 rounded-lg hover:bg-blue-500/10 hover:border-blue-400 transition-all"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/Jitu0110"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm border border-white/20 text-white/70 rounded-lg hover:bg-white/5 hover:border-white/40 transition-all"
            >
              GitHub
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

      <div className="grid md:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="text-3xl mb-4">{card.icon}</div>
            <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-300 transition-colors">
              {card.title}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed">{card.body}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
