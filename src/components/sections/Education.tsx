"use client";

import { motion } from "framer-motion";
import SectionWrapper, { SectionTitle } from "@/components/ui/SectionWrapper";

const education = [
  {
    degree: "Master of Science",
    field: "Computer Engineering",
    university: "Syracuse University",
    years: "2022 – 2024",
    icon: "🎓",
    color: "blue",
  },
  {
    degree: "Bachelor of Engineering",
    field: "Electronics and Communication Engineering",
    university: "PES University, Bangalore",
    years: "2015 – 2019",
    icon: "🏛️",
    color: "white",
  },
];

export default function Education() {
  return (
    <SectionWrapper id="education">
      <SectionTitle accent="Academic Background">Education</SectionTitle>
      <div className="relative max-w-3xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-blue-500 via-blue-500/50 to-transparent hidden md:block" />

        <div className="space-y-8">
          {education.map((edu, i) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="md:pl-16 relative"
            >
              {/* Timeline dot */}
              <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-300 shadow-lg shadow-blue-500/50 hidden md:block -translate-x-1/2" />

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:bg-white/[0.05]">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{edu.icon}</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <h3 className="text-white font-bold text-xl">{edu.degree}</h3>
                      <span className="text-blue-400 text-sm font-mono border border-blue-500/30 px-3 py-1 rounded-full">
                        {edu.years}
                      </span>
                    </div>
                    <p className="text-blue-300 font-medium mb-1">{edu.field}</p>
                    <p className="text-white/50 text-sm">{edu.university}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
