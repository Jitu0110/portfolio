"use client";

import { motion } from "framer-motion";
import SectionWrapper, { SectionTitle } from "@/components/ui/SectionWrapper";
import GlowBadge from "@/components/ui/GlowBadge";
import { TechCategory } from "@/types";

const categories: TechCategory[] = [
  {
    name: "Languages",
    color: "white",
    techs: ["Java", "Python", "TypeScript", "JavaScript", "C++", "SQL", "Golang"],
  },
  {
    name: "AI / Generative AI",
    color: "red",
    techs: ["LLMs", "RAG", "Agentic Workflows", "Tool Calling", "LangChain", "Prompt Engineering", "Semantic Search"],
  },
  {
    name: "Frontend",
    color: "blue",
    techs: ["React.js", "Next.js", "Tailwind", "Shadcn", "Vite", "Redux Toolkit"],
  },
  {
    name: "Backend",
    color: "blue",
    techs: ["Spring Boot", "FastAPI", "Node.js", "Microservices", "Redis", "PostgreSQL", "MongoDB", "Neo4j", "Elasticsearch"],
  },
  {
    name: "Cloud & DevOps",
    color: "blue",
    techs: ["AWS Lambda", "S3", "EC2", "API Gateway", "Redshift", "CloudFront", "Docker", "Kubernetes", "GitHub Actions"],
  },
  {
    name: "Data Engineering",
    color: "white",
    techs: ["Apache Spark", "Hadoop", "Kafka", "Delta Lake"],
  },
];

export default function TechStack() {
  return (
    <SectionWrapper id="tech">
      <SectionTitle accent="Technologies">Tech Stack</SectionTitle>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, catIdx) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: catIdx * 0.1 }}
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4 text-white/50">
              {cat.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {cat.techs.map((tech, i) => (
                <GlowBadge
                  key={tech}
                  label={tech}
                  color={cat.color as "blue" | "red" | "white"}
                  delay={catIdx * 0.05 + i * 0.04}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
