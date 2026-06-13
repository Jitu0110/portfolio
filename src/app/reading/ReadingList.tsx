"use client";

import { motion } from "framer-motion";
import { readings } from "@/lib/readings";

export default function ReadingList() {
  return (
    <ol className="space-y-3">
      {readings.map((item, i) => (
        <motion.li
          key={item.url}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
        >
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/[0.04] transition-all duration-300"
          >
            <span className="text-white/20 font-mono text-sm pt-0.5 w-6 shrink-0 text-right">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-white font-semibold group-hover:text-blue-300 transition-colors">
                  {item.title}
                </h2>
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    item.type === "Paper"
                      ? "text-red-300 border-red-500/30 bg-red-500/5"
                      : "text-blue-300 border-blue-500/30 bg-blue-500/5"
                  }`}
                >
                  {item.type}
                </span>
              </div>
              <p className="text-white/40 text-sm">
                {item.source}
                {item.note && <span className="text-white/30"> — {item.note}</span>}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-white/30 text-xs font-mono whitespace-nowrap">{item.date}</p>
              <span className="text-white/20 group-hover:text-blue-400 text-sm transition-colors">
                ↗
              </span>
            </div>
          </a>
        </motion.li>
      ))}
    </ol>
  );
}
