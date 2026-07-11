"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamic import — avoids SSR issues with Three.js
const RacingGame = dynamic(() => import("@/features/game/RacingGame"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#050510]">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/40 text-sm">Loading game engine...</p>
      </div>
    </div>
  ),
});

export default function GameSection() {
  return (
    <section id="game" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-red-400 text-sm font-mono tracking-[0.3em] uppercase mb-3 block">
            Here's a fun weekend project I'm currently working on!
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Take It For A{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
              Spin
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Complete the circuit and beat the clock.
          </p>
          <p className="text-white/25 text-sm mt-2">
            Best experienced on a laptop or desktop with a keyboard.
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-red-500 to-transparent mx-auto mt-4" />
        </motion.div>

        {/* Game Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl overflow-hidden border border-white/10"
          style={{ height: "520px" }}
        >
          <RacingGame />
        </motion.div>

        {/* Controls info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mt-6"
        >
          {[
            { key: "W / ↑", action: "Accelerate" },
            { key: "S / ↓", action: "Brake" },
            { key: "A / ←", action: "Turn Left" },
            { key: "D / →", action: "Turn Right" },
          ].map((ctrl) => (
            <div key={ctrl.key} className="flex items-center gap-2 text-sm text-white/40">
              <span className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-xs text-white/60">
                {ctrl.key}
              </span>
              <span>{ctrl.action}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
