import data from '../data/puzzles.json'

/**
 * Ein Lichess-Puzzle. `fen` ist die Stellung VOR dem Gegnerzug:
 * moves[0] spielt der Gegner automatisch vor, danach wechseln sich
 * Kind (moves[1], moves[3], …) und Gegner (moves[2], …) ab.
 */
export interface Puzzle {
  id: string
  fen: string
  moves: string[]
  rating: number
  themes: string[]
}

/** Anzeigetexte einer Welt liegen im Wörterbuch unter `world.{id}.*` (i18n). */
export type WorldId = 'burgdorf'

/** Welt der Karten-Vorschau – hat noch keinen Auftragstext. */
export type ComingSoonId = 'finsterwald'

export interface World {
  id: WorldId
  number: number
  puzzles: Puzzle[]
}

export const WORLDS: World[] = [
  {
    id: 'burgdorf',
    number: 1,
    puzzles: data.burgdorf,
  },
]

/** Vorschau auf die nächste Welt am Ende der Karte. */
export const COMING_SOON: { id: ComingSoonId; number: number } = { id: 'finsterwald', number: 2 }

export function findWorld(id: string): World | undefined {
  return WORLDS.find((w) => w.id === id)
}
