"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { GameState } from "@/types";

const INITIAL: GameState = {
  phase: "idle",
  countdown: 3,
  raceTime: 0,
  finalTime: null,
  speed: 0,
  progress: 0,
  carX: 0,
  carZ: 0,
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(INITIAL);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const finishedRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    timerRef.current = null;
    countdownRef.current = null;
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const startRace = useCallback(() => {
    clearTimers();
    finishedRef.current = false;
    setGameState({ ...INITIAL, phase: "countdown", countdown: 3 });

    let count = 3;
    countdownRef.current = setInterval(() => {
      count--;
      if (count > 0) {
        setGameState((prev) => ({ ...prev, countdown: count }));
      } else {
        if (countdownRef.current) clearInterval(countdownRef.current);
        startTimeRef.current = Date.now();
        setGameState((prev) => ({ ...prev, phase: "racing", countdown: 0 }));
        timerRef.current = setInterval(() => {
          setGameState((prev) =>
            prev.phase === "racing"
              ? { ...prev, raceTime: Date.now() - startTimeRef.current }
              : prev
          );
        }, 47);
      }
    }, 1000);
  }, [clearTimers]);

  const finishRace = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearTimers();
    const final = Date.now() - startTimeRef.current;
    setGameState((prev) => ({
      ...prev,
      phase: "finished",
      finalTime: final,
      raceTime: final,
    }));
  }, [clearTimers]);

  const resetRace = useCallback(() => {
    clearTimers();
    finishedRef.current = false;
    setGameState(INITIAL);
  }, [clearTimers]);

  const setTelemetry = useCallback(
    (speed: number, progress: number, carX: number, carZ: number) => {
      setGameState((prev) =>
        prev.phase === "racing" ? { ...prev, speed, progress, carX, carZ } : prev
      );
    },
    []
  );

  return { gameState, startRace, finishRace, resetRace, setTelemetry };
}
