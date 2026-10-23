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
import { MAP_W, chestSpot, pathD, pointOn, seeded, type Pt } from '../game/mapPath'

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

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M-40 14 C-56 14 -58 -4 -44 -8 C-46 -24 -24 -30 -14 -18 C-8 -34 18 -36 24 -18 C38 -26 56 -16 50 0 C64 2 62 14 50 14 Z"
      fill={FP.cloud}
      stroke="rgba(47,36,32,.12)"
      strokeWidth={2}
      opacity={0.95}
    />
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
  const freeSide = (p: Pt) => (p.x > MAP_W / 2 ? -1 : 1)
  const free = (p: Pt, min: number, spread: number) => (p.x > MAP_W / 2 ? min + rand() * spread : MAP_W - min - rand() * spread)

  // Special stones: small ice pond (3), frozen lake + penguin (6), rock shelf + crystals (9).
  const pondIdx = Math.min(3, stones)
  const lakeIdx = Math.min(6, stones)
  const shelfIdx = Math.min(9, stones)
  const sideX = (p: Pt, d: number) => (p.x > MAP_W / 2 ? d : MAP_W - d)
  const pond = { x: sideX(pts[pondIdx], 90), y: pts[pondIdx].y + 26 }
  const lake = { x: sideX(pts[lakeIdx], 104), y: pts[lakeIdx].y + 30 }

  const slipPines = new Set([2, 7, 11])
  const deco: { y: number; node: ReactNode }[] = []
  for (let i = 1; i <= stones; i++) {
    const p = pts[i]
    const side = freeSide(p)
    if (i === pondIdx) {
      deco.push({ y: pond.y - 10, node: <Pine key={`pp${i}`} x={pond.x + side * 62} y={pond.y - 10} s={0.95} /> })
      deco.push({ y: pond.y + 52, node: <FrostShrub key={`ps${i}`} x={pond.x - side * 64} y={pond.y + 52} s={0.9} /> })
      continue
    }
    if (i === lakeIdx) {
      deco.push({ y: lake.y - 18, node: <Pine key={`lp${i}`} x={lake.x + side * 72} y={lake.y - 18} s={1.1} /> })
      deco.push({ y: lake.y + 48, node: <Snowdrift key={`ld${i}`} x={lake.x + side * 36} y={lake.y + 48} s={0.85} flip /> })
      continue
    }
    if (i === shelfIdx) {
      const sx = sideX(p, 96)
      deco.push({ y: p.y + 30, node: <RockShelf key={`rs${i}`} x={sx} y={p.y + 30} s={1.15} flip={side < 0} /> })
      deco.push({ y: p.y + 54, node: <IceCrystals key={`ic${i}`} x={sx - side * 36} y={p.y + 54} s={1.05} /> })
      deco.push({ y: p.y - 22, node: <Pine key={`sp${i}`} x={sx + side * 34} y={p.y - 22} s={0.85} /> })
      continue
    }
    const x1 = free(p, 26, 56)
    const y1 = p.y + 36 + rand() * 22
    deco.push({ y: y1, node: <Pine key={`p${i}`} x={x1} y={y1} s={1 + rand() * 0.25} flip={rand() > 0.5} slip={slipPines.has(i)} delay={-rand() * 6} /> })
    const x2 = x1 < MAP_W / 2 ? (x1 < 56 ? x1 + 44 : x1 - 30) : x1 > MAP_W - 56 ? x1 - 44 : x1 + 30
    const y2 = p.y - 26 + rand() * 16
    if (i % 3 === 0) deco.push({ y: y2, node: <Cairn key={`c${i}`} x={x2} y={y2} s={0.95 + rand() * 0.2} /> })
    else if (i % 3 === 1) deco.push({ y: y2, node: <Pine key={`q${i}`} x={x2} y={y2} s={0.72 + rand() * 0.15} flip /> })
    else deco.push({ y: y2, node: <FrostShrub key={`f${i}`} x={x2} y={y2} s={0.95 + rand() * 0.2} /> })
    if ([2, 7, 11].includes(i)) deco.push({ y: p.y + 70, node: <Snowdrift key={`d${i}`} x={p.x + side * 84} y={p.y + 70} flip={side < 0} /> })
    if ([4, 10].includes(i)) deco.push({ y: p.y - 34, node: <IceCrystals key={`x${i}`} x={p.x + side * 78} y={p.y - 34} s={0.85} /> })
  }
  deco.sort((a, b) => a.y - b.y)

  // Floor texture: soft blue drift shadows, glitter dots, small tufts of frosty grass.
  const patches: ReactNode[] = []
  for (let i = 0; i < stones * 3; i++) {
    const x = rand() * MAP_W
    const y = skyEnd + 140 + rand() * (height - skyEnd - 160)
    patches.push(<ellipse key={`fp${i}`} cx={x} cy={y} rx={30 + rand() * 40} ry={8 + rand() * 8} fill={FP.floorPatch} />)
  }
  const cover: ReactNode[] = []
  for (let i = 0; i < stones * 5; i++) {
    const x = 12 + rand() * (MAP_W - 24)
    const y = skyEnd + 140 + rand() * (height - skyEnd - 160)
    const r = rand()
    if (r < 0.3) cover.push(<circle key={`g${i}`} cx={x} cy={y} r={1.6} fill="#FFFFFF" stroke={FP.snowDeep} strokeWidth={0.8} />)
    else if (r < 0.55)
      cover.push(
        <path key={`t${i}`} d={`M${x - 5} ${y} q2 -7 3 -9 M${x} ${y} q0 -8 1 -11 M${x + 5} ${y} q-2 -7 -3 -9`} stroke={FP.shrubDeep} strokeWidth={1.8} fill="none" strokeLinecap="round" />,
      )
    else if (r < 0.82)
      // wind-carved snow wave: blue shadow under a white crest
      cover.push(
        <g key={`w${i}`}>
          <path d={`M${x - 14} ${y + 2} q14 -7 28 0`} stroke={FP.snowShade} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <path d={`M${x - 12} ${y} q12 -7 24 0`} stroke="#FFFFFF" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </g>,
      )
    else
      cover.push(
        <g key={`h${i}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
          <ellipse cx="1" cy="1" rx="13" ry="3" fill={FP.floorPatch} />
          <path d="M-12 0 q12 -11 24 0 Z" fill={FP.snow} stroke={FP.snowDeep} strokeWidth={1.2} strokeLinejoin="round" />
          <path d="M-6 -4 q4 -3 8 -2" stroke="#FFFFFF" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </g>,
      )
  }

  // Snow-capped rocks along the trail edges (between stones, alternating sides).
  const rocks: ReactNode[] = []
  for (let i = 0; i < stones; i++) {
    const a = pointOn(pts, i, 0.45)
    const b = pointOn(pts, i, 0.5)
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
    const sgn = i % 2 ? 1 : -1
    rocks.push(<TrailRocks key={`tr${i}`} x={b.x - ((b.y - a.y) / len) * 25 * sgn} y={b.y + ((b.x - a.x) / len) * 25 * sgn} />)
  }

  // Magic layer: slow snow (16 flakes) and crystal sparkles (8), seeded, on the free side.
  const flakes: ReactNode[] = []
  for (let i = 0; i < 16; i++) {
    const p = pts[1 + Math.floor(rand() * stones)]
    flakes.push(<Snowflake key={`sf${i}`} x={free(p, 20, 100)} y={p.y - 50 + rand() * 90} s={0.8 + rand() * 0.5} delay={-rand() * 9} />)
  }
  const sparkles: ReactNode[] = []
  for (let i = 0; i < 6; i++) {
    const p = pts[1 + Math.floor(rand() * stones)]
    sparkles.push(<Sparkle key={`sk${i}`} x={free(p, 30, 80)} y={p.y + 10 + rand() * 40} s={0.8 + rand() * 0.4} delay={-rand() * 3.4} />)
  }

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

      {/* 1 cold alpine sky, winter sun, light clouds */}
      <rect width={MAP_W} height={height} fill="url(#fp-floor)" />
      <rect width={MAP_W} height={skyEnd + 10} fill="url(#fp-sky)" />
      <circle cx="320" cy="62" r="84" fill="url(#fp-sun-glow)" />
      <circle cx="320" cy="62" r="22" fill={FP.sun} stroke="rgba(47,36,32,.2)" strokeWidth={2} />
      <Cloud x={232} y={28} s={0.7} />
      <Cloud x={392} y={128} s={0.62} />

      {/* 2 far peaks (pale) + Glutvulkan teaser (next world) behind the generic sign */}
      <Mountain x={262} y={92} w={110} h={200} fill={FP.farPeak} shade={FP.farPeakShade} stroke="rgba(47,36,32,.28)" />
      <Mountain x={372} y={120} w={86} h={170} fill={FP.farPeak} shade={FP.farPeakShade} stroke="rgba(47,36,32,.28)" />
      <Mountain x={12} y={128} w={70} h={160} fill={FP.farPeak} shade={FP.farPeakShade} stroke="rgba(47,36,32,.28)" />
      <VolcanoTeaser x={104} y={104} s={0.82} />
      <rect y={skyEnd - 150} width={MAP_W} height={80} fill="url(#fp-haze)" />

      {/* 3 middle ridge (blue) */}
      <Mountain x={56} y={skyEnd - 128} w={96} h={160} fill={FP.midPeak} shade={FP.midPeakShade} stroke="rgba(47,36,32,.38)" cap={0.22} />
      <Mountain x={196} y={skyEnd - 110} w={92} h={150} fill={FP.midPeak} shade={FP.midPeakShade} stroke="rgba(47,36,32,.38)" cap={0.22} />
      <Mountain x={340} y={skyEnd - 132} w={100} h={170} fill={FP.midPeak} shade={FP.midPeakShade} stroke="rgba(47,36,32,.38)" cap={0.22} />
      <rect y={skyEnd - 90} width={MAP_W} height={60} fill="url(#fp-haze)" />

      {/* 4 near ridge (dark slate-blue) */}
      <Mountain x={-6} y={skyEnd - 58} w={80} h={120} fill={FP.nearPeak} shade={FP.nearPeakShade} stroke="rgba(47,36,32,.5)" cap={0.2} />
      <Mountain x={62} y={skyEnd - 50} w={70} h={100} fill={FP.nearPeak} shade={FP.nearPeakShade} stroke="rgba(47,36,32,.5)" cap={0.2} />
      <Mountain x={344} y={skyEnd - 56} w={74} h={110} fill={FP.nearPeak} shade={FP.nearPeakShade} stroke="rgba(47,36,32,.5)" cap={0.2} />
      <Mountain x={404} y={skyEnd - 62} w={70} h={120} fill={FP.nearPeak} shade={FP.nearPeakShade} stroke="rgba(47,36,32,.5)" cap={0.2} />
      <rect y={skyEnd - 30} width={MAP_W} height={40} fill="url(#fp-haze)" />

      {/* 5 summit snowfield + ice palace + crystal lantern */}
      <path
        d={`M0 ${skyEnd + 30} C80 ${skyEnd - 34} 320 ${skyEnd - 34} ${MAP_W} ${skyEnd + 30} V${skyEnd + 90} H0 Z`}
        fill={FP.floorTop}
        stroke="rgba(47,36,32,.22)"
        strokeWidth={2}
      />
      <path d={`M0 ${skyEnd + 34} C80 ${skyEnd - 28} 320 ${skyEnd - 28} ${MAP_W} ${skyEnd + 34} V${skyEnd + 52} C320 ${skyEnd} 80 ${skyEnd} 0 ${skyEnd + 52} Z`} fill={FP.snow} />
      <path d={`M30 ${skyEnd + 26} q40 -18 90 -20 M290 ${skyEnd + 4} q40 4 80 22`} stroke={FP.snowShade} strokeWidth={3} fill="none" strokeLinecap="round" />
      <IcePalace x={MAP_W / 2} y={chest.y - 24} />
      <g transform={`translate(50 ${chest.y + 8}) scale(1.12)`}>
        <CrystalLantern x={0} y={0} />
      </g>
      <Sparkle x={70} y={chest.y - 150} s={1.1} delay={-0.4} />
      <Sparkle x={338} y={chest.y - 128} s={0.9} delay={-1.6} />
      <Sparkle x={256} y={chest.y - 182} s={0.8} delay={-2.5} />
      <Snowdrift x={354} y={chest.y + 30} s={0.9} flip />

      {/* 6 floor texture; packed-snow clearing under every stone keeps it readable */}
      {patches}
      {pts.slice(1, stones + 1).map((p, i) => (
        <ellipse key={`cl${i}`} cx={p.x} cy={p.y + 8} rx={50} ry={34} fill={FP.clearing} />
      ))}
      {cover}

      {/* 7 frozen lake with penguin, small ice pond */}
      <FrozenLake x={pond.x} y={pond.y} rx={52} ry={19} seed={5} />
      <FrozenLake x={lake.x} y={lake.y} rx={78} ry={28} seed={11}>
        <Penguin x={-18} y={6} s={1.05} flip={lake.x < MAP_W / 2} />
      </FrozenLake>

      {/* 8 packed-snow trail: same widths as Burgdorf; pale-blue groove + dashed texture */}
      {rocks}
      <path d={road} fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={FP.trailEdge} strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={FP.trail} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={FP.trailDash} strokeWidth={4} strokeLinecap="round" strokeDasharray="6 16" />
      {walked && <path d={walked} fill="none" stroke="#C9372C" strokeWidth={5} strokeLinecap="round" strokeDasharray="10 12" opacity={0.8} />}

      {deco.map((d) => d.node)}

      {/* 9 start: alpine lodge with smoke + woodpile, snowman, signpost with skis */}
      <Lodge x={318} y={height - 50} s={1.2} />
      <Pine x={388} y={height - 150} s={1.05} />
      <Pine x={30} y={height - 132} s={1.1} slip delay={-3.2} />
      <Snowman x={104} y={height - 128} s={0.95} />
      <FrostShrub x={56} y={height - 12} s={1} />
      <Pine x={226} y={height - 4} s={0.9} flip />
      <Signpost x={pts[0].x - 74} y={pts[0].y - 6} />

      {/* 10 magic layer */}
      {sparkles}
      {flakes}
      <Snowflake x={180} y={44} s={1.1} delay={-2} />
      <Snowflake x={372} y={210} s={0.9} delay={-5} />
      <Snowflake x={26} y={240} s={1} delay={-7.4} />
    </svg>
  )
}
