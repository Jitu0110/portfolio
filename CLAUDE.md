# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build
npm run lint     # ESLint
```

No test suite exists.

## Architecture

Single-page portfolio at `src/app/page.tsx` renders all sections in sequence: Hero → About → Education → Experience → TechStack → Projects → GameSection → Footer. There is also a `/reading` route (`src/app/reading/`) that displays a curated reading list.

### Key directories

- `src/components/sections/` — one file per portfolio section (all Server Components unless noted)
- `src/components/ui/` — shared layout pieces (Navbar, Footer, SectionWrapper, GlowBadge)
- `src/features/game/` — the 3D racing game (all Client Components using React Three Fiber / Drei / Three.js)
- `src/hooks/` — `useGameState` (race phase/timer FSM), `useLeaderboard` (fetch/submit scores)
- `src/lib/` — `readings.ts` (static reading list data), `moderation.ts` (profanity filter via `obscenity`), `supabase.ts` (re-exports browser client)
- `src/utils/supabase/` — `client.ts`, `server.ts`, `middleware.ts` (standard Supabase SSR setup)
- `src/types/index.ts` — shared TypeScript interfaces (`GameState`, `LeaderboardEntry`, `RacePhase`, etc.)

### Racing game

`GameSection` lazy-loads `RacingGame` (the root game component). It renders a `<Canvas>` (R3F) containing `Car` and `Track`, with `GameUI` and `LeaderboardModal` as HTML overlays. Game phases: `idle → countdown → racing → finished`. `useGameState` owns the timer and phase FSM; `useLeaderboard` calls the API route.

### Leaderboard API

`src/app/api/leaderboard/route.ts` — GET returns top 10 by `lap_time_ms`; POST validates name (profanity filter + length), lap time (must exceed physics-derived `MIN_POSSIBLE_RACE_MS` from `trackData.ts`), and checkpoint count before inserting into Supabase. Anti-cheat lives here, not client-side.

### Supabase

Requires env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Schema is in `supabase-schema.sql` (single `leaderboard` table with RLS). Server-side routes use `@/utils/supabase/server`; client components use `@/utils/supabase/client` (via `@/lib/supabase`).

### Reading list

`src/lib/readings.ts` is the source of truth — a plain TypeScript array. Append new items to the **end** of the array; the page renders oldest-first.

### Styling

Tailwind CSS v4 (PostCSS plugin, no `tailwind.config`). Dark theme throughout (`bg-black`). Framer Motion for animations. `src/lib/utils.ts` exports `cn()` (clsx + tailwind-merge).
