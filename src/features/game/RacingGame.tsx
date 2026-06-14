"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import Car from "./Car";
import Track from "./Track";
import GameUI from "./GameUI";
import LeaderboardModal from "./LeaderboardModal";
import { useGameState } from "@/hooks/useGameState";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { START_POSITION } from "./trackData";
import { RaceSounds } from "./sounds";

export default function RacingGame() {
  const { gameState, startRace, finishRace, resetRace, setTelemetry } = useGameState();
  const { submitting, error, submitScore } = useLeaderboard();
  const wrapRef = useRef<HTMLDivElement>(null);
  const soundsRef = useRef<RaceSounds | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    return () => soundsRef.current?.dispose();
  }, []);

  const handleStart = useCallback(() => {
    if (!soundsRef.current) soundsRef.current = new RaceSounds();
    soundsRef.current.init(); // inside the click — satisfies autoplay policy
    startRace();
    setTimeout(() => wrapRef.current?.focus(), 50);
  }, [startRace]);

  // Phase-driven audio cues
  const prevPhaseRef = useRef(gameState.phase);
  useEffect(() => {
    const s = soundsRef.current;
    const prev = prevPhaseRef.current;
    prevPhaseRef.current = gameState.phase;
    if (!s) return;

    if (gameState.phase === "countdown") s.countdownBeep();
    else if (gameState.phase === "racing" && prev === "countdown") s.go();
    else if (gameState.phase === "finished" && prev === "racing") s.finish();
    else if (gameState.phase === "idle") s.engineOff();
  }, [gameState.phase, gameState.countdown]);

  const handleTelemetry = useCallback(
    (speed: number, progress: number, x: number, z: number) => {
      setTelemetry(speed, progress, x, z);
      soundsRef.current?.setSpeed(speed);
    },
    [setTelemetry]
  );

  const handleToggleMute = useCallback(() => {
    setMuted((m) => {
      soundsRef.current?.setMuted(!m);
      return !m;
    });
  }, []);

  const handleSubmitScore = useCallback(
    async (name: string) => {
      if (!gameState.finalTime) return false;
      return submitScore(name, gameState.finalTime);
    },
    [gameState.finalTime, submitScore]
  );

  const handleCloseModal = useCallback(() => {
    resetRace();
    setTimeout(() => wrapRef.current?.focus(), 50);
  }, [resetRace]);

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      className="relative w-full h-full outline-none"
      onPointerDown={() => wrapRef.current?.focus()}
    >
      <Canvas
        camera={{
          position: [START_POSITION.x + 2, START_POSITION.y + 5, START_POSITION.z + 11],
          fov: 55,
        }}
        shadows
        gl={{ antialias: true }}
        style={{ background: "#05050f" }}
      >
        {/* Night race lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[30, 50, 10]}
          intensity={1.0}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <hemisphereLight args={["#1e3a5f", "#0a120c", 0.4]} />
        <pointLight position={[0, 25, 0]} color="#1d4ed8" intensity={2} distance={120} />
        <pointLight position={[45, 12, -28]} color="#60a5fa" intensity={2} distance={45} />
        <pointLight position={[-42, 10, 0]} color="#60a5fa" intensity={2} distance={45} />
        <Stars radius={130} depth={60} count={2200} factor={3} fade speed={0.4} />
        <fog attach="fog" args={["#05050f", 70, 170]} />

        <Track />

        {gameState.phase !== "idle" && (
          <Car
            phase={gameState.phase}
            onTelemetry={handleTelemetry}
            onFinish={finishRace}
          />
        )}
      </Canvas>

      <GameUI
        gameState={gameState}
        onStart={handleStart}
        muted={muted}
        onToggleMute={handleToggleMute}
      />

      <LeaderboardModal
        isOpen={gameState.phase === "finished"}
        lapTime={gameState.finalTime}
        submitting={submitting}
        error={error}
        onSubmit={handleSubmitScore}
        onClose={handleCloseModal}
      />
    </div>
  );
}
