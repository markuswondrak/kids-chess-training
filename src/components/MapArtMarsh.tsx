/**
 * REFERENCE – Nebelsumpf (Misty Marsh): die Moorszene der Karte – Morgennebel, Alte Weide auf der
 * Truheninsel, Stelzenhütte mit Steg und Ruderboot, Bohlenweg, Tümpel mit Frosch und Reiher,
 * Irrlichter, Libellen, schwankendes Schilf. Props wie `MapArt`. Zufall nur über `seeded()`.
 *
 * Port 1:1 to `src/components/MapArtMarsh.tsx`; only change the import below to `../game/mapPath`.
 * Bildsprache: art-guide.md (Feature 005).
 */
import type { ReactNode } from 'react'
import { MAP_W, chestSpot, pathD, pointOn, seeded, type Pt } from '../game/mapPath'

const INK = '#2F2420'

/** Marsh palette – mirror the shared ones in tokens.css (see art-guide.md §2). */
export const MS = {
  skyTop: '#A7BDB0',
  skyMid: '#C9D7C6',
  skyLow: '#E6EBDA',
  skyHorizon: '#F2F4EA',
  sun: '#FFF6DC',
  sunGlow: '255,236,190',
  peak: '#B9C8CF',
  peakShade: '#9DAEB9',
  snow: '#FBFDFF',
  paleFir: '#A3BDB6',
  bankFar: '#B2C3AE',
  bankMid: '#8DA788',
  bogTop: '#869C5C',
  bogBottom: '#6A7348',
  bogDark: 'rgba(52,72,58,.26)',
  clearing: 'rgba(240,244,214,.24)',
  plank: '#DCC293',
  plankSeam: '#B3915E',
  rope: '#CDAE72',
  water: '#7FB2AE',
  waterDeep: '#5E9592',
  waterLight: '#A8D1CB',
  mud: '#8F8A5C',
  reed: '#93A452',
  reedDeep: '#71833B',
  cattail: '#7A4E2E',
  willow: '#8DAA5E',
  willowLight: '#A9C474',
  willowStrand: '#7E9D52',
  willowDeep: '#5F7F3E',
  alder: ['#6E9452', '#7FA35A', '#5E8649'],
  alderLight: 'rgba(255,255,255,.22)',
  bark: '#8A6A48',
  barkDeep: '#5E4632',
  wicker: '#C79A5B',
  wickerDeep: '#9C7140',
  thatch: '#D7B56A',
  thatchDeep: '#B08E45',
  boat: '#B5643A',
  boatDeep: '#8A4728',
  lantern: '#FFD36B',
  lanternDeep: '#E9A93A',
  glowWarm: '255,206,110',
  marshLight: '#EEF8B0',
  marshGlow: '226,245,140',
  mist: '#F2F4EA',
  moss: '#7DA25A',
  mossLight: '#9BBE6E',
  mushroom: '#E08A4C',
  stem: '#F6EAD0',
  lilyPad: '#6FA04E',
  lilyPadDeep: '#4F7F3A',
  lily: '#FFF4F6',
  lilyPink: '#F6A9C0',
  marigold: '#F3C43A',
  frog: '#7CC05A',
  frogBelly: '#D9EFA0',
  frogCheek: '#F4A3A0',
  heron: '#C3CFD8',
  heronDeep: '#8FA2B2',
  beak: '#F3B630',
  dragonfly: ['#3FA7C9', '#E07A5F', '#7A6FD0'],
  wing: 'rgba(232,246,255,.78)',
  driftwood: '#BFA88A',
  driftwoodDeep: '#8E7A60',
  pebble: '#E3DCC8',
}

// ---------------------------------------------------------------- primitives

/** Soft ground shadow – same value as Burgdorf (daylight world). */
const Shadow = ({ rx, ry = rx / 3.4 }: { rx: number; ry?: number }) => (
  <ellipse cx="0" cy="2" rx={rx} ry={ry} fill="rgba(47,36,32,.16)" />
)

/** Reed cluster with optional cattails; sways around its base (`.ms-sway`). */
function Reeds({ x, y, s = 1, cattails = 2, delay = 0, flip = false }: { x: number; y: number; s?: number; cattails?: number; delay?: number; flip?: boolean }) {
  const blades: [number, number, number][] = [[-9, 26, -4], [-4, 36, -1], [2, 30, 3], [8, 22, 6], [-1, 18, -6]]
  const tails: [number, number][] = [[-2, 44], [5, 38], [-7, 34]].slice(0, cattails) as [number, number][]
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={12} />
      <g className="ms-sway" style={{ animationDelay: `${delay}s` }}>
        {tails.map(([tx, h], i) => (
          <g key={`c${i}`}>
            <path d={`M${tx} 0 Q${tx + 1} ${-h * 0.5} ${tx} ${-h}`} stroke={INK} strokeWidth={3.6} fill="none" strokeLinecap="round" />
            <path d={`M${tx} 0 Q${tx + 1} ${-h * 0.5} ${tx} ${-h}`} stroke={MS.reedDeep} strokeWidth={1.6} fill="none" strokeLinecap="round" />
            <rect x={tx - 2.8} y={-h - 1} width={5.6} height={13} rx={2.8} fill={MS.cattail} stroke={INK} strokeWidth={1.4} />
            <path d={`M${tx} ${-h - 1} V${-h - 5}`} stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
          </g>
        ))}
        {blades.map(([bx, h, lean], i) => (
          <path
            key={`b${i}`}
            d={`M${bx - 2.2} 0 Q${bx - 1} ${-h * 0.6} ${bx + lean} ${-h} Q${bx + 1.6} ${-h * 0.55} ${bx + 2.2} 0 Z`}
            fill={i % 2 ? MS.reed : MS.reedDeep}
            stroke={INK}
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
        ))}
      </g>
    </g>
  )
}

/** Small weeping willow: scalloped curtain of strands under a blob crown (one outline). */
function Willow({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  const blobs: [number, number, number][] = [[-14, -58, 16], [12, -60, 17], [0, -70, 16]]
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={24} />
      <path d="M-5 2 C-4 -14 -2 -30 4 -46 L10 -44 C6 -30 4 -14 5 2 Z" fill={MS.bark} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <path
        d="M-30 -58 C-34 -40 -32 -24 -30 -12 q4 6 8 0 q4 7 8 0 q4 6 8 -1 C-12 -26 -12 -44 -10 -58 Z
           M10 -58 C12 -44 12 -26 14 -14 q4 7 8 0 q4 6 8 0 q4 6 8 -2 C34 -26 34 -42 32 -58 Z"
        fill={MS.willowStrand}
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path d="M-24 -44 V-18 M-17 -46 V-16 M18 -46 V-18 M25 -44 V-16" stroke={MS.willowLight} strokeWidth={1.6} strokeLinecap="round" opacity={0.8} />
      {blobs.map(([cx, cy, r], i) => <circle key={`o${i}`} cx={cx} cy={cy} r={r + 2.4} fill={INK} />)}
      {blobs.map(([cx, cy, r], i) => <circle key={`f${i}`} cx={cx} cy={cy} r={r} fill={MS.willow} />)}
      {blobs.map(([cx, cy, r], i) => <circle key={`h${i}`} cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.4} fill={MS.willowLight} />)}
      <path d="M-20 -66 q5 -5 10 -3" stroke="rgba(255,255,255,.4)" strokeWidth={2.4} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** Alder: oval crown of three blobs (one outline) on a slim trunk. */
function Alder({ x, y, s = 1, color = MS.alder[0] }: { x: number; y: number; s?: number; color?: string }) {
  const blobs: [number, number, number][] = [[-8, -34, 13], [8, -36, 13], [0, -50, 14]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow rx={16} />
      <rect x="-3.5" y="-24" width="7" height="26" rx="2" fill={MS.bark} stroke={INK} strokeWidth={2.2} />
      <path d="M0 -14 l-7 -6" stroke={INK} strokeWidth={4.2} strokeLinecap="round" />
      <path d="M0 -14 l-7 -6" stroke={MS.bark} strokeWidth={1.8} strokeLinecap="round" />
      {blobs.map(([cx, cy, r], i) => <circle key={`o${i}`} cx={cx} cy={cy} r={r + 2.4} fill={INK} />)}
      {blobs.map(([cx, cy, r], i) => <circle key={`f${i}`} cx={cx} cy={cy} r={r} fill={color} />)}
      <circle cx="-5" cy="-56" r="5" fill={MS.alderLight} />
      <circle cx="-12" cy="-38" r="3.4" fill={MS.alderLight} />
      {/* catkins */}
      <path d="M10 -28 v5 M-2 -26 v5 M14 -40 v5" stroke={MS.cattail} strokeWidth={2.4} strokeLinecap="round" />
    </g>
  )
}

/** Moss mound with two friendly orange mushrooms. */
function MossMound({ x, y, s = 1, mushrooms = true }: { x: number; y: number; s?: number; mushrooms?: boolean }) {
  const shroom = (dx: number, h: number, r: number) => (
    <g transform={`translate(${dx} -8)`}>
      <path d={`M${-r * 0.3} 0 Q0 ${-h * 0.2} ${-r * 0.22} ${-h} H${r * 0.22} Q0 ${-h * 0.2} ${r * 0.3} 0 Z`} fill={MS.stem} stroke={INK} strokeWidth={1.6} />
      <path d={`M${-r} ${-h + 1} Q0 ${-h - r * 1.4} ${r} ${-h + 1} Z`} fill={MS.mushroom} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <circle cx={-r * 0.35} cy={-h - r * 0.35} r={r * 0.2} fill="rgba(255,255,255,.7)" />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow rx={24} />
      <path d="M-24 2 C-24 -12 -10 -20 0 -20 C12 -20 24 -12 24 2 Z" fill={MS.moss} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M-14 -10 q4 -5 9 -4 M4 -14 q4 -3 8 0" stroke={MS.mossLight} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      {mushrooms && shroom(-8, 10, 7)}
      {mushrooms && shroom(9, 14, 8.5)}
    </g>
  )
}

/** Weathered driftwood log with a branch stub. */
function Driftwood({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={24} ry={5} />
      <path d="M8 -8 l10 -12" stroke={INK} strokeWidth={6.4} strokeLinecap="round" />
      <path d="M8 -8 l10 -12" stroke={MS.driftwood} strokeWidth={3} strokeLinecap="round" />
      <rect x="-24" y="-12" width="44" height="12" rx="6" fill={MS.driftwood} stroke={INK} strokeWidth={2.2} />
      <ellipse cx="20" cy="-6" rx="4.2" ry="6" fill="#E3D2B6" stroke={INK} strokeWidth={1.8} />
      <path d="M-16 -7 h14 M-8 -3 h12" stroke={MS.driftwoodDeep} strokeWidth={1.4} strokeLinecap="round" />
    </g>
  )
}

function Marigold({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 q-6 -2 -8 -6 q6 0 8 4" fill={MS.reed} stroke={INK} strokeWidth={0.9} />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 3} cy={-5 + Math.sin((a * Math.PI) / 180) * 3} r={2.5} fill={MS.marigold} />
      ))}
      <circle cy={-5} r={1.8} fill="#E08A2C" />
    </g>
  )
}

function GrassTuft({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x - 6} ${y} q2 -9 4 -12 M${x} ${y} q0 -11 1 -15 M${x + 6} ${y} q-2 -9 -4 -12`}
      stroke={MS.reedDeep}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
  )
}

/** Lily pad with a notch; optional white/pink flower. */
function LilyPad({ x, y, r = 8, rot = 0, flower = false }: { x: number; y: number; r?: number; rot?: number; flower?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 L${(r * 0.906).toFixed(1)} ${(-r * 0.254).toFixed(1)} A${r} ${r * 0.6} 0 1 0 ${(r * 0.906).toFixed(1)} ${(r * 0.254).toFixed(1)} Z`} fill={MS.lilyPad} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
      <path d={`M0 0 L${-r * 0.6} ${-r * 0.1}`} stroke={MS.lilyPadDeep} strokeWidth={1} />
      {flower && (
        <g transform={`rotate(${-rot}) translate(-1 -3)`}>
          {[-50, -20, 20, 50, 0].map((a) => (
            <ellipse key={a} cx={0} cy={-3} rx={2.2} ry={4.4} transform={`rotate(${a})`} fill={a === 0 ? MS.lilyPink : MS.lily} stroke={INK} strokeWidth={0.9} />
          ))}
          <circle cy={-1} r={1.4} fill={MS.marigold} />
        </g>
      )}
    </g>
  )
}

/** Ripple ring: positioned group outside, animated ellipse inside (`.ms-ripple`). */
function Ripple({ x, y, r = 14, delay = 0 }: { x: number; y: number; r?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse className="ms-ripple" style={{ animationDelay: `${delay}s` }} rx={r} ry={r * 0.36} fill="none" stroke="#FFFFFF" strokeWidth={1.6} opacity={0.6} />
    </g>
  )
}

/** Shallow pool: muddy bank, water with ink outline, shallow rim, shine, ripples. */
function Pool({ x, y, rx, ry, seed, children }: { x: number; y: number; rx: number; ry: number; seed: number; children?: ReactNode }) {
  const r = seeded(seed)
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse rx={rx + 8} ry={ry + 5} cy={2} fill={MS.mud} opacity={0.55} />
      <ellipse rx={rx} ry={ry} fill="url(#ms-water)" stroke={INK} strokeWidth={2.4} />
      <ellipse rx={rx - 7} ry={ry - 5} cy={-2} fill="none" stroke={MS.waterLight} strokeWidth={2} opacity={0.6} />
      <path d={`M${-rx * 0.55} ${-ry * 0.2} q8 -5 16 0 M${rx * 0.1} ${ry * 0.35} q8 -5 16 0`} stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.55} />
      <Ripple x={-rx * 0.25} y={ry * 0.05} r={rx * 0.24} delay={-r() * 5} />
      <Ripple x={rx * 0.35} y={-ry * 0.15} r={rx * 0.18} delay={-r() * 5} />
      <LilyPad x={-rx * 0.6} y={ry * 0.25} r={7} rot={r() * 360} />
      <LilyPad x={rx * 0.55} y={ry * 0.35} r={6} rot={r() * 360} flower />
      {children}
    </g>
  )
}

/** Smiling frog on a big lily pad; lids blink via `.ms-frog-lid` (static = eyes open). */
function Frog({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 4 L21.3 2.1 A22 8 0 1 0 21.3 5.9 Z" fill={MS.lilyPad} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M-14 2 q8 -3 14 0" stroke={MS.lilyPadDeep} strokeWidth={1.3} fill="none" />
      {/* body */}
      <path d="M-16 2 C-18 -10 -10 -18 0 -18 C10 -18 18 -10 16 2 Z" fill={MS.frog} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M-8 2 C-9 -6 -5 -10 0 -10 C5 -10 9 -6 8 2 Z" fill={MS.frogBelly} />
      {/* feet */}
      <path d="M-18 2 q-4 -2 -6 1 M-18 2 q-3 1 -4 3 M18 2 q4 -2 6 1 M18 2 q3 1 4 3" stroke={INK} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      {/* eyes */}
      {[-8, 8].map((ex) => (
        <g key={ex} transform={`translate(${ex} -18)`}>
          <circle r="6" fill={MS.frog} stroke={INK} strokeWidth={2} />
          <circle r="3.8" fill="#FFFFFF" />
          <circle cx="0.6" cy="0.6" r="2" fill={INK} />
          <circle cx="1.3" cy="-0.3" r="0.7" fill="#FFFFFF" />
          <rect className="ms-frog-lid" transform="scale(1 0)" x="-6" y="-6" width="12" height="12" rx="6" fill={MS.frog} stroke={INK} strokeWidth={1.6} />
        </g>
      ))}
      <path d="M-6 -8 Q0 -3 6 -8" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <circle cx="-11" cy="-8" r="2.4" fill={MS.frogCheek} opacity={0.8} />
      <circle cx="11" cy="-8" r="2.4" fill={MS.frogCheek} opacity={0.8} />
      <circle cx="-6" cy="-13" r="1.6" fill="rgba(255,255,255,.5)" />
    </g>
  )
}

/** Grey heron standing on one leg in the shallows, with a smile. */
function Heron({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="0" cy="2" rx="10" ry="3" fill="#FFFFFF" opacity={0.5} />
      {/* standing leg */}
      <path d="M0 0 V-30" stroke={INK} strokeWidth={4.4} strokeLinecap="round" />
      <path d="M0 0 V-30" stroke={MS.beak} strokeWidth={2} strokeLinecap="round" />
      {/* tucked leg */}
      <path d="M2 -34 L10 -28 L4 -24" stroke={INK} strokeWidth={4.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M2 -34 L10 -28 L4 -24" stroke={MS.beak} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* tail + body */}
      <path d="M-20 -40 L-30 -32 L-18 -36 Z" fill={MS.heronDeep} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M-22 -40 C-20 -54 2 -58 12 -50 C18 -44 14 -32 2 -30 C-10 -28 -22 -30 -22 -40 Z" fill={MS.heron} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M-16 -42 C-8 -48 4 -48 8 -42 C2 -38 -8 -36 -16 -42 Z" fill={MS.heronDeep} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      {/* S-neck (ink under body colour = rounded outlined neck) */}
      <path d="M8 -50 C16 -58 6 -66 8 -74 C10 -82 16 -84 18 -84" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d="M8 -50 C16 -58 6 -66 8 -74 C10 -82 16 -84 18 -84" stroke={MS.heron} strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* head, crest, beak */}
      <path d="M14 -88 C6 -92 0 -90 -4 -94" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <circle cx="18" cy="-86" r="7.4" fill="#FFFFFF" stroke={INK} strokeWidth={2} />
      <path d="M24 -88 L40 -85 L24 -82 Z" fill={MS.beak} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <circle cx="20" cy="-88" r="1.6" fill={INK} />
      <path d="M17 -83 q3 2 6 0" stroke={INK} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <path d="M12 -90 q2 -3 5 -3" stroke={MS.heronDeep} strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M-12 -50 q6 -4 12 -2" stroke="rgba(255,255,255,.7)" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** Dragonfly seen from above. Hover drift on the outer animated group, wing flutter inside. */
function Dragonfly({ x, y, s = 1, color = MS.dragonfly[0], delay = 0, rot = 0 }: { x: number; y: number; s?: number; color?: string; delay?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <g className="ms-dragonfly" style={{ animationDelay: `${delay}s` }}>
        <g className="ms-wing" style={{ animationDelay: `${delay}s` }}>
          <ellipse cx="-4" cy="-8" rx="4" ry="9" transform="rotate(-18 -4 -8)" fill={MS.wing} stroke={INK} strokeWidth={1} />
          <ellipse cx="4" cy="-8" rx="4" ry="9" transform="rotate(18 4 -8)" fill={MS.wing} stroke={INK} strokeWidth={1} />
          <ellipse cx="-4" cy="8" rx="3.4" ry="8" transform="rotate(18 -4 8)" fill={MS.wing} stroke={INK} strokeWidth={1} />
          <ellipse cx="4" cy="8" rx="3.4" ry="8" transform="rotate(-18 4 8)" fill={MS.wing} stroke={INK} strokeWidth={1} />
        </g>
        <rect x="-2.4" y="-6" width="4.8" height="26" rx="2.4" transform="rotate(90)" fill={color} stroke={INK} strokeWidth={1.3} />
        <circle cx="10" cy="0" r="3.6" fill={color} stroke={INK} strokeWidth={1.3} />
        <circle cx="11" cy="-1.4" r="1" fill="#FFFFFF" />
      </g>
    </g>
  )
}

/** Marsh light (Irrlicht): pale green-yellow glow dot, pulses via `.ms-light`. */
function MarshLight({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="ms-light" style={{ animationDelay: `${delay}s` }}>
        <circle r="18" fill="url(#ms-glow-light)" />
        <circle r="3.6" fill={MS.marshLight} stroke="rgba(47,36,32,.35)" strokeWidth={0.9} />
      </g>
    </g>
  )
}

/** Low fog bank: a long soft band drifting with `.ms-fog`. */
function FogBank({ x, y, s = 1, delay = 0, opacity = 0.3 }: { x: number; y: number; s?: number; delay?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * 0.8})`}>
      <path
        className="ms-fog"
        style={{ animationDelay: `${delay}s` }}
        d="M-150 8 C-166 6 -160 -6 -146 -6 C-140 -18 -116 -18 -108 -8 C-98 -20 -70 -20 -62 -8 C-52 -18 -24 -18 -16 -6 C-6 -16 20 -16 28 -6 C38 -16 66 -16 74 -6 C84 -16 112 -14 116 -4 C132 -10 160 -2 150 8 C100 16 -100 16 -150 8 Z"
        fill="url(#ms-fog-fill)"
        opacity={opacity}
      />
    </g>
  )
}

/** Hanging lantern; pivot = hook at the group's origin (`.ms-lantern`, transform-box: view-box). */
function Lantern({ x, y, s = 1, string = 14, delay = 0, glowClass = 'ms-glow' }: { x: number; y: number; s?: number; string?: number; delay?: number; glowClass?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="ms-lantern" style={{ animationDelay: `${delay}s` }}>
        <circle className={glowClass} cx="0" cy={string + 12} r="26" fill="url(#ms-glow-warm)" />
        <path d={`M0 0 V${string}`} stroke={INK} strokeWidth={1.8} />
        <g transform={`translate(0 ${string})`}>
          <path d="M-6 0 H6 L8 4 H-8 Z" fill={MS.barkDeep} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          <rect x="-7" y="4" width="14" height="16" rx="3" fill={MS.lantern} stroke={INK} strokeWidth={2} />
          <path d="M-2 7 V17 M2 7 V17" stroke={MS.lanternDeep} strokeWidth={1.4} />
          <path d="M-8 20 H8 L6 24 H-6 Z" fill={MS.barkDeep} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          <circle cx="-3" cy="9" r="1.6" fill="#FFFFFF" opacity={0.8} />
        </g>
      </g>
    </g>
  )
}

/** Rowing boat; bobs via `.ms-bob` on the inner group. */
function Boat({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="ms-bob">
        <path d="M-30 -8 H30 C26 4 18 8 0 8 C-18 8 -26 4 -30 -8 Z" fill={MS.boat} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
        <path d="M-27 -3 H27" stroke={MS.boatDeep} strokeWidth={2} />
        <path d="M-30 -8 H30" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <path d="M-30 -8 H30" stroke="#D9895A" strokeWidth={1.8} strokeLinecap="round" />
        <path d="M-10 -8 V-11 M10 -8 V-11" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        {/* oar */}
        <path d="M-6 -12 L26 -22" stroke={INK} strokeWidth={4.4} strokeLinecap="round" />
        <path d="M-6 -12 L26 -22" stroke={MS.driftwood} strokeWidth={2} strokeLinecap="round" />
        <ellipse cx="29" cy="-23" rx="6" ry="3" transform="rotate(-18 29 -23)" fill={MS.driftwood} stroke={INK} strokeWidth={1.6} />
        <path d="M-18 -4 q4 -2 8 0" stroke="rgba(255,255,255,.35)" strokeWidth={2} fill="none" strokeLinecap="round" />
      </g>
    </g>
  )
}

/** Stilt hut over the water: wicker walls, thatch, round lit window, smoke curl, jetty. */
function StiltHut({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="ms-smoke" fill="none" stroke="rgba(242,244,234,.85)" strokeWidth={5} strokeLinecap="round">
        <path d="M18 -86 c-8 -8 6 -14 -2 -22 c-8 -8 6 -14 -2 -22" />
      </g>
      {/* stilts into the water */}
      {[-24, -8, 10, 26].map((sx) => (
        <g key={sx}>
          <rect x={sx - 3} y={-2} width={6} height={40} rx={2} fill={MS.bark} stroke={INK} strokeWidth={1.8} />
          <ellipse cx={sx} cy={38} rx={6} ry={2} fill="none" stroke="#FFFFFF" strokeWidth={1.2} opacity={0.6} />
        </g>
      ))}
      <path d="M-24 10 L26 30 M26 10 L-24 30" stroke={MS.barkDeep} strokeWidth={2} />
      {/* deck */}
      <rect x="-36" y="-6" width="72" height="9" rx="3" fill={MS.plank} stroke={INK} strokeWidth={2.2} />
      <path d="M-24 -6 V3 M-12 -6 V3 M0 -6 V3 M12 -6 V3 M24 -6 V3" stroke={MS.plankSeam} strokeWidth={1.4} />
      {/* chimney */}
      <rect x="13" y="-84" width="10" height="20" rx="2" fill="#9A8E7A" stroke={INK} strokeWidth={2} />
      {/* wicker walls */}
      <path d="M-26 -6 C-28 -22 -28 -34 -26 -44 H26 C28 -34 28 -22 26 -6 Z" fill={MS.wicker} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      {[-36, -28, -20, -12].map((ly, i) => (
        <path key={ly} d={`M-26 ${ly} ${Array.from({ length: 7 }, () => `q4 ${i % 2 ? 3 : -3} 8 0`).join(' ')}`} stroke={MS.wickerDeep} strokeWidth={1.6} fill="none" />
      ))}
      {/* thatch roof */}
      <path d="M-38 -40 C-30 -60 -12 -76 2 -80 C16 -76 32 -60 40 -40 C20 -44 -18 -44 -38 -40 Z" fill={MS.thatch} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <path d="M-26 -46 l-4 6 M-14 -54 l-3 9 M-2 -60 l-1 12 M10 -58 l2 11 M22 -50 l4 8 M32 -44 l3 4" stroke={MS.thatchDeep} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M-20 -58 q8 -10 18 -14" stroke="rgba(255,255,255,.45)" strokeWidth={2.6} fill="none" strokeLinecap="round" />
      {/* round lit window + door */}
      <circle cx="-11" cy="-26" r="15" fill="url(#ms-glow-warm)" />
      <circle cx="-11" cy="-26" r="7" fill={MS.lantern} stroke={INK} strokeWidth={2} />
      <path d="M-11 -33 V-19 M-18 -26 H-4" stroke={INK} strokeWidth={1.3} />
      <path d="M6 -6 V-22 A6 6 0 0 1 18 -22 V-6 Z" fill="#5A3A22" stroke={INK} strokeWidth={2} />
      <circle cx="15" cy="-14" r="1.2" fill={MS.lantern} />
    </g>
  )
}

/** Jetty: planks on posts from the hut toward the boat. */
function Jetty({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[4, w / 2, w - 6].map((px) => (
        <rect key={px} x={px - 2.5} y={-2} width={5} height={18} rx={2} fill={MS.bark} stroke={INK} strokeWidth={1.6} />
      ))}
      <rect x="0" y="-6" width={w} height="8" rx="3" fill={MS.plank} stroke={INK} strokeWidth={2} />
      {Array.from({ length: Math.floor(w / 10) - 1 }, (_, i) => (
        <path key={i} d={`M${10 + i * 10} -6 V2`} stroke={MS.plankSeam} strokeWidth={1.3} />
      ))}
      {/* mooring post + rope */}
      <rect x="-3" y="-16" width="6" height="18" rx="2.5" fill={MS.bark} stroke={INK} strokeWidth={1.8} />
      <path d="M0 -10 Q-6 0 -14 4" stroke={MS.rope} strokeWidth={1.6} fill="none" />
    </g>
  )
}

/** Signpost with a small lantern and a tied reed bundle. */
function Signpost({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 V-34" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <Lantern x={10} y={-8} s={0.7} string={4} delay={-1.1} />
      <g transform="translate(-16 2)">
        <path d="M-6 0 L-2 -24 M-2 0 L0 -28 M2 0 L2 -26 M6 0 L4 -22" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />
        <path d="M-6 0 L-2 -24 M-2 0 L0 -28 M2 0 L2 -26 M6 0 L4 -22" stroke={MS.thatch} strokeWidth={1.6} strokeLinecap="round" />
        <rect x="-6" y="-14" width="12" height="4" rx="1.5" fill={MS.boat} stroke={INK} strokeWidth={1.2} />
      </g>
    </g>
  )
}

/** Rope rail post along the plank walkway to the island. */
function RopePost({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shadow rx={6} />
      <rect x="-3" y="-22" width="6" height="24" rx="2.5" fill={MS.bark} stroke={INK} strokeWidth={1.8} />
      <circle cx="0" cy="-22" r="3" fill={MS.barkDeep} stroke={INK} strokeWidth={1.4} />
    </g>
  )
}

/** The landmark at the chest end: the Old Willow, leaning, with a hanging lantern. */
function OldWillow({ x, y }: { x: number; y: number }) {
  const blobs: [number, number, number][] = [
    [-100, -146, 30], [104, -144, 30], [-62, -170, 40], [60, -172, 40], [0, -186, 46], [0, -150, 48], [-130, -126, 20], [132, -124, 20],
  ]
  const curtain = (x0: number, x1: number, top: number, bottom: number, bumps: number) => {
    const w = (x1 - x0) / bumps
    let d = `M${x0} ${top} C${x0 - 6} ${top + 30} ${x0 - 4} ${bottom - 20} ${x0} ${bottom}`
    for (let i = 0; i < bumps; i++) d += ` q${w / 2} ${i % 2 ? 12 : 9} ${w} ${i === bumps - 1 ? -2 : 0}`
    d += ` C${x1 + 4} ${bottom - 20} ${x1 + 6} ${top + 30} ${x1} ${top} Z`
    return d
  }
  return (
    <g transform={`translate(${x} ${y}) scale(0.9)`}>
      <ellipse cx="6" cy="6" rx="150" ry="16" fill="rgba(47,36,32,.16)" />
      {/* roots + leaning trunk */}
      <path
        d="M-62 4 C-40 0 -28 -8 -22 -30 C-16 -60 -2 -96 10 -128 L44 -122 C32 -94 24 -60 26 -32 C28 -10 42 0 66 4 Z"
        fill={MS.bark} stroke={INK} strokeWidth={2.8} strokeLinejoin="round"
      />
      <path d="M-12 -40 q2 -24 12 -46 M16 -36 q0 -24 12 -52 M-40 -2 q10 -6 14 -18 M42 -2 q-10 -6 -14 -16" stroke={MS.barkDeep} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <ellipse cx="6" cy="-58" rx="6" ry="8" fill={MS.barkDeep} stroke={INK} strokeWidth={2} />
      {/* branches */}
      <path d="M2 -108 C-30 -118 -62 -116 -92 -104 M32 -116 C58 -126 86 -122 108 -112" stroke={INK} strokeWidth={11} strokeLinecap="round" fill="none" />
      <path d="M2 -108 C-30 -118 -62 -116 -92 -104 M32 -116 C58 -126 86 -122 108 -112" stroke={MS.bark} strokeWidth={6.4} strokeLinecap="round" fill="none" />
      {/* hanging strand curtains (under the crown) */}
      <path d={curtain(-152, -96, -130, -30, 5)} fill={MS.willowStrand} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <path d={curtain(-90, -40, -130, -62, 4)} fill={MS.willowStrand} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={curtain(72, 128, -130, -44, 5)} fill={MS.willowStrand} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <path d={curtain(130, 156, -120, -64, 2)} fill={MS.willowStrand} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path
        d="M-144 -110 V-44 M-132 -114 V-38 M-120 -112 V-40 M-108 -114 V-38 M-80 -114 V-68 M-66 -114 V-64 M-52 -116 V-68
           M82 -116 V-56 M94 -118 V-50 M106 -118 V-52 M118 -116 V-50 M140 -108 V-70"
        stroke={MS.willowLight} strokeWidth={1.8} strokeLinecap="round" opacity={0.75}
      />
      {/* crown: one outline around the union of blobs */}
      {blobs.map(([cx, cy, r], i) => <circle key={`o${i}`} cx={cx} cy={cy} r={r + 2.8} fill={INK} />)}
      {blobs.map(([cx, cy, r], i) => <circle key={`f${i}`} cx={cx} cy={cy} r={r} fill={MS.willow} />)}
      {blobs.map(([cx, cy, r], i) => <circle key={`h${i}`} cx={cx - r * 0.3} cy={cy - r * 0.32} r={r * 0.42} fill={MS.willowLight} />)}
      {/* strands falling over the crown edge */}
      <path d="M-120 -136 q-2 14 0 26 M-84 -150 q-2 16 0 30 M-30 -140 q-2 12 0 22 M30 -142 q2 12 0 22 M84 -150 q2 16 0 30 M120 -134 q2 14 0 24" stroke={MS.willowDeep} strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M-74 -192 q8 -8 16 -4 M24 -214 q8 -8 16 -4 M-112 -150 q6 -6 12 -3" stroke="rgba(255,255,255,.4)" strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* little bird box with a lit hole */}
      <g transform="translate(22 -80)">
        <path d="M-10 -12 L0 -20 L10 -12 Z" fill={MS.boat} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
        <rect x="-8" y="-12" width="16" height="16" rx="2" fill={MS.wicker} stroke={INK} strokeWidth={1.8} />
        <circle cy="-4" r="3.2" fill={MS.lantern} stroke={INK} strokeWidth={1.2} />
      </g>
      {/* moss on the roots */}
      <path d="M-56 2 q6 -8 14 -4 q4 -6 12 -2 M36 0 q6 -8 14 -2 q6 -4 12 2" fill={MS.moss} stroke={INK} strokeWidth={1.6} />
      {/* the lantern: its big halo glows brighter when the chest is ready (`.ms-willow-glow`, no new props) */}
      <ellipse className="ms-willow-glow" cx={-80} cy={-4} rx={70} ry={16} fill="url(#ms-glow-lantern)" />
      <circle className="ms-willow-glow" cx={-88} cy={-72} r={64} fill="url(#ms-glow-lantern)" />
      <Lantern x={-88} y={-104} string={20} />
    </g>
  )
}

/** Frostgipfel teaser peak: snow cap, ink outline, shade side. */
function Peak({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-w / 2} ${h} L-4 3 Q0 -2 4 3 L${w / 2} ${h} Z`} fill={MS.peak} stroke="rgba(47,36,32,.4)" strokeWidth={2} strokeLinejoin="round" />
      <path d={`M2 2 L${w / 2} ${h} H${w * 0.12} Z`} fill={MS.peakShade} />
      <path
        d={`M${-w * 0.16} ${h * 0.3} L-4 3 Q0 -2 4 3 L${w * 0.17} ${h * 0.3} L${w * 0.08} ${h * 0.24} L${w * 0.02} ${h * 0.34} L${-w * 0.06} ${h * 0.25} Z`}
        fill={MS.snow} stroke="rgba(47,36,32,.4)" strokeWidth={1.6} strokeLinejoin="round"
      />
    </g>
  )
}

function PaleFir({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={MS.paleFir} stroke="rgba(47,36,32,.3)" strokeWidth={1.6} strokeLinejoin="round">
      <path d="M0 -30 L10 -10 H-10 Z" />
      <path d="M0 -20 L13 2 H-13 Z" />
      <path d="M-3 -24 l-3 6" stroke="#FFFFFF" strokeWidth={1.6} strokeLinecap="round" />
    </g>
  )
}

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M-40 14 C-56 14 -58 -4 -44 -8 C-46 -24 -24 -30 -14 -18 C-8 -34 18 -36 24 -18 C38 -26 56 -16 50 0 C64 2 62 14 50 14 Z"
      fill="#FBFBF5"
      stroke="rgba(47,36,32,.12)"
      strokeWidth={2}
      opacity={0.92}
    />
  )
}

/** Reed bank silhouette: wavy base with thin blade spikes – reads as distant reeds. */
function reedBank(base: number, bottom: number, amp: number, rand: () => number, tails: Pt[]) {
  let d = `M0 ${base}`
  for (let x = 0; x <= MAP_W; x += 6) {
    const swell = Math.sin(x / 64) * amp
    const top = base - swell - 6 - rand() * 14
    d += ` L${x + 1.5} ${(base - swell * 0.9).toFixed(1)} L${x + 3} ${top.toFixed(1)} L${x + 4.5} ${(base - swell * 0.9).toFixed(1)}`
    if (rand() > 0.9) tails.push({ x: x + 3, y: top })
  }
  return `${d} V${bottom} H0 Z`
}

// ---------------------------------------------------------------- scene

interface MapArtProps {
  height: number
  pts: Pt[]
  walkedTo: number
  stones: number
}

export function MapArtMarsh({ height, pts, walkedTo, stones }: MapArtProps) {
  const rand = seeded(31)
  const chest = chestSpot(pts)
  const skyEnd = chest.y - 40
  const freeSide = (p: Pt) => (p.x > MAP_W / 2 ? -1 : 1)
  const free = (p: Pt, min: number, spread: number) => (p.x > MAP_W / 2 ? min + rand() * spread : MAP_W - min - rand() * spread)

  // Pools sit on the free side of three stones; those stones get reeds instead of trees.
  const smallIdx = Math.min(3, stones)
  const frogIdx = Math.min(6, stones)
  const heronIdx = Math.min(9, stones)
  const poolAt = (i: number, dy: number) => {
    const p = pts[i]
    return { x: p.x > MAP_W / 2 ? 92 : MAP_W - 100, y: p.y + dy }
  }
  const poolSmall = poolAt(smallIdx, 24)
  const poolFrog = poolAt(frogIdx, 26)
  const poolHeron = poolAt(heronIdx, 28)

  const deco: { y: number; node: ReactNode }[] = []
  for (let i = 1; i <= stones; i++) {
    const p = pts[i]
    const side = freeSide(p)
    if (i === smallIdx || i === frogIdx || i === heronIdx) {
      const pool = i === smallIdx ? poolSmall : i === frogIdx ? poolFrog : poolHeron
      deco.push({ y: pool.y - 14, node: <Reeds key={`pr${i}`} x={pool.x + side * 54} y={pool.y - 14} s={1.05} delay={-rand() * 4} /> })
      deco.push({ y: pool.y + 22, node: <Reeds key={`ps${i}`} x={pool.x - side * 50} y={pool.y + 22} s={0.85} cattails={1} delay={-rand() * 4} flip /> })
      continue
    }
    const x1 = free(p, 22, 60)
    const y1 = p.y + 36 + rand() * 24
    if (i % 3 === 1) deco.push({ y: y1, node: <Willow key={`w${i}`} x={x1} y={y1} s={1 + rand() * 0.2} flip={p.x > MAP_W / 2} /> })
    else deco.push({ y: y1, node: <Alder key={`a${i}`} x={x1} y={y1} s={0.95 + rand() * 0.3} color={MS.alder[i % 3]} /> })
    if (rand() > 0.25) {
      const x2 = free(p, 36, 50)
      const y2 = p.y - 24 + rand() * 16
      deco.push({ y: y2, node: <Reeds key={`r${i}`} x={x2} y={y2} s={0.9 + rand() * 0.3} cattails={1 + Math.floor(rand() * 3)} delay={-rand() * 4} /> })
    }
    if ([2, 7, 11].includes(i)) {
      deco.push({ y: p.y + 44, node: <MossMound key={`m${i}`} x={p.x + side * 80} y={p.y + 44} /> })
    }
    if ([4, 10].includes(i)) {
      deco.push({ y: p.y - 30, node: <Driftwood key={`d${i}`} x={p.x + side * 76} y={p.y - 30} flip={side < 0} /> })
    }
  }
  // Heron stands in the shallow edge of its pool, the frog sits on a lily pad in the middle of its pool.
  deco.push({ y: poolHeron.y + 6, node: <Heron key="heron" x={poolHeron.x + (poolHeron.x < MAP_W / 2 ? 14 : -14)} y={poolHeron.y + 6} flip={poolHeron.x > MAP_W / 2} /> })
  deco.sort((a, b) => a.y - b.y)

  // Ground cover: grass tufts, marigolds, moss specks – under the path, never on the pools.
  const cover: ReactNode[] = []
  for (let i = 0; i < stones * 5; i++) {
    const x = 12 + rand() * (MAP_W - 24)
    const y = skyEnd + 140 + rand() * (height - skyEnd - 160)
    const r = rand()
    if (r < 0.5) cover.push(<GrassTuft key={`g${i}`} x={x} y={y} />)
    else if (r < 0.8) cover.push(<Marigold key={`f${i}`} x={x} y={y} />)
    else cover.push(<ellipse key={`p${i}`} cx={x} cy={y} rx={9} ry={3.4} fill={MS.waterDeep} opacity={0.35} />)
  }

  // Waterlogged patches give the floor texture.
  const patches: ReactNode[] = []
  for (let i = 0; i < stones * 2; i++) {
    const x = rand() * MAP_W
    const y = skyEnd + 140 + rand() * (height - skyEnd - 160)
    patches.push(<ellipse key={`bp${i}`} cx={x} cy={y} rx={30 + rand() * 40} ry={9 + rand() * 9} fill={MS.bogDark} />)
  }

  // Gravel / driftwood banks along the walkway edges (between stones).
  const banks: ReactNode[] = []
  for (let i = 0; i < stones; i++) {
    const a = pointOn(pts, i, 0.45)
    const b = pointOn(pts, i, 0.5)
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
    const nx = -(b.y - a.y) / len
    const ny = (b.x - a.x) / len
    const sgn = i % 2 ? 1 : -1
    const cx = b.x + nx * 24 * sgn
    const cy = b.y + ny * 24 * sgn
    banks.push(
      <g key={`gb${i}`} transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)})`}>
        <ellipse cx="-5" cy="0" rx="5" ry="3.2" fill={MS.pebble} stroke={INK} strokeWidth={1} />
        <ellipse cx="4" cy="2" rx="4" ry="2.6" fill={MS.pebble} stroke={INK} strokeWidth={1} />
        <ellipse cx="1" cy="-4" rx="3.2" ry="2.2" fill={MS.pebble} stroke={INK} strokeWidth={1} />
      </g>,
    )
  }

  // Marsh lights: 12, on the free side, staggered pulse.
  const lights: ReactNode[] = []
  for (let i = 0; i < 12; i++) {
    const p = pts[1 + Math.floor(rand() * stones)]
    lights.push(<MarshLight key={`ml${i}`} x={free(p, 24, 90)} y={p.y - 46 + rand() * 80} delay={-rand() * 4} />)
  }

  // Rope rail along the last stretch (stone n → chest island).
  const rp1 = pointOn(pts, stones, 0.32)
  const rp2 = pointOn(pts, stones, 0.72)
  const rope = (dx: number) =>
    `M${rp1.x + dx} ${rp1.y - 20} Q${(rp1.x + rp2.x) / 2 + dx} ${(rp1.y + rp2.y) / 2 - 8} ${rp2.x + dx} ${rp2.y - 20}`

  const road = pathD(pts, 0, stones + 1)
  const walked = walkedTo > 0 ? pathD(pts, 0, Math.min(walkedTo, stones + 1)) : ''
  const tailsFar: Pt[] = []
  const tailsMid: Pt[] = []
  const farBank = reedBank(skyEnd - 96, skyEnd + 20, 10, rand, tailsFar)
  const midBank = reedBank(skyEnd - 48, skyEnd + 20, 8, rand, tailsMid)

  return (
    <svg className="map__art" viewBox={`0 0 ${MAP_W} ${height}`} aria-hidden="true">
      <defs>
        <linearGradient id="ms-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={MS.skyTop} />
          <stop offset="0.45" stopColor={MS.skyMid} />
          <stop offset="0.8" stopColor={MS.skyLow} />
          <stop offset="1" stopColor={MS.skyHorizon} />
        </linearGradient>
        <linearGradient id="ms-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={MS.bogTop} />
          <stop offset="1" stopColor={MS.bogBottom} />
        </linearGradient>
        <linearGradient id="ms-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={MS.mist} stopOpacity="0" />
          <stop offset="1" stopColor={MS.mist} stopOpacity="0.7" />
        </linearGradient>
        {/* fog banks: crisp puffy top, soft fading bottom – no blur filter */}
        <linearGradient id="ms-fog-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.3" stopColor={MS.mist} stopOpacity="1" />
          <stop offset="1" stopColor={MS.mist} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ms-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={MS.water} />
          <stop offset="1" stopColor={MS.waterDeep} />
        </linearGradient>
        <radialGradient id="ms-sun-glow">
          <stop offset="0.3" stopColor={`rgb(${MS.sunGlow})`} stopOpacity="0.8" />
          <stop offset="1" stopColor={`rgb(${MS.sunGlow})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ms-glow-warm">
          <stop offset="0" stopColor={`rgb(${MS.glowWarm})`} stopOpacity="0.75" />
          <stop offset="1" stopColor={`rgb(${MS.glowWarm})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ms-glow-lantern">
          <stop offset="0" stopColor={`rgb(${MS.glowWarm})`} stopOpacity="0.95" />
          <stop offset="0.45" stopColor={`rgb(${MS.glowWarm})`} stopOpacity="0.55" />
          <stop offset="1" stopColor={`rgb(${MS.glowWarm})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ms-glow-light">
          <stop offset="0" stopColor={`rgb(${MS.marshGlow})`} stopOpacity="0.9" />
          <stop offset="1" stopColor={`rgb(${MS.marshGlow})`} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1 morning fog sky, low sun, high clouds */}
      <rect width={MAP_W} height={height} fill="url(#ms-floor)" />
      <rect width={MAP_W} height={skyEnd + 10} fill="url(#ms-sky)" />
      <circle cx="306" cy="70" r="80" fill="url(#ms-sun-glow)" />
      <circle cx="306" cy="70" r="22" fill={MS.sun} stroke="rgba(47,36,32,.22)" strokeWidth={2} />
      <Cloud x={226} y={30} s={0.75} />
      <Cloud x={386} y={150} s={0.7} />

      {/* 2 Frostgipfel teaser (next world) behind the "coming soon" sign */}
      <g opacity={0.92}>
        <Peak x={118} y={58} w={150} h={150} />
        <Peak x={30} y={104} w={110} h={100} />
        <Peak x={356} y={96} w={130} h={110} />
        {[[22, 196, 0.9], [44, 192, 1.05], [70, 198, 0.85], [318, 196, 0.95], [340, 192, 1.1], [378, 198, 0.9]].map(([fx, fy, fs], i) => (
          <PaleFir key={`pf${i}`} x={fx} y={fy} s={fs} />
        ))}
        <rect y={150} width={MAP_W} height={56} fill="url(#ms-haze)" />
      </g>

      {/* 3 layered reed banks with fog bands between = depth */}
      <path d={farBank} fill={MS.bankFar} />
      {tailsFar.map((t, i) => <rect key={`tf${i}`} x={t.x - 2.2} y={t.y - 8} width={4.4} height={10} rx={2.2} fill={MS.bankFar} />)}
      <rect y={skyEnd - 110} width={MAP_W} height={70} fill="url(#ms-haze)" />
      <path d={midBank} fill={MS.bankMid} stroke="rgba(47,36,32,.18)" strokeWidth={1.4} />
      {tailsMid.map((t, i) => <rect key={`tm${i}`} x={t.x - 2.4} y={t.y - 9} width={4.8} height={11} rx={2.4} fill={MS.bankMid} />)}
      <rect y={skyEnd - 60} width={MAP_W} height={50} fill="url(#ms-haze)" />
      <path
        d={`M0 ${skyEnd + 30} C80 ${skyEnd - 30} 320 ${skyEnd - 30} ${MAP_W} ${skyEnd + 30} V${skyEnd + 80} H0 Z`}
        fill={MS.bogTop}
        stroke="rgba(47,36,32,.22)"
        strokeWidth={2}
      />

      {/* 4 lagoon + chest island with the Old Willow */}
      <ellipse cx={200} cy={skyEnd + 72} rx={214} ry={54} fill="url(#ms-water)" stroke={INK} strokeWidth={2.4} />
      <path d={`M24 ${skyEnd + 100} q10 -5 20 0 M330 ${skyEnd + 104} q10 -5 20 0 M250 ${skyEnd + 116} q8 -4 16 0`} stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.5} />
      <Ripple x={300} y={skyEnd + 96} r={16} delay={-1} />
      <Ripple x={46} y={skyEnd + 84} r={13} delay={-3.4} />
      <LilyPad x={270} y={skyEnd + 112} r={8} rot={30} flower />
      <LilyPad x={350} y={skyEnd + 92} r={7} rot={200} />
      <LilyPad x={20} y={skyEnd + 112} r={7} rot={120} />
      <ellipse cx={188} cy={skyEnd + 44} rx={158} ry={36} fill={MS.mud} stroke={INK} strokeWidth={2.4} />
      <ellipse cx={188} cy={skyEnd + 38} rx={150} ry={30} fill={MS.bogTop} />
      <path d={`M60 ${skyEnd + 36} q8 -6 16 -2 M290 ${skyEnd + 30} q8 -6 16 -2`} stroke={MS.mossLight} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <OldWillow x={MAP_W / 2 - 30} y={chest.y - 16} />
      <Reeds x={44} y={skyEnd + 60} s={1.1} delay={-0.6} />
      <Reeds x={330} y={skyEnd + 64} s={1.05} delay={-2.1} flip />
      <Reeds x={372} y={skyEnd + 112} s={0.9} cattails={1} delay={-3.3} />

      {/* 5 floor texture, clearings keep every stone readable */}
      {patches}
      {pts.slice(1, stones + 1).map((p, i) => (
        <ellipse key={`c${i}`} cx={p.x} cy={p.y + 8} rx={50} ry={34} fill={MS.clearing} />
      ))}
      {cover}

      {/* 6 pools */}
      <Pool x={poolSmall.x} y={poolSmall.y} rx={54} ry={20} seed={3} />
      <Pool x={poolFrog.x} y={poolFrog.y} rx={74} ry={27} seed={8}>
        <Frog x={-8} y={4} s={1.05} />
      </Pool>
      <Pool x={poolHeron.x} y={poolHeron.y} rx={66} ry={24} seed={13} />

      {/* 7 plank walkway: same stroke widths as Burgdorf; seams = dashes across the plank band */}
      {banks}
      <path d={road} fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={MS.plank} strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={MS.plankSeam} strokeWidth={26} strokeDasharray="1.6 13" />
      {walked && <path d={walked} fill="none" stroke="#C9372C" strokeWidth={5} strokeLinecap="round" strokeDasharray="10 12" opacity={0.8} />}

      {/* rope rail onto the island */}
      <RopePost x={rp1.x - 26} y={rp1.y + 2} />
      <RopePost x={rp2.x - 26} y={rp2.y + 2} />
      <path d={rope(-26)} stroke={INK} strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <path d={rope(-26)} stroke={MS.rope} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <RopePost x={rp1.x + 26} y={rp1.y + 2} />
      <RopePost x={rp2.x + 26} y={rp2.y + 2} />
      <path d={rope(26)} stroke={INK} strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <path d={rope(26)} stroke={MS.rope} strokeWidth={1.6} fill="none" strokeLinecap="round" />

      {deco.map((d) => d.node)}

      {/* 8 start bank: stilt hut over the water, jetty, rowing boat, signpost */}
      <ellipse cx={322} cy={height - 34} rx={96} ry={30} fill="url(#ms-water)" stroke={INK} strokeWidth={2.4} />
      <path d={`M262 ${height - 22} q8 -4 16 0 M344 ${height - 14} q8 -4 16 0`} stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.5} />
      <Ripple x={300} y={height - 30} r={14} delay={-2.2} />
      <StiltHut x={334} y={height - 84} />
      <Jetty x={252} y={height - 54} w={48} />
      <Boat x={264} y={height - 26} />
      <Reeds x={392} y={height - 70} s={1} delay={-1.4} flip />
      <Willow x={44} y={height - 142} s={0.95} />
      <MossMound x={118} y={height - 142} s={0.85} />
      <Reeds x={124} y={height - 6} s={0.9} cattails={2} delay={-2.6} />
      <Alder x={30} y={height - 10} s={1.05} color={MS.alder[1]} />
      <Signpost x={pts[0].x - 74} y={pts[0].y - 6} />

      {lights}

      {/* 9 magic layer: dragonflies near the pools */}
      <Dragonfly x={poolSmall.x + 44} y={poolSmall.y - 44} delay={-0.4} rot={-14} color={MS.dragonfly[0]} />
      <Dragonfly x={poolFrog.x - 34} y={poolFrog.y - 52} delay={-2.1} rot={196} color={MS.dragonfly[1]} />
      <Dragonfly x={poolHeron.x + 118} y={poolHeron.y - 12} delay={-1.3} rot={8} s={0.9} color={MS.dragonfly[2]} />

      {/* 10 low fog banks in front (between stone rows) */}
      {[11, 8, 5, 2].map((i, k) => {
        const a = pts[Math.min(i, stones)]
        const b = pts[Math.min(i + 1, stones)]
        return <FogBank key={`fb${k}`} x={a.x > MAP_W / 2 ? 120 : MAP_W - 120} y={(a.y + b.y) / 2 + 6} s={0.9} opacity={0.5} delay={-k * 4.5} />
      })}
      <FogBank x={200} y={height - 150} s={1.3} opacity={0.36} delay={-14} />
    </svg>
  )
}
