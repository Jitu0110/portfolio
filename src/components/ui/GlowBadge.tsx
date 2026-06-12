"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowBadgeProps {
  label: string;
  color?: "blue" | "red" | "white";
  delay?: number;
}

export default function GlowBadge({ label, color = "blue", delay = 0 }: GlowBadgeProps) {
  const colorMap = {
    blue: "border-blue-500/40 text-blue-300 hover:border-blue-400 hover:shadow-blue-500/30 hover:text-blue-200",
    red: "border-red-500/40 text-red-300 hover:border-red-400 hover:shadow-red-500/30 hover:text-red-200",
    white: "border-white/20 text-white/70 hover:border-white/50 hover:shadow-white/10 hover:text-white",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.08, y: -2 }}
      transition={{ duration: 0.3, delay }}
      viewport={{ once: true }}
      className={cn(
        "inline-block px-4 py-2 rounded-lg border text-sm font-medium cursor-default",
        "backdrop-blur-sm bg-white/5 transition-all duration-300",
        "hover:shadow-lg",
        colorMap[color]
      )}
    >
      {label}
    </motion.span>
  );
}
