import { WORLDS, type Puzzle, type WorldId } from './worlds'

/**
 * Ein Vorrat pro Weltband. Der Typ erzwingt eine Datei je Welt; jede Datei
 * wird als eigener Chunk nachgeladen und nie statisch importiert (FR-015).
 */
const POOLS: Record<WorldId, () => Promise<{ default: Puzzle[] }>> = {
  burgdorf: () => import('../data/endless.burgdorf.json'),
}

/**
 * Lädt den Vorrat einer Welt und entfernt die kuratierten Aufgaben.
 * Liefert `null` bei Ladefehler, leerem oder nach dem Filtern leerem Vorrat –
 * niemals eine Ausnahme (FR-016).
 */
export async function loadEndlessPool(worldId: WorldId): Promise<Puzzle[] | null> {
  let raw: Puzzle[]
  try {
    raw = (await POOLS[worldId]()).default
  } catch {
    return null
  }
  if (!Array.isArray(raw)) return null
  const curated = new Set(WORLDS.find((w) => w.id === worldId)?.puzzles.map((p) => p.id) ?? [])
  const pool = raw.filter((p) => !curated.has(p.id))
  return pool.length > 0 ? pool : null
}

export interface EndlessRun {
  /** Nächste Aufgabe. Wirft nie; `pool.length >= 1` ist Vorbedingung. */
  next(): Puzzle
}

function shuffle<T>(xs: T[]): T[] {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = xs[i]
    xs[i] = xs[j]
    xs[j] = tmp
  }
  return xs
}

/**
 * Frische Mischung über eine Kopie des Vorrats. Jede Aufgabe kommt einmal pro
 * Beutel dran; beim Nachfüllen wird vermieden, dass die zuletzt gezogene
 * Aufgabe sofort wieder erscheint (FR-014). Kein Gedächtnis über Läufe hinweg.
 */
export function createRun(pool: Puzzle[]): EndlessRun {
  if (pool.length === 0) throw new Error('createRun: leerer Vorrat')
  let bag: Puzzle[] = []
  let last: string | undefined

  const refill = () => {
    bag = shuffle([...pool])
    if (bag.length >= 2 && bag[0].id === last) {
      const j = bag.findIndex((p, i) => i > 0 && p.id !== last)
      if (j > 0) {
        const tmp = bag[0]
        bag[0] = bag[j]
        bag[j] = tmp
      }
    }
  }

  return {
    next() {
      if (bag.length === 0) refill()
      const puzzle = bag.shift() as Puzzle
      last = puzzle.id
      return puzzle
    },
  }
}
