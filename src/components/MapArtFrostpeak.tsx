/**
 * Frostgipfel (Frostpeak): die Gipfelszene der Karte – kalter Alpenhimmel mit Wintersonne,
 * drei verschneite Bergketten, Eispalast mit Gletschertor und Kristall-Laterne an der Truhe,
 * Berghütte mit Rauch, Holzstoß und Schneemann am Start, gefrorener See mit Pinguin, Schneepfad,
 * verschneite Zirben, Frostbüsche, Steinmänner, Felsbänder mit Eiszapfen, Eiskristalle,
 * Schneeflocken und Funkeln; am Kartenende der warme Glutvulkan-Teaser (Welt 5).
 * Props wie `MapArt`. Zufall nur über `seeded()`.
 *
 * Bildsprache: art-guide.md (Feature 006).
 */
import type { ReactNode } from 'react'
import { MAP_W, chestSpot, pathD, pointOn, scatterSpots, seeded, type Pt } from '../game/mapPath'

const INK = '#2F2420'

/** Frostpeak palette – shared values mirror tokens.css (see art-guide.md §2). */
export const FP = {
  skyTop: '#8EBDE6',
  skyMid: '#B5D3EF',
  skyLow: '#DCE5F6',
  skyHorizon: '#ECE9F7',
  sun: '#FFF8E4',
  sunGlow: '255,244,214',
  cloud: '#FBFDFF',
  farPeak: '#C9D3EC',
  farPeakShade: '#B3BFE0',
  midPeak: '#97ABD2',
  midPeakShade: '#7F94C2',
  nearPeak: '#6F86B4',
  nearPeakShade: '#5B71A1',
  haze: '#EEF3FB',
  snow: '#F7FBFF',
  snowBlue: '#D6E6F3',
  snowShade: '#BFD3E8',
  snowDeep: '#A6BDD8',
  floorTop: '#E3EDF8',
  floorBottom: '#C9D9EB',
  floorPatch: 'rgba(120,150,195,.16)',
  clearing: 'rgba(120,150,195,.17)',
  trail: '#FAFDFF',
  trailEdge: '#C9DBEC',
  trailDash: '#B7CDE4',
  ice: '#BFE6F2',
  iceLight: '#E3F6FC',
  iceDeep: '#7FC3DA',
  iceDeeper: '#5AA6C4',
  iceGate: '#3F6E9C',
  lake: '#8FD3DF',
  lakeDeep: '#5FB4C8',
  pine: '#2F6E5E',
  pineLight: '#3F8570',
  pineDeep: '#1F4F45',
  shrub: '#8FB3A8',
  shrubDeep: '#6F9689',
  bark: '#8A5A34',
  barkDeep: '#5E3D24',
  slate: '#7D8BA3',
  slateLight: '#9AA7BC',
  slateDeep: '#5E6B84',
  timber: '#B5743F',
  timberLight: '#CF9056',
  timberDeep: '#8A5229',
  logEnd: '#E2B57E',
  lantern: '#FFD36B',
  lanternDeep: '#E9A93A',
  glowWarm: '255,206,110',
  crystal: '#E9F8FF',
  crystalDeep: '#8FD0EE',
  crystalGlow: '110,200,255',
  volcano: '#8A5A4E',
  volcanoShade: '#6B4039',
  volcanoRock: '#4E3A36',
  lava: '#F2703A',
  lavaHot: '#FFC24A',
  lavaGlow: '255,140,70',
  smoke: '#CFC4CC',
  smokeDeep: '#A99CA8',
  chimneySmoke: '#B7C5D8',
  flag: '#C9372C',
  pennant: '#F3B630',
  scarf: '#E0533F',
  carrot: '#F08A2C',
  coal: '#3A3340',
  penguin: '#34405A',
  penguinBelly: '#FFFFFF',
  beak: '#F3B630',
  cheek: '#F4A3A0',
}

/** Cool ground shadow on snow (blue-tinted; Burgdorf uses warm ink). */
const Shadow = ({ rx, ry = rx / 3.4 }: { rx: number; ry?: number }) => (
  <ellipse cx="0" cy="2" rx={rx} ry={ry} fill="rgba(60,80,130,.18)" />
)

/** Wavy (scalloped) snow edge from (x0,y) to (x1,y), `n` bumps hanging down by `d`. */
function scallop(x0: number, x1: number, y: number, n: number, d: number) {
  const w = (x1 - x0) / n
  let s = ''
  for (let i = 0; i < n; i++) s += ` q${(w / 2).toFixed(1)} ${(i % 2 ? d * 0.6 : d).toFixed(1)} ${w.toFixed(1)} 0`
  return `M${x0} ${y}${s}`
}

// ---------------------------------------------------------------- primitives

/** Snow cap for a triangular tier with apex (0,a), half-width `w` at y=`b`. */
function tierCap(a: number, b: number, w: number, t = 0.48) {
  const y = a + (b - a) * t
  const x = w * t
  const n = 3
  const step = (2 * x) / n
  let d = `M0 ${a - 1} L${x.toFixed(1)} ${y.toFixed(1)}`
  for (let i = 0; i < n; i++) d += ` q${(-step / 2).toFixed(1)} ${i % 2 ? 3.2 : 5.4} ${(-step).toFixed(1)} 0`
  return `${d} Z`
}

/** Snow-capped mountain pine (Zirbe); optional falling snow clump (`.fp-slip`). */
function Pine({ x, y, s = 1, flip = false, slip = false, delay = 0 }: { x: number; y: number; s?: number; flip?: boolean; slip?: boolean; delay?: number }) {
  const tiers: [number, number, number][] = [
    [-42, -8, 26],
    [-60, -28, 21],
    [-78, -46, 16],
  ]
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={20} />
      <rect x="-4" y="-14" width="8" height="16" rx="2" fill={FP.bark} stroke={INK} strokeWidth={2.2} />
      {tiers.map(([a, b, w], i) => (
        <g key={i}>
          <path d={`M0 ${a} L${w} ${b} Q0 ${b - 5} ${-w} ${b} Z`} fill={i === 1 ? FP.pineLight : FP.pine} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
          <path d={`M${w * 0.4} ${b - 2} L${w} ${b} Q${w * 0.5} ${b - 3} 0 ${b - 5} Z`} fill={FP.pineDeep} opacity={0.45} />
          <path d={tierCap(a, b, w)} fill={FP.snow} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
        </g>
      ))}
      <path d="M-5 -70 L-9 -60 M-7 -52 L-13 -42" stroke="rgba(255,255,255,.75)" strokeWidth={2.2} strokeLinecap="round" />
      {slip && (
        <g transform="translate(14 -36)">
          <g className="fp-slip" style={{ animationDelay: `${delay}s` }}>
            <circle r="3.2" fill={FP.snow} stroke={INK} strokeWidth={1.2} />
            <circle cx="3.4" cy="1.6" r="2" fill={FP.snow} stroke={INK} strokeWidth={1} />
          </g>
        </g>
      )}
    </g>
  )
}

/** Low frosty shrub: three blobs, one outline, white frost tips. */
function FrostShrub({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const blobs: [number, number, number][] = [[-10, -8, 9], [9, -9, 9], [0, -15, 10]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow rx={20} />
      {blobs.map(([cx, cy, r], i) => <circle key={`o${i}`} cx={cx} cy={cy} r={r + 2.2} fill={INK} />)}
      {blobs.map(([cx, cy, r], i) => <circle key={`f${i}`} cx={cx} cy={cy} r={r} fill={i === 2 ? FP.shrub : FP.shrubDeep} />)}
      <path d="M-9 -22 q9 -8 18 0 q-9 -3 -18 0 Z" fill={FP.snow} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
      {[[-14, -12], [-6, -16], [12, -14], [15, -6], [-17, -5], [4, -9]].map(([fx, fy], i) => (
        <circle key={`t${i}`} cx={fx} cy={fy} r={1.5} fill="#FFFFFF" />
      ))}
    </g>
  )
}

/** Rounded rock cairn (Steinmann) with a snow cap. */
function Cairn({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow rx={18} />
      <ellipse cx="0" cy="-6" rx="15" ry="8" fill={FP.slate} stroke={INK} strokeWidth={2.2} />
      <ellipse cx="2" cy="-18" rx="11" ry="6.5" fill={FP.slateLight} stroke={INK} strokeWidth={2.2} />
      <ellipse cx="-1" cy="-28" rx="7.5" ry="5" fill={FP.slate} stroke={INK} strokeWidth={2} />
      <path d="M-7 -31 Q-1 -38 7 -31 Q2 -29 -1 -30 Q-4 -28 -7 -31 Z" fill={FP.snow} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M-10 -9 q4 -3 9 -3 M-4 -20 q3 -2 7 -2" stroke="rgba(255,255,255,.5)" strokeWidth={1.8} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** Rounded snowdrift mound with blue shading. */
function Snowdrift({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={30} ry={6} />
      <path d="M-32 1 C-30 -12 -14 -18 -2 -15 C8 -24 28 -16 32 1 Z" fill={FP.snow} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-30 0 C-18 -6 4 -4 30 0 Z" fill={FP.snowShade} />
      <path d="M-20 -10 q6 -5 12 -4" stroke="#FFFFFF" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** Slate rock shelf with a snow slab on top and icicles hanging from its edge. */
function RockShelf({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  const icicles: [number, number][] = [[-22, 9], [-14, 13], [-6, 8], [4, 14], [13, 9], [22, 11]]
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={40} ry={7} />
      <path d="M-38 1 C-40 -12 -34 -26 -18 -30 C0 -34 26 -30 36 -18 C40 -10 40 -4 38 1 Z" fill={FP.slate} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M8 -26 C22 -26 34 -18 36 -6 L38 1 H16 C20 -8 16 -18 8 -26 Z" fill={FP.slateDeep} opacity={0.55} />
      <path d="M-26 -10 q8 -4 16 -2 M4 -8 q6 -3 12 0" stroke={FP.slateDeep} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      {/* snow slab + icicles */}
      {icicles.map(([ix, l], i) => (
        <path key={i} d={`M${ix - 3} -26 L${ix} ${-26 + l} L${ix + 3} -26 Z`} fill={FP.iceLight} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
      ))}
      <path d={`M-34 -24 C-30 -38 26 -40 36 -22 ${scallop(36, -34, -22, 6, 5).replace(/^M[^q]*/, '')} Z`} fill={FP.snow} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M-20 -32 q10 -5 22 -4" stroke="#FFFFFF" strokeWidth={2.4} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** Cluster of three ice crystal prisms. */
function IceCrystals({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const prism = (dx: number, h: number, w: number, rot: number) => (
    <g transform={`translate(${dx} 0) rotate(${rot})`}>
      <path d={`M${-w} 0 V${-h} L0 ${-h - w * 1.4} L${w} ${-h} V0 Z`} fill={FP.ice} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <path d={`M0 0 V${-h} L0 ${-h - w * 1.4} L${w} ${-h} V0 Z`} fill={FP.iceDeep} opacity={0.6} />
      <path d={`M${-w * 0.5} -4 V${-h + 2}`} stroke="#FFFFFF" strokeWidth={1.6} strokeLinecap="round" opacity={0.85} />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow rx={18} />
      <ellipse cx="0" cy="0" rx="17" ry="5" fill={FP.snowShade} stroke={INK} strokeWidth={1.6} />
      {prism(-9, 14, 4.5, -16)}
      {prism(9, 12, 4, 18)}
      {prism(0, 22, 5.5, 0)}
    </g>
  )
}

/** Small six-armed snowflake that drifts a few px (`.fp-snow`). */
function Snowflake({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  const arms = 'M0 -6 V6 M-5.2 -3 L5.2 3 M-5.2 3 L5.2 -3'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="fp-snow" style={{ animationDelay: `${delay}s` }}>
        <path d={arms} stroke="rgba(47,36,32,.4)" strokeWidth={3.6} strokeLinecap="round" />
        <path d={arms} stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" />
        <circle r="1.6" fill="#FFFFFF" />
      </g>
    </g>
  )
}

/** Four-point ice sparkle; scales and fades in place (`.fp-sparkle`). */
function Sparkle({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        className="fp-sparkle"
        style={{ animationDelay: `${delay}s` }}
        d="M0 -8 Q1.2 -1.2 8 0 Q1.2 1.2 0 8 Q-1.2 1.2 -8 0 Q-1.2 -1.2 0 -8 Z"
        fill={FP.crystal}
        stroke={INK}
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
    </g>
  )
}

/** Frozen lake: snowy bank, turquoise ice, crack pattern, trapped bubbles, shimmer (`.fp-shimmer`). */
function FrozenLake({ x, y, rx, ry, seed, children }: { x: number; y: number; rx: number; ry: number; seed: number; children?: ReactNode }) {
  const r = seeded(seed)
  const bubbles = Array.from({ length: 5 }, () => ({ bx: (r() - 0.5) * rx * 1.3, by: (r() - 0.5) * ry * 1.1, br: 1.6 + r() * 2.2 }))
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse rx={rx + 10} ry={ry + 6} cy={3} fill={FP.snowShade} stroke={INK} strokeWidth={1.6} />
      <ellipse rx={rx} ry={ry} fill="url(#fp-ice)" stroke={INK} strokeWidth={2.4} />
      <ellipse rx={rx - 7} ry={ry - 5} cy={-2} fill="none" stroke={FP.iceLight} strokeWidth={2} opacity={0.7} />
      {/* cracks: dark line + light edge */}
      <path
        d={`M${-rx * 0.62} ${ry * 0.1} l${rx * 0.18} ${-ry * 0.22} l${rx * 0.14} ${ry * 0.18} l${rx * 0.2} ${-ry * 0.3} M${-rx * 0.1} ${-ry * 0.12} l${rx * 0.06} ${ry * 0.36} l${rx * 0.2} ${ry * 0.12} M${rx * 0.16} ${ry * 0.36} l${rx * 0.22} ${-ry * 0.12} l${rx * 0.12} ${ry * 0.16}`}
        stroke={FP.iceDeeper}
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M${-rx * 0.6} ${ry * 0.06} l${rx * 0.18} ${-ry * 0.22} M${rx * 0.18} ${ry * 0.32} l${rx * 0.22} ${-ry * 0.12}`}
        stroke="#FFFFFF"
        strokeWidth={1}
        fill="none"
        strokeLinecap="round"
        opacity={0.8}
      />
      {bubbles.map(({ bx, by, br }, i) => (
        <circle key={i} cx={bx} cy={by} r={br} fill="none" stroke="#FFFFFF" strokeWidth={1.1} opacity={0.75} />
      ))}
      {/* shimmer glints */}
      <path className="fp-shimmer" d={`M${-rx * 0.5} ${-ry * 0.45} q${rx * 0.16} -4 ${rx * 0.32} 0`} stroke="#FFFFFF" strokeWidth={2.6} fill="none" strokeLinecap="round" style={{ animationDelay: `${-r() * 4}s` }} />
      <path className="fp-shimmer" d={`M${rx * 0.2} ${-ry * 0.2} q${rx * 0.12} -3 ${rx * 0.24} 0`} stroke="#FFFFFF" strokeWidth={2.2} fill="none" strokeLinecap="round" style={{ animationDelay: `${-r() * 4}s` }} />
      {/* little snow pile on the ice */}
      <path d={`M${rx * 0.5} ${ry * 0.38} q6 -8 14 0 Z`} fill={FP.snow} stroke={INK} strokeWidth={1.3} />
      {children}
    </g>
  )
}

/** Friendly little penguin with a red scarf, standing on the ice. */
function Penguin({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="0" cy="1" rx="12" ry="3" fill="rgba(60,80,130,.22)" />
      <path d="M-6 0 q-4 1 -6 -1 q3 -3 7 -2 Z M6 0 q4 1 6 -1 q-3 -3 -7 -2 Z" fill={FP.beak} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M-12 -4 C-14 -20 -10 -34 0 -34 C10 -34 14 -20 12 -4 C8 0 -8 0 -12 -4 Z" fill={FP.penguin} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M-7 -4 C-9 -16 -6 -24 0 -24 C6 -24 9 -16 7 -4 C4 -2 -4 -2 -7 -4 Z" fill={FP.penguinBelly} />
      {/* flippers */}
      <path d="M-11 -20 q-8 6 -6 14 q4 -6 6 -8 Z" fill={FP.penguin} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M11 -20 q8 4 8 12 q-5 -4 -8 -6 Z" fill={FP.penguin} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      {/* face */}
      <circle cx="-3.6" cy="-26" r="2.4" fill="#FFFFFF" />
      <circle cx="3.6" cy="-26" r="2.4" fill="#FFFFFF" />
      <circle cx="-3.2" cy="-25.6" r="1.3" fill={INK} />
      <circle cx="4" cy="-25.6" r="1.3" fill={INK} />
      <path d="M-2.6 -22.6 L0 -18.6 L2.6 -22.6 Z" fill={FP.beak} stroke={INK} strokeWidth={1.1} strokeLinejoin="round" />
      <circle cx="-6.6" cy="-20.6" r="1.8" fill={FP.cheek} opacity={0.8} />
      <circle cx="6.6" cy="-20.6" r="1.8" fill={FP.cheek} opacity={0.8} />
      {/* scarf */}
      <path d="M-9 -17 Q0 -13 9 -17 L9 -13 Q0 -9 -9 -13 Z" fill={FP.scarf} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M5 -13 l2 8 l4 -1 l-2 -8 Z" fill={FP.scarf} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M-6 -30 q3 -3 6 -2" stroke="rgba(255,255,255,.45)" strokeWidth={1.8} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** Snowman with coal eyes, carrot nose, scarf, twig arms and a little hat. */
function Snowman({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow rx={22} />
      {/* twig arms (behind) */}
      <path d="M-10 -40 L-28 -50 M-22 -47 l-2 -7 M10 -40 L28 -54 M22 -49 l5 -2" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <path d="M-10 -40 L-28 -50 M-22 -47 l-2 -7 M10 -40 L28 -54 M22 -49 l5 -2" stroke={FP.bark} strokeWidth={1.8} strokeLinecap="round" />
      <circle cx="0" cy="-15" r="17" fill={FP.snow} stroke={INK} strokeWidth={2.4} />
      <circle cx="0" cy="-42" r="13" fill={FP.snow} stroke={INK} strokeWidth={2.4} />
      <circle cx="0" cy="-63" r="10" fill={FP.snow} stroke={INK} strokeWidth={2.4} />
      <path d="M-14 -8 q14 8 28 0 M-10 -36 q10 6 20 0" stroke={FP.snowShade} strokeWidth={3} fill="none" strokeLinecap="round" />
      {[-46, -40, -18].map((by) => <circle key={by} cx="0" cy={by} r="1.8" fill={FP.coal} />)}
      {/* scarf */}
      <path d="M-11 -54 Q0 -49 11 -54 L11 -49 Q0 -44 -11 -49 Z" fill={FP.scarf} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M5 -50 l3 12 l5 -1 l-2 -12 Z" fill={FP.scarf} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
      {/* face */}
      <circle cx="-3.4" cy="-66" r="1.7" fill={FP.coal} />
      <circle cx="3.4" cy="-66" r="1.7" fill={FP.coal} />
      <path d="M0 -62 L12 -60 L0 -59 Z" fill={FP.carrot} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M-4 -57 q4 3 8 0" stroke={FP.coal} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      {/* hat */}
      <rect x="-11" y="-74" width="22" height="4" rx="2" fill={FP.coal} stroke={INK} strokeWidth={1.4} />
      <rect x="-7" y="-86" width="14" height="13" rx="2" fill={FP.coal} stroke={INK} strokeWidth={1.4} />
      <rect x="-7" y="-77" width="14" height="3" fill={FP.flag} />
      <path d="M-6 -70 q3 -3 6 -2 M-11 -24 q4 -6 10 -7" stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** Timber alpine lodge: log walls, heavy snow roof with icicles, warm windows, chimney smoke, woodpile. */
function Lodge({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="4" cy="3" rx="64" ry="9" fill="rgba(60,80,130,.18)" />
      {/* chimney + smoke (behind roof) */}
      <g transform="translate(26 -88)">
        <g className="fp-smoke" fill="none" stroke={FP.chimneySmoke} strokeWidth={5} strokeLinecap="round">
          <path d="M0 -8 c-8 -8 6 -14 -2 -22 c-8 -8 6 -14 -2 -22" />
        </g>
      </g>
      <rect x="20" y="-92" width="12" height="26" rx="2" fill={FP.slate} stroke={INK} strokeWidth={2} />
      <path d="M18 -92 q8 -7 16 0 Z" fill={FP.snow} stroke={INK} strokeWidth={1.6} />
      {/* stone plinth */}
      <rect x="-42" y="-14" width="84" height="16" rx="3" fill={FP.slate} stroke={INK} strokeWidth={2.2} />
      <path d="M-30 -14 V2 M-12 -14 V2 M8 -14 V2 M26 -14 V2 M-42 -6 H42" stroke={FP.slateDeep} strokeWidth={1.4} />
      {/* log walls */}
      <rect x="-38" y="-52" width="76" height="40" fill={FP.timber} stroke={INK} strokeWidth={2.4} />
      {[-44, -36, -28, -20].map((ly) => (
        <path key={ly} d={`M-38 ${ly} H38`} stroke={FP.timberDeep} strokeWidth={1.6} />
      ))}
      {[-48, -40, -32, -24, -16].map((ly) => (
        <g key={`le${ly}`}>
          <circle cx="-38" cy={ly} r="3.6" fill={FP.logEnd} stroke={INK} strokeWidth={1.3} />
          <circle cx="38" cy={ly} r="3.6" fill={FP.logEnd} stroke={INK} strokeWidth={1.3} />
        </g>
      ))}
      {/* warm window + door */}
      <circle cx="-16" cy="-32" r="18" fill="url(#fp-glow-warm)" />
      <rect x="-26" y="-42" width="20" height="18" rx="3" fill={FP.lantern} stroke={INK} strokeWidth={2} />
      <path d="M-16 -42 V-24 M-26 -33 H-6" stroke={INK} strokeWidth={1.4} />
      <path d="M-28 -22 H-4 V-18 H-28 Z" fill={FP.snow} stroke={INK} strokeWidth={1.3} />
      <path d="M6 -12 V-36 A9 9 0 0 1 24 -36 V-12 Z" fill={FP.timberDeep} stroke={INK} strokeWidth={2} />
      <path d="M15 -44 V-12" stroke={INK} strokeWidth={1.2} opacity={0.5} />
      <circle cx="20" cy="-24" r="1.4" fill={FP.lantern} />
      {/* roof boards + gable with round lit window */}
      <path d="M-50 -48 L0 -88 L50 -48 Z" fill={FP.timberLight} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <circle cx="0" cy="-64" r="12" fill="url(#fp-glow-warm)" />
      <circle cx="0" cy="-64" r="6" fill={FP.lantern} stroke={INK} strokeWidth={1.8} />
      <path d="M0 -70 V-58 M-6 -64 H6" stroke={INK} strokeWidth={1.1} />
      {/* thick snow roof edges with icicles */}
      {[-44, -34, -24, 24, 34, 44].map((ix, i) => (
        <path key={ix} d={`M${ix - 2.6} -46 L${ix} ${-46 + (i % 2 ? 9 : 13)} L${ix + 2.6} -46 Z`} fill={FP.iceLight} stroke={INK} strokeWidth={1.1} strokeLinejoin="round" />
      ))}
      <path
        d="M-56 -46 C-58 -52 -54 -54 -50 -56 L-2 -96 Q0 -98 2 -96 L50 -56 C54 -54 58 -52 56 -46 q-6 5 -12 0 q-6 6 -12 0 L0 -74 L-32 -46 q-6 6 -12 0 q-6 5 -12 0 Z"
        fill={FP.snow}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path d="M-40 -58 L-8 -86" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
      <path d="M8 -84 L44 -54" stroke={FP.snowShade} strokeWidth={2.4} strokeLinecap="round" />
      {/* woodpile */}
      <g transform="translate(-62 0)">
        <rect x="-16" y="-24" width="32" height="24" rx="2" fill={FP.timberDeep} stroke={INK} strokeWidth={2} />
        {[[-9, -6], [0, -6], [9, -6], [-4.5, -14], [4.5, -14], [-9, -21], [0, -21], [9, -21]].map(([lx, ly], i) => (
          <g key={i}>
            <circle cx={lx} cy={ly} r="4" fill={FP.logEnd} stroke={INK} strokeWidth={1.3} />
            <circle cx={lx} cy={ly} r="1.4" fill={FP.timber} />
          </g>
        ))}
        <path d="M-18 -24 q6 -6 12 -2 q6 -5 12 -1 q6 -4 12 3 Z" fill={FP.snow} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
      </g>
      {/* front snow */}
      <path d="M-46 2 q20 -6 40 0 q24 -5 48 0" stroke={FP.snow} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** Signpost at the start with a snow cap and a pair of crossed skis. */
function Signpost({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 V-34" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <g transform="translate(-20 2)">
        <path d="M-8 0 L6 -40 M8 0 L-6 -40" stroke={INK} strokeWidth={5.4} strokeLinecap="round" />
        <path d="M-8 0 L6 -40 M8 0 L-6 -40" stroke={FP.flag} strokeWidth={3} strokeLinecap="round" />
        <path d="M5 -38 q3 -4 1 -8 M-5 -38 q-3 -4 -1 -8" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      </g>
      <Snowdrift x={2} y={2} s={0.5} />
    </g>
  )
}

/** Crystal lantern on an ice post; its halo brightens when the chest is ready (`.fp-summit-glow`). */
function CrystalLantern({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse className="fp-summit-glow" cx="0" cy="0" rx="46" ry="12" fill="url(#fp-glow-crystal)" />
      <circle className="fp-summit-glow" cx="0" cy="-60" r="58" fill="url(#fp-glow-crystal)" />
      <path
        className="fp-summit-glow"
        d="M0 -98 V-108 M0 -22 V-12 M-30 -60 H-40 M30 -60 H40 M-22 -82 l-7 -7 M22 -82 l7 -7 M-22 -38 l-7 7 M22 -38 l7 7"
        stroke={FP.crystalDeep}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Shadow rx={12} />
      <rect x="-4" y="-38" width="8" height="40" rx="3" fill={FP.ice} stroke={INK} strokeWidth={2} />
      <path d="M-1.6 -34 V-2" stroke="#FFFFFF" strokeWidth={1.6} strokeLinecap="round" />
      <path d="M-11 -38 H11 L8 -44 H-8 Z" fill={FP.slateDeep} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      {/* hexagonal crystal head */}
      <path d="M0 -76 L10 -66 V-50 L0 -44 L-10 -50 V-66 Z" fill={FP.crystal} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M0 -76 L10 -66 V-50 L0 -44 Z" fill={FP.crystalDeep} opacity={0.65} />
      <path d="M-5 -66 V-52" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
      <path d="M-12 -78 H12 L8 -84 H-8 Z" fill={FP.slateDeep} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M0 -84 V-90" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <circle cx="0" cy="-92" r="2.6" fill={FP.crystalDeep} stroke={INK} strokeWidth={1.2} />
      <path d="M-8 -44 V-38 M8 -44 V-38" stroke={INK} strokeWidth={1.6} />
    </g>
  )
}

/** Rounded tower with a crystal cone roof; `flag` = waving pennant (`.map-flag`). */
function IceTower({ x, w, h, roof, flag }: { x: number; w: number; h: number; roof: number; flag?: string }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={-w / 2} y={-h} width={w} height={h} rx={4} fill={FP.iceLight} stroke={INK} strokeWidth={2.6} />
      <rect x={w * 0.12} y={-h + 2} width={w * 0.36} height={h - 4} fill={FP.ice} opacity={0.8} />
      <path d={`M${-w / 2 + 3} ${-h * 0.62} H${w / 2 - 3} M${-w / 2 + 3} ${-h * 0.32} H${w / 2 - 3}`} stroke={FP.ice} strokeWidth={1.6} />
      <rect x={-5} y={-h * 0.72} width={10} height={16} rx={5} fill={FP.iceGate} stroke={INK} strokeWidth={1.6} />
      <circle cx={0} cy={-h * 0.72 + 7} r={2.2} fill={FP.crystal} />
      {flag && (
        <>
          <path d={`M0 ${-h - roof} V${-h - roof - 18}`} stroke={INK} strokeWidth={2.2} />
          <path className="map-flag" d={`M0 ${-h - roof - 18} L18 ${-h - roof - 13} L0 ${-h - roof - 8} Z`} fill={flag} stroke={INK} strokeWidth={1.8} />
        </>
      )}
      <path d={`M${-w / 2 - 6} ${-h + 2} L0 ${-h - roof} L${w / 2 + 6} ${-h + 2} Q0 ${-h - 4} ${-w / 2 - 6} ${-h + 2} Z`} fill={FP.iceDeep} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <path d={`M0 ${-h - roof} L${w / 2 + 6} ${-h + 2} Q${w / 4} ${-h - 2} 0 ${-h - 3} Z`} fill={FP.iceDeeper} opacity={0.6} />
      <path d={`M${-w * 0.22} ${-h - roof * 0.35} L${-w * 0.06} ${-h - roof * 0.78}`} stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" />
      <path d={`${scallop(-w / 2 - 6, w / 2 + 6, -h + 2, 4, 5)}`} stroke={FP.snow} strokeWidth={3.6} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** The landmark at the chest end: an ice palace with a glacier gate, on a glacier tongue. */
function IcePalace({ x, y }: { x: number; y: number }) {
  const bumps = (x0: number, x1: number, y0: number, n: number) => {
    const w = (x1 - x0) / n
    return Array.from({ length: n }, (_, i) => (
      <path key={i} d={`M${x0 + i * w + 1.5} ${y0} a${w / 2 - 1.5} ${w / 2 - 1.5} 0 0 1 ${w - 3} 0 Z`} fill={FP.snow} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
    ))
  }
  const icicles = (x0: number, x1: number, y0: number, n: number) =>
    Array.from({ length: n }, (_, i) => {
      const ix = x0 + ((i + 0.5) * (x1 - x0)) / n
      const l = i % 3 === 1 ? 11 : i % 2 ? 6 : 8
      return <path key={i} d={`M${ix - 2.4} ${y0} L${ix} ${y0 + l} L${ix + 2.4} ${y0} Z`} fill={FP.iceLight} stroke={INK} strokeWidth={1.1} strokeLinejoin="round" />
    })
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="6" rx="156" ry="18" fill="rgba(60,80,130,.18)" />
      {/* glacier tongue */}
      <path d="M-164 10 C-150 -16 -124 -22 -96 -18 L96 -18 C124 -22 152 -14 166 10 C110 22 -110 22 -164 10 Z" fill={FP.ice} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M-140 4 l14 -10 l8 6 M132 2 l-12 -9 l-10 7 M-90 12 l10 -8 M96 12 l-8 -8" stroke={FP.iceDeeper} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-136 -4 q18 -8 36 -6 M104 -10 q16 -2 30 6" stroke="#FFFFFF" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      {/* back wall */}
      {bumps(-96, 96, -68, 10)}
      <rect x="-96" y="-68" width="192" height="66" fill={FP.iceLight} stroke={INK} strokeWidth={2.6} />
      <path d="M-96 -46 H96 M-96 -24 H96 M-72 -68 V-46 M-40 -46 V-24 M40 -68 V-46 M72 -46 V-24 M-64 -24 V-2 M64 -24 V-2" stroke={FP.ice} strokeWidth={1.6} />
      {icicles(-90, -48, -68, 5)}
      {icicles(48, 90, -68, 5)}
      {/* central keep with crystal spire and the summit flag */}
      {bumps(-46, 46, -124, 6)}
      <rect x="-46" y="-124" width="92" height="60" fill={FP.iceLight} stroke={INK} strokeWidth={2.6} />
      <rect x="10" y="-122" width="34" height="56" fill={FP.ice} opacity={0.8} />
      <path d="M0 -196 V-228" stroke={INK} strokeWidth={2.6} />
      <path className="map-flag" d="M0 -228 L30 -220 L0 -212 Z" fill={FP.flag} stroke={INK} strokeWidth={2} />
      <path d="M-34 -122 L0 -196 L34 -122 Q0 -128 -34 -122 Z" fill={FP.iceDeep} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <path d="M0 -196 L34 -122 Q16 -126 0 -127 Z" fill={FP.iceDeeper} opacity={0.6} />
      <path d="M-12 -150 L-3 -176" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" />
      <path d={scallop(-36, 36, -122, 5, 5)} stroke={FP.snow} strokeWidth={3.8} fill="none" strokeLinecap="round" />
      {/* keep windows */}
      {[-24, 24].map((wx) => (
        <g key={wx}>
          <rect x={wx - 5.5} y={-108} width={11} height={18} rx={5.5} fill={FP.iceGate} stroke={INK} strokeWidth={1.8} />
          <circle cx={wx} cy={-100} r={2.4} fill={FP.crystal} />
        </g>
      ))}
      {icicles(-44, 44, -64, 9)}
      {/* side towers */}
      <g>
        <IceTower x={-112} w={40} h={102} roof={44} flag={FP.pennant} />
        <IceTower x={112} w={40} h={102} roof={44} flag={FP.pennant} />
      </g>
      {/* glacier gate: arch with inner crystal glow, icicles, snow step */}
      <circle className="fp-summit-glow" cx="0" cy="-22" r="44" fill="url(#fp-glow-crystal)" />
      <path d="M-30 -2 V-30 A30 30 0 0 1 30 -30 V-2 Z" fill={FP.iceGate} stroke={INK} strokeWidth={2.6} />
      <path d="M-22 -2 V-28 A22 22 0 0 1 22 -28 V-2" fill="none" stroke={FP.iceDeep} strokeWidth={2} />
      <ellipse className="fp-summit-glow" cx="0" cy="-16" rx="18" ry="22" fill="url(#fp-glow-crystal)" />
      <path d="M-36 -30 A36 36 0 0 1 36 -30" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <path d="M-36 -30 A36 36 0 0 1 36 -30" fill="none" stroke={FP.crystal} strokeWidth={4.4} strokeLinecap="round" />
      {[-26, -16, -6, 6, 16, 26].map((ix, i) => {
        const iy = -30 - Math.sqrt(Math.max(0, 36 * 36 - ix * ix)) + 4
        return <path key={ix} d={`M${ix - 2.4} ${iy} L${ix} ${iy + (i % 2 ? 9 : 13)} L${ix + 2.4} ${iy} Z`} fill={FP.iceLight} stroke={INK} strokeWidth={1.1} strokeLinejoin="round" />
      })}
      <path d="M-40 0 q20 -8 40 -4 q20 -4 40 4 Z" fill={FP.snow} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M-88 -60 V-10 M-80 -60 V-36" stroke="rgba(255,255,255,.75)" strokeWidth={2.4} strokeLinecap="round" />
    </g>
  )
}

/** One snow-capped mountain: rounded apex at (x,y), base half-width w at y + h. */
function Mountain({ x, y, w, h, fill, shade, stroke, cap = 0.34 }: { x: number; y: number; w: number; h: number; fill: string; shade: string; stroke: string; cap?: number }) {
  const cy = h * cap
  const cx = w * cap
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-w} ${h} L-5 4 Q0 -2 5 4 L${w} ${h} Z`} fill={fill} stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
      <path d={`M3 3 L${w} ${h} H${w * 0.18} Z`} fill={shade} />
      <path
        d={`M${-cx} ${cy} L-5 4 Q0 -2 5 4 L${cx} ${cy} q${-cx * 0.25} 5 ${-cx * 0.5} -1 q${-cx * 0.25} 6 ${-cx * 0.5} 0 q${-cx * 0.25} 6 ${-cx * 0.5} -1 q${-cx * 0.25} 5 ${-cx * 0.5} 1 Z`}
        fill={FP.snow}
        stroke={stroke}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path d={`M2 6 L${cx} ${cy} q${-cx * 0.25} 5 ${-cx * 0.5} -1 Z`} fill={FP.snowShade} opacity={0.7} />
    </g>
  )
}

/** Glutvulkan teaser (world 5): warm cone, lava glow (`.fp-lava`), smoke puff, dark rocks. */
function VolcanoTeaser({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* smoke puff drifting up-right, behind the sign */}
      <g fill={FP.smoke} stroke="rgba(47,36,32,.3)" strokeWidth={1.6}>
        <circle cx="12" cy="-14" r="11" />
        <circle cx="34" cy="-22" r="13" />
        <circle cx="60" cy="-28" r="14" />
        <circle cx="88" cy="-30" r="12" />
        <circle cx="108" cy="-26" r="9" />
      </g>
      <circle cx="56" cy="-32" r="5" fill="#FFFFFF" opacity={0.4} />
      <circle cx="86" cy="-34" r="4" fill="#FFFFFF" opacity={0.4} />
      {/* crater glow */}
      <circle className="fp-lava" cx="0" cy="2" r="44" fill="url(#fp-glow-lava)" />
      {/* cone */}
      <path d="M-104 104 C-70 70 -40 26 -24 4 Q0 -6 24 4 C40 26 70 70 104 104 Z" fill={FP.volcano} stroke="rgba(47,36,32,.6)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M8 2 C30 22 64 68 104 104 H38 C34 70 22 30 8 2 Z" fill={FP.volcanoShade} opacity={0.75} />
      {/* crater rim + lava */}
      <ellipse cx="0" cy="3" rx="24" ry="6" fill={FP.volcanoRock} stroke="rgba(47,36,32,.6)" strokeWidth={1.8} />
      <ellipse className="fp-lava" cx="0" cy="3" rx="17" ry="3.6" fill={FP.lavaHot} />
      <path className="fp-lava" d="M-8 6 C-12 20 -6 30 -16 44 C-20 52 -14 58 -22 66 M10 7 C14 18 8 26 16 36" stroke={FP.lava} strokeWidth={4.6} fill="none" strokeLinecap="round" />
      <path d="M-8 6 C-12 20 -6 30 -16 44 M10 7 C14 18 8 26 16 36" stroke={FP.lavaHot} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <path d="M-30 30 q-8 12 -14 22" stroke="rgba(255,255,255,.25)" strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* dark rocks at the foot */}
      {[[-74, 92, 9], [-56, 98, 7], [64, 94, 8], [82, 100, 6]].map(([rx, ry, r], i) => (
        <ellipse key={i} cx={rx} cy={ry} rx={r * 1.3} ry={r} fill={FP.volcanoRock} stroke="rgba(47,36,32,.6)" strokeWidth={1.4} />
      ))}
    </g>
  )
}

/** Two snow-capped slate rocks beside the trail (between stones). */
function TrailRocks({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <ellipse cx="-5" cy="0" rx="6.4" ry="4.4" fill={FP.slate} stroke={INK} strokeWidth={1.3} />
      <path d="M-10 -1.6 q5 -5 10 0 Z" fill={FP.snow} />
      <ellipse cx="5" cy="2" rx="4.6" ry="3.2" fill={FP.slateLight} stroke={INK} strokeWidth={1.2} />
    </g>
  )
}

/** Cave opening at the foot of the cliff: dark arch, icicle fringe, a soft crystal glow inside. */
function CaveMouth({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-40 2 C-42 -30 -22 -52 2 -52 C26 -52 44 -30 42 2 Z" fill={FP.slateDeep} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M-28 2 C-30 -22 -16 -38 2 -38 C20 -38 32 -22 30 2 Z" fill="#2E3650" stroke={INK} strokeWidth={2} />
      <ellipse className="fp-summit-glow" cx="2" cy="-12" rx="22" ry="16" fill="url(#fp-glow-crystal)" />
      <IceCrystals x={10} y={0} s={0.55} />
      {[-22, -12, -2, 8, 18].map((ix, i) => {
        const iy = -36 + Math.abs(ix - 2) * 0.55
        return <path key={ix} d={`M${ix - 3} ${iy} L${ix} ${iy + (i % 2 ? 9 : 14)} L${ix + 3} ${iy} Z`} fill={FP.iceLight} stroke={INK} strokeWidth={1.1} strokeLinejoin="round" />
      })}
      <path d="M-46 -30 C-40 -58 40 -62 48 -30 C40 -40 26 -44 2 -46 C-22 -46 -38 -40 -46 -30 Z" fill={FP.snow} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M-30 -48 q14 -8 30 -8" stroke="#FFFFFF" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Snowdrift x={-38} y={4} s={0.5} />
    </g>
  )
}

/** Little wooden sled with red runners, parked at the start. */
function Sled({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow rx={22} ry={4} />
      <path d="M-22 0 H18 Q26 0 26 -8" stroke={INK} strokeWidth={4.6} fill="none" strokeLinecap="round" />
      <path d="M-22 0 H18 Q26 0 26 -8" stroke={FP.flag} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d="M-14 0 V-8 M10 0 V-8" stroke={INK} strokeWidth={2} />
      <rect x="-22" y="-14" width="40" height="7" rx="2.5" fill={FP.timber} stroke={INK} strokeWidth={2} />
      <path d="M-12 -14 V-7 M-2 -14 V-7 M8 -14 V-7" stroke={FP.timberDeep} strokeWidth={1.3} />
      <path d="M-20 -15 q20 -5 36 0" stroke={FP.snow} strokeWidth={2.6} fill="none" strokeLinecap="round" />
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

export function MapArtFrostpeak({ height, pts, walkedTo, stones }: MapArtProps) {
  const rand = seeded(47)
  const chest = chestSpot(pts)
  const skyEnd = chest.y - 40
  const S = (i: number) => pts[Math.max(1, Math.min(stones, i))]
  const centre = (Math.min(...pts.slice(1, stones + 1).map((p) => p.x)) + Math.max(...pts.slice(1, stones + 1).map((p) => p.x))) / 2

  // The right flank is one long cliff wall; it steps in where the switchback turns left, out where it turns right.
  const cliffTop = skyEnd + 70
  const cliffBottom = S(1).y + 40
  const edgeCtl: Pt[] = [{ x: 318, y: cliffTop - 30 }]
  for (let i = stones; i >= 1; i--) edgeCtl.push({ x: pts[i].x > centre ? 300 : 256, y: pts[i].y })
  edgeCtl.push({ x: 330, y: cliffBottom }, { x: 430, y: cliffBottom + 90 })
  const edgeAt = (y: number) => {
    if (y <= edgeCtl[0].y) return edgeCtl[0].x
    for (let k = 1; k < edgeCtl.length; k++) {
      const a = edgeCtl[k - 1]
      const b = edgeCtl[k]
      if (y <= b.y) {
        const t = (y - a.y) / (b.y - a.y)
        const u = t * t * (3 - 2 * t)
        return a.x + (b.x - a.x) * u
      }
    }
    return MAP_W + 40
  }
  const cliffRand = seeded(83)
  const edgePts: Pt[] = []
  for (let y = cliffTop - 30; y <= cliffBottom + 90; y += 22) edgePts.push({ x: edgeAt(y) + (cliffRand() - 0.5) * 12, y })
  const cliffD = `M${MAP_W + 6} ${cliffTop - 30} ${edgePts.map((p) => `L${p.x.toFixed(1)} ${p.y}`).join(' ')} L${MAP_W + 6} ${cliffBottom + 90} Z`
  const offCliff = (p: Pt, pad = 0) => p.x > edgeAt(p.y) - pad && p.y > cliffTop - 40 && p.y < cliffBottom + 90

  // Snow ledges + strata across the cliff face, pines perched on some ledges.
  const ledges: ReactNode[] = []
  for (let y = cliffTop + 40, k = 0; y < cliffBottom - 20; y += 120 + cliffRand() * 50, k++) {
    const ex = edgeAt(y) + 4
    ledges.push(
      <g key={`ld${k}`}>
        <path d={`M${ex - 6} ${y} q${(MAP_W - ex) / 2} -12 ${MAP_W - ex + 12} -4 V${y + 6} ${scallop(MAP_W + 6, ex - 6, y + 6, 5, 5).replace(/^M[^q]*/, '')} Z`} fill={FP.snow} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
        {k % 2 === 0 && <Pine x={ex + 30 + cliffRand() * 30} y={y - 2} s={0.7} slip={k % 4 === 0} delay={-k} />}
        {k % 3 === 1 && <Pine x={ex + 66} y={y - 4} s={0.6} flip />}
      </g>,
    )
  }
  const strata: string[] = []
  for (let y = cliffTop; y < cliffBottom; y += 34) {
    const ex = edgeAt(y)
    strata.push(`M${(ex + 14).toFixed(1)} ${y} l${10 + cliffRand() * 14} ${18 + cliffRand() * 10}`)
    strata.push(`M${(ex + 50 + cliffRand() * 30).toFixed(1)} ${y + 10} v${14 + cliffRand() * 14}`)
  }

  // A frozen stream falls off the cliff as an icefall and cuts diagonally down-left across the switchbacks.
  const crossSeg = Math.max(1, Math.min(stones - 1, Math.round(stones / 2)))
  const bridge = pointOn(pts, crossSeg, 0.5)
  const fallX = edgeAt(bridge.y - 70) + 34
  const fallTop = bridge.y - 250
  const fallD = `M${fallX + 4} ${fallTop} C${fallX - 4} ${fallTop + 60} ${fallX + 6} ${fallTop + 120} ${fallX} ${bridge.y - 64}`
  const streamPts: Pt[] = [
    { x: fallX, y: bridge.y - 64 },
    { x: (fallX + bridge.x) / 2 + 10, y: bridge.y - 40 },
    bridge,
    { x: bridge.x - 70, y: bridge.y + 44 },
  ]
  const pond = { x: 64, y: bridge.y + 72 }
  streamPts.push({ x: pond.x + 30, y: pond.y - 8 })
  const streamD = streamPts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const nearStream = (p: Pt, pad: number) =>
    streamPts.slice(1).some((b, i) => {
      const a = streamPts[i]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)))
      return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy) < pad
    }) || ((p.x - pond.x) / (70 + pad)) ** 2 + ((p.y - pond.y) / (26 + pad)) ** 2 < 1
  // bridge direction = road direction at the crossing
  const ba = pointOn(pts, crossSeg, 0.42)
  const bb = pointOn(pts, crossSeg, 0.58)
  const bAng = (Math.atan2(bb.y - ba.y, bb.x - ba.x) * 180) / Math.PI

  const cave = { x: edgeAt(S(3).y + 30) + 46, y: S(3).y + 30 }
  const lodge = { x: 86, y: height - 150 }

  // Decor on both sides of every switchback, never on the cliff, the stream or the start cabin.
  const spots = scatterSpots({
    pts,
    stones,
    rand,
    clear: 54,
    gap: 60,
    spread: 100,
    blocked: (p) => offCliff(p, 26) || nearStream(p, 26) || Math.hypot(p.x - cave.x, p.y - cave.y) < 70 || p.y > height - 200,
  })
  const deco: { y: number; node: ReactNode }[] = spots.map((p, k) => {
    const r = rand()
    const node =
      r < 0.4 ? <Pine key={`p${k}`} x={p.x} y={p.y} s={0.85 + rand() * 0.3} flip={rand() > 0.5} slip={k % 5 === 0} delay={-rand() * 6} />
      : r < 0.55 ? <Cairn key={`c${k}`} x={p.x} y={p.y} s={0.9 + rand() * 0.2} />
      : r < 0.7 ? <FrostShrub key={`f${k}`} x={p.x} y={p.y} s={0.9 + rand() * 0.2} />
      : r < 0.82 ? <Snowdrift key={`d${k}`} x={p.x} y={p.y} flip={p.side < 0} s={0.9} />
      : r < 0.92 ? <IceCrystals key={`x${k}`} x={p.x} y={p.y} s={0.85} />
      : <RockShelf key={`r${k}`} x={p.x} y={p.y} s={0.8} flip={p.side < 0} />
    return { y: p.y, node }
  })
  deco.push({ y: pond.y + 6, node: <Penguin key="peng" x={pond.x - 16} y={pond.y + 6} s={1.05} /> })
  deco.push({ y: pond.y + 2, node: <Penguin key="peng2" x={pond.x + 22} y={pond.y + 2} s={0.8} flip /> })
  deco.sort((a, b) => a.y - b.y)

  // Floor texture: soft blue drift shadows, glitter dots, frosty grass, wind-carved snow waves.
  const patches: ReactNode[] = []
  const cover: ReactNode[] = []
  for (let i = 0; i < stones * 8; i++) {
    const x = 12 + rand() * (MAP_W - 24)
    const y = skyEnd + 140 + rand() * (height - skyEnd - 160)
    const r = rand()
    if (offCliff({ x, y }, -4)) continue
    if (r < 0.25) patches.push(<ellipse key={`fp${i}`} cx={x} cy={y} rx={30 + rand() * 40} ry={8 + rand() * 8} fill={FP.floorPatch} />)
    else if (r < 0.45) cover.push(<circle key={`g${i}`} cx={x} cy={y} r={1.6} fill="#FFFFFF" stroke={FP.snowDeep} strokeWidth={0.8} />)
    else if (r < 0.62)
      cover.push(<path key={`t${i}`} d={`M${x - 5} ${y} q2 -7 3 -9 M${x} ${y} q0 -8 1 -11 M${x + 5} ${y} q-2 -7 -3 -9`} stroke={FP.shrubDeep} strokeWidth={1.8} fill="none" strokeLinecap="round" />)
    else
      cover.push(
        <g key={`w${i}`}>
          <path d={`M${x - 14} ${y + 2} q14 -7 28 0`} stroke={FP.snowShade} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <path d={`M${x - 12} ${y} q12 -7 24 0`} stroke="#FFFFFF" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </g>,
      )
  }

  // Snow-capped rocks along the trail edges (between stones, alternating sides).
  const rocks: ReactNode[] = []
  for (let i = 0; i < stones; i++) {
    if (i === crossSeg) continue
    const a = pointOn(pts, i, 0.45)
    const b = pointOn(pts, i, 0.5)
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
    const sgn = i % 2 ? 1 : -1
    rocks.push(<TrailRocks key={`tr${i}`} x={b.x - ((b.y - a.y) / len) * 25 * sgn} y={b.y + ((b.x - a.x) / len) * 25 * sgn} />)
  }

  // Magic layer: snow drifting down the cliff side, sparkles along the stream and the cliff foot.
  const flakes: ReactNode[] = []
  for (let i = 0; i < 18; i++) {
    const y = skyEnd + 100 + rand() * (height - skyEnd - 200)
    const x = i % 3 === 0 ? 20 + rand() * 80 : edgeAt(y) - 30 + rand() * 90
    flakes.push(<Snowflake key={`sf${i}`} x={x} y={y} s={0.8 + rand() * 0.5} delay={-rand() * 9} />)
  }
  const sparkles: ReactNode[] = streamPts.map((p, i) => (
    <Sparkle key={`sk${i}`} x={p.x + (i % 2 ? 26 : -22)} y={p.y - 16} s={0.8 + rand() * 0.3} delay={-rand() * 3.4} />
  ))

  const road = pathD(pts, 0, stones + 1)
  const walked = walkedTo > 0 ? pathD(pts, 0, Math.min(walkedTo, stones + 1)) : ''

  return (
    <svg className="map__art" viewBox={`0 0 ${MAP_W} ${height}`} aria-hidden="true">
      <defs>
        <linearGradient id="fp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={FP.skyTop} />
          <stop offset="0.4" stopColor={FP.skyMid} />
          <stop offset="0.78" stopColor={FP.skyLow} />
          <stop offset="1" stopColor={FP.skyHorizon} />
        </linearGradient>
        <linearGradient id="fp-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={FP.floorTop} />
          <stop offset="1" stopColor={FP.floorBottom} />
        </linearGradient>
        <linearGradient id="fp-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={FP.haze} stopOpacity="0" />
          <stop offset="1" stopColor={FP.haze} stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="fp-ice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={FP.lake} />
          <stop offset="1" stopColor={FP.lakeDeep} />
        </linearGradient>
        <linearGradient id="fp-cliff" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={FP.slateLight} />
          <stop offset="0.35" stopColor={FP.slate} />
          <stop offset="1" stopColor={FP.slateDeep} />
        </linearGradient>
        <radialGradient id="fp-sun-glow">
          <stop offset="0.3" stopColor={`rgb(${FP.sunGlow})`} stopOpacity="0.85" />
          <stop offset="1" stopColor={`rgb(${FP.sunGlow})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fp-glow-warm">
          <stop offset="0" stopColor={`rgb(${FP.glowWarm})`} stopOpacity="0.75" />
          <stop offset="1" stopColor={`rgb(${FP.glowWarm})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fp-glow-crystal">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="0.25" stopColor={`rgb(${FP.crystalGlow})`} stopOpacity="0.8" />
          <stop offset="0.55" stopColor={`rgb(${FP.crystalGlow})`} stopOpacity="0.4" />
          <stop offset="1" stopColor={`rgb(${FP.crystalGlow})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fp-glow-lava">
          <stop offset="0" stopColor={`rgb(${FP.lavaGlow})`} stopOpacity="0.85" />
          <stop offset="1" stopColor={`rgb(${FP.lavaGlow})`} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1 cold alpine sky – the sun is HIDDEN behind the great right-hand peak, only its rays fan out */}
      <rect width={MAP_W} height={height} fill="url(#fp-floor)" />
      <rect width={MAP_W} height={skyEnd + 10} fill="url(#fp-sky)" />
      <circle cx="318" cy="96" r="120" fill="url(#fp-sun-glow)" />
      <g stroke={`rgba(${FP.sunGlow},.55)`} strokeWidth={14} strokeLinecap="round">
        {[-150, -128, -106, -84, -62, -40].map((a) => (
          <path key={a} d={`M${318 + Math.cos((a * Math.PI) / 180) * 50} ${96 + Math.sin((a * Math.PI) / 180) * 50} L${318 + Math.cos((a * Math.PI) / 180) * 120} ${96 + Math.sin((a * Math.PI) / 180) * 120}`} />
        ))}
      </g>

      {/* 2 the great peak hiding the sun, a lenticular cloud cap; volcano teaser on the LEFT behind its sign */}
      <Mountain x={318} y={86} w={140} h={230} fill={FP.farPeak} shade={FP.farPeakShade} stroke="rgba(47,36,32,.28)" cap={0.3} />
      <g fill={FP.cloud} stroke="rgba(47,36,32,.14)" strokeWidth={1.6}>
        <ellipse cx="318" cy="80" rx="60" ry="9" />
        <ellipse cx="322" cy="68" rx="42" ry="8" />
        <ellipse cx="316" cy="58" rx="24" ry="6" />
      </g>
      <Mountain x={196} y={150} w={80} h={150} fill={FP.farPeak} shade={FP.farPeakShade} stroke="rgba(47,36,32,.28)" />
      <VolcanoTeaser x={100} y={108} s={0.8} />
      <rect y={skyEnd - 150} width={MAP_W} height={80} fill="url(#fp-haze)" />

      {/* 3 middle ridge (blue) – rising toward the right where the cliff wall begins */}
      <Mountain x={40} y={skyEnd - 100} w={90} h={130} fill={FP.midPeak} shade={FP.midPeakShade} stroke="rgba(47,36,32,.38)" cap={0.22} />
      <Mountain x={150} y={skyEnd - 118} w={86} h={150} fill={FP.midPeak} shade={FP.midPeakShade} stroke="rgba(47,36,32,.38)" cap={0.22} />
      <Mountain x={356} y={skyEnd - 176} w={120} h={230} fill={FP.nearPeak} shade={FP.nearPeakShade} stroke="rgba(47,36,32,.5)" cap={0.2} />
      <rect y={skyEnd - 60} width={MAP_W} height={50} fill="url(#fp-haze)" />

      {/* 4 summit snowfield */}
      <path
        d={`M0 ${skyEnd + 26} C90 ${skyEnd - 30} 300 ${skyEnd - 40} ${MAP_W} ${skyEnd + 10} V${skyEnd + 90} H0 Z`}
        fill={FP.floorTop}
        stroke="rgba(47,36,32,.22)"
        strokeWidth={2}
      />

      {/* 5 floor texture */}
      {patches}
      {cover}

      {/* 6 THE CLIFF WALL along the right flank: strata, snow ledges, perched pines, a cave at its foot */}
      <path d={cliffD} fill="url(#fp-cliff)" stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <path d={strata.join(' ')} stroke={FP.slateDeep} strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d={`M${edgePts.map((p) => `${(p.x + 6).toFixed(1)} ${p.y}`).join(' L')}`} stroke="rgba(255,255,255,.35)" strokeWidth={3} fill="none" strokeLinecap="round" />
      {ledges}
      <CaveMouth x={cave.x} y={cave.y} s={1} />

      {/* 7 icefall down the cliff, frozen stream diagonally across the switchbacks into a skating pond */}
      <path d={fallD} stroke={INK} strokeWidth={24} fill="none" strokeLinecap="round" />
      <path d={fallD} stroke={FP.ice} strokeWidth={19} fill="none" strokeLinecap="round" />
      <path className="fp-shimmer" d={fallD} stroke="#FFFFFF" strokeWidth={3} fill="none" strokeLinecap="round" strokeDasharray="18 14" />
      {[-1, 1].map((d) => (
        <path key={d} d={`M${fallX + d * 9} ${fallTop + 6} v14 m0 30 v18`} stroke={FP.iceDeep} strokeWidth={2} strokeLinecap="round" />
      ))}
      <path d={streamD} stroke={FP.snowShade} strokeWidth={46} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={streamD} stroke={INK} strokeWidth={33} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={streamD} stroke="url(#fp-ice)" strokeWidth={28} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={streamD} stroke={FP.iceLight} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="14 22" opacity={0.85} />
      <FrozenLake x={pond.x} y={pond.y} rx={70} ry={26} seed={11} />

      {/* 8 packed-snow trail: same widths as Burgdorf; pale-blue groove + dashed texture */}
      {rocks}
      <path d={road} fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={FP.trailEdge} strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={FP.trail} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={FP.trailDash} strokeWidth={4} strokeLinecap="round" strokeDasharray="6 16" />
      {walked && <path d={walked} fill="none" stroke="#C9372C" strokeWidth={5} strokeLinecap="round" strokeDasharray="10 12" opacity={0.8} />}

      {/* ice bridge: crystal railings where the trail crosses the frozen stream */}
      <g transform={`translate(${bridge.x} ${bridge.y}) rotate(${bAng})`}>
        {[-21, 21].map((o) => (
          <g key={o}>
            <path d={`M-26 ${o} Q0 ${o - (o < 0 ? 8 : -4)} 26 ${o}`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
            <path d={`M-26 ${o} Q0 ${o - (o < 0 ? 8 : -4)} 26 ${o}`} stroke={FP.iceLight} strokeWidth={4} fill="none" strokeLinecap="round" />
            {[-26, 0, 26].map((px) => (
              <rect key={px} x={px - 3.5} y={o - 7} width={7} height={11} rx={2} fill={FP.ice} stroke={INK} strokeWidth={1.5} />
            ))}
          </g>
        ))}
      </g>

      {deco.map((d) => d.node)}

      {/* 9 summit: ice palace slightly left, crystal lantern on the RIGHT in front of the cliff top */}
      <IcePalace x={MAP_W / 2 - 18} y={chest.y - 24} />
      <g transform={`translate(${MAP_W - 44} ${chest.y + 22}) scale(1.05)`}>
        <CrystalLantern x={0} y={0} />
      </g>
      <Snowdrift x={36} y={chest.y + 36} s={0.9} />

      {/* 10 start: log cabin on the LEFT bank, sled + snowman by the cliff foot on the right */}
      <Lodge x={lodge.x} y={lodge.y} s={0.98} />
      <Pine x={20} y={lodge.y - 70} s={0.9} />
      <Snowman x={292} y={height - 64} s={0.92} />
      <Sled x={350} y={height - 40} />
      <Pine x={378} y={height - 120} s={1.05} slip delay={-3.2} />
      <Pine x={236} y={height - 8} s={0.85} flip />
      <FrostShrub x={330} y={height - 150} s={0.9} />
      <Signpost x={pts[0].x - 74} y={pts[0].y - 6} />

      {/* 11 magic layer */}
      {sparkles}
      {flakes}
      <Snowflake x={40} y={60} s={1.1} delay={-2} />
      <Snowflake x={250} y={44} s={0.9} delay={-5} />
    </svg>
  )
}
