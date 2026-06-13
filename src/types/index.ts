export interface LeaderboardEntry {
  id: string;
  player_name: string;
  lap_time_ms: number;
  created_at: string;
}

export type RacePhase = "idle" | "countdown" | "racing" | "finished";

export interface GameState {
  phase: RacePhase;
  countdown: number;
  raceTime: number;
  finalTime: number | null;
  speed: number;
  progress: number;
  carX: number;
  carZ: number;
}

export interface TechCategory {
  name: string;
  techs: string[];
  color: string;
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  highlights: string[];
  link?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  achievements: string[];
}
