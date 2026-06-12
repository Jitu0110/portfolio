"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export default function SectionWrapper({ id, className, children }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={cn("py-24 px-6 max-w-6xl mx-auto", className)}
    >
      {children}
    </motion.section>
  );
}

export function SectionTitle({ children, accent }: { children: ReactNode; accent?: string }) {
  return (
    <div className="mb-16 text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">{children}</h2>
      {accent && (
        <p className="text-blue-400 text-lg font-medium tracking-widest uppercase text-sm">{accent}</p>
      )}
      <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-transparent mx-auto mt-4" />
    </div>
  );
}
