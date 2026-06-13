"use client";

import { motion } from "framer-motion";
import SectionWrapper, { SectionTitle } from "@/components/ui/SectionWrapper";

const experiences = [
  {
    company: "Medifast",
    website: "https://medifastinc.com/",
    role: "Software Engineer 2",
    period: "Oct 2024 – Present",
    location: "Seattle, WA (Remote)",
    achievements: [
      "Building and maintaining business-critical full-stack applications — React.js, Tailwind and TypeScript frontends with Node.js, AWS Lambda and Amazon Redshift backends — delivering seamless, high-performance customer experiences.",
      "Oversaw the successful beta launch of Connect-Web, orchestrating a staged rollout onboarding 25,000+ coaches; implemented Okta-based authentication and authorization using industry-standard OIDC flows.",
      "Built and deployed an internal AI-powered business intelligence agent using LLMs, RAG, tool calling and vector databases — letting employees query enterprise data in natural language, compare coach performance and analyze revenue trends without relying on engineering for ad-hoc analytics.",
    ],
  },
  {
    company: "Neustar, A TransUnion Company",
    website: "https://home.neustar/",
    role: "Software Engineer",
    period: "Jul 2019 – Jul 2021",
    location: "Bangalore, India",
    achievements: [
      "Led full-stack development for Neustar's OneID products using Java, Spring Boot, Python, Django, React.js and Docker — improving product performance by 25% and streamlining deployments across AWS and GCP.",
      "Architected the Activation Service, a critical microservice in Neustar's IDaaS suite that automates GCP Storage bucket creation and IAM policy generation for data security and access control.",
      "Engineered REST APIs for ETL data ingestion handling millions of requests daily at 95% uptime.",
    ],
  },
];

export default function Experience() {
  return (
    <SectionWrapper id="experience">
      <SectionTitle accent="Career">Work Experience</SectionTitle>
      <div className="max-w-4xl mx-auto space-y-8">
        {experiences.map((exp, expIdx) => (
          <motion.div
            key={exp.company}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{exp.role}</h3>
                {exp.website ? (
                  <a
                    href={exp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 font-semibold text-lg hover:text-blue-300 hover:underline underline-offset-4 transition-colors"
                  >
                    {exp.company} ↗
                  </a>
                ) : (
                  <p className="text-blue-400 font-semibold text-lg">{exp.company}</p>
                )}
                <p className="text-white/40 text-sm mt-1">{exp.location}</p>
              </div>
              <span className="text-sm font-mono text-blue-400 border border-blue-500/30 px-4 py-2 rounded-full bg-blue-500/5 whitespace-nowrap">
                {exp.period}
              </span>
            </div>
            <ul className="space-y-3">
              {exp.achievements.map((achievement, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: expIdx * 0.1 + i * 0.08 }}
                  className="flex gap-3 text-white/60 text-sm leading-relaxed group"
                >
                  <span className="text-blue-500 mt-1 shrink-0">▸</span>
                  <span className="group-hover:text-white/80 transition-colors">{achievement}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
