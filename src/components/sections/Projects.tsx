"use client";

import { motion } from "framer-motion";
import SectionWrapper, { SectionTitle } from "@/components/ui/SectionWrapper";
import GlowBadge from "@/components/ui/GlowBadge";
import { Project } from "@/types";

const projects: Project[] = [
  {
    title: "ResumeOptimizer",
    description:
      "An AI-driven tool that tailors a résumé to any job description in under 10 seconds, cutting manual tailoring time by over 70%.",
    tech: ["Python", "RAG", "LangChain", "GPT-4", "Gemini", "Streamlit"],
    highlights: [
      "Extracts keywords and matches skills against the job posting",
      "Generates targeted suggestions to improve alignment",
      "LLM-agnostic pipeline supporting GPT-4 and Gemini",
    ],
    link: "https://github.com/Jitu0110/SikeResume",
  },
  {
    title: "RL MuJoCo",
    description:
      "Deep reinforcement learning agents trained to walk, run and stand up in MuJoCo physics environments — Humanoid, Ant, HalfCheetah and HumanoidStandup.",
    tech: ["Python", "PyTorch", "Stable-Baselines3", "Gymnasium", "MuJoCo"],
    highlights: [
      "Implemented and compared SAC, PPO and A2C across four environments",
      "Hyperparameter tuning of learning rate and discount factor for optimized policies",
      "Custom reward shaping in sub-environments to steer agent behavior",
    ],
    link: "https://github.com/Jitu0110/RLMujoco",
  },
  {
    title: "AI Business Intelligence Agent",
    description:
      "An internal enterprise agent at Medifast that lets any employee query company data in natural language — no SQL, no waiting on engineering.",
    tech: ["LLMs", "RAG", "Tool Calling", "Vector DBs", "Node.js"],
    highlights: [
      "Compares coach performance and analyzes revenue trends conversationally",
      "RAG over enterprise data with tool-calling for live queries",
      "Reduced ad-hoc analytics requests to engineering teams",
    ],
  },
  {
    title: "RoomieMatch",
    description:
      "A cross-functional iOS app that simplifies roommate discovery with Tinder-style swipe mechanics and personalized match suggestions.",
    tech: ["SwiftUI", "Firebase", "Java", "Spring Boot", "MongoDB"],
    highlights: [
      "Swipe-based matching with personalized suggestions",
      "Secure REST APIs for matching, groups and chat",
      "Full-stack: native iOS frontend, Spring Boot backend",
    ],
    link: "https://github.com/pksp99/RoomieMatch",
  },
];

export default function Projects() {
  return (
    <SectionWrapper id="projects">
      <SectionTitle accent="What I've Built">Projects</SectionTitle>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group flex flex-col p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/[0.03] transition-all duration-300 cursor-default"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/50" />
              <h3 className="text-white font-bold text-lg group-hover:text-blue-300 transition-colors">
                {project.title}
              </h3>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-xs text-white/40 hover:text-blue-400 border border-white/10 hover:border-blue-500/40 rounded-md px-2 py-1 transition-all"
                >
                  GitHub ↗
                </a>
              )}
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-5 flex-1">{project.description}</p>

            <ul className="space-y-2 mb-5">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-white/40 text-xs">
                  <span className="text-blue-500 shrink-0">✓</span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 rounded-md bg-white/5 text-white/40 border border-white/10"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
