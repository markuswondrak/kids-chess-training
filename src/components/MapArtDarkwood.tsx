/**
 * Finsterwald (Darkwood): die Waldszene der Karte – Abenddämmerung, Große Alte Eiche,
 * Laternen, Glühwürmchen, Eule. Props wie `MapArt`. Zufall nur über `seeded()`, damit die
 * Karte bei jedem Laden gleich aussieht. Bildsprache: Planungsunterlage art-guide.md (Feature 004).
 */
import type { ReactNode } from 'react'
import { MAP_W, chestSpot, pathD, pointOn, seeded, type Pt } from '../game/mapPath'

const INK = '#2F2420'

/** Darkwood palette – mirror these in tokens.css (see art-guide.md §2). */
export const DW = {
  skyTop: '#232C58',
  skyMid: '#47407A',
  skyLow: '#A9668A',
  skyHorizon: '#EFA978',
  ridgeFar: '#6C6699',
  ridgeMid: '#3B4C6E',
  ridgeNear: '#33505A',
  mossTop: '#4C7A4B',
  mossBottom: '#3B6640',
  mossDark: 'rgba(30,60,40,.35)',
  clearing: 'rgba(214,232,170,.22)',
  path: '#D5B884',
  pathEdge: '#BE9C66',
  fir: ['#2E5E4A', '#3A6E52', '#24503E'],
  firLight: 'rgba(255,255,255,.22)',
  canopy: '#2F5F49',
  canopyLight: '#3F7A5C',
  bark: '#6E4C34',
  barkDeep: '#4B3324',
  lantern: '#FFD36B',
  lanternDeep: '#E9A93A',
  glowWarm: '255,206,110',
  firefly: '#F7F59A',
  fireflyGlow: '233,245,120',
  moon: '#FFF3D2',
  moonShade: '#EADDB4',
  cap: '#D9443A',
  capDeep: '#A92F27',
  stem: '#F6EAD0',
  fern: '#7FB06A',
  glowFlower: '#9ED9F5',
  water: '#3E5F8A',
  fog: '#E9E6F5',
  reed: '#7C8F4E',
  owl: '#8C6A4B',
  owlBelly: '#E3CDA2',
}

// ---------------------------------------------------------------- primitives

/** Soft ground shadow – same value as Burgdorf. */
const Shadow = ({ rx, ry = rx / 3.4 }: { rx: number; ry?: number }) => (
  <ellipse cx="0" cy="2" rx={rx} ry={ry} fill="rgba(20,16,30,.28)" />
)

/** Three-tier fir with a white highlight stroke (cartoon "shine"). */
function Fir({ x, y, s = 1, color = DW.fir[0] }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow rx={18} />
      <rect x="-4" y="-14" width="8" height="16" rx="2" fill={DW.bark} stroke={INK} strokeWidth={2.2} />
      <g stroke={INK} strokeWidth={2.4} strokeLinejoin="round" fill={color}>
        <path d="M0 -44 L28 -10 Q0 -16 -28 -10 Z" />
        <path d="M0 -62 L22 -30 Q0 -35 -22 -30 Z" />
        <path d="M0 -80 L16 -50 Q0 -54 -16 -50 Z" />
      </g>
      <path d="M-6 -56 L-12 -38 M-8 -72 L-3 -62" stroke={DW.firLight} strokeWidth={2.6} strokeLinecap="round" fill="none" />
    </g>
  )
}

/** Gnarled leafless tree with curled branch tips – the "spooky but friendly" silhouette. */
function TwistTree({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={20} />
      <path
        d="M-9 2 C-6 -14 -12 -26 -6 -40 C-2 -50 -10 -58 -18 -62 C-24 -64 -26 -58 -22 -56
           M-6 -40 C2 -48 10 -50 14 -62 C16 -70 24 -70 24 -64
           M-4 -24 C6 -26 16 -22 22 -30 C26 -34 30 -30 28 -27"
        fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M-9 2 C-6 -14 -12 -26 -6 -40 C-2 -50 -10 -58 -18 -62 C-24 -64 -26 -58 -22 -56
           M-6 -40 C2 -48 10 -50 14 -62 C16 -70 24 -70 24 -64
           M-4 -24 C6 -26 16 -22 22 -30 C26 -34 30 -30 28 -27"
        fill="none" stroke={DW.bark} strokeWidth={4.6} strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M-14 2 Q-9 -4 -4 2 Z" fill={DW.bark} stroke={INK} strokeWidth={2} />
    </g>
  )
}

/** Toadstool cluster: red caps, white dots, cream stems. `glow` adds a magic halo. */
function Toadstools({ x, y, s = 1, glow = false }: { x: number; y: number; s?: number; glow?: boolean }) {
  const one = (dx: number, h: number, r: number, key: number) => (
    <g key={key} transform={`translate(${dx} 0)`}>
      <path d={`M${-r * 0.35} 0 Q0 ${-h * 0.2} ${-r * 0.25} ${-h} H${r * 0.25} Q0 ${-h * 0.2} ${r * 0.35} 0 Z`} fill={DW.stem} stroke={INK} strokeWidth={2} />
      <path d={`M${-r} ${-h + 1} Q${-r} ${-h - r * 1.15} 0 ${-h - r * 1.15} Q${r} ${-h - r * 1.15} ${r} ${-h + 1} Z`} fill={DW.cap} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <circle cx={-r * 0.45} cy={-h - r * 0.5} r={r * 0.18} fill="#FFFFFF" />
      <circle cx={r * 0.3} cy={-h - r * 0.75} r={r * 0.14} fill="#FFFFFF" />
      <circle cx={r * 0.55} cy={-h - r * 0.25} r={r * 0.12} fill="#FFFFFF" />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {glow && <circle className="dw-glow" cx="0" cy="-12" r="30" fill="url(#dw-glow-magic)" />}
      <Shadow rx={16} />
      {one(-8, 10, 9, 0)}
      {one(7, 14, 11, 1)}
      {one(-1, 6, 6, 2)}
    </g>
  )
}

function Fern({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={DW.fern} strokeWidth={2.2} fill="none" strokeLinecap="round">
      <path d="M0 0 Q-2 -10 -10 -16 M-3 -6 l-5 1 M-6 -11 l-4 -1" />
      <path d="M0 0 Q2 -10 10 -16 M3 -6 l5 1 M6 -11 l4 -1" />
      <path d="M0 0 Q0 -12 1 -20 M0 -8 l-4 -2 M0 -8 l4 -2 M0 -14 l-3 -2 M0 -14 l3 -2" />
    </g>
  )
}

function GlowFlower({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="7" fill="url(#dw-glow-cool)" />
      <path d="M0 0 V6" stroke={DW.fern} strokeWidth={1.8} />
      <circle r="3.2" fill={DW.glowFlower} stroke={INK} strokeWidth={1.2} />
      <circle r="1.2" fill="#FFFFFF" />
    </g>
  )
}

/** Hanging lantern. `className="dw-lantern"` makes it swing (pivot = hook at 0,0). */
function Lantern({ x, y, s = 1, string = 14, delay = 0 }: { x: number; y: number; s?: number; string?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* pivot = this group's origin (the hook): .dw-lantern uses transform-box: view-box; transform-origin: 0 0 */}
      <g className="dw-lantern" style={{ animationDelay: `${delay}s` }}>
        <circle className="dw-glow" cx="0" cy={string + 12} r="26" fill="url(#dw-glow-warm)" />
        <path d={`M0 0 V${string}`} stroke={INK} strokeWidth={1.8} />
        <g transform={`translate(0 ${string})`}>
          <path d="M-6 0 H6 L8 4 H-8 Z" fill={DW.barkDeep} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          <rect x="-7" y="4" width="14" height="16" rx="3" fill={DW.lantern} stroke={INK} strokeWidth={2} />
          <path d="M-2 7 V17 M2 7 V17" stroke={DW.lanternDeep} strokeWidth={1.4} />
          <path d="M-8 20 H8 L6 24 H-6 Z" fill={DW.barkDeep} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          <circle cx="-3" cy="9" r="1.6" fill="#FFFFFF" opacity={0.8} />
        </g>
      </g>
    </g>
  )
}

/** Wooden post with an arm and a hanging lantern – lines the final stretch to the oak. */
function LanternPost({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const d = flip ? -1 : 1
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shadow rx={10} />
      <rect x="-3.5" y="-52" width="7" height="54" rx="2" fill={DW.bark} stroke={INK} strokeWidth={2.2} />
      <path d={`M0 -48 H${18 * d}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d={`M0 -48 H${18 * d}`} stroke={DW.bark} strokeWidth={2.6} strokeLinecap="round" />
      <Lantern x={16 * d} y={-46} s={0.9} string={6} delay={flip ? -0.8 : -2.2} />
    </g>
  )
}

/** Round owl with a smile; eyelids close via `.dw-owl-lid` (scaleY 0 → 1). */
function Owl({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-26 2 H26" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d="M-26 2 H26" stroke={DW.bark} strokeWidth={3.4} strokeLinecap="round" />
      <path d="M-14 -2 C-18 -20 -16 -34 -10 -38 L-8 -46 L-2 -40 H2 L8 -46 L10 -38 C16 -34 18 -20 14 -2 Z" fill={DW.owl} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M-8 -4 C-10 -14 -8 -20 0 -21 C8 -20 10 -14 8 -4 Z" fill={DW.owlBelly} />
      <path d="M-5 -10 q2 2 4 0 M1 -14 q2 2 4 0 M-3 -16 q2 2 4 0" stroke={DW.owl} strokeWidth={1.3} fill="none" />
      {[-6, 6].map((ex) => (
        <g key={ex} transform={`translate(${ex} -30)`}>
          <circle r="5.6" fill="#FFFFFF" stroke={INK} strokeWidth={2} />
          <circle cx="0.6" cy="0.6" r="2.6" fill={INK} />
          <circle cx="1.4" cy="-0.4" r="0.9" fill="#FFFFFF" />
          {/* scale(1 0) = eyes open when not animated (reduced motion / static render); CSS blinks it */}
          <rect className="dw-owl-lid" transform="scale(1 0)" x="-6" y="-6" width="12" height="12" rx="6" fill={DW.owl} stroke={INK} strokeWidth={2} />
        </g>
      ))}
      <path d="M-2 -25 L2 -25 L0 -21 Z" fill="#F3B630" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M-5 -1 v3 M-2 -1 v3 M2 -1 v3 M5 -1 v3" stroke="#F3B630" strokeWidth={1.8} strokeLinecap="round" />
    </g>
  )
}

/** Log cabin with lit window and a smoke curl (`.dw-smoke`). */
function Hut({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="dw-smoke" fill="none" stroke="rgba(233,230,245,.75)" strokeWidth={5} strokeLinecap="round">
        <path d="M14 -66 c-8 -8 6 -14 -2 -22 c-8 -8 6 -14 -2 -22" />
      </g>
      <Shadow rx={36} />
      <rect x="9" y="-66" width="10" height="20" fill="#8A8274" stroke={INK} strokeWidth={2} />
      <rect x="-26" y="-32" width="52" height="34" fill={DW.bark} stroke={INK} strokeWidth={2.4} />
      {[-22, -13, -4, 5].map((ly) => (
        <path key={ly} d={`M-26 ${ly} H26`} stroke={DW.barkDeep} strokeWidth={2} />
      ))}
      {[-24, -15, -6, 3].map((ly) => (
        <g key={ly}>
          <circle cx="-26" cy={ly + 4} r="4.2" fill="#C99A6B" stroke={INK} strokeWidth={1.6} />
          <circle cx="26" cy={ly + 4} r="4.2" fill="#C99A6B" stroke={INK} strokeWidth={1.6} />
        </g>
      ))}
      <path d="M-34 -30 L0 -58 L34 -30 Z" fill="#5E7D4E" stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <path d="M-24 -36 q6 -4 10 0 M6 -44 q6 -4 10 0" stroke="#7FA068" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <circle cx="-12" cy="-14" r="16" fill="url(#dw-glow-warm)" />
      <rect x="-19" y="-21" width="13" height="12" rx="2" fill={DW.lantern} stroke={INK} strokeWidth={2} />
      <path d="M-12.5 -21 V-9 M-19 -15 H-6" stroke={INK} strokeWidth={1.4} />
      <path d="M6 2 V-16 A6 6 0 0 1 18 -16 V2 Z" fill="#4A2C18" stroke={INK} strokeWidth={2} />
    </g>
  )
}

/** Tree-stump cottage – the cute counterpart to Burgdorf's second village house. */
function StumpHouse({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shadow rx={32} />
      <path d="M-30 2 C-24 -2 -24 -10 -24 -40 H24 C24 -10 24 -2 30 2 Z" fill={DW.bark} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M-14 -34 V-6 M12 -36 V-10" stroke={DW.barkDeep} strokeWidth={2} strokeLinecap="round" />
      <ellipse cx="0" cy="-40" rx="24" ry="7" fill="#D9B07A" stroke={INK} strokeWidth={2.2} />
      <ellipse cx="0" cy="-40" rx="13" ry="3.5" fill="none" stroke="#B88B5A" strokeWidth={1.4} />
      {/* toadstool roof */}
      <path d="M-34 -42 Q-34 -82 0 -84 Q34 -82 34 -42 Q0 -50 -34 -42 Z" fill={DW.cap} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <circle cx="-16" cy="-62" r="5" fill="#FFFFFF" />
      <circle cx="10" cy="-72" r="4" fill="#FFFFFF" />
      <circle cx="20" cy="-56" r="3.4" fill="#FFFFFF" />
      <circle cx="12" cy="-22" r="12" fill="url(#dw-glow-warm)" />
      <circle cx="12" cy="-22" r="6" fill={DW.lantern} stroke={INK} strokeWidth={1.8} />
      <path d="M-14 2 V-14 A7 7 0 0 1 0 -14 V2 Z" fill="#4A2C18" stroke={INK} strokeWidth={2} />
    </g>
  )
}

function Woodpile({ x, y }: { x: number; y: number }) {
  const logs = [[-12, 0], [0, 0], [12, 0], [-6, -10], [6, -10], [0, -20]]
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shadow rx={22} />
      {logs.map(([lx, ly], i) => (
        <g key={i} transform={`translate(${lx} ${ly - 5})`}>
          <circle r="6" fill="#C99A6B" stroke={INK} strokeWidth={2} />
          <circle r="2.4" fill="none" stroke={DW.bark} strokeWidth={1.2} />
        </g>
      ))}
      <path d="M22 4 l8 -14 l3 2 l-8 14 Z" fill="#8A8274" stroke={INK} strokeWidth={1.6} />
    </g>
  )
}

/** The landmark at the chest end. Same footprint as Burgdorf's castle. */
function GreatOak({ x, y }: { x: number; y: number }) {
  // Canopy = union of circles: draw thick ink circles first, then the fills on top.
  // That leaves ONE clean outline around the whole blob instead of overlapping rings.
  const blobs: [number, number, number][] = [
    [-92, -150, 40], [92, -146, 40], [-58, -190, 50], [58, -192, 50], [0, -214, 56], [0, -160, 60], [-118, -122, 26], [118, -120, 26],
  ]
  return (
    <g transform={`translate(${x} ${y}) scale(0.84)`}>
      <ellipse cx="0" cy="6" rx="150" ry="16" fill="rgba(20,16,30,.28)" />
      <circle className="dw-door-glow" cx="0" cy="-30" r="70" fill="url(#dw-glow-warm)" />
      {/* roots + trunk */}
      <path
        d="M-78 4 C-56 0 -44 -10 -38 -30 C-34 -60 -36 -100 -30 -130 L30 -130 C36 -100 34 -60 38 -30 C44 -10 56 0 78 4 Z"
        fill={DW.bark} stroke={INK} strokeWidth={2.8} strokeLinejoin="round"
      />
      <path d="M-24 -60 q-4 -20 2 -40 M22 -50 q4 -22 -2 -44 M-50 -2 q10 -6 14 -18 M50 -2 q-10 -6 -14 -18" stroke={DW.barkDeep} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      {/* side branches that carry the lanterns */}
      <path d="M-30 -112 C-60 -116 -84 -108 -104 -96 M30 -110 C60 -114 86 -106 106 -94" stroke={INK} strokeWidth={11} strokeLinecap="round" fill="none" />
      <path d="M-30 -112 C-60 -116 -84 -108 -104 -96 M30 -110 C60 -114 86 -106 106 -94" stroke={DW.bark} strokeWidth={6.4} strokeLinecap="round" fill="none" />
      {/* canopy */}
      {blobs.map(([cx, cy, r], i) => <circle key={`o${i}`} cx={cx} cy={cy} r={r + 2.8} fill={INK} />)}
      {blobs.map(([cx, cy, r], i) => <circle key={`f${i}`} cx={cx} cy={cy} r={r} fill={DW.canopy} />)}
      {blobs.map(([cx, cy, r], i) => <circle key={`h${i}`} cx={cx - r * 0.3} cy={cy - r * 0.32} r={r * 0.42} fill={DW.canopyLight} />)}
      <path d="M-70 -206 q8 -8 16 -4 M30 -240 q8 -8 16 -4 M-110 -150 q6 -6 12 -3" stroke="rgba(255,255,255,.28)" strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* round window + little balcony */}
      <circle cx="10" cy="-96" r="9" fill={DW.lantern} stroke={INK} strokeWidth={2.2} />
      <path d="M10 -105 V-87 M1 -96 H19" stroke={INK} strokeWidth={1.4} />
      <path d="M-46 -70 H-14" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d="M-46 -70 H-14" stroke="#C99A6B" strokeWidth={2.6} strokeLinecap="round" />
      <path d="M-44 -70 V-82 M-36 -70 V-82 M-28 -70 V-82 M-20 -70 V-82 M-46 -82 H-16" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      {/* glowing doorway */}
      <path d="M-18 2 V-30 A18 18 0 0 1 18 -30 V2 Z" fill="url(#dw-door)" stroke={INK} strokeWidth={2.6} />
      <path d="M-8 2 V-10 H8 V2" fill="none" stroke="rgba(160,90,30,.45)" strokeWidth={1.6} />
      {/* moss on the roots */}
      <path d="M-70 2 q6 -8 14 -4 q4 -6 12 -2 M44 0 q6 -8 14 -2 q6 -4 12 2" fill="#5E9A4E" stroke={INK} strokeWidth={1.6} />
      <Lantern x={-100} y={-98} />
      <Lantern x={102} y={-96} delay={-1.6} />
    </g>
  )
}

/** Forested ridge: base line with little fir "teeth" – reads as distant woods. */
function ridgePath(base: number, bottom: number, amp: number, step: number, rand: () => number) {
  let d = `M0 ${base}`
  for (let x = 0; x <= MAP_W; x += step) {
    const swell = Math.sin(x / 70) * amp
    const peak = base - swell - 10 - rand() * 14
    d += ` L${x + step / 2} ${peak.toFixed(1)} L${x + step} ${(base - swell * 0.9).toFixed(1)}`
  }
  return `${d} V${bottom} H0 Z`
}

function Star({ x, y, s = 1, delay }: { x: number; y: number; s?: number; delay: number }) {
  return (
    // Animated element INSIDE a positioned <g>: a CSS transform would replace an SVG transform attribute.
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path className="dw-twinkle" style={{ animationDelay: `${delay}s` }} d="M0 -5 L1.3 -1.3 L5 0 L1.3 1.3 L0 5 L-1.3 1.3 L-5 0 L-1.3 -1.3 Z" fill={DW.moon} />
    </g>
  )
}

function Firefly({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="dw-firefly" style={{ animationDelay: `${delay}s` }}>
        <circle r="16" fill="url(#dw-glow-firefly)" />
        <circle r="3.4" fill={DW.firefly} stroke="rgba(47,36,32,.35)" strokeWidth={0.8} />
      </g>
    </g>
  )
}

/** Soft fog wisp; drifts with `.dw-mist`. */
function Wisp({ x, y, s = 1, delay = 0, opacity = 0.4 }: { x: number; y: number; s?: number; delay?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      className="dw-mist"
      style={{ animationDelay: `${delay}s` }}
      d="M-70 6 C-82 4 -76 -6 -64 -5 C-58 -15 -40 -15 -34 -7 C-26 -17 -2 -17 4 -7 C14 -15 36 -13 40 -3 C56 -7 80 -1 70 6 C40 14 -40 14 -70 6 Z"
      fill={DW.fog}
      opacity={opacity}
    />
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

export function MapArtDarkwood({ height, pts, walkedTo, stones }: MapArtProps) {
  const rand = seeded(23)
  const chest = chestSpot(pts)
  const skyEnd = chest.y - 40
  const free = (p: Pt, min: number, spread: number) => (p.x > MAP_W / 2 ? min + rand() * spread : MAP_W - min - rand() * spread)

  // Trees + deco on the free side of every stone. Collected with their y so they can be depth-sorted.
  const owlIndex = Math.min(6, stones)
  const deco: { y: number; node: ReactNode }[] = []
  for (let i = 1; i <= stones; i++) {
    const p = pts[i]
    if (i === owlIndex) continue // the owl's tree stands here alone – no fir behind it
    const x1 = free(p, 20, 64)
    const y1 = p.y + 34 + rand() * 26
    const roll = rand()
    if (i % 4 === 2) deco.push({ y: y1, node: <TwistTree key={`w${i}`} x={free(p, 40, 40)} y={y1} s={1 + rand() * 0.2} flip={p.x > MAP_W / 2} /> })
    else deco.push({ y: y1, node: <Fir key={`t${i}`} x={x1} y={y1} s={0.95 + rand() * 0.35} color={DW.fir[Math.floor(roll * 3)]} /> })
    if (rand() > 0.3) {
      const x2 = free(p, 34, 56)
      const y2 = p.y - 26 + rand() * 18
      deco.push({ y: y2, node: <Fir key={`u${i}`} x={x2} y={y2} s={0.8 + rand() * 0.3} color={DW.fir[(Math.floor(roll * 3) + 1) % 3]} /> })
    }
    if ([3, 7, 10].includes(i)) {
      const x3 = p.x > MAP_W / 2 ? p.x - 78 : p.x + 78
      deco.push({ y: p.y + 40, node: <Toadstools key={`m${i}`} x={x3} y={p.y + 40} glow /> })
    }
  }
  // The owl sits on a branch near stone 6, on the free side.
  const owlStone = pts[owlIndex]
  const owlX = owlStone.x > MAP_W / 2 ? 62 : MAP_W - 62
  deco.push({ y: owlStone.y - 4, node: <TwistTree key="owl-tree" x={owlX} y={owlStone.y + 10} s={1.25} flip={owlX > MAP_W / 2} /> })
  deco.push({ y: owlStone.y - 3, node: <Owl key="owl" x={owlX + (owlX > MAP_W / 2 ? -14 : 14)} y={owlStone.y - 60} s={1.05} /> })
  deco.sort((a, b) => a.y - b.y)

  // Ground cover: ferns, glow flowers and leaves – never on the path band.
  const cover: ReactNode[] = []
  const leafColors = ['#C9783A', '#E0A23C', '#A9532E']
  for (let i = 0; i < stones * 5; i++) {
    const x = 12 + rand() * (MAP_W - 24)
    const y = skyEnd + 80 + rand() * (height - skyEnd - 100)
    const r = rand()
    if (r < 0.45) cover.push(<Fern key={`f${i}`} x={x} y={y} s={0.9 + rand() * 0.4} />)
    else if (r < 0.7) cover.push(<GlowFlower key={`g${i}`} x={x} y={y} />)
    else cover.push(<ellipse key={`l${i}`} cx={x} cy={y} rx={4} ry={2.2} transform={`rotate(${rand() * 180} ${x} ${y})`} fill={leafColors[i % 3]} stroke={INK} strokeWidth={1} />)
  }

  // Fireflies: 12, off the path, staggered pulse.
  const flies: ReactNode[] = []
  for (let i = 0; i < 12; i++) {
    const p = pts[1 + Math.floor(rand() * stones)]
    flies.push(<Firefly key={`ff${i}`} x={free(p, 24, 90)} y={p.y - 40 + rand() * 80} delay={rand() * 4} />)
  }

  const moss: ReactNode[] = []
  for (let i = 0; i < stones * 2; i++) {
    const x = rand() * MAP_W
    const y = skyEnd + 100 + rand() * (height - skyEnd - 120)
    moss.push(<ellipse key={`mo${i}`} cx={x} cy={y} rx={30 + rand() * 40} ry={10 + rand() * 10} fill={DW.mossDark} />)
  }

  const pool = pts[Math.min(stones, 5)]
  const poolX = pool.x > MAP_W / 2 ? 84 : MAP_W - 84

  // Lantern posts along the last stretch (stone n → chest).
  const lp1 = pointOn(pts, stones, 0.3)
  const lp2 = pointOn(pts, stones, 0.75)

  const road = pathD(pts, 0, stones + 1)
  const walked = walkedTo > 0 ? pathD(pts, 0, Math.min(walkedTo, stones + 1)) : ''
  const r2 = seeded(5)

  return (
    <svg className="map__art" viewBox={`0 0 ${MAP_W} ${height}`} aria-hidden="true">
      <defs>
        <linearGradient id="dw-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={DW.skyTop} />
          <stop offset="0.45" stopColor={DW.skyMid} />
          <stop offset="0.8" stopColor={DW.skyLow} />
          <stop offset="1" stopColor={DW.skyHorizon} />
        </linearGradient>
        <linearGradient id="dw-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={DW.mossTop} />
          <stop offset="1" stopColor={DW.mossBottom} />
        </linearGradient>
        <linearGradient id="dw-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={DW.fog} stopOpacity="0" />
          <stop offset="1" stopColor={DW.fog} stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id="dw-glow-warm">
          <stop offset="0" stopColor={`rgb(${DW.glowWarm})`} stopOpacity="0.75" />
          <stop offset="1" stopColor={`rgb(${DW.glowWarm})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dw-glow-firefly">
          <stop offset="0" stopColor={`rgb(${DW.fireflyGlow})`} stopOpacity="0.85" />
          <stop offset="1" stopColor={`rgb(${DW.fireflyGlow})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dw-glow-cool">
          <stop offset="0" stopColor={DW.glowFlower} stopOpacity="0.8" />
          <stop offset="1" stopColor={DW.glowFlower} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dw-glow-magic">
          <stop offset="0" stopColor="#F5B6E8" stopOpacity="0.7" />
          <stop offset="1" stopColor="#F5B6E8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dw-glow-moon">
          <stop offset="0.45" stopColor={DW.moon} stopOpacity="0.55" />
          <stop offset="1" stopColor={DW.moon} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dw-door" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE9A6" />
          <stop offset="1" stopColor={DW.lanternDeep} />
        </linearGradient>
      </defs>

      {/* 1 sky, stars, moon */}
      <rect width={MAP_W} height={height} fill="url(#dw-floor)" />
      <rect width={MAP_W} height={skyEnd + 10} fill="url(#dw-sky)" />
      {Array.from({ length: 9 }, (_, i) => (
        <Star key={`s${i}`} x={20 + r2() * 360} y={14 + r2() * (skyEnd - 170)} s={0.6 + r2() * 0.7} delay={r2() * 3} />
      ))}
      <circle cx="318" cy="74" r="62" fill="url(#dw-glow-moon)" />
      <circle cx="318" cy="74" r="26" fill={DW.moon} stroke={INK} strokeWidth={2.4} />
      <circle cx="309" cy="68" r="5" fill={DW.moonShade} />
      <circle cx="326" cy="84" r="3.6" fill={DW.moonShade} />
      <circle cx="324" cy="64" r="2.4" fill={DW.moonShade} />

      {/* 2 layered ridges with haze between = depth */}
      <path d={ridgePath(skyEnd - 110, skyEnd + 20, 18, 22, rand)} fill={DW.ridgeFar} />
      <rect y={skyEnd - 150} width={MAP_W} height={80} fill="url(#dw-haze)" />
      <rect y={skyEnd - 100} width={MAP_W} height={50} fill="url(#dw-haze)" />
      <path d={ridgePath(skyEnd - 60, skyEnd + 20, 14, 18, rand)} fill={DW.ridgeMid} stroke="rgba(20,16,30,.25)" strokeWidth={2} />
      <path
        d={`M0 ${skyEnd + 30} C80 ${skyEnd - 40} 320 ${skyEnd - 40} ${MAP_W} ${skyEnd + 30} V${skyEnd + 80} H0 Z`}
        fill={DW.mossTop}
        stroke="rgba(20,16,30,.3)"
        strokeWidth={2}
      />

      {/* 3 Nebelsumpf teaser (next world) under the "coming soon" sign */}
      <g opacity={0.9}>
        <path d="M14 136 h44 l4 -6 h40 l-2 6 h36" stroke={INK} strokeWidth={6} strokeLinecap="round" fill="none" />
        <path d="M14 136 h44 l4 -6 h40 l-2 6 h36" stroke="#9A7A55" strokeWidth={3} strokeLinecap="round" fill="none" />
        {[22, 34, 120, 132, 368, 380].map((rx, i) => (
          <g key={`r${i}`} transform={`translate(${rx} ${i < 4 ? 132 : 150})`}>
            <path d="M0 0 Q-2 -16 1 -30 M5 0 Q6 -12 9 -22" stroke={DW.reed} strokeWidth={2.2} fill="none" strokeLinecap="round" />
            <rect x="-1.6" y="-38" width="5" height="11" rx="2.5" fill="#7A4E2E" stroke={INK} strokeWidth={1.2} />
          </g>
        ))}
        <Wisp x={70} y={120} s={1.4} opacity={0.75} />
        <Wisp x={360} y={140} s={1.1} opacity={0.65} delay={-6} />
      </g>

      {/* 4 landmark */}
      {/* shifted left of centre so the glowing door is not hidden behind the chest */}
      <GreatOak x={MAP_W / 2 - 24} y={chest.y - 24} />

      {/* 5 pool with moon reflection */}
      <g transform={`translate(${poolX} ${pool.y + 56})`}>
        <ellipse rx="48" ry="21" fill={DW.water} stroke={INK} strokeWidth={2.4} />
        <ellipse cx="10" cy="-2" rx="9" ry="4" fill={DW.moon} opacity={0.85} />
        <path d="M-28 4 q8 -5 16 0 M-6 10 q8 -5 16 0" stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.45} />
        <ellipse cx="-24" cy="-6" rx="8" ry="3.5" fill="#5E9A4E" stroke={INK} strokeWidth={1.2} />
        <g transform="translate(40 -6)">
          <path d="M0 0 Q-2 -16 1 -26 M5 0 Q6 -10 8 -18" stroke={DW.reed} strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <rect x="-1.6" y="-34" width="5" height="10" rx="2.5" fill="#7A4E2E" stroke={INK} strokeWidth={1.2} />
        </g>
      </g>

      {/* moss patches give the floor texture; clearings keep every stone readable */}
      {moss}
      {pts.slice(1, stones + 1).map((p, i) => (
        <ellipse key={`c${i}`} cx={p.x} cy={p.y + 8} rx={50} ry={34} fill={DW.clearing} />
      ))}

      {cover}

      {/* 6 forest path: same stroke widths as Burgdorf, earthier colours */}
      <path d={road} fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={DW.path} strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={DW.pathEdge} strokeWidth={7} strokeLinecap="round" strokeDasharray="2 26" />
      {walked && <path d={walked} fill="none" stroke="#C9372C" strokeWidth={5} strokeLinecap="round" strokeDasharray="10 12" opacity={0.8} />}

      <LanternPost x={lp1.x - 30} y={lp1.y + 8} />
      <LanternPost x={lp2.x + 30} y={lp2.y + 8} flip />

      {deco.map((d) => d.node)}

      {/* 7 start: hut, woodpile, signpost with lantern */}
      <Hut x={318} y={height - 104} />
      <Woodpile x={286} y={height - 40} />
      <Fir x={364} y={height - 34} s={1.2} color={DW.fir[2]} />
      <Fir x={34} y={height - 18} s={1.15} color={DW.fir[1]} />
      {/* kept above the start sign (pts[0].x - 74, pts[0].y - 40) so the sign never covers it */}
      <StumpHouse x={58} y={height - 134} />
      <Toadstools x={108} y={height - 124} s={0.8} />
      <g transform={`translate(${pts[0].x - 74} ${pts[0].y - 6})`}>
        <path d="M0 0 V-34" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <Lantern x={10} y={-8} s={0.7} string={4} />
      </g>

      {flies}

      {/* 8 drifting mist in front */}
      <Wisp x={50} y={skyEnd + 76} s={1.2} opacity={0.22} />
      <Wisp x={330} y={skyEnd + 300} s={1.2} opacity={0.22} delay={-8} />
      <Wisp x={60} y={height * 0.55} s={1.3} opacity={0.14} delay={-3} />
    </svg>
  )
}
