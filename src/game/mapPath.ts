/** Geometrie der Abenteuerkarte (Koordinaten im SVG-viewBox, Breite 400). */
import type { WorldId } from './worlds'

export const MAP_W = 400
const STEP = 116
const BOTTOM = 210 // Platz für das Dorf unten
const TOP = 360 // Platz für Burg, Truhe und die Vorschau oben

export interface Pt {
  x: number
  y: number
}

/** Die Truhe steht rechts neben dem Wegende, damit der Ritter daneben Platz hat. */
export function chestSpot(pts: Pt[]): Pt {
  const end = pts[pts.length - 1]
  return { x: end.x + 84, y: end.y - 6 }
}

export function mapHeight(stones: number) {
  return BOTTOM + TOP + stones * STEP
}

/**
 * Form der Wegschlange: x = center + amp · sin((i + phase) · π / period).
 * Ein negatives `amp` spiegelt die Kurve (erster Bogen nach links).
 */
export interface PathShape {
  center: number
  amp: number
  phase: number
  period: number
}

/** Der klassische Weg von Burgdorf und Finsterwald. */
export const DEFAULT_PATH: PathShape = { center: 200, amp: 108, phase: 0.35, period: 3.3 }

/** Pro Welt: Form des Weges und Platz des Schildes zur nächsten Welt (über deren Vorschau im Himmel). */
export interface MapLayout {
  path: PathShape
  nextSign: Pt
}

const LAYOUTS: Partial<Record<WorldId, MapLayout>> = {
  // Bohlenweg: erster Bogen nach links, weite Schleifen über die Lagunen.
  nebelsumpf: { path: { center: 200, amp: -104, phase: 0.5, period: 3.8 }, nextSign: { x: 292, y: 54 } },
  // Serpentinen: je zwei Steine übereinander, dann quer – links, rechts bleibt Platz für die Felswand.
  frostgipfel: { path: { center: 168, amp: 74, phase: 0.5, period: 2 }, nextSign: { x: 104, y: 52 } },
  // Weite Mäander, die der Magmafluss zweimal kreuzt.
  glutvulkan: { path: { center: 200, amp: 112, phase: -0.9, period: 4.6 }, nextSign: { x: 300, y: 50 } },
  // Inselkette: kürzere Bögen, Brücken zwischen den Inseln.
  wolkeninseln: { path: { center: 200, amp: 106, phase: 1.6, period: 3.6 }, nextSign: { x: 98, y: 56 } },
}

export function mapLayout(worldId: WorldId): MapLayout {
  return LAYOUTS[worldId] ?? { path: DEFAULT_PATH, nextSign: { x: 112, y: 52 } }
}

/**
 * Wegpunkte: Dorftor, alle Level-Steine und die Truhe.
 * Index 1 … n sind die Steine, n + 1 ist die Truhe.
 */
export function waypoints(stones: number, shape: PathShape = DEFAULT_PATH): Pt[] {
  const h = mapHeight(stones)
  const pts: Pt[] = [{ x: 150, y: h - 40 }]
  for (let i = 0; i < stones; i++) {
    pts.push({ x: shape.center + shape.amp * Math.sin((i + shape.phase) * (Math.PI / shape.period)), y: h - BOTTOM - i * STEP })
  }
  pts.push({ x: 152, y: h - BOTTOM - stones * STEP - 22 })
  return pts
}

/** Catmull-Rom-Interpolation zwischen Wegpunkt i und i + 1. */
export function pointOn(pts: Pt[], i: number, t: number): Pt {
  const p0 = pts[Math.max(0, i - 1)]
  const p1 = pts[i]
  const p2 = pts[Math.min(pts.length - 1, i + 1)]
  const p3 = pts[Math.min(pts.length - 1, i + 2)]
  const t2 = t * t
  const t3 = t2 * t
  const f = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
  return { x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) }
}

/** Glatter SVG-Pfad von Wegpunkt `from` bis `to`. */
export function pathD(pts: Pt[], from = 0, to = pts.length - 1, samples = 18): string {
  const out: string[] = []
  for (let i = from; i < to; i++) {
    for (let s = i === from ? 0 : 1; s <= samples; s++) {
      const p = pointOn(pts, i, s / samples)
      out.push(`${out.length === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    }
  }
  return out.join(' ')
}

/** Kleiner deterministischer Zufall für Deko (gleiche Karte bei jedem Laden). */
export function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Dichte Stichprobe des ganzen Weges (für Abstandstests der Deko). */
export function pathSamples(pts: Pt[], samples = 10): Pt[] {
  const out: Pt[] = []
  for (let i = 0; i < pts.length - 1; i++) for (let s = 0; s < samples; s++) out.push(pointOn(pts, i, s / samples))
  out.push(pts[pts.length - 1])
  return out
}

/** Kleinster Abstand eines Punktes zu einer Punktwolke. */
export function distTo(p: Pt, cloud: Pt[]): number {
  let d = Infinity
  for (const q of cloud) d = Math.min(d, Math.hypot(p.x - q.x, p.y - q.y))
  return d
}

export interface Spot extends Pt {
  /** Seite des Weges: -1 links, 1 rechts. */
  side: -1 | 1
  /** Stein, neben dem der Platz liegt (1 … n). */
  stone: number
}

/**
 * Deko-Plätze auf BEIDEN Seiten jedes Steins (wo Platz ist) statt alles auf die freie Außenseite zu stapeln.
 * Ein Platz hält `clear` Abstand zum Weg, `gap` zu anderen Plätzen und meidet `blocked`.
 */
export function scatterSpots({
  pts,
  stones,
  rand,
  perSide = 1,
  clear = 54,
  gap = 58,
  spread = 90,
  minX = 22,
  maxX = MAP_W - 22,
  taken = [],
  blocked = () => false,
}: {
  pts: Pt[]
  stones: number
  rand: () => number
  perSide?: number
  clear?: number
  gap?: number
  spread?: number
  minX?: number
  maxX?: number
  taken?: Pt[]
  blocked?: (p: Pt) => boolean
}): Spot[] {
  const road = pathSamples(pts, 14)
  const spots: Spot[] = []
  const used: Pt[] = [...taken]
  for (let i = 1; i <= stones; i++) {
    const p = pts[i]
    const sides: (-1 | 1)[] = i % 2 ? [-1, 1] : [1, -1]
    for (const side of sides) {
      for (let k = 0; k < perSide; k++) {
        for (let tries = 0; tries < 14; tries++) {
          const c = { x: p.x + side * (clear + rand() * spread), y: p.y - 50 + rand() * 100 }
          if (c.x < minX || c.x > maxX) continue
          if (distTo(c, road) < clear) continue
          if (used.some((u) => Math.hypot(u.x - c.x, (u.y - c.y) * 1.3) < gap)) continue
          if (blocked(c)) continue
          spots.push({ ...c, side, stone: i })
          used.push(c)
          break
        }
      }
    }
  }
  return spots
}
