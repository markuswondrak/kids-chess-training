/** Geometrie der Abenteuerkarte (Koordinaten im SVG-viewBox, Breite 400). */

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
 * Wegpunkte: Dorftor, alle Level-Steine und die Truhe.
 * Index 1 … n sind die Steine, n + 1 ist die Truhe.
 */
export function waypoints(stones: number): Pt[] {
  const h = mapHeight(stones)
  const pts: Pt[] = [{ x: 150, y: h - 40 }]
  for (let i = 0; i < stones; i++) {
    pts.push({ x: 200 + 108 * Math.sin((i + 0.35) * (Math.PI / 3.3)), y: h - BOTTOM - i * STEP })
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
