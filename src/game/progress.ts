import { useCallback, useState } from 'react'
import { WORLDS, type World } from './worlds'

const KEY = 'burgensturm.progress.v1'

export type StarCount = 1 | 2 | 3

export interface Progress {
  /** Beste Sternzahl je Puzzle-ID. */
  stars: Record<string, StarCount>
  /** Welten, deren Schatztruhe schon geöffnet wurde. */
  chests: Record<string, true>
}

const EMPTY: Progress = { stars: {}, chests: {} }

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<Progress>
    return { stars: parsed.stars ?? {}, chests: parsed.chests ?? {} }
  } catch {
    return EMPTY
  }
}

function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    // Privater Modus o. Ä. – Fortschritt gilt dann nur für diese Sitzung.
  }
}

/** Index des ersten ungelösten Puzzles = Standort des Ritters. `puzzles.length` = an der Truhe. */
export function frontier(world: World, progress: Progress): number {
  const i = world.puzzles.findIndex((p) => !progress.stars[p.id])
  return i === -1 ? world.puzzles.length : i
}

/** Die Welt, die das Kind als Nächstes spielt: die erste mit noch geschlossener Truhe, sonst die letzte gebaute. */
export function currentWorld(progress: Progress): World {
  return WORLDS.find((w) => !progress.chests[w.id]) ?? WORLDS[WORLDS.length - 1]
}

export function worldStars(world: World, progress: Progress): number {
  return world.puzzles.reduce((sum, p) => sum + (progress.stars[p.id] ?? 0), 0)
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load)

  const recordStars = useCallback((puzzleId: string, stars: StarCount) => {
    setProgress((prev) => {
      if ((prev.stars[puzzleId] ?? 0) >= stars) return prev
      const next = { ...prev, stars: { ...prev.stars, [puzzleId]: stars } }
      save(next)
      return next
    })
  }, [])

  const openChest = useCallback((worldId: string) => {
    setProgress((prev) => {
      const next = { ...prev, chests: { ...prev.chests, [worldId]: true as const } }
      save(next)
      return next
    })
  }, [])

  return { progress, recordStars, openChest }
}
