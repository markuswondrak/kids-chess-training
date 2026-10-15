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

export interface World {
  id: string
  number: number
  name: string
  subtitle: string
  /** Auftrag, den Ritter Kuno zu Beginn jeder Aufgabe gibt. */
  task: string
  puzzles: Puzzle[]
}

export const WORLDS: World[] = [
  {
    id: 'burgdorf',
    number: 1,
    name: 'Burgdorf',
    subtitle: 'Matt in 1',
    task: 'Setze den König mit einem einzigen Zug schachmatt!',
    puzzles: data.burgdorf,
  },
]

/** Vorschau auf die nächste Welt am Ende der Karte. */
export const COMING_SOON = { name: 'Finsterwald', subtitle: 'Welt 2' }

export function findWorld(id: string): World | undefined {
  return WORLDS.find((w) => w.id === id)
}
