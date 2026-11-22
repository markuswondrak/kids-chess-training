/**
 * Geisterruine (Ghost Ruins · World 7): eine verwunschene Burgruine bei Vollmond.
 * Von unten nach oben: Burgtor mit Wehrmauer am Start, leuchtender Burggraben mit Steinbrücke
 * und Geister-Bötchen, riesiger Schachbrett-Hof mit schlafenden Stein-Schachfiguren,
 * Kreuzgang mit Spitzbögen, durch die das Mondlicht fällt, Mondteich mit Springer-Brunnen
 * und Froschkönig, schiefer Geisterturm, oben die Geisterabtei mit bunten Glasfenstern,
 * schläfriger Vollmond mit Fledermäusen und Drachenburg-Teaser (Welt 8).
 * Laternen säumen den Weg, Nebelbänke und Irrlichter ziehen über die Karte.
 * Props wie `MapArt`. Zufall nur über `seeded()`.
 */
import type { ReactNode } from 'react'
import { MAP_W, chestSpot, pathD, pointOn, scatterSpots, seeded, type Pt } from '../game/mapPath'

const INK = '#2F2420'

/** Ghost Ruins palette – shared CSS values mirror tokens.css (`--ghost-*`). */
export const GR = {
  skyTop: '#16123C',
  skyMid: '#2D2468',
  skyLow: '#5B3F90',
  skyHorizon: '#A07CC0',
  skyline: '#3A2D72',
  skylineDeep: '#2C2260',
  moon: '#FFF4CF',
  moonShade: '#EEDCA4',
  moonGlow: '255,238,186',
  groundTop: '#3A336F',
  groundMid: '#2F3D6C',
  groundBottom: '#283F5E',
  grass: '#3F6380',
  grassLight: '#5C8AA0',
  soil: '#252D52',
  stone: '#A39CCB',
  stoneLight: '#CBC5E8',
  stoneShade: '#7E76AD',
  stoneDeep: '#565088',
  pave: '#8F88BD',
  paveLight: '#ABA4D2',
  trail: '#C4BDE2',
  trailEdge: '#625A98',
  trailSlab: '#DDD8F1',
  roof: '#4E3A86',
  roofLight: '#6A52A8',
  roofDeep: '#33265F',
  ivy: '#3F9A78',
  ivyLight: '#6FD3A2',
  bark: '#6B5470',
  wood: '#8A5E44',
  woodDeep: '#6A4432',
  water: '#2BA6B3',
  waterLight: '#8EF0E4',
  waterDeep: '#1B6A89',
  lily: '#3FA27C',
  lantern: '#FFD66E',
  lanternDeep: '#F2A93B',
  lanternGlow: '255,214,110',
  wisp: '#A8FFE9',
  wispGlow: '140,250,222',
  ghost: '#FCFBFF',
  ghostShade: '#DCD5F3',
  cheek: '#FF9EAA',
  mist: '#E6DEF8',
  marble: '#EEEAF9',
  marbleShade: '#BDB5DC',
  obsidian: '#5A519A',
  obsidianLight: '#7F76C0',
  flag: '#C9372C',
  gold: '#F3B630',
  glassMint: '#7FF0D2',
  glassPink: '#FF9FC4',
  glassBlue: '#8FB8FF',
  bat: '#2A2152',
  frog: '#6CC46A',
  frogDeep: '#4A9A4C',
  dragonRock: '#4E445A',
  dragonRockDeep: '#362E42',
  dragonWall: '#6E6178',
  dragonRoof: '#B53D32',
  dragonFire: '#FF9844',
  dragonGold: '#FFE07A',
}

const f = (v: number) => v.toFixed(1)

/** Glatter geschlossener (oder offener) Pfad durch Stützpunkte (Catmull-Rom → Bézier). */
function smooth(points: [number, number][], closed = true): string {
  const n = points.length
  const P = (i: number) => points[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))]
  let d = `M${f(P(0)[0])} ${f(P(0)[1])}`
  const segs = closed ? n : n - 1
  for (let i = 0; i < segs; i++) {
    const p0 = P(i - 1)
    const p1 = P(i)
    const p2 = P(i + 1)
    const p3 = P(i + 2)
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return closed ? `${d} Z` : d
}

/** Soft night ground shadow. */
const Shadow = ({ rx, ry = rx / 3.4, cy = 2 }: { rx: number; ry?: number; cy?: number }) => (
  <ellipse cx="0" cy={cy} rx={rx} ry={ry} fill="rgba(12,10,34,.32)" />
)

const at = (x: number, y: number, s = 1, flip = false) => `translate(${f(x)} ${f(y)}) scale(${flip ? -s : s} ${s})`

/** Sleepy closed eyes + smile (for moon and stone statues). */
function SleepyFace({ y = 0, dx = 6, s = 1, cheeks = true }: { y?: number; dx?: number; s?: number; cheeks?: boolean }) {
  return (
    <g transform={`translate(0 ${y}) scale(${s})`}>
      <path d={`M${-dx - 3} 0 q3 3 6 0 M${dx - 3} 0 q3 3 6 0`} fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      {cheeks && <ellipse cx={-dx - 3} cy="4.5" rx="2.6" ry="1.7" fill={GR.cheek} opacity={0.7} />}
      {cheeks && <ellipse cx={dx + 3} cy="4.5" rx="2.6" ry="1.7" fill={GR.cheek} opacity={0.7} />}
      <path d="M-2.5 5 q2.5 2.4 5 0" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
    </g>
  )
}

// ---------------------------------------------------------------- small characters & props

/** Friendly smiling cartoon ghost with a soft glow aura and optional lantern. */
function FriendlyGhost({
  x,
  y,
  s = 1,
  flip = false,
  lantern = true,
  delay = 0,
  shadow = true,
}: {
  x: number
  y: number
  s?: number
  flip?: boolean
  lantern?: boolean
  delay?: number
  shadow?: boolean
}) {
  return (
    <g transform={at(x, y, s, flip)}>
      {shadow && <ellipse cx="0" cy="6" rx="12" ry="3.5" fill="rgba(12,10,34,.3)" />}
      <g className="gr-float" style={{ animationDelay: `${f(delay)}s` }}>
        <circle cx="0" cy="-17" r="26" fill="url(#gr-glow-ghost)" />
        {lantern && <circle className="gr-glow" cx="16" cy="-10" r="15" fill="url(#gr-glow-warm)" />}
        <path
          d="M-13 -16 C-13 -36 13 -36 13 -16 L13.5 -1 C10 -4 8 -1 5.5 -3.5 C3 -1 1 -4 -1.5 -1.5 C-4 -4 -6.5 -1 -9 -3.5 C-11 -1.5 -12.5 -2 -13.5 -1 Z"
          fill={GR.ghost}
          stroke={INK}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
        <path d="M4 -31 C10 -28 12 -22 12 -16 L12.4 -4 C10 -6 8 -4 6 -5 C8 -14 8 -24 4 -31 Z" fill={GR.ghostShade} opacity={0.8} />
        <path d="M-8 -27 q3 -4 7 -4" fill="none" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" />
        <path d="M-12 -18 C-17 -20 -18 -13 -13 -12" fill={GR.ghost} stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <path d="M12 -17 C17 -18 18 -12 13 -11" fill={GR.ghost} stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <ellipse cx="-4.5" cy="-21" rx="2.2" ry="2.8" fill={INK} />
        <ellipse cx="4.5" cy="-21" rx="2.2" ry="2.8" fill={INK} />
        <circle cx="-5.2" cy="-22" r="0.8" fill="#FFFFFF" />
        <circle cx="3.8" cy="-22" r="0.8" fill="#FFFFFF" />
        <ellipse cx="-8" cy="-16.5" rx="2.4" ry="1.6" fill={GR.cheek} opacity={0.85} />
        <ellipse cx="8" cy="-16.5" rx="2.4" ry="1.6" fill={GR.cheek} opacity={0.85} />
        <path d="M-3 -16 Q0 -12.5 3 -16" fill="none" stroke={INK} strokeWidth={1.7} strokeLinecap="round" />
        {lantern && (
          <g transform="translate(16 -11)">
            <path d="M0 -7 V-3.5" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
            <rect x="-4.2" y="-3.5" width="8.4" height="9.5" rx="2.6" fill={GR.lantern} stroke={INK} strokeWidth={1.8} />
            <path d="M-5.2 -3.5 H5.2 M-4.2 6 H4.2" stroke={INK} strokeWidth={1.9} strokeLinecap="round" />
            <circle cx="0" cy="1.2" r="2" fill="#FFFDF2" />
          </g>
        )}
      </g>
    </g>
  )
}

/** Wrought-iron lantern post – warm pools of light along the cobblestone path. */
function LampPost({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={at(x, y, s, flip)}>
      <ellipse cx="6" cy="2" rx="30" ry="11" fill="rgba(255,214,110,.16)" />
      <Shadow rx={9} />
      <circle className="gr-glow" cx="11" cy="-40" r="26" fill="url(#gr-glow-warm)" />
      <rect x="-5.5" y="-7" width="11" height="9" rx="2" fill={GR.stoneDeep} stroke={INK} strokeWidth={1.9} />
      <path d="M0 -7 V-50 C0 -57 12 -57 12 -50 V-47" fill="none" stroke={INK} strokeWidth={3.6} strokeLinecap="round" />
      <path d="M-4 -22 H4" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <g className="gr-lantern">
        <path d="M6 -46 H18 L16 -33 H8 Z" fill={GR.lantern} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <path d="M5 -46 L12 -52 L19 -46 Z" fill={GR.stoneDeep} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M12 -45 V-34" stroke={INK} strokeWidth={1.2} opacity={0.6} />
        <circle cx="12" cy="-39" r="2.6" fill="#FFFDF2" />
      </g>
    </g>
  )
}

/** Glowing mint-and-violet mushrooms in a little moss cluster. */
function GlowMushrooms({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={at(x, y, s)}>
      <circle className="gr-glow" cx="0" cy="-9" r="22" fill="url(#gr-glow-wisp)" />
      <Shadow rx={14} />
      {[
        { dx: -8, h: 9, r: 8, c: '#A68AF0' },
        { dx: 6, h: 13, r: 10, c: GR.glassMint },
        { dx: -1, h: 5, r: 5.5, c: GR.glassPink },
      ].map((m, i) => (
        <g key={i} transform={`translate(${m.dx} 0)`}>
          <path d={`M-2.3 0 Q-1.5 ${-m.h} -1.8 ${-m.h} H1.8 Q1.5 ${-m.h} 2.3 0 Z`} fill="#EFE8FA" stroke={INK} strokeWidth={1.7} />
          <path
            d={`M${-m.r} ${-m.h + 1} Q${-m.r} ${-m.h - m.r * 0.95} 0 ${-m.h - m.r * 0.95} Q${m.r} ${-m.h - m.r * 0.95} ${m.r} ${-m.h + 1} Z`}
            fill={m.c}
            stroke={INK}
            strokeWidth={1.9}
          />
          <circle cx={-m.r * 0.35} cy={-m.h - m.r * 0.4} r="1.5" fill="#FFFDF6" />
          <circle cx={m.r * 0.32} cy={-m.h - m.r * 0.5} r="1.1" fill="#FFFDF6" />
        </g>
      ))}
    </g>
  )
}

/** Cute wide-eyed owl on a broken mossy column (blinks). */
function RuinsOwl({ x, y, s = 1, flip = false, column = true }: { x: number; y: number; s?: number; flip?: boolean; column?: boolean }) {
  return (
    <g transform={at(x, y, s, flip)}>
      {column && <Shadow rx={15} />}
      {column && (
        <g>
          <path d="M-11 2 V-24 L-4 -27 L3 -24 L11 -26 V2 Z" fill={GR.stone} stroke={INK} strokeWidth={2.1} strokeLinejoin="round" />
          <path d="M3 -24 L11 -26 V2 H3 Z" fill={GR.stoneShade} opacity={0.7} />
          <path d="M-11 -12 H11" stroke={GR.stoneDeep} strokeWidth={1.4} />
          <path d="M-12 -22 C-8 -14 -12 -8 -8 -2" fill="none" stroke={GR.ivy} strokeWidth={3} strokeLinecap="round" />
        </g>
      )}
      <g transform={column ? 'translate(0 -25)' : undefined}>
        <ellipse cx="0" cy="-13" rx="11.5" ry="13.5" fill="#7A63B0" stroke={INK} strokeWidth={2.1} />
        <ellipse cx="0" cy="-9" rx="7" ry="8.5" fill="#E9DFF7" />
        <path
          d="M-3 -6 l1.5 1.5 l1.5 -1.5 l1.5 1.5 l1.5 -1.5 M-3 -2 l1.5 1.5 l1.5 -1.5 l1.5 1.5 l1.5 -1.5"
          fill="none"
          stroke="#B9A9DB"
          strokeWidth={1.1}
        />
        <path d="M-9 -23 L-12 -30 L-4 -26 Z M9 -23 L12 -30 L4 -26 Z" fill="#7A63B0" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
        <circle cx="-4.4" cy="-16" r="4" fill={GR.lantern} stroke={INK} strokeWidth={1.5} />
        <circle cx="4.4" cy="-16" r="4" fill={GR.lantern} stroke={INK} strokeWidth={1.5} />
        <circle cx="-4.2" cy="-16" r="1.9" fill={INK} />
        <circle cx="4.2" cy="-16" r="1.9" fill={INK} />
        <g className="gr-blink">
          <rect x="-8.6" y="-20.4" width="8.4" height="8.6" rx="4" fill="#7A63B0" />
          <rect x="0.2" y="-20.4" width="8.4" height="8.6" rx="4" fill="#7A63B0" />
        </g>
        <path d="M-2 -12 L0 -9 L2 -12 Z" fill={GR.gold} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
        <path d="M-5 0 H-2 M2 0 H5" stroke={GR.gold} strokeWidth={2.2} strokeLinecap="round" />
      </g>
    </g>
  )
}

/** Small broken column stump with ivy – filler ruin. */
function BrokenColumn({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={at(x, y, s, flip)}>
      <Shadow rx={20} />
      <rect x="-14" y="-7" width="28" height="9" rx="2" fill={GR.stoneShade} stroke={INK} strokeWidth={2} />
      <path d="M-9 -7 V-40 L-3 -46 L2 -40 L9 -44 V-7 Z" fill={GR.stone} stroke={INK} strokeWidth={2.1} strokeLinejoin="round" />
      <path d="M2 -40 L9 -44 V-7 H2 Z" fill={GR.stoneShade} opacity={0.65} />
      <path d="M-4 -38 V-9 M3 -36 V-9" stroke={GR.stoneDeep} strokeWidth={1.2} opacity={0.6} />
      {/* fallen drum next to it */}
      <g transform="translate(18 -2) rotate(-8)">
        <rect x="-8" y="-9" width="16" height="10" rx="3" fill={GR.stone} stroke={INK} strokeWidth={1.9} />
        <ellipse cx="8" cy="-4" rx="2.6" ry="5" fill={GR.stoneLight} stroke={INK} strokeWidth={1.5} />
      </g>
      <path d="M-10 -36 C-5 -30 -11 -22 -6 -14" fill="none" stroke={GR.ivy} strokeWidth={3} strokeLinecap="round" />
      <circle cx="-7" cy="-27" r="2.6" fill={GR.ivyLight} stroke={INK} strokeWidth={1.1} />
    </g>
  )
}

/** Mossy little rook/knight statue on a plinth – filler decor. */
function ChessStatue({
  x,
  y,
  s = 1,
  kind = 'rook',
  flip = false,
}: {
  x: number
  y: number
  s?: number
  kind?: 'rook' | 'knight'
  flip?: boolean
}) {
  return (
    <g transform={at(x, y, s, flip)}>
      <Shadow rx={18} />
      <rect x="-15" y="-11" width="30" height="12" rx="2" fill={GR.stoneShade} stroke={INK} strokeWidth={2.1} />
      <rect x="-17" y="-15" width="34" height="5" rx="1.5" fill={GR.stoneLight} stroke={INK} strokeWidth={1.9} />
      {kind === 'knight' ? (
        <path
          d="M-9 -15 C-9 -25 -5 -33 -1 -41 L-8 -36 C-12 -33 -13 -37 -10 -41 L-1 -50 L2 -55 L5 -49 C12 -45 14 -33 10 -15 Z"
          fill={GR.marble}
          stroke={INK}
          strokeWidth={2.1}
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M-10 -15 L-8 -38 H-12 V-48 H-6 V-43 H-2 V-48 H2 V-43 H6 V-48 H12 V-38 H8 L10 -15 Z"
          fill={GR.marble}
          stroke={INK}
          strokeWidth={2.1}
          strokeLinejoin="round"
        />
      )}
      {kind === 'knight' ? <circle cx="-2" cy="-43" r="1.4" fill={INK} /> : <SleepyFace y={-30} dx={3.2} s={0.9} cheeks={false} />}
      <path d="M-16 -14 C-12 -18 -6 -16 -3 -12 C-8 -10 -13 -10 -16 -14 Z" fill={GR.ivyLight} stroke={INK} strokeWidth={1.4} />
    </g>
  )
}

/** Floating mint will-o'-wisp. */
function WillOWisp({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={at(x, y, s)}>
      <g className="gr-wisp" style={{ animationDelay: `${f(delay)}s` }}>
        <circle r="15" fill="url(#gr-glow-wisp)" />
        <path d="M0 -8 Q5 -2 3 3 A3.6 3.6 0 1 1 -3 3 Q-5 -2 0 -8 Z" fill={GR.wisp} stroke={INK} strokeWidth={1.2} />
        <circle cx="0" cy="1" r="1.8" fill="#FFFFFF" />
      </g>
    </g>
  )
}

/** Cute little bat fluttering around the moon. */
function Bat({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={at(x, y, s)}>
      <g className="gr-bat" style={{ animationDelay: `${f(delay)}s` }}>
        <path
          d="M0 -2 C-4 -9 -12 -10 -18 -6 C-15 -4 -14 -1 -15 2 C-11 0 -8 1 -6 4 C-4 2 -2 2 0 4 C2 2 4 2 6 4 C8 1 11 0 15 2 C14 -1 15 -4 18 -6 C12 -10 4 -9 0 -2 Z"
          fill={GR.bat}
          stroke={INK}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
        <ellipse cx="0" cy="0" rx="5" ry="5.5" fill={GR.bat} stroke={INK} strokeWidth={1.6} />
        <path d="M-4 -4 L-3.5 -8.5 L-1.5 -5 M4 -4 L3.5 -8.5 L1.5 -5" fill={GR.bat} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
        <circle cx="-1.9" cy="-0.6" r="1.1" fill="#FFF4CF" />
        <circle cx="1.9" cy="-0.6" r="1.1" fill="#FFF4CF" />
      </g>
    </g>
  )
}

/** Twinkling four-point star. */
function TwinkleStar({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={at(x, y, s)}>
      <path
        className="gr-twinkle"
        style={{ animationDelay: `${f(delay)}s` }}
        d="M0 -8 L1.9 -1.9 L8 0 L1.9 1.9 L0 8 L-1.9 1.9 L-8 0 L-1.9 -1.9 Z"
        fill="#FFF7D6"
      />
    </g>
  )
}

/** Patch of broken flagstone paving (brick pattern, crumbling oval edge). */
function Paving({
  cx,
  cy,
  rx,
  ry,
  rand,
  cell = 22,
  angle = 0,
}: {
  cx: number
  cy: number
  rx: number
  ry: number
  rand: () => number
  cell?: number
  angle?: number
}) {
  const out: ReactNode[] = []
  const ch = cell * 0.7
  const rows = Math.ceil((ry * 2) / ch)
  for (let r = 0; r < rows; r++) {
    const y = -ry + r * ch + ch / 2
    const off = (r % 2) * (cell / 2)
    for (let x0 = -rx - off; x0 < rx; x0 += cell) {
      const px = x0 + cell / 2
      const d = (px / rx) ** 2 + (y / ry) ** 2
      const cut = rand()
      if (d > 1 - cut * 0.4 || rand() < 0.08) continue
      const w = cell - 3 - rand() * 3
      const h = ch - 3 - rand() * 2
      out.push(
        <rect
          key={`${r}-${f(px)}`}
          x={f(px - w / 2)}
          y={f(y - h / 2)}
          width={f(w)}
          height={f(h)}
          rx="3"
          fill={rand() < 0.5 ? GR.pave : GR.paveLight}
          opacity={f(0.45 + 0.5 * (1 - d))}
          stroke="rgba(47,36,32,.4)"
          strokeWidth={1.2}
        />,
      )
    }
  }
  return <g transform={`translate(${f(cx)} ${f(cy)}) rotate(${angle})`}>{out}</g>
}

// ---------------------------------------------------------------- big set pieces

/** Ruined castle gate with towers and crenellated wall stubs – the entrance at the start. */
function RuinGate({ x, y }: { x: number; y: number }) {
  const st = { stroke: INK, strokeWidth: 2.4, strokeLinejoin: 'round' as const }
  const merlons = (x0: number, x1: number, top: number, skip: number[] = []) => {
    const out: ReactNode[] = []
    for (let i = 0, mx = x0; mx + 10 <= x1; i++, mx += 17) {
      if (skip.includes(i)) continue
      out.push(<rect key={i} x={f(mx)} y={top - 9} width="10" height="10" rx="1.5" fill={GR.stone} {...st} strokeWidth={2} />)
    }
    return out
  }
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      <ellipse cx="0" cy="4" rx="230" ry="14" fill="rgba(12,10,34,.3)" />
      {/* left wall stub running off to the edge */}
      {merlons(-232, -50, -34, [3, 7])}
      <path d="M-240 2 V-34 H-50 V2 Z" fill={GR.stone} {...st} />
      <path
        d="M-240 -16 H-50 M-200 -34 V-16 M-150 -16 V2 M-110 -34 V-16 M-70 -16 V2"
        stroke={GR.stoneDeep}
        strokeWidth={1.4}
        opacity={0.7}
      />
      <path d="M-240 -8 H-50 V2 H-240 Z" fill={GR.stoneShade} opacity={0.55} />
      {/* right wall stub, broken in steps */}
      {merlons(50, 150, -34, [2])}
      <path d="M50 2 V-34 H152 L160 -26 H176 L182 -14 H200 L206 2 Z" fill={GR.stone} {...st} />
      <path d="M50 -16 H180 M90 -34 V-16 M120 -16 V2 M160 -16 V2" stroke={GR.stoneDeep} strokeWidth={1.4} opacity={0.7} />
      <path d="M50 -8 H200 L206 2 H50 Z" fill={GR.stoneShade} opacity={0.55} />
      <path d="M100 -35 C96 -24 104 -18 99 -8" fill="none" stroke={GR.ivy} strokeWidth={3.4} strokeLinecap="round" />
      <circle cx="101" cy="-24" r="3" fill={GR.ivyLight} stroke={INK} strokeWidth={1.2} />
      {/* rubble at the broken end */}
      <rect x="208" y="-8" width="12" height="9" rx="2" fill={GR.stone} {...st} strokeWidth={1.8} transform="rotate(12 214 -4)" />

      {/* left tower (intact, banner + torch) */}
      <path d="M-84 4 V-70 H-42 V4 Z" fill={GR.stone} {...st} />
      <path d="M-58 -70 H-42 V4 H-58 Z" fill={GR.stoneShade} opacity={0.6} />
      {[-84, -70, -56].map((mx) => (
        <rect key={mx} x={mx} y={-80} width="11" height="11" rx="1.5" fill={GR.stone} {...st} strokeWidth={2} />
      ))}
      <path
        d="M-84 -48 H-42 M-84 -24 H-42 M-70 -70 V-48 M-56 -48 V-24 M-70 -24 V4"
        stroke={GR.stoneDeep}
        strokeWidth={1.3}
        opacity={0.65}
      />
      <path d="M-78 -66 V-22 L-71 -28 L-64 -22 V-66 Z" fill={GR.roof} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-71 -54 l-4 6 h8 Z" fill={GR.gold} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
      <rect x="-74" y="-48" width="6" height="8" rx="1" fill={GR.gold} stroke={INK} strokeWidth={1.3} />

      {/* right tower (broken top) */}
      <path d="M42 4 V-62 L52 -70 L60 -62 L70 -74 L84 -64 V4 Z" fill={GR.stone} {...st} />
      <path d="M68 -72 L84 -64 V4 H68 Z" fill={GR.stoneShade} opacity={0.6} />
      <path d="M42 -44 H84 M42 -20 H84 M56 -44 V-20 M70 -20 V4" stroke={GR.stoneDeep} strokeWidth={1.3} opacity={0.65} />
      <path d="M58 -40 V-50 A5 6 0 0 1 68 -50 V-40 Z" fill={GR.lantern} stroke={INK} strokeWidth={1.8} />
      <circle className="gr-glow" cx="63" cy="-46" r="14" fill="url(#gr-glow-warm)" />
      <path d="M84 -60 C78 -48 86 -38 80 -24" fill="none" stroke={GR.ivy} strokeWidth={3.4} strokeLinecap="round" />
      <circle cx="82" cy="-44" r="3" fill={GR.ivyLight} stroke={INK} strokeWidth={1.2} />

      {/* pointed gate arch over the trail + raised portcullis */}
      <path
        d="M-44 -38 C-44 -70 0 -84 0 -84 C0 -84 44 -70 44 -38 H32 C32 -60 0 -70 0 -70 C0 -70 -32 -60 -32 -38 Z"
        fill={GR.stoneLight}
        {...st}
      />
      <path d="M-5 -84 L0 -70 L5 -84 Z" fill={GR.stoneShade} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <path
        d="M-26 -50 V-40 M-14 -60 V-40 M-2 -66 V-40 M10 -63 V-40 M22 -55 V-40 M-29 -46 H27"
        stroke={INK}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.75}
      />
      <path
        d="M-28 -40 l2 4 l2 -4 M-16 -40 l2 4 l2 -4 M-4 -40 l2 4 l2 -4 M8 -40 l2 4 l2 -4 M20 -40 l2 4 l2 -4"
        fill="none"
        stroke={INK}
        strokeWidth={1.6}
        opacity={0.75}
      />
      {/* torches on the tower fronts */}
      {[-46, 46].map((tx) => (
        <g key={tx} transform={`translate(${tx} -28)`}>
          <circle className="gr-glow" cx="0" cy="-8" r="18" fill="url(#gr-glow-warm)" />
          <path d="M-3 0 H3 L1.5 8 H-1.5 Z" fill={GR.woodDeep} stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
          <path className="gr-flicker" d="M0 -10 C4 -6 4 -2 0 0 C-4 -2 -4 -6 0 -10 Z" fill={GR.lantern} stroke={INK} strokeWidth={1.3} />
        </g>
      ))}
    </g>
  )
}

/** Glowing moat band across the map with stone embankment, lily pads and moon reflections. */
function Moat({ top, bottom, rand }: { top: [number, number][]; bottom: [number, number][]; rand: () => number }) {
  const outline = smooth([...top, ...[...bottom].reverse()])
  const mid = top.map(([x, y], i) => [x, (y + bottom[i][1]) / 2] as [number, number])
  const pads: ReactNode[] = []
  for (let k = 0; k < 5; k++) {
    const i = 1 + Math.floor(rand() * (mid.length - 2))
    const [mx, my] = mid[i]
    const px = mx + (rand() - 0.5) * 40
    if (px > 150 && px < 250) continue
    pads.push(
      <g key={k} transform={`translate(${f(px)} ${f(my + (rand() - 0.5) * 10)})`}>
        <path d="M0 0 m-9 0 a9 4.5 0 1 0 18 0 a9 4.5 0 1 0 -18 0 M0 0 L7 -2" fill={GR.lily} stroke={INK} strokeWidth={1.4} />
        {k % 2 === 0 && (
          <g>
            <circle className="gr-glow" cx="-1" cy="-3" r="9" fill="url(#gr-glow-wisp)" />
            <path
              d="M-4 -2 L-1 -7 L2 -2 Z M-1 -2 L3 -6 L4 -1 Z M-1 -2 L-5 -6 L-6 -1 Z"
              fill={GR.glassPink}
              stroke={INK}
              strokeWidth={1}
              strokeLinejoin="round"
            />
          </g>
        )}
      </g>,
    )
  }
  return (
    <g>
      <path d={outline} fill="url(#gr-water)" />
      <path d={smooth(mid, false)} fill="none" stroke="rgba(142,240,228,.32)" strokeWidth={12} strokeLinecap="round" />
      <path d={outline} fill="none" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      <path d={outline} fill="none" stroke={GR.stoneShade} strokeWidth={6} strokeLinejoin="round" />
      <path d={outline} fill="none" stroke={GR.stoneLight} strokeWidth={2} strokeDasharray="10 7" strokeLinejoin="round" />
      <path
        className="gr-shimmer"
        d={mid
          .filter((_, i) => i % 2 === 1)
          .map(([x, y]) => `M${f(x - 14)} ${f(y - 3)} q7 -3 14 0 M${f(x + 4)} ${f(y + 5)} q6 -2 12 0`)
          .join(' ')}
        fill="none"
        stroke={GR.waterLight}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      {pads}
    </g>
  )
}

/** Arched stone bridge along the trail over the moat. */
function StoneBridge({ pts, seg, t0, t1 }: { pts: Pt[]; seg: number; t0: number; t1: number }) {
  const n = 12
  const line = Array.from({ length: n + 1 }, (_, k) => pointOn(pts, seg, t0 + ((t1 - t0) * k) / n))
  const normal = (k: number) => {
    const a = line[Math.max(0, k - 1)]
    const b = line[Math.min(n, k + 1)]
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
    return { x: -(b.y - a.y) / len, y: (b.x - a.x) / len }
  }
  const deck = line.map((p, k) => `${k ? 'L' : 'M'}${f(p.x)} ${f(p.y)}`).join(' ')
  const rail = (o: number) =>
    line
      .map((p, k) => {
        const nn = normal(k)
        return `${k ? 'L' : 'M'}${f(p.x + nn.x * o)} ${f(p.y + nn.y * o)}`
      })
      .join(' ')
  const posts = [0, n].flatMap((k) => [-23, 23].map((o) => ({ x: line[k].x + normal(k).x * o, y: line[k].y + normal(k).y * o })))
  return (
    <g>
      <path d={deck} fill="none" stroke="rgba(12,10,34,.35)" strokeWidth={56} transform="translate(4 8)" />
      <path d={deck} fill="none" stroke={INK} strokeWidth={50} />
      <path d={deck} fill="none" stroke={GR.stoneShade} strokeWidth={44} />
      <path d={deck} fill="none" stroke={GR.trail} strokeWidth={32} />
      <path d={deck} fill="none" stroke={GR.trailSlab} strokeWidth={26} strokeDasharray="9 4" />
      {[-21, 21].map((o) => (
        <g key={o}>
          <path d={rail(o)} fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
          <path d={rail(o)} fill="none" stroke={GR.stoneLight} strokeWidth={5} strokeLinecap="round" />
          <path d={rail(o)} fill="none" stroke={GR.stoneDeep} strokeWidth={1.4} strokeDasharray="2 8" />
        </g>
      ))}
      {posts.map((p, i) => (
        <g key={i} transform={`translate(${f(p.x)} ${f(p.y)})`}>
          <circle className="gr-glow" cx="0" cy="-16" r="15" fill="url(#gr-glow-warm)" />
          <rect x="-5.5" y="-12" width="11" height="15" rx="2" fill={GR.stoneLight} stroke={INK} strokeWidth={1.8} />
          <path d="M-4 -12 H4 L3 -21 H-3 Z" fill={GR.lantern} stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
          <path d="M-5 -21 L0 -25 L5 -21 Z" fill={GR.stoneDeep} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
        </g>
      ))}
    </g>
  )
}

/** Tiny rowing boat with a ghost and lantern drifting on the moat. */
function GhostBoat({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      <g className="gr-bob">
        <ellipse className="gr-ripple" cx="0" cy="4" rx="30" ry="5" fill="none" stroke={GR.waterLight} strokeWidth={1.6} opacity={0.7} />
        <FriendlyGhost x={-2} y={-2} s={0.78} lantern={false} shadow={false} delay={-1.3} />
        <path d="M-24 -6 H24 C20 4 12 7 0 7 C-12 7 -20 4 -24 -6 Z" fill={GR.wood} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
        <path d="M-20 -2 H20" stroke={GR.woodDeep} strokeWidth={1.6} />
        <path d="M14 -6 L30 6" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
        <path d="M27 4 l6 4 l-2 2 l-6 -3 Z" fill={GR.wood} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
        <g transform="translate(-20 -8)">
          <circle className="gr-glow" cx="0" cy="-12" r="14" fill="url(#gr-glow-warm)" />
          <path d="M0 0 V-16 H5" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          <rect x="2" y="-16" width="7" height="8" rx="2" fill={GR.lantern} stroke={INK} strokeWidth={1.5} />
        </g>
      </g>
    </g>
  )
}

/** Giant sleepy stone king (white marble). Base at 0. */
function GiantKing({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const m = { fill: GR.marble, stroke: INK, strokeWidth: 2.4, strokeLinejoin: 'round' as const }
  return (
    <g transform={at(x, y, s)}>
      <ellipse cx="8" cy="3" rx="30" ry="8" fill="rgba(12,10,34,.32)" />
      <rect x="-24" y="-12" width="48" height="13" rx="6" {...m} />
      <path d="M-17 -12 L-14 -56 H14 L17 -12 Z" {...m} />
      <path d="M4 -56 H14 L17 -12 H6 Z" fill={GR.marbleShade} opacity={0.75} />
      <rect x="-21" y="-62" width="42" height="9" rx="4.5" {...m} fill={GR.marbleShade} />
      <path d="M-15 -62 C-15 -78 15 -78 15 -62 Z" {...m} />
      <path d="M-4 -90 h8 v6 h6 v7 h-6 v6 h-8 v-6 h-6 v-7 h6 Z" {...m} fill={GR.gold} strokeWidth={2} />
      <SleepyFace y={-40} dx={5.5} s={1.1} />
      <path d="M-15 -18 C-6 -14 4 -16 15 -20" fill="none" stroke={GR.marbleShade} strokeWidth={2} />
      <path d="M-24 -6 C-16 -12 -6 -10 -2 -4 C-10 -1 -18 -1 -24 -6 Z" fill={GR.ivyLight} stroke={INK} strokeWidth={1.5} />
      <path d="M-14 -46 C-10 -40 -14 -32 -10 -26" fill="none" stroke={GR.ivy} strokeWidth={3} strokeLinecap="round" />
      <path
        className="gr-snore"
        d="M20 -66 h7 l-7 8 h7 M30 -80 h5 l-5 6 h5"
        fill="none"
        stroke={GR.mist}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  )
}

/** Giant sleepy stone knight (dark stone). Base at 0. */
function GiantKnight({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={at(x, y, s, true)}>
      <ellipse cx="0" cy="3" rx="28" ry="8" fill="rgba(12,10,34,.32)" />
      <g transform="translate(-50 -96)">
        <path
          d="M58 14 C68 14 75 22 72 30 C79 34 79 44 74 48 C80 53 79 62 73 65 C77 70 75 77 69 79 L60 60 Z"
          fill={GR.lantern}
          stroke={INK}
          strokeWidth={2.4}
          strokeLinejoin="round"
        />
        <path
          d="M68 81 C71 66 71 52 67 40 C65 33 64 27 63 21 L62 5 L55 14 L48 7 L45 18 C37 22 29 29 24 37 C20 43 19 49 23 53 C27 57 33 58 38 55 C41 53 44 52 47 52 C43 59 39 69 37 81 Z"
          fill={GR.obsidian}
          stroke={INK}
          strokeWidth={2.4}
          strokeLinejoin="round"
        />
        <path d="M60 30 C64 42 66 60 64 80 H68 C71 66 71 52 67 40 C65 33 64 27 63 21 Z" fill={GR.obsidianLight} opacity={0.7} />
        <ellipse cx="26.5" cy="46" rx="2" ry="2.6" fill={INK} />
        <path d="M40 32 q4 4 8 0" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <ellipse cx="36" cy="42" rx="3.4" ry="2.2" fill={GR.cheek} opacity={0.6} />
        <rect x="28" y="78" width="48" height="11" rx="5.5" fill={GR.obsidian} stroke={INK} strokeWidth={2.4} />
        <rect x="22" y="86" width="60" height="12" rx="6" fill={GR.obsidianLight} stroke={INK} strokeWidth={2.4} />
        <path d="M24 92 C32 86 42 88 46 94 C38 97 30 97 24 92 Z" fill={GR.ivyLight} stroke={INK} strokeWidth={1.5} />
      </g>
    </g>
  )
}

/** Little sleepy marble pawn statue on the board. */
function GiantPawn({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const m = { fill: GR.marble, stroke: INK, strokeWidth: 2.3, strokeLinejoin: 'round' as const }
  return (
    <g transform={at(x, y, s)}>
      <ellipse cx="6" cy="3" rx="22" ry="6" fill="rgba(12,10,34,.32)" />
      <rect x="-18" y="-10" width="36" height="11" rx="5.5" {...m} />
      <path d="M-13 -10 L-9 -32 H9 L13 -10 Z" {...m} />
      <path d="M3 -32 H9 L13 -10 H5 Z" fill={GR.marbleShade} opacity={0.75} />
      <rect x="-14" y="-38" width="28" height="8" rx="4" {...m} fill={GR.marbleShade} />
      <circle cx="0" cy="-50" r="13" {...m} />
      <path d="M-6 -57 q3 -3 7 -3" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
      <SleepyFace y={-50} dx={3.6} s={0.95} />
      <path d="M-18 -4 C-12 -9 -5 -8 -2 -3 C-8 -1 -14 -1 -18 -4 Z" fill={GR.ivyLight} stroke={INK} strokeWidth={1.4} />
    </g>
  )
}

/** Gnarled moonlit tree with round teal canopy puffs and a hanging lantern. */
function SpookyTree({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={at(x, y, s, flip)}>
      <Shadow rx={30} />
      <path
        d="M-9 2 C-6 -12 -10 -26 -4 -40 L-22 -54 L-18 -58 L-2 -46 L4 -62 L9 -60 L5 -42 L22 -52 L25 -48 L7 -34 C6 -20 8 -8 10 2 Z"
        fill={GR.bark}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path d="M2 -40 L20 -50 L22 -48 L6 -36 C5 -22 6 -10 8 1 H3 Z" fill="#4E3C58" opacity={0.6} />
      <ellipse cx="-2" cy="-14" rx="3" ry="4.5" fill="#3A2C44" stroke={INK} strokeWidth={1.4} />
      <path
        d="M-34 -56 C-44 -56 -44 -72 -30 -74 C-26 -84 -10 -84 -6 -74 C2 -74 2 -56 -8 -56 Z"
        fill="#2F6A76"
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path
        d="M6 -58 C-4 -58 -4 -74 8 -76 C12 -86 30 -86 34 -76 C44 -74 42 -58 30 -58 Z"
        fill="#2F6A76"
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path
        d="M-20 -70 C-30 -70 -32 -88 -16 -90 C-12 -102 10 -102 16 -90 C30 -90 32 -72 18 -70 Z"
        fill="#3E8790"
        stroke={INK}
        strokeWidth={2.3}
        strokeLinejoin="round"
      />
      <path d="M-12 -86 q10 -6 20 0" stroke="rgba(230,222,248,.6)" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {[
        [-22, -60],
        [20, -62],
        [0, -80],
        [-30, -68],
      ].map(([bx, by], i) => (
        <circle key={i} cx={bx} cy={by} r={2.3} fill={GR.wisp} stroke={INK} strokeWidth={1.1} />
      ))}
      <g transform="translate(23 -50)">
        <circle className="gr-glow" cx="0" cy="14" r="16" fill="url(#gr-glow-warm)" />
        <g className="gr-lantern">
          <path d="M0 0 V8" stroke={INK} strokeWidth={1.6} />
          <rect x="-4.5" y="8" width="9" height="11" rx="2.5" fill={GR.lantern} stroke={INK} strokeWidth={1.8} />
          <path d="M-5.5 8 H5.5" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        </g>
      </g>
    </g>
  )
}

/** Giant cracked chessboard courtyard with missing tiles and moss. */
function ChessCourtyard({ x, y, angle, rand }: { x: number; y: number; angle: number; rand: () => number }) {
  const N = 8
  const T = 28
  const half = (N * T) / 2
  const missing = new Set(['0-0', '0-1', '1-0', '7-7', '6-7', '7-6', '3-6', '5-1', '2-4'])
  const tiles: ReactNode[] = []
  const moss: ReactNode[] = []
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const key = `${r}-${c}`
      const tx = -half + c * T
      const ty = -half + r * T
      if (missing.has(key)) {
        moss.push(
          <path
            key={key}
            d={`M${tx + 7} ${ty + 20} q2 -7 3 -9 M${tx + 13} ${ty + 21} q0 -8 1 -10 M${tx + 19} ${ty + 20} q-2 -7 -3 -9`}
            stroke={GR.grassLight}
            strokeWidth={1.8}
            fill="none"
            strokeLinecap="round"
          />,
        )
        continue
      }
      const light = (r + c) % 2 === 0
      const jx = (rand() - 0.5) * 1.6
      const jy = (rand() - 0.5) * 1.6
      tiles.push(
        <g key={key}>
          <rect
            x={f(tx + 1 + jx)}
            y={f(ty + 1 + jy)}
            width={T - 2}
            height={T - 2}
            rx="2.5"
            fill={light ? GR.marble : GR.obsidian}
            stroke="rgba(47,36,32,.55)"
            strokeWidth={1.2}
          />
          {light && (
            <path
              d={`M${f(tx + 4 + jx)} ${f(ty + 5 + jy)} h${T - 12}`}
              stroke="#FFFFFF"
              strokeWidth={1.6}
              opacity={0.6}
              strokeLinecap="round"
            />
          )}
          {!light && (
            <path
              d={`M${f(tx + 4 + jx)} ${f(ty + 5 + jy)} h${T - 12}`}
              stroke={GR.obsidianLight}
              strokeWidth={1.6}
              opacity={0.8}
              strokeLinecap="round"
            />
          )}
        </g>,
      )
    }
  }
  const frame = half + 9
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${angle})`}>
      <rect x={-frame + 6} y={-frame + 10} width={frame * 2} height={frame * 2} rx="10" fill="rgba(12,10,34,.3)" />
      <path
        d={`M${-frame + 26} ${-frame} H${frame} V${frame - 30} L${frame - 8} ${frame - 20} L${frame - 2} ${frame - 8} L${frame - 14} ${frame} H${-frame} V${-frame + 30} L${-frame + 10} ${-frame + 18} Z`}
        fill={GR.stoneShade}
        stroke={INK}
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      <path
        d={`M${-frame + 26} ${-frame + 3} H${frame - 3} M${-frame + 3} ${-frame + 30} V${frame - 3}`}
        stroke={GR.stoneLight}
        strokeWidth={2.2}
        strokeLinecap="round"
        opacity={0.8}
      />
      <rect x={-half} y={-half} width={half * 2} height={half * 2} fill={GR.soil} stroke={INK} strokeWidth={2} />
      {tiles}
      {moss}
      {/* cracks */}
      <path
        d={`M${-half + 60} ${-half + 2} l6 14 l-5 10 l8 12 M${half - 40} ${half - 70} l-12 6 l-4 14 l-14 4`}
        fill="none"
        stroke={INK}
        strokeWidth={1.4}
        opacity={0.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* moss creeping over the frame corners */}
      <path
        d={`M${frame - 30} ${-frame - 2} C${frame - 20} ${-frame - 8} ${frame - 4} ${-frame - 4} ${frame + 2} ${-frame + 10} C${frame - 6} ${-frame + 14} ${frame - 22} ${-frame + 8} ${frame - 30} ${-frame - 2} Z`}
        fill={GR.ivyLight}
        stroke={INK}
        strokeWidth={1.6}
      />
      <path
        d={`M${-frame - 3} ${frame - 40} C${-frame - 8} ${frame - 24} ${-frame + 2} ${frame - 4} ${-frame + 16} ${frame + 2} C${-frame + 10} ${frame - 12} ${-frame + 4} ${frame - 26} ${-frame - 3} ${frame - 40} Z`}
        fill={GR.ivy}
        stroke={INK}
        strokeWidth={1.6}
      />
    </g>
  )
}

/** Ruined Gothic cloister wall with three tall lancet arches and moonlight pouring through. */
function CloisterArcade({ x, y, rand }: { x: number; y: number; rand: () => number }) {
  const arches = [-74, -4, 66]
  const archD = (cx: number, w = 23, top = -112) =>
    `M${cx - w} 0 V${top + 40} C${cx - w} ${top + 14} ${cx} ${top} ${cx} ${top} C${cx} ${top} ${cx + w} ${top + 14} ${cx + w} ${top + 40} V0 Z`
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      {/* floor of the cloister */}
      <Paving cx={-4} cy={26} rx={128} ry={34} rand={rand} cell={24} />
      {/* moonlight falling through the arches onto the floor */}
      {arches.map((cx) => (
        <path key={`l${cx}`} d={`M${cx - 23} 0 H${cx + 23} L${cx + 56} 56 H${cx + 6} Z`} fill="url(#gr-floor-light)" />
      ))}
      <ellipse cx="0" cy="4" rx="126" ry="10" fill="rgba(12,10,34,.3)" />
      {/* jagged ruined wall */}
      <path
        d="M-122 2 V-118 L-104 -134 L-86 -126 L-66 -150 L-40 -140 L-14 -162 L8 -150 L28 -158 L46 -134 L66 -144 L88 -120 L104 -126 L118 -96 V2 Z"
        fill={GR.stone}
        stroke={INK}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path d="M-122 -16 H118 V2 H-122 Z" fill={GR.stoneShade} opacity={0.55} />
      <path
        d="M-122 -46 H-100 M-50 -46 H-28 M20 -46 H42 M90 -46 H118 M-122 -84 H-100 M-50 -84 H-28 M20 -84 H42 M90 -84 H118 M-110 -84 V-46 M-38 -84 V-46 M30 -84 V-46 M104 -84 V-46 M-60 -132 H40 M-20 -132 V-112"
        stroke={GR.stoneDeep}
        strokeWidth={1.4}
        opacity={0.65}
      />
      {/* arch openings with the night sky beyond */}
      {arches.map((cx) => (
        <g key={cx}>
          <path d={archD(cx, 28, -120)} fill={GR.stoneLight} stroke={INK} strokeWidth={2.3} strokeLinejoin="round" />
          <path d={archD(cx)} fill="url(#gr-arch-night)" stroke={INK} strokeWidth={2.3} strokeLinejoin="round" />
          <circle cx={cx - 8} cy={-80} r="1.3" fill="#FFF7D6" />
          <circle cx={cx + 9} cy={-62} r="1" fill="#FFF7D6" />
          <circle cx={cx - 3} cy={-96} r="0.9" fill="#FFF7D6" />
          <path d={`M${cx - 23} 0 H${cx + 23} V-14 C${cx + 10} -22 ${cx - 10} -22 ${cx - 23} -14 Z`} fill="rgba(255,238,186,.22)" />
          {/* column capitals */}
          <rect x={cx - 31} y={-74} width="10" height="6" rx="1.5" fill={GR.stoneLight} stroke={INK} strokeWidth={1.6} />
          <rect x={cx + 21} y={-74} width="10" height="6" rx="1.5" fill={GR.stoneLight} stroke={INK} strokeWidth={1.6} />
        </g>
      ))}
      {/* round tracery window above the middle arch */}
      <circle cx="-4" cy="-138" r="10" fill={GR.lantern} stroke={INK} strokeWidth={2} />
      <path d="M-4 -148 V-128 M-14 -138 H6" stroke={INK} strokeWidth={1.4} />
      <circle className="gr-glow" cx="-4" cy="-138" r="20" fill="url(#gr-glow-warm)" />
      {/* ivy cascades */}
      <path
        d="M-104 -132 C-96 -116 -108 -100 -98 -84 C-92 -72 -102 -60 -96 -48"
        fill="none"
        stroke={GR.ivy}
        strokeWidth={3.6}
        strokeLinecap="round"
      />
      <path d="M46 -134 C40 -120 50 -108 42 -96" fill="none" stroke={GR.ivy} strokeWidth={3.4} strokeLinecap="round" />
      <path
        d="M104 -124 C96 -108 108 -94 100 -78 C94 -66 104 -56 98 -40"
        fill="none"
        stroke={GR.ivy}
        strokeWidth={3.4}
        strokeLinecap="round"
      />
      {[
        [-100, -118],
        [-102, -94],
        [-97, -66],
        [44, -118],
        [101, -104],
        [99, -72],
        [101, -50],
      ].map(([lx, ly], i) => (
        <circle key={i} cx={lx} cy={ly} r="3.2" fill={GR.ivyLight} stroke={INK} strokeWidth={1.2} />
      ))}
      {/* owl on top + ghost peeking from behind a column */}
      <RuinsOwl x={-40} y={-140} s={0.86} column={false} />
      <FriendlyGhost x={30} y={-14} s={0.92} flip lantern delay={-2.4} />
      {/* rubble */}
      <rect x="-120" y="10" width="14" height="10" rx="2" fill={GR.stone} stroke={INK} strokeWidth={1.8} transform="rotate(-14 -113 15)" />
      <rect
        x="-100"
        y="18"
        width="10"
        height="8"
        rx="2"
        fill={GR.stoneShade}
        stroke={INK}
        strokeWidth={1.6}
        transform="rotate(10 -95 22)"
      />
    </g>
  )
}

/** Ornamental moon pool with a knight fountain and a frog prince. */
function MoonPool({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      <ellipse cx="6" cy="12" rx="94" ry="54" fill="rgba(12,10,34,.3)" />
      <ellipse cx="0" cy="6" rx="90" ry="52" fill={GR.stoneShade} stroke={INK} strokeWidth={2.6} />
      <ellipse cx="0" cy="0" rx="88" ry="49" fill={GR.stoneLight} stroke={INK} strokeWidth={2.4} />
      <ellipse cx="0" cy="0" rx="88" ry="49" fill="none" stroke={GR.stoneShade} strokeWidth={1.4} strokeDasharray="12 10" />
      <ellipse cx="0" cy="2" rx="75" ry="38" fill="url(#gr-water)" stroke={INK} strokeWidth={2} />
      <ellipse cx="-4" cy="-4" rx="58" ry="24" fill="rgba(142,240,228,.25)" />
      {/* moon reflection */}
      <ellipse cx="-34" cy="6" rx="13" ry="5" fill={GR.moon} opacity={0.85} />
      <path
        className="gr-shimmer"
        d="M-52 14 h36 M-46 20 h24 M-40 -2 h14 M28 18 q10 -4 20 0 M30 -16 q8 -3 16 0"
        stroke={GR.waterLight}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      <ellipse className="gr-ripple" cx="0" cy="4" rx="28" ry="10" fill="none" stroke={GR.wisp} strokeWidth={1.8} opacity={0.8} />
      {/* lily pads + frog prince */}
      <path d="M44 6 m-12 0 a12 6 0 1 0 24 0 a12 6 0 1 0 -24 0 M44 6 L54 3" fill={GR.lily} stroke={INK} strokeWidth={1.5} />
      <path d="M-56 -10 m-9 0 a9 4.5 0 1 0 18 0 a9 4.5 0 1 0 -18 0" fill={GR.lily} stroke={INK} strokeWidth={1.4} />
      <g transform="translate(-56 -12)">
        <circle className="gr-glow" r="9" fill="url(#gr-glow-wisp)" />
        <path
          d="M-4 0 L-1 -6 L2 0 Z M-1 0 L3 -5 L4 1 Z M-1 0 L-5 -5 L-6 1 Z"
          fill={GR.glassPink}
          stroke={INK}
          strokeWidth={1}
          strokeLinejoin="round"
        />
      </g>
      <g transform="translate(44 2)">
        <ellipse cx="0" cy="0" rx="9" ry="7" fill={GR.frog} stroke={INK} strokeWidth={1.8} />
        <circle cx="-4.5" cy="-6" r="3.4" fill={GR.frog} stroke={INK} strokeWidth={1.6} />
        <circle cx="4.5" cy="-6" r="3.4" fill={GR.frog} stroke={INK} strokeWidth={1.6} />
        <circle cx="-4.5" cy="-6.4" r="1.4" fill={INK} />
        <circle cx="4.5" cy="-6.4" r="1.4" fill={INK} />
        <path d="M-4 1 q4 3 8 0" fill="none" stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
        <path
          d="M-5 -10 L-4 -14 L-1.5 -11 L0 -15 L1.5 -11 L4 -14 L5 -10 Z"
          fill={GR.gold}
          stroke={INK}
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
        <path d="M-9 4 C-12 6 -12 8 -9 8 M9 4 C12 6 12 8 9 8" fill="none" stroke={GR.frogDeep} strokeWidth={2} strokeLinecap="round" />
      </g>
      {/* central knight fountain */}
      <ellipse cx="0" cy="2" rx="16" ry="6" fill={GR.stoneShade} stroke={INK} strokeWidth={2} />
      <path d="M-8 2 V-14 H8 V2 Z" fill={GR.stone} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <ellipse cx="0" cy="-14" rx="13" ry="4.5" fill={GR.stoneLight} stroke={INK} strokeWidth={1.9} />
      <path
        d="M-7 -16 C-7 -24 -4 -31 -1 -37 L-7 -33 C-10 -31 -11 -34 -9 -37 L-1 -45 L2 -49 L4 -44 C10 -41 11 -30 8 -16 Z"
        fill={GR.marble}
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <circle cx="-2" cy="-39" r="1.3" fill={INK} />
      <path
        className="gr-glow"
        d="M-9 -34 C-22 -40 -28 -22 -30 -6 M6 -36 C20 -46 30 -26 32 -8"
        fill="none"
        stroke={GR.waterLight}
        strokeWidth={2.8}
        strokeLinecap="round"
      />
      <circle cx="-30" cy="-4" r="2" fill={GR.waterLight} />
      <circle cx="32" cy="-6" r="2" fill={GR.waterLight} />
    </g>
  )
}

/** Tall leaning ghost tower with lit windows and floating bricks. Base at 0. */
function GhostTower({ x, y }: { x: number; y: number }) {
  const st = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: 'round' as const }
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      <ellipse cx="6" cy="4" rx="54" ry="12" fill="rgba(12,10,34,.32)" />
      <g transform="rotate(-5)">
        {/* body */}
        <path d="M-32 2 L-28 -176 H28 L32 2 Z" fill={GR.stone} {...st} />
        <path d="M6 -176 H28 L32 2 H8 Z" fill={GR.stoneShade} opacity={0.6} />
        {[-150, -122, -94, -66, -38, -12].map((by, i) => (
          <path
            key={by}
            d={`M-30 ${by} H30 M${i % 2 ? -10 : 8} ${by} V${by - 28} M${i % 2 ? 14 : -16} ${by} V${by - 28}`}
            stroke={GR.stoneDeep}
            strokeWidth={1.3}
            opacity={0.6}
          />
        ))}
        {/* corbelled top with broken crenellations */}
        <path d="M-38 -176 H38 L34 -188 H-34 Z" fill={GR.stoneLight} {...st} />
        {[-36, -18, 16].map((mx) => (
          <rect key={mx} x={mx} y="-204" width="14" height="17" rx="2" fill={GR.stone} {...st} strokeWidth={2.2} />
        ))}
        <path d="M2 -188 L6 -196 L12 -190 Z" fill={GR.stone} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        {/* flag */}
        <path d="M-24 -204 V-238" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
        <path
          className="map-flag"
          d="M-24 -238 L2 -230 L-6 -226 L2 -220 L-24 -222 Z"
          fill={GR.roofLight}
          stroke={INK}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {/* big top window with a ghost peeking out */}
        <circle className="gr-glow" cx="0" cy="-146" r="30" fill="url(#gr-glow-warm)" />
        <path
          d="M-15 -128 V-150 C-15 -162 0 -168 0 -168 C0 -168 15 -162 15 -150 V-128 Z"
          fill={GR.lantern}
          stroke={INK}
          strokeWidth={2.3}
        />
        <g transform="translate(0 -128)">
          <path d="M-10 0 V-14 C-10 -24 10 -24 10 -14 V0 Z" fill={GR.ghost} stroke={INK} strokeWidth={2} />
          <ellipse cx="-3.5" cy="-14" rx="1.8" ry="2.3" fill={INK} />
          <ellipse cx="3.5" cy="-14" rx="1.8" ry="2.3" fill={INK} />
          <ellipse cx="-6.5" cy="-9.5" rx="2" ry="1.3" fill={GR.cheek} opacity={0.85} />
          <ellipse cx="6.5" cy="-9.5" rx="2" ry="1.3" fill={GR.cheek} opacity={0.85} />
          <path d="M-2.5 -9 q2.5 2.5 5 0" fill="none" stroke={INK} strokeWidth={1.5} strokeLinecap="round" />
          <path d="M-10 -6 C-15 -8 -16 -2 -11 -1" fill={GR.ghost} stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        </g>
        <rect x="-19" y="-130" width="38" height="6" rx="2" fill={GR.stoneLight} stroke={INK} strokeWidth={2} />
        {/* lower windows + door */}
        <path d="M-6 -76 V-90 A6 7 0 0 1 6 -90 V-76 Z" fill={GR.lantern} stroke={INK} strokeWidth={2} />
        <circle className="gr-glow" cx="0" cy="-84" r="16" fill="url(#gr-glow-warm)" />
        <path d="M-14 2 V-22 A14 15 0 0 1 14 -22 V2 Z" fill={GR.woodDeep} stroke={INK} strokeWidth={2.3} />
        <path d="M-7 2 V-30 M0 2 V-36 M7 2 V-30" stroke={INK} strokeWidth={1.3} opacity={0.5} />
        <circle cx="8" cy="-12" r="1.8" fill={GR.gold} />
        {/* ivy climbing */}
        <path
          d="M-30 -6 C-22 -30 -34 -52 -24 -74 C-18 -94 -30 -110 -22 -130"
          fill="none"
          stroke={GR.ivy}
          strokeWidth={3.8}
          strokeLinecap="round"
        />
        {[
          [-27, -24],
          [-28, -58],
          [-22, -86],
          [-26, -114],
        ].map(([lx, ly], i) => (
          <circle key={i} cx={lx} cy={ly} r="3.4" fill={GR.ivyLight} stroke={INK} strokeWidth={1.2} />
        ))}
      </g>
      {/* magically floating bricks */}
      <g className="gr-float" style={{ animationDelay: '-1.2s' }}>
        <rect x="30" y="-222" width="14" height="9" rx="2" fill={GR.stone} stroke={INK} strokeWidth={1.8} transform="rotate(16 37 -218)" />
        <rect
          x="46"
          y="-196"
          width="11"
          height="8"
          rx="2"
          fill={GR.stoneLight}
          stroke={INK}
          strokeWidth={1.7}
          transform="rotate(-12 51 -192)"
        />
        <circle cx="40" cy="-206" r="10" fill="url(#gr-glow-wisp)" />
      </g>
      {/* rubble at the foot */}
      <rect x="30" y="-8" width="14" height="10" rx="2" fill={GR.stone} stroke={INK} strokeWidth={1.8} transform="rotate(-12 37 -3)" />
      <rect x="-50" y="-6" width="11" height="8" rx="2" fill={GR.stoneShade} stroke={INK} strokeWidth={1.6} transform="rotate(14 -45 -2)" />
    </g>
  )
}

/** Caretaker's cottage just inside the castle wall. */
function Cottage({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={at(x, y, s)}>
      <Shadow rx={42} />
      <rect x="-30" y="-44" width="60" height="46" rx="3" fill={GR.stone} stroke={INK} strokeWidth={2.4} />
      <rect x="6" y="-44" width="24" height="46" fill={GR.stoneShade} opacity={0.5} />
      <path d="M-38 -42 L0 -80 L38 -42 Z" fill={GR.roof} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M0 -80 L38 -42 H6 Z" fill={GR.roofDeep} opacity={0.5} />
      <path d="M-26 -50 L-12 -64 M-14 -50 L0 -64" stroke={GR.roofLight} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
      <rect x="14" y="-78" width="9" height="22" rx="1.5" fill={GR.stoneShade} stroke={INK} strokeWidth={2} />
      <circle className="gr-mist" cx="19" cy="-86" r="5" fill={GR.mist} opacity={0.75} />
      <circle className="gr-mist" style={{ animationDelay: '-1.5s' }} cx="25" cy="-97" r="7" fill={GR.mist} opacity={0.55} />
      <path d="M-10 2 V-18 A10 10 0 0 1 10 -18 V2 Z" fill={GR.woodDeep} stroke={INK} strokeWidth={2.2} />
      <circle cx="5" cy="-7" r="1.6" fill={GR.gold} />
      <circle className="gr-glow" cx="-19" cy="-26" r="15" fill="url(#gr-glow-warm)" />
      <rect x="-25" y="-32" width="12" height="12" rx="2" fill={GR.lantern} stroke={INK} strokeWidth={1.8} />
      <path d="M-19 -32 V-20 M-25 -26 H-13" stroke={INK} strokeWidth={1.2} />
      <circle cx="-2" cy="-58" r="5" fill={GR.lantern} stroke={INK} strokeWidth={1.6} />
      <path d="M-28 -40 C-22 -34 -26 -26 -22 -20" fill="none" stroke={GR.ivyLight} strokeWidth={3} strokeLinecap="round" />
    </g>
  )
}

/** Gothic ghost abbey at the summit with stained-glass windows and a glowing portal. */
function GhostAbbey({ x, y }: { x: number; y: number }) {
  const s = { fill: GR.stone, stroke: INK, strokeWidth: 2.5, strokeLinejoin: 'round' as const }
  const r = { fill: GR.roof, stroke: INK, strokeWidth: 2.5, strokeLinejoin: 'round' as const }
  const glass = (wx: number, wy: number, w: number, h: number, key: string) => (
    <g key={key}>
      <path
        d={`M${wx - w} ${wy} V${wy - h + w} A${w} ${w * 1.25} 0 0 1 ${wx + w} ${wy - h + w} V${wy} Z`}
        fill={GR.lantern}
        stroke={INK}
        strokeWidth={2}
      />
      <path d={`M${wx - w} ${wy - h * 0.45} H${wx + w} V${wy} H${wx - w} Z`} fill={GR.glassMint} opacity={0.75} />
      <path d={`M${wx} ${wy - h * 0.45} H${wx + w} V${wy} H${wx} Z`} fill={GR.glassPink} opacity={0.7} />
      <path d={`M${wx} ${wy - h + 2} V${wy} M${wx - w} ${wy - h * 0.45} H${wx + w}`} stroke={INK} strokeWidth={1.3} />
    </g>
  )
  const rose = [GR.glassMint, GR.glassPink, GR.lantern, GR.glassBlue, GR.glassMint, GR.glassPink, GR.lantern, GR.glassBlue]
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="10" rx="172" ry="20" fill="rgba(12,10,34,.34)" />
      {/* flying buttresses */}
      <path
        d="M-150 6 V-36 C-140 -48 -120 -60 -96 -64 L-96 -52 C-116 -48 -132 -38 -138 -28 V6 Z"
        fill={GR.stoneShade}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path
        d="M150 6 V-36 C140 -48 120 -60 96 -64 L96 -52 C116 -48 132 -38 138 -28 V6 Z"
        fill={GR.stoneShade}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />

      {/* left grand spire tower */}
      <rect x="-140" y="-118" width="50" height="124" rx="2" {...s} />
      <rect x="-112" y="-118" width="22" height="124" fill={GR.stoneShade} opacity={0.55} />
      <path d="M-146 -116 L-115 -196 L-84 -116 Z" {...r} />
      <path d="M-115 -196 L-84 -116 H-110 Z" fill={GR.roofDeep} opacity={0.55} />
      <path
        d="M-134 -126 L-122 -142 M-128 -112 L-112 -132 M-122 -152 L-114 -166"
        stroke={GR.roofLight}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.75}
      />
      <rect x="-146" y="-122" width="62" height="8" rx="2" fill={GR.stoneLight} stroke={INK} strokeWidth={2.2} />
      <path d="M-115 -196 V-216" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      <path
        className="map-flag"
        d="M-115 -216 L-90 -209 L-115 -202 Z"
        fill={GR.gold}
        stroke={INK}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <circle className="gr-glow" cx="-115" cy="-80" r="26" fill="url(#gr-glow-warm)" />
      {glass(-115, -62, 8, 38, 'lt')}
      <path d="M-140 -20 H-90" stroke={GR.stoneDeep} strokeWidth={1.4} opacity={0.6} />

      {/* right broken belfry with exposed rafters and a ghost ringing the bell */}
      <path d="M90 6 V-128 L104 -136 L116 -126 L132 -138 L142 -130 V6 Z" {...s} />
      <path d="M118 -128 L142 -130 V6 H118 Z" fill={GR.stoneShade} opacity={0.55} />
      <path
        d="M116 -178 L148 -126 M120 -160 H128 M114 -146 H137 M108 -134 H144"
        fill="none"
        stroke={INK}
        strokeWidth={5.5}
        strokeLinecap="round"
      />
      <path
        d="M116 -178 L148 -126 M120 -160 H128 M114 -146 H137 M108 -134 H144"
        fill="none"
        stroke={GR.wood}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <path d="M84 -126 L116 -178 L120 -162 L112 -152 L117 -142 L106 -134 L110 -126 Z" {...r} />
      <path d="M94 -136 L104 -150 M100 -128 L108 -140" stroke={GR.roofLight} strokeWidth={2} strokeLinecap="round" opacity={0.75} />
      <path d="M100 -70 V-98 A16 16 0 0 1 132 -98 V-70 Z" fill={GR.roofDeep} stroke={INK} strokeWidth={2.2} />
      <g className="gr-bell">
        <path d="M116 -106 V-100" stroke={INK} strokeWidth={2} />
        <path d="M107 -80 C107 -94 125 -94 125 -80 L128 -75 H104 Z" fill={GR.gold} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
        <circle cx="116" cy="-73" r="2.6" fill={GR.lanternDeep} stroke={INK} strokeWidth={1.2} />
      </g>
      <path
        d="M142 -124 C134 -110 144 -96 136 -80 C142 -66 134 -54 140 -40"
        fill="none"
        stroke={GR.ivy}
        strokeWidth={3.6}
        strokeLinecap="round"
      />
      <circle cx="138" cy="-102" r="3.4" fill={GR.ivyLight} stroke={INK} strokeWidth={1.2} />
      <circle cx="137" cy="-66" r="3" fill={GR.ivyLight} stroke={INK} strokeWidth={1.2} />
      <FriendlyGhost x={-166} y={-150} s={0.72} lantern={false} shadow={false} delay={-0.8} />

      {/* central nave + roof with a hole */}
      <rect x="-94" y="-84" width="188" height="90" {...s} />
      <path d="M30 -84 H94 V6 H30 Z" fill={GR.stoneShade} opacity={0.4} />
      <path d="M-100 -82 L-60 -130 L-28 -120 L0 -152 L28 -122 L60 -128 L100 -82 Z" {...r} />
      <path d="M-84 -92 L-62 -118 M-70 -88 L-50 -112" stroke={GR.roofLight} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
      {/* front gable with the rose window */}
      <path d="M-58 -84 L0 -144 L58 -84 Z" fill={GR.stoneLight} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M0 -152 V-180" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <path className="map-flag" d="M0 -180 L30 -172 L0 -164 Z" fill={GR.flag} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <circle className="gr-glow" cx="0" cy="-104" r="34" fill="url(#gr-glow-warm)" />
      <circle cx="0" cy="-104" r="20" fill={GR.lantern} stroke={INK} strokeWidth={2.4} />
      {rose.map((c, i) => {
        const a0 = (i * Math.PI) / 4
        const a1 = a0 + Math.PI / 4
        return (
          <path
            key={i}
            d={`M0 -104 L${f(Math.cos(a0) * 18)} ${f(-104 + Math.sin(a0) * 18)} A18 18 0 0 1 ${f(Math.cos(a1) * 18)} ${f(-104 + Math.sin(a1) * 18)} Z`}
            fill={c}
            stroke={INK}
            strokeWidth={1.2}
          />
        )
      })}
      <circle cx="0" cy="-104" r="6" fill="#FFF7D6" stroke={INK} strokeWidth={1.5} />
      {glass(-70, -30, 8, 42, 'l1')}
      {glass(70, -30, 8, 42, 'r1')}
      {/* glowing portal (brightens when the chest is ready/open) */}
      <circle className="gr-abbey-glow" cx="0" cy="-26" r="56" fill="url(#gr-glow-portal)" />
      <path d="M-34 6 V-34 C-34 -58 0 -70 0 -70 C0 -70 34 -58 34 -34 V6 Z" fill={GR.stoneLight} stroke={INK} strokeWidth={2.6} />
      <path d="M-26 6 V-32 C-26 -50 0 -60 0 -60 C0 -60 26 -50 26 -32 V6 Z" fill={GR.roofDeep} stroke={INK} strokeWidth={2.2} />
      <path className="gr-abbey-glow" d="M-24 6 V-31 C-24 -48 0 -57 0 -57 C0 -57 24 -48 24 -31 V6 Z" fill="url(#gr-glow-portal)" />
      {/* steps */}
      <rect x="-46" y="2" width="92" height="7" rx="2.5" fill={GR.stoneLight} stroke={INK} strokeWidth={2} />
      <rect x="-56" y="8" width="112" height="7" rx="2.5" fill={GR.stone} stroke={INK} strokeWidth={2} />
      {/* ivy over the nave */}
      <path
        d="M-92 -78 C-84 -66 -94 -54 -86 -40 C-80 -30 -88 -20 -84 -8"
        fill="none"
        stroke={GR.ivy}
        strokeWidth={3.6}
        strokeLinecap="round"
      />
      <circle cx="-88" cy="-60" r="3.2" fill={GR.ivyLight} stroke={INK} strokeWidth={1.2} />
      <circle cx="-84" cy="-30" r="3" fill={GR.ivyLight} stroke={INK} strokeWidth={1.2} />
      {/* mist banks along the foundation */}
      <path
        className="gr-mist"
        d="M-186 16 C-200 16 -198 -2 -180 -4 C-172 -18 -146 -16 -138 -4 C-128 -10 -112 -4 -110 8 V18 Z"
        fill={GR.mist}
        opacity={0.82}
      />
      <path
        className="gr-mist"
        style={{ animationDelay: '-2.6s' }}
        d="M110 18 V8 C112 -4 128 -10 138 -4 C146 -16 172 -18 180 -4 C198 -2 200 16 186 16 Z"
        fill={GR.mist}
        opacity={0.82}
      />
    </g>
  )
}

/** Drachenburg teaser (World 8): crimson-roofed fortress on a crag with a tiny dragon. */
function DragonCastleTeaser({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const line = 'rgba(47,36,32,.7)'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle className="gr-glow" cx="0" cy="-26" r="60" fill="url(#gr-glow-dragon)" />
      <path
        d="M-58 20 L-36 -10 L-22 -4 L0 -26 L24 -8 L40 -14 L60 20 Z"
        fill={GR.dragonRock}
        stroke={line}
        strokeWidth={2.1}
        strokeLinejoin="round"
      />
      <path d="M0 -26 L24 -8 L40 -14 L60 20 H4 Z" fill={GR.dragonRockDeep} opacity={0.62} />
      <rect x="-26" y="-44" width="14" height="36" fill={GR.dragonWall} stroke={line} strokeWidth={1.9} />
      <path d="M-30 -44 L-19 -60 L-8 -44 Z" fill={GR.dragonRoof} stroke={line} strokeWidth={1.9} strokeLinejoin="round" />
      <rect x="12" y="-44" width="14" height="36" fill={GR.dragonWall} stroke={line} strokeWidth={1.9} />
      <path d="M8 -44 L19 -60 L30 -44 Z" fill={GR.dragonRoof} stroke={line} strokeWidth={1.9} strokeLinejoin="round" />
      <rect x="-14" y="-52" width="28" height="44" fill={GR.dragonWall} stroke={line} strokeWidth={2} />
      <path d="M-19 -52 L0 -74 L19 -52 Z" fill={GR.dragonRoof} stroke={line} strokeWidth={2} strokeLinejoin="round" />
      <rect x="-4" y="-42" width="8" height="11" rx="4" fill={GR.dragonGold} stroke={line} strokeWidth={1.3} />
      <circle cx="-19" cy="-32" r="2.6" fill={GR.dragonGold} />
      <circle cx="19" cy="-32" r="2.6" fill={GR.dragonGold} />
      <g transform="translate(-34 -64)">
        <g className="gr-float">
          <path
            d="M-8 2 C-4 -6 2 -4 6 -2 C9 -4 12 -3 14 -1 C10 1 8 3 4 3 C1 6 -3 4 -8 2 Z"
            fill={GR.dragonRoof}
            stroke={line}
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
          <path d="M-2 -2 L-10 -10 L2 -6 Z" fill={GR.dragonRoof} stroke={line} strokeWidth={1.3} strokeLinejoin="round" />
          <path d="M15 -1 Q22 -5 25 0 Q20 4 15 -1 Z" fill={GR.dragonFire} />
          <circle cx="18" cy="-1" r="2" fill={GR.dragonGold} />
        </g>
      </g>
      <path
        d="M-64 22 C-72 22 -72 10 -60 10 C-52 2 -32 4 -24 12 C-12 4 12 4 22 12 C34 4 54 4 62 12 C72 12 72 22 62 22 Z"
        fill={GR.mist}
        opacity={0.8}
      />
    </g>
  )
}

/** Big sleepy full moon with halo rings. */
function Moon({ x, y, r = 40 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r * 4} fill="url(#gr-moon-glow)" />
      <circle r={r * 1.7} fill="rgba(255,238,186,.08)" />
      <circle r={r * 1.35} fill="rgba(255,238,186,.12)" />
      <circle r={r} fill={GR.moon} stroke={INK} strokeWidth={2.6} />
      <path
        d={`M${r * 0.25} ${-r * 0.97} A${r} ${r} 0 0 1 ${r * 0.25} ${r * 0.97} A${r * 0.78} ${r} 0 0 0 ${r * 0.25} ${-r * 0.97} Z`}
        fill={GR.moonShade}
        opacity={0.7}
      />
      <circle cx={-r * 0.5} cy={-r * 0.45} r={r * 0.14} fill={GR.moonShade} />
      <circle cx={r * 0.45} cy={r * 0.5} r={r * 0.1} fill={GR.moonShade} />
      <circle cx={r * 0.55} cy={-r * 0.3} r={r * 0.07} fill={GR.moonShade} />
      <path
        d={`M${-r * 0.55} ${-r * 0.68} q${r * 0.2} ${-r * 0.12} ${r * 0.4} ${-r * 0.06}`}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={2.4}
        strokeLinecap="round"
        opacity={0.8}
      />
      <SleepyFace y={r * 0.05} dx={r * 0.2} s={1.25} />
    </g>
  )
}

/** Wooden signpost pole under MapScreen's start sign. */
function Signpost({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 V-34" stroke={INK} strokeWidth={4} strokeLinecap="round" />
    </g>
  )
}

// ---------------------------------------------------------------- scene

interface MapArtProps {
  height: number
  pts: Pt[]
  walkedTo: number
  stones: number
}

export function MapArtGhostRuins({ height, pts, walkedTo, stones }: MapArtProps) {
  const rand = seeded(79)
  const chest = chestSpot(pts)
  const skyEnd = chest.y - 40
  const S = (i: number) => pts[Math.max(1, Math.min(stones, i))]
  const H = height

  // ---- set-piece anchors (relative to the trail so other stone counts still work)
  const gateBase = pointOn(pts, 0, 0.3)
  const gateX = pointOn(pts, 0, 0.4).x
  const moatAt = pointOn(pts, 1, 0.5)
  const moatTop: [number, number][] = [
    [-20, moatAt.y + 14],
    [50, moatAt.y + 8],
    [120, moatAt.y - 4],
    [moatAt.x, moatAt.y - 16],
    [270, moatAt.y - 28],
    [340, moatAt.y - 40],
    [420, moatAt.y - 34],
  ]
  const moatBottom: [number, number][] = [
    [-20, moatAt.y + 66],
    [50, moatAt.y + 56],
    [120, moatAt.y + 34],
    [moatAt.x, moatAt.y + 20],
    [270, moatAt.y + 18],
    [340, moatAt.y + 20],
    [420, moatAt.y + 30],
  ]
  const board = { x: 236, y: (S(3).y + S(4).y) / 2 + 30 }
  const arcade = { x: 96, y: S(5).y + 4 }
  const pool = { x: 304, y: (S(8).y + S(9).y) / 2 }
  const tower = { x: 78, y: S(11).y + 54 }
  const cottage = { x: 344, y: gateBase.y - 50 }

  const near = (p: Pt, c: Pt, rx: number, ry: number) => ((p.x - c.x) / rx) ** 2 + ((p.y - c.y) / ry) ** 2 < 1
  const blocked = (p: Pt) => {
    if (p.y < skyEnd + 70 || p.y > gateBase.y - 50) return true
    if (p.y > moatAt.y - 50 && p.y < moatAt.y + 80) return true
    if (near(p, board, 150, 150)) return true
    if (p.x < 230 && p.y > arcade.y - 180 && p.y < arcade.y + 70) return true
    if (near(p, pool, 120, 80)) return true
    if (p.x < 160 && p.y > tower.y - 250 && p.y < tower.y + 30) return true
    if (near(p, cottage, 70, 70)) return true
    if (near(p, { x: 344, y: S(10).y + 30 }, 60, 60) || near(p, { x: 36, y: S(8).y }, 50, 60)) return true
    return false
  }

  // ---- lamp posts lining the path (alternating sides)
  const lamps: { y: number; node: ReactNode }[] = []
  const lampPts: Pt[] = []
  for (let seg = 1; seg < stones; seg++) {
    const a = pointOn(pts, seg, 0.45)
    const b = pointOn(pts, seg, 0.55)
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
    const side = seg % 2 ? 1 : -1
    const p = { x: (a.x + b.x) / 2 + (-(b.y - a.y) / len) * 40 * side, y: (a.y + b.y) / 2 + ((b.x - a.x) / len) * 40 * side + 16 }
    if (p.x < 20 || p.x > MAP_W - 20 || blocked(p)) continue
    lampPts.push(p)
    lamps.push({ y: p.y, node: <LampPost key={`lp${seg}`} x={p.x} y={p.y} s={0.92} flip={p.x > (a.x + b.x) / 2} /> })
  }

  // ---- small scattered decor
  const spots = scatterSpots({ pts, stones, rand, perSide: 1, clear: 54, gap: 70, spread: 80, blocked, taken: lampPts })
  const deco: { y: number; node: ReactNode }[] = spots.map((p, k) => {
    const r = rand()
    const node =
      r < 0.14 ? (
        <BrokenColumn key={`bc${k}`} x={p.x} y={p.y} s={0.9} flip={p.side < 0} />
      ) : r < 0.38 ? (
        <GlowMushrooms key={`gm${k}`} x={p.x} y={p.y} s={0.95} />
      ) : r < 0.6 ? (
        <FriendlyGhost key={`fg${k}`} x={p.x} y={p.y} s={0.9} flip={p.side < 0} lantern={k % 2 === 0} delay={-rand() * 4} />
      ) : r < 0.78 ? (
        <ChessStatue key={`cs${k}`} x={p.x} y={p.y} s={0.86} kind={k % 2 ? 'knight' : 'rook'} flip={p.side < 0} />
      ) : (
        <RuinsOwl key={`ro${k}`} x={p.x} y={p.y} s={0.86} flip={p.side < 0} />
      )
    return { y: p.y, node }
  })
  // giant sleeping chess pieces on the board
  deco.push({ y: board.y - 26, node: <GiantKing key="gk" x={board.x + 70} y={board.y - 26} s={0.95} /> })
  deco.push({ y: board.y + 62, node: <GiantKnight key="gn" x={board.x + 40} y={board.y + 62} s={0.82} /> })
  deco.push({ y: board.y + 20, node: <GiantPawn key="gp" x={board.x - 14} y={board.y + 20} s={0.8} /> })
  deco.push({ y: S(10).y + 60, node: <SpookyTree key="st1" x={344} y={S(10).y + 60} s={1} /> })
  deco.push({ y: S(8).y + 30, node: <SpookyTree key="st2" x={36} y={S(8).y + 30} s={0.85} flip /> })
  deco.push({ y: board.y - 70, node: <FriendlyGhost key="bg" x={board.x + 16} y={board.y - 72} s={0.95} lantern delay={-0.6} /> })
  deco.push({ y: pool.y + 70, node: <FriendlyGhost key="pg" x={pool.x - 86} y={pool.y + 72} s={0.88} flip lantern delay={-3.1} /> })
  deco.push(...lamps)
  deco.sort((a, b) => a.y - b.y)

  // ---- ground texture
  const groundCover: ReactNode[] = []
  for (let i = 0; i < stones * 7; i++) {
    const x = 10 + rand() * (MAP_W - 20)
    const y = skyEnd + 60 + rand() * (H - skyEnd - 80)
    if (pts.some((q) => Math.hypot(q.x - x, q.y - y) < 40)) continue
    if (near({ x, y }, board, 140, 140) || near({ x, y }, pool, 96, 60)) continue
    if (y > moatAt.y - 40 && y < moatAt.y + 70) continue
    const pick = rand()
    if (pick < 0.6) {
      groundCover.push(
        <path
          key={`gt${i}`}
          d={`M${f(x - 5)} ${f(y)} q2 -7 3 -9 M${f(x)} ${f(y)} q0 -8 1 -11 M${f(x + 5)} ${f(y)} q-2 -7 -3 -9`}
          stroke={GR.grassLight}
          strokeWidth={1.9}
          fill="none"
          strokeLinecap="round"
          opacity={0.8}
        />,
      )
    } else if (pick < 0.85) {
      groundCover.push(
        <rect
          key={`gs${i}`}
          x={f(x - 7)}
          y={f(y - 4)}
          width={14}
          height={8}
          rx={3}
          fill={GR.pave}
          opacity={0.55}
          stroke="rgba(47,36,32,.35)"
          strokeWidth={1.1}
        />,
      )
    } else {
      groundCover.push(<circle key={`gf${i}`} cx={f(x)} cy={f(y)} r={2.2} fill={GR.wisp} opacity={0.9} />)
    }
  }
  const patches: ReactNode[] = []
  for (let k = 0; k < 14; k++) {
    const x = rand() * MAP_W
    const y = skyEnd + 80 + rand() * (H - skyEnd - 100)
    patches.push(<ellipse key={`gp${k}`} cx={f(x)} cy={f(y)} rx={f(60 + rand() * 60)} ry={f(30 + rand() * 24)} fill="url(#gr-patch)" />)
  }

  // ---- atmosphere
  const wisps: ReactNode[] = []
  for (let k = 0; k < 12; k++) {
    const x = 20 + rand() * (MAP_W - 40)
    const y = skyEnd + 90 + rand() * (H - skyEnd - 220)
    wisps.push(<WillOWisp key={`w${k}`} x={x} y={y} s={0.75 + (k % 3) * 0.14} delay={-rand() * 5.2} />)
  }
  const fogY = [S(2).y - 40, S(5).y + 50, S(7).y - 20, S(10).y + 40, skyEnd + 70]
  const fog = fogY.map((fy, k) => (
    <g key={`fog${k}`} className="gr-fog" style={{ animationDelay: `${-k * 3.3}s` }}>
      <ellipse cx={k % 2 ? 70 : 330} cy={f(fy)} rx="200" ry="26" fill="url(#gr-fog)" />
    </g>
  ))
  const skyDots: ReactNode[] = []
  for (let k = 0; k < 46; k++) {
    const x = rand() * MAP_W
    const y = rand() * (skyEnd - 60)
    if (Math.hypot(x - 150, y - 72) < 64) continue
    skyDots.push(<circle key={`sd${k}`} cx={f(x)} cy={f(y)} r={f(0.7 + rand() * 1.2)} fill="#FFF7D6" opacity={f(0.45 + rand() * 0.5)} />)
  }
  const twinkles = [
    [30, 30, 1],
    [168, 40, 0.8],
    [204, 18, 1.1],
    [232, 74, 0.75],
    [380, 24, 0.9],
    [150, 120, 0.7],
    [24, 172, 0.8],
    [370, 210, 0.7],
  ]

  const road = pathD(pts, 0, stones + 1)
  const walked = walkedTo > 0 ? pathD(pts, 0, Math.min(walkedTo, stones + 1)) : ''

  return (
    <svg className="map__art" viewBox={`0 0 ${MAP_W} ${H}`} aria-hidden="true">
      <defs>
        <linearGradient id="gr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GR.skyTop} />
          <stop offset="0.45" stopColor={GR.skyMid} />
          <stop offset="0.8" stopColor={GR.skyLow} />
          <stop offset="1" stopColor={GR.skyHorizon} />
        </linearGradient>
        <linearGradient id="gr-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GR.groundTop} />
          <stop offset="0.4" stopColor={GR.groundMid} />
          <stop offset="1" stopColor={GR.groundBottom} />
        </linearGradient>
        <linearGradient id="gr-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GR.waterLight} />
          <stop offset="0.45" stopColor={GR.water} />
          <stop offset="1" stopColor={GR.waterDeep} />
        </linearGradient>
        <linearGradient id="gr-arch-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C1748" />
          <stop offset="0.7" stopColor="#3B2F78" />
          <stop offset="1" stopColor="#7A64B4" />
        </linearGradient>
        <linearGradient id="gr-floor-light" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={`rgb(${GR.moonGlow})`} stopOpacity="0.42" />
          <stop offset="1" stopColor={`rgb(${GR.moonGlow})`} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gr-beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`rgb(${GR.moonGlow})`} stopOpacity="0.2" />
          <stop offset="1" stopColor={`rgb(${GR.moonGlow})`} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gr-vignette" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0C0A24" stopOpacity="0.42" />
          <stop offset="0.14" stopColor="#0C0A24" stopOpacity="0" />
          <stop offset="0.86" stopColor="#0C0A24" stopOpacity="0" />
          <stop offset="1" stopColor="#0C0A24" stopOpacity="0.42" />
        </linearGradient>
        <radialGradient id="gr-moon-glow">
          <stop offset="0" stopColor={`rgb(${GR.moonGlow})`} stopOpacity="0.55" />
          <stop offset="0.4" stopColor={`rgb(${GR.moonGlow})`} stopOpacity="0.16" />
          <stop offset="1" stopColor={`rgb(${GR.moonGlow})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gr-glow-warm">
          <stop offset="0" stopColor={`rgb(${GR.lanternGlow})`} stopOpacity="0.85" />
          <stop offset="1" stopColor={`rgb(${GR.lanternGlow})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gr-glow-wisp">
          <stop offset="0" stopColor={`rgb(${GR.wispGlow})`} stopOpacity="0.85" />
          <stop offset="1" stopColor={`rgb(${GR.wispGlow})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gr-glow-ghost">
          <stop offset="0" stopColor="#E9FFF8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#E9FFF8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gr-glow-portal">
          <stop offset="0" stopColor="#FFFDF2" stopOpacity="0.95" />
          <stop offset="0.35" stopColor={`rgb(${GR.wispGlow})`} stopOpacity="0.8" />
          <stop offset="0.7" stopColor={`rgb(${GR.lanternGlow})`} stopOpacity="0.35" />
          <stop offset="1" stopColor={`rgb(${GR.wispGlow})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gr-glow-dragon">
          <stop offset="0" stopColor="#FFAE52" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFAE52" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gr-pool">
          <stop offset="0" stopColor="#D8FFF4" stopOpacity="0.32" />
          <stop offset="0.6" stopColor="#B8F4E8" stopOpacity="0.12" />
          <stop offset="1" stopColor="#B8F4E8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gr-patch">
          <stop offset="0" stopColor={GR.grass} stopOpacity="0.75" />
          <stop offset="1" stopColor={GR.grass} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gr-fog">
          <stop offset="0" stopColor={GR.mist} stopOpacity="0.3" />
          <stop offset="0.6" stopColor={GR.mist} stopOpacity="0.12" />
          <stop offset="1" stopColor={GR.mist} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. night ground + starry sky */}
      <rect width={MAP_W} height={H} fill="url(#gr-ground)" />
      <rect width={MAP_W} height={skyEnd + 14} fill="url(#gr-sky)" />
      {skyDots}
      {twinkles.map(([sx, sy, ss], i) => (
        <TwinkleStar key={i} x={sx} y={sy} s={ss} delay={-i * 0.65} />
      ))}
      <Moon x={150} y={72} r={36} />
      <Bat x={56} y={70} s={0.85} delay={-0.4} />
      <Bat x={214} y={28} s={0.65} delay={-1.7} />
      <Bat x={240} y={100} s={0.7} delay={-2.6} />

      {/* moonbeams slanting across the sky */}
      <path d={`M130 60 L170 80 L${MAP_W - 40} ${skyEnd + 10} L${MAP_W - 150} ${skyEnd + 10} Z`} fill="url(#gr-beam)" />
      <path d={`M120 90 L140 100 L110 ${skyEnd + 10} L40 ${skyEnd + 10} Z`} fill="url(#gr-beam)" />

      {/* 2. Drachenburg teaser (World 8) under its sign */}
      <DragonCastleTeaser x={308} y={150} s={0.8} />

      {/* 3. distant ruined skyline + abbey hill */}
      <path
        d={`M0 ${skyEnd - 30} H18 V${skyEnd - 84} L28 ${skyEnd - 96} L38 ${skyEnd - 84} V${skyEnd - 50} H62 V${skyEnd - 64} H70 V${skyEnd - 58} H78 V${skyEnd - 66} H86 V${skyEnd - 46} H330 V${skyEnd - 72} L338 ${skyEnd - 80} L348 ${skyEnd - 66} V${skyEnd - 92} L360 ${skyEnd - 108} L372 ${skyEnd - 92} V${skyEnd - 54} H${MAP_W} V${skyEnd + 20} H0 Z`}
        fill={GR.skyline}
        stroke="rgba(47,36,32,.35)"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <rect x="25" y={skyEnd - 76} width="5" height="8" rx="2" fill={GR.lantern} opacity={0.8} />
      <rect x="357" y={skyEnd - 88} width="5" height="8" rx="2" fill={GR.lantern} opacity={0.8} />
      <path
        d={`M0 ${skyEnd - 20} Q80 ${skyEnd - 62} 160 ${skyEnd - 34} Q250 ${skyEnd - 66} 320 ${skyEnd - 36} Q368 ${skyEnd - 52} ${MAP_W} ${skyEnd - 30} V${skyEnd + 24} H0 Z`}
        fill={GR.skylineDeep}
        stroke="rgba(47,36,32,.3)"
        strokeWidth={2}
      />
      <path
        d={`M0 ${skyEnd + 16} C95 ${skyEnd - 30} 305 ${skyEnd - 30} ${MAP_W} ${skyEnd + 16} V${skyEnd + 70} H0 Z`}
        fill={GR.groundTop}
        stroke="rgba(47,36,32,.3)"
        strokeWidth={2}
      />

      {/* 4. ground texture */}
      {patches}
      <Paving cx={MAP_W / 2} cy={chest.y + 30} rx={170} ry={36} rand={rand} cell={24} />
      <Paving cx={gateX + 10} cy={gateBase.y - 40} rx={110} ry={28} rand={rand} cell={22} />
      <Paving cx={S(7).x - 40} cy={S(7).y + 20} rx={70} ry={26} rand={rand} />
      <Paving cx={S(10).x + 30} cy={S(10).y + 20} rx={66} ry={24} rand={rand} />
      {groundCover}

      {/* 5. big set pieces under the trail */}
      <Moat top={moatTop} bottom={moatBottom} rand={rand} />
      <ChessCourtyard x={board.x} y={board.y} angle={-6} rand={rand} />
      <MoonPool x={pool.x} y={pool.y} />
      <Cottage x={cottage.x} y={cottage.y} s={0.86} />

      {/* moonlight pools under every puzzle stone */}
      {pts.slice(1, stones + 1).map((p, i) => (
        <ellipse key={`cl${i}`} cx={p.x} cy={p.y + 6} rx={58} ry={34} fill="url(#gr-pool)" />
      ))}

      {/* 6. cobblestone trail + stone bridge */}
      <path
        d={road}
        fill="none"
        stroke="rgba(12,10,34,.3)"
        strokeWidth={44}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(3 6)"
      />
      <path d={road} fill="none" stroke={INK} strokeWidth={38} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={GR.trailEdge} strokeWidth={32} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={GR.trail} strokeWidth={25} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={GR.trailSlab} strokeWidth={19} strokeDasharray="11 4" strokeLinejoin="round" />
      <StoneBridge pts={pts} seg={1} t0={0.26} t1={0.74} />
      {walked && (
        <path d={walked} fill="none" stroke="#C9372C" strokeWidth={5} strokeLinecap="round" strokeDasharray="10 12" opacity={0.85} />
      )}

      {/* 7. ruins beside the trail */}
      <CloisterArcade x={arcade.x} y={arcade.y} rand={rand} />
      <GhostTower x={tower.x} y={tower.y} />
      <GhostBoat x={326} y={moatAt.y - 6} />

      {/* 8. y-sorted decor */}
      {deco.map((d) => d.node)}

      {/* 9. castle gate at the start */}
      <RuinGate x={gateX} y={gateBase.y + 10} />
      <GlowMushrooms x={40} y={H - 22} s={1.05} />
      <LampPost x={250} y={H - 18} s={0.95} flip />
      <FriendlyGhost x={340} y={H - 40} s={0.95} flip delay={-0.4} />
      <Signpost x={pts[0].x - 74} y={pts[0].y - 6} />

      {/* 10. summit: ghost abbey */}
      <GhostAbbey x={MAP_W / 2} y={chest.y - 24} />
      <LampPost x={30} y={chest.y + 40} s={1.05} />
      <FriendlyGhost x={MAP_W - 40} y={chest.y + 34} s={0.95} flip delay={-2.1} />

      {/* 11. atmosphere: fog banks, wisps, edge vignette */}
      {fog}
      {wisps}
      <rect width={MAP_W} height={H} fill="url(#gr-vignette)" pointerEvents="none" />
    </svg>
  )
}
