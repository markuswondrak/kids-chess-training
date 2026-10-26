import puzzleData from '../data/puzzles.json'
import type { MessageKey } from '../i18n'

/**
 * Ein Lichess-Puzzle. `fen` ist die Stellung VOR dem Gegnerzug:
 * moves[0] spielt der Gegner automatisch vor, danach wechseln sich
 * Kind (moves[1], moves[3], …) und Gegner (moves[2], …) ab.
 */
export type Motif = 'mateIn1' | 'mateIn2' | 'hanging' | 'fork' | 'pin' | 'skewer' | 'discovered'

export interface Puzzle {
  id: string
  fen: string
  moves: string[]
  rating: number
  themes: string[]
  motif: Motif
}

/** Welten mit Daten und Spielbetrieb. */
export type WorldId = 'burgdorf' | 'finsterwald' | 'nebelsumpf' | 'frostgipfel' | 'glutvulkan'

/** Alle geplanten Welten der Karte (Roadmap, Epic #1). Anzeigetexte: `world.{id}.*` (i18n). */
export type PlannedWorldId = WorldId | 'wolkeninseln' | 'geisterruine' | 'drachenburg'

export interface World {
  id: WorldId
  number: number
  puzzles: Puzzle[]
}

export const WORLDS: World[] = [
  { id: 'burgdorf', number: 1, puzzles: (puzzleData as Record<WorldId, Puzzle[]>).burgdorf },
  { id: 'finsterwald', number: 2, puzzles: (puzzleData as Record<WorldId, Puzzle[]>).finsterwald },
  { id: 'nebelsumpf', number: 3, puzzles: (puzzleData as Record<WorldId, Puzzle[]>).nebelsumpf },
  { id: 'frostgipfel', number: 4, puzzles: (puzzleData as Record<WorldId, Puzzle[]>).frostgipfel },
  { id: 'glutvulkan', number: 5, puzzles: (puzzleData as Record<WorldId, Puzzle[]>).glutvulkan },
]

/** Reihenfolge und Nummern aller geplanten Welten. Gebaut wird, was in `WORLDS` steht. */
export const ROADMAP: { id: PlannedWorldId; number: number }[] = [
  { id: 'burgdorf', number: 1 },
  { id: 'finsterwald', number: 2 },
  { id: 'nebelsumpf', number: 3 },
  { id: 'frostgipfel', number: 4 },
  { id: 'glutvulkan', number: 5 },
  { id: 'wolkeninseln', number: 6 },
  { id: 'geisterruine', number: 7 },
  { id: 'drachenburg', number: 8 },
]

export function findWorld(id: string): World | undefined {
  return WORLDS.find((w) => w.id === id)
}

/** Die Welt direkt nach `world`, sofern schon gebaut. */
export function nextBuiltWorld(world: World): World | undefined {
  return WORLDS.find((w) => w.number > world.number)
}

/** Erste geplante Welt, die noch nicht gebaut ist – Ziel der Vorschau. */
export function upcomingWorld(): { id: PlannedWorldId; number: number } | undefined {
  return ROADMAP.find((r) => !findWorld(r.id))
}

/** Die geplante Welt direkt nach `world` (gebaut oder nicht). */
export function roadmapAfter(world: World): { id: PlannedWorldId; number: number } | undefined {
  return ROADMAP.find((r) => r.number === world.number + 1)
}

const TASK_KEYS: Partial<Record<Motif, MessageKey>> = {
  mateIn1: 'task.mateIn1',
  mateIn2: 'task.mateIn2',
  hanging: 'task.hanging',
  fork: 'task.fork',
}

/** Auftragstext zum Motiv; unbekannte oder fehlende Motive bekommen den allgemeinen Text. */
export function taskKey(motif: Motif | undefined): MessageKey {
  return (motif && TASK_KEYS[motif]) || 'task.generic'
}
