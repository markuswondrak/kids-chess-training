/**
 * Geisterruine (Ghost Ruins · World 7): eigenständige Ruinenhof-Szene der Karte –
 * freundliche Dämmerungs-Ruinen im Mondlicht mit Mondsichel und Sternenhimmel links,
 * Drachenburg-Teaser (Welt 8) auf einem Felsen rechts, einer gotischen Geisterabtei mit
 * Rosettenfenster und Mondportal an der Truhe, zwei zerfallenen Kreuzgang-Torbögen direkt
 * über dem Kopfsteinpfad, einem versunkenen Schachbrett-Hof, einem mondbeschienenen
 * Spiegelgraben mit Bogenbrücke, einem leuchtenden Hofbrunnen, lächelnden kleinen Geistern
 * mit Laternen, verwitterten Schachfiguren-Statuen, Mondbäumen und schwebenden Irrlichtern.
 * Props wie `MapArt`. Zufall nur über `seeded()`.
 */
import type { ReactNode } from 'react'
import { MAP_W, chestSpot, pathD, pointOn, scatterSpots, seeded, type Pt } from '../game/mapPath'

const INK = '#2F2420'

/** Ghost Ruins palette – shared CSS values mirror tokens.css. */
export const GR = {
  skyTop: '#2B2454',
  skyMid: '#4C3E80',
  skyLow: '#836CB0',
  skyHorizon: '#C8B4DC',
  moon: '#FFF6D6',
  moonShade: '#E8D8A6',
  moonGlow: '255,244,196',
  turfTop: '#5E8077',
  turfMid: '#51726B',
  turfBottom: '#43605D',
  turfLight: '#73988C',
  turfDeep: '#36504D',
  clearing: 'rgba(220,212,240,.22)',
  trail: '#DED7EC',
  trailEdge: '#8A81A6',
  trailSeam: '#B2A9CC',
  stone: '#A59DC0',
  stoneLight: '#C7C0DE',
  stoneShade: '#81789E',
  stoneDeep: '#5E567A',
  roof: '#563F7C',
  roofLight: '#6F549B',
  roofDeep: '#3E2B5E',
  ivy: '#569478',
  ivyLight: '#74B594',
  ivyDeep: '#3B6E58',
  bark: '#5E4B66',
  barkDeep: '#42334A',
  canopy: '#496E72',
  canopyLight: '#628D8E',
  canopyDeep: '#345257',
  water: '#6AB8B8',
  waterLight: '#A8E8E2',
  waterDeep: '#43898E',
  lantern: '#FFE082',
  lanternDeep: '#F2A93B',
  lanternGlow: '255,222,125',
  wisp: '#B8FFF0',
  wispGlow: '150,248,226',
  ghost: '#FBF9FF',
  ghostShade: '#DFD8F2',
  cheek: '#FF9EAA',
  mist: '#E9E1F7',
  flag: '#C9372C',
  gold: '#F3B630',
  dragonRock: '#4E445A',
  dragonRockDeep: '#362E42',
  dragonWall: '#6E6178',
  dragonRoof: '#B53D32',
  dragonFire: '#FF9844',
  dragonGold: '#FFE07A',
}

/** Soft twilight ground shadow. */
const Shadow = ({ rx, ry = rx / 3.4 }: { rx: number; ry?: number }) => (
  <ellipse cx="0" cy="2" rx={rx} ry={ry} fill="rgba(26,20,44,.25)" />
)

// ---------------------------------------------------------------- primitives

/** Friendly smiling little cartoon ghost with rosy cheeks and optional tiny glowing lantern. */
function FriendlyGhost({
  x,
  y,
  s = 1,
  flip = false,
  lantern = true,
  delay = 0,
}: {
  x: number
  y: number
  s?: number
  flip?: boolean
  lantern?: boolean
  delay?: number
}) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="0" cy="4" rx="12" ry="3.5" fill="rgba(26,20,44,.2)" />
      <g className="gr-float" style={{ animationDelay: `${delay.toFixed(2)}s` }}>
        {lantern && <circle className="gr-glow" cx="15" cy="-12" r="14" fill="url(#gr-glow-warm)" />}
        {/* ghost cloak */}
        <path
          d="M-12 -14 C-12 -32 12 -32 12 -14 L13 -3 L8 -7 L4 -2 L0 -7 L-4 -2 L-8 -7 L-13 -3 Z"
          fill={GR.ghost}
          stroke={INK}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
        {/* gentle lavender shading along right side */}
        <path
          d="M3 -27 C9 -25 11 -19 11 -14 L12 -5 L8 -8 L5 -4 C7 -12 6 -21 3 -27 Z"
          fill={GR.ghostShade}
          opacity={0.75}
        />
        {/* tiny waving stubby arms */}
        <path d="M-11 -16 C-16 -18 -17 -12 -12 -11" fill={GR.ghost} stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <path d="M11 -15 C16 -16 17 -11 12 -10" fill={GR.ghost} stroke={INK} strokeWidth={2} strokeLinecap="round" />
        {/* happy eyes, rosy cheeks, little smile */}
        <circle cx="-4" cy="-19" r="2" fill={INK} />
        <circle cx="4" cy="-19" r="2" fill={INK} />
        <circle cx="-4.6" cy="-19.7" r="0.65" fill="#FFFFFF" />
        <circle cx="3.4" cy="-19.7" r="0.65" fill="#FFFFFF" />
        <circle cx="-7" cy="-15.5" r="2.1" fill={GR.cheek} opacity={0.85} />
        <circle cx="7" cy="-15.5" r="2.1" fill={GR.cheek} opacity={0.85} />
        <path d="M-3 -14.5 Q0 -11.5 3 -14.5" fill="none" stroke={INK} strokeWidth={1.7} strokeLinecap="round" />
        {/* tiny hanging golden lantern */}
        {lantern && (
          <g transform="translate(15 -12)">
            <path d="M0 -6 V-3" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
            <rect x="-4" y="-3" width="8" height="9" rx="2.5" fill={GR.lantern} stroke={INK} strokeWidth={1.8} />
            <path d="M-5 -3 H5 M-4 6 H4" stroke={INK} strokeWidth={1.9} strokeLinecap="round" />
            <circle cx="0" cy="1.5" r="2" fill="#FFFDF2" />
          </g>
        )}
      </g>
    </g>
  )
}

/** Gnarled twilight moon-tree with silvery-purple bark and lush teal-sage puffs. */
function MoonTree({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={22} />
      {/* curved trunk and roots */}
      <path
        d="M-7 2 C-5 -10 -7 -22 -2 -34 L-14 -45 L-11 -48 L0 -38 L12 -46 L15 -43 L4 -32 C3 -20 5 -10 7 2 Z"
        fill={GR.bark}
        stroke={INK}
        strokeWidth={2.3}
        strokeLinejoin="round"
      />
      <path d="M0 -32 L12 -44 L14 -42 L3 -30 C3 -18 4 -8 6 1 H1 Z" fill={GR.barkDeep} opacity={0.55} />
      {/* layered moon-lit canopy clouds */}
      <path
        d="M-26 -38 C-34 -38 -34 -52 -22 -54 C-18 -62 -5 -60 -1 -52 C5 -52 5 -38 -5 -38 Z"
        fill={GR.canopy}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path
        d="M3 -37 C-5 -37 -5 -51 5 -53 C9 -61 23 -61 27 -53 C36 -51 34 -37 24 -37 Z"
        fill={GR.canopy}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path
        d="M-19 -48 C-28 -48 -30 -64 -16 -66 C-12 -76 6 -77 13 -67 C24 -69 29 -54 17 -48 Z"
        fill={GR.canopyLight}
        stroke={INK}
        strokeWidth={2.3}
        strokeLinejoin="round"
      />
      <path d="M-13 -61 q11 -5 20 0" stroke="rgba(233,225,247,.55)" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {/* tiny hanging glowing spirit blossoms */}
      {[
        [-17, -45],
        [15, -45],
        [-2, -59],
      ].map(([bx, by], i) => (
        <circle key={i} cx={bx} cy={by} r={2.2} fill={GR.wisp} stroke={INK} strokeWidth={1.1} />
      ))}
    </g>
  )
}

/** Weathered Gothic ruin arch segment with mossy stone blocks and creeping ivy. */
function RuinArch({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={26} />
      {/* stepped plinth */}
      <rect x="-24" y="-5" width="48" height="7" rx="2" fill={GR.stoneShade} stroke={INK} strokeWidth={2} />
      {/* broken pointed arch masonry */}
      <path
        d="M-20 -5 V-34 C-20 -48 -4 -54 4 -50 L2 -40 C-3 -42 -10 -39 -10 -32 V-5 Z"
        fill={GR.stone}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path
        d="M8 -5 V-28 L14 -33 L20 -26 V-5 Z"
        fill={GR.stone}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      {/* stone block seams */}
      <path d="M-20 -20 H-10 M-20 -32 H-10 M8 -16 H20" stroke={GR.stoneDeep} strokeWidth={1.5} />
      {/* creeping emerald ivy leaves */}
      <path
        d="M-19 -36 C-14 -34 -12 -28 -16 -24 C-11 -22 -11 -15 -16 -12"
        fill="none"
        stroke={GR.ivy}
        strokeWidth={3.2}
        strokeLinecap="round"
      />
      <circle cx="-13" cy="-31" r="2.8" fill={GR.ivyLight} stroke={INK} strokeWidth={1.2} />
      <circle cx="-17" cy="-21" r="2.6" fill={GR.ivyLight} stroke={INK} strokeWidth={1.2} />
      {/* small warm candle perched on the broken right pillar */}
      <rect x="12" y="-38" width="4.5" height="7" rx="1" fill="#FFF4D6" stroke={INK} strokeWidth={1.4} />
      <path className="gr-glow" d="M14.2 -44 Q17 -40 14.2 -38 Q11.5 -40 14.2 -44 Z" fill={GR.lantern} stroke={INK} strokeWidth={1.1} />
    </g>
  )
}

/** Weathered mossy chess-knight or rook garden statue – playful chess motif in the ruins. */
function ChessStatue({
  x,
  y,
  s = 1,
  kind = 'knight',
  flip = false,
}: {
  x: number
  y: number
  s?: number
  kind?: 'knight' | 'rook'
  flip?: boolean
}) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={18} />
      {/* mossy pedestal */}
      <rect x="-15" y="-11" width="30" height="12" rx="2" fill={GR.stoneShade} stroke={INK} strokeWidth={2.1} />
      <rect x="-17" y="-15" width="34" height="5" rx="1.5" fill={GR.stoneLight} stroke={INK} strokeWidth={1.9} />
      {kind === 'knight' ? (
        <g>
          <path
            d="M-9 -15 C-9 -25 -5 -33 -1 -41 L-8 -36 C-12 -33 -13 -37 -10 -41 L-1 -50 L2 -54 L5 -49 C12 -45 14 -33 10 -15 Z"
            fill={GR.stone}
            stroke={INK}
            strokeWidth={2.1}
            strokeLinejoin="round"
          />
          <circle cx="-2" cy="-42" r="1.4" fill={INK} />
          <path d="M5 -45 C9 -38 9 -28 6 -18" stroke={GR.stoneDeep} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <path
            d="M-10 -15 L-8 -38 H-12 V-47 H-6 V-42 H-2 V-47 H2 V-42 H6 V-47 H12 V-38 H8 L10 -15 Z"
            fill={GR.stone}
            stroke={INK}
            strokeWidth={2.1}
            strokeLinejoin="round"
          />
          <path d="M-7 -27 H7" stroke={GR.stoneDeep} strokeWidth={1.5} />
        </g>
      )}
      {/* moss cap draping over pedestal corner */}
      <path d="M-16 -14 C-12 -18 -6 -16 -3 -12 C-8 -10 -13 -10 -16 -14 Z" fill={GR.ivyLight} stroke={INK} strokeWidth={1.4} />
    </g>
  )
}

/** Wrought-iron lantern post casting a cozy golden pool of light in the twilight ruins. */
function RuinLantern({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={11} />
      <circle className="gr-glow" cx="11" cy="-36" r="22" fill="url(#gr-glow-warm)" />
      {/* stone base + curled iron post */}
      <rect x="-6" y="-6" width="12" height="8" rx="2" fill={GR.stoneDeep} stroke={INK} strokeWidth={1.9} />
      <path d="M0 -6 V-46 C0 -52 11 -52 11 -45 V-42" fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />
      {/* hanging lantern cage */}
      <g className="gr-lantern">
        <path d="M6 -42 H16 L14 -30 H8 Z" fill={GR.lantern} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <path d="M5 -42 L11 -47 L17 -42 Z" fill={GR.stoneDeep} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
        <circle cx="11" cy="-36" r="2.6" fill="#FFFDF2" />
      </g>
    </g>
  )
}

/** Glowing mint-and-amber twilight mushrooms in a little moss cluster. */
function GlowMushrooms({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})`}>
      <circle className="gr-glow" cx="0" cy="-9" r="18" fill="url(#gr-glow-wisp)" />
      <Shadow rx={14} />
      {[
        { dx: -7, h: 9, r: 8 },
        { dx: 6, h: 12, r: 9.5 },
        { dx: 0, h: 6, r: 5.5 },
      ].map((m, i) => (
        <g key={i} transform={`translate(${m.dx} 0)`}>
          <path d={`M-2.2 0 Q-1.5 ${-m.h} -1.8 ${-m.h} H1.8 Q1.5 ${-m.h} 2.2 0 Z`} fill="#EFE8FA" stroke={INK} strokeWidth={1.7} />
          <path
            d={`M${-m.r} ${-m.h + 1} Q${-m.r} ${-m.h - m.r * 0.9} 0 ${-m.h - m.r * 0.9} Q${m.r} ${-m.h - m.r * 0.9} ${m.r} ${-m.h + 1} Z`}
            fill={i === 1 ? '#7DE6D0' : '#9B7ED9'}
            stroke={INK}
            strokeWidth={1.9}
          />
          <circle cx={-m.r * 0.35} cy={-m.h - m.r * 0.38} r="1.4" fill="#FFFDF6" />
          <circle cx={m.r * 0.32} cy={-m.h - m.r * 0.45} r="1.1" fill="#FFFDF6" />
        </g>
      ))}
    </g>
  )
}

/** Cute wide-eyed lavender ruin owl perched on a mossy broken pillar (blinks gently). */
function RuinsOwl({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={15} />
      {/* mossy stump column */}
      <rect x="-11" y="-22" width="22" height="24" rx="2" fill={GR.stone} stroke={INK} strokeWidth={2.1} />
      <rect x="-13" y="-25" width="26" height="5" rx="2" fill={GR.stoneLight} stroke={INK} strokeWidth={1.9} />
      {/* plump round owl body */}
      <ellipse cx="0" cy="-37" rx="11" ry="13" fill="#7C63A3" stroke={INK} strokeWidth={2.1} />
      <ellipse cx="0" cy="-34" rx="7" ry="8" fill="#E9DFF7" />
      {/* ear tufts */}
      <path d="M-9 -46 L-12 -53 L-4 -49 Z M9 -46 L12 -53 L4 -49 Z" fill="#7C63A3" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      {/* big golden eyes + blinking lids */}
      <circle cx="-4.2" cy="-40" r="3.6" fill={GR.lantern} stroke={INK} strokeWidth={1.5} />
      <circle cx="4.2" cy="-40" r="3.6" fill={GR.lantern} stroke={INK} strokeWidth={1.5} />
      <circle cx="-4" cy="-40" r="1.7" fill={INK} />
      <circle cx="4" cy="-40" r="1.7" fill={INK} />
      <g className="gr-blink">
        <rect x="-8" y="-44" width="7.6" height="7.6" rx="3.5" fill="#7C63A3" />
        <rect x="0.4" y="-44" width="7.6" height="7.6" rx="3.5" fill="#7C63A3" />
      </g>
      {/* tiny beak & feet */}
      <path d="M-2 -36 L0 -33 L2 -36 Z" fill={GR.gold} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M-5 -25 H-2 M2 -25 H5" stroke={GR.gold} strokeWidth={2.2} strokeLinecap="round" />
    </g>
  )
}

/** Floating mint-blue will-o'-wisp orb drifting lazily through the ruins. */
function WillOWisp({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})`}>
      <g className="gr-wisp" style={{ animationDelay: `${delay.toFixed(2)}s` }}>
        <circle r="13" fill="url(#gr-glow-wisp)" />
        <path d="M0 -8 Q5 -2 3 3 A3.6 3.6 0 1 1 -3 3 Q-5 -2 0 -8 Z" fill={GR.wisp} stroke={INK} strokeWidth={1.2} />
        <circle cx="0" cy="1" r="1.8" fill="#FFFFFF" />
      </g>
    </g>
  )
}

/** Twinkling four-point star in the twilight sky. */
function TwinkleStar({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})`}>
      <path
        className="gr-twinkle"
        style={{ animationDelay: `${delay.toFixed(2)}s` }}
        d="M0 -7 L1.8 -1.8 L7 0 L1.8 1.8 L0 7 L-1.8 1.8 L-7 0 L-1.8 -1.8 Z"
        fill="#FFF7D6"
      />
    </g>
  )
}

// ---------------------------------------------------------------- multi-stone features

/**
 * Ruined Gothic Cloister Archway straddling directly OVER the trail (stones pass underneath!).
 * Built from two mossy stone buttresses flanking the path and a cracked arch with a hanging lantern.
 */
function TrailArchway({
  x,
  y,
  angle = 0,
  lantern = true,
}: {
  x: number
  y: number
  angle?: number
  lantern?: boolean
}) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)})`}>
      {/* left & right stone pillars straddling the trail */}
      <rect x="-32" y="-26" width="12" height="36" rx="2" fill={GR.stone} stroke={INK} strokeWidth={2.2} />
      <rect x="20" y="-26" width="12" height="36" rx="2" fill={GR.stone} stroke={INK} strokeWidth={2.2} />
      <rect x="-26" y="-26" width="6" height="36" fill={GR.stoneShade} opacity={0.55} />
      <rect x="26" y="-26" width="6" height="36" fill={GR.stoneShade} opacity={0.55} />
      {/* pointed Gothic lintel arch bridging over the path */}
      <path
        d="M-34 -24 C-34 -46 0 -54 0 -54 C0 -54 34 -46 34 -24 H20 C20 -36 0 -42 0 -42 C0 -42 -20 -36 -20 -24 Z"
        fill={GR.stoneLight}
        stroke={INK}
        strokeWidth={2.3}
        strokeLinejoin="round"
      />
      {/* keystone + stone crack + draped ivy */}
      <path d="M-4 -53 L0 -42 L4 -53 Z" fill={GR.stoneShade} stroke={INK} strokeWidth={1.6} />
      <path d="M-24 -40 C-16 -38 -14 -31 -20 -26 M20 -34 C26 -32 28 -24 23 -18" fill="none" stroke={GR.ivy} strokeWidth={3.2} strokeLinecap="round" />
      <circle cx="-18" cy="-34" r="2.8" fill={GR.ivyLight} stroke={INK} strokeWidth={1.2} />
      <circle cx="24" cy="-28" r="2.6" fill={GR.ivyLight} stroke={INK} strokeWidth={1.2} />
      {/* warm glowing lantern hanging from the center of the arch */}
      {lantern && (
        <g transform="translate(0 -34)">
          <circle className="gr-glow" cx="0" cy="8" r="16" fill="url(#gr-glow-warm)" />
          <path d="M0 -8 V2" stroke={INK} strokeWidth={1.8} />
          <path d="M-4 2 H4 L3.2 10 H-3.2 Z" fill={GR.lantern} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          <circle cx="0" cy="6" r="1.8" fill="#FFFDF2" />
        </g>
      )}
    </g>
  )
}

/** Stone arch footbridge where the trail crosses the moonlit reflecting moat. */
function StoneFootbridge({ pts, seg, t0, t1 }: { pts: Pt[]; seg: number; t0: number; t1: number }) {
  const n = 10
  const line = Array.from({ length: n + 1 }, (_, k) => pointOn(pts, seg, t0 + ((t1 - t0) * k) / n))
  const normal = (k: number) => {
    const a = line[Math.max(0, k - 1)]
    const b = line[Math.min(n, k + 1)]
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
    return { x: -(b.y - a.y) / len, y: (b.x - a.x) / len }
  }
  const deck = line.map((p, k) => `${k ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const rail = (o: number) =>
    line
      .map((p, k) => {
        const nn = normal(k)
        return `${k ? 'L' : 'M'}${(p.x + nn.x * o).toFixed(1)} ${(p.y + nn.y * o).toFixed(1)}`
      })
      .join(' ')
  const posts = [0, n].flatMap((k) => [-19, 19].map((o) => ({ x: line[k].x + normal(k).x * o, y: line[k].y + normal(k).y * o })))
  return (
    <g>
      <path d={deck} fill="none" stroke={INK} strokeWidth={34} strokeLinecap="butt" />
      <path d={deck} fill="none" stroke={GR.stoneShade} strokeWidth={28} strokeLinecap="butt" />
      <path d={deck} fill="none" stroke={GR.stoneLight} strokeWidth={20} strokeDasharray="7 5" />
      {[-18, 18].map((o) => (
        <g key={o}>
          <path d={rail(o)} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <path d={rail(o)} fill="none" stroke={GR.stone} strokeWidth={3} strokeLinecap="round" />
        </g>
      ))}
      {posts.map((p, i) => (
        <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
          <rect x="-4" y="-12" width="8" height="14" rx="2" fill={GR.stoneLight} stroke={INK} strokeWidth={1.7} />
          <circle cx="0" cy="-12" r="3" fill={GR.lantern} stroke={INK} strokeWidth={1.2} />
        </g>
      ))}
    </g>
  )
}

/**
 * Weathered Chessboard Courtyard Plaza: tilted stone tiles with subtle light/dark checkered
 * pattern overgrown with moss and framed by low crumbling cloister walls.
 */
function ChessCourtyard({ x, y }: { x: number; y: number }) {
  const tiles: ReactNode[] = []
  const size = 20
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 6; c++) {
      // leave a few outer corners broken/missing so it reads as an ancient ruin
      if ((r === 0 && c === 0) || (r === 4 && c === 5) || (r === 0 && c === 5)) continue
      const light = (r + c) % 2 === 0
      tiles.push(
        <rect
          key={`${r}-${c}`}
          x={-60 + c * size}
          y={-50 + r * size}
          width={size - 1.5}
          height={size - 1.5}
          rx="2"
          fill={light ? 'rgba(218,210,236,.42)' : 'rgba(92,84,122,.34)'}
          stroke="rgba(47,36,32,.24)"
          strokeWidth={1.2}
        />,
      )
    }
  }
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <ellipse cx="0" cy="4" rx="84" ry="62" fill="rgba(165,157,192,.18)" />
      {tiles}
      {/* low broken courtyard wall along the left edge */}
      <path
        d="M-66 -46 H-28 V-32 H-44 V26 H-26 V42 H-66 Z"
        fill={GR.stone}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path d="M-66 -16 H-44 M-66 10 H-44" stroke={GR.stoneDeep} strokeWidth={1.6} />
      <path d="M-60 -42 C-50 -46 -42 -42 -36 -38" stroke={GR.ivyLight} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  )
}

/**
 * Misty Courtyard Fountain: circular mossy stone basin with glowing moonlit teal water,
 * gentle ripples, and a playful smiling ghost peeking from behind the rim.
 */
function CourtyardFountain({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <Shadow rx={52} ry={22} />
      {/* outer carved stone rim */}
      <ellipse cx="0" cy="2" rx="48" ry="22" fill={GR.stoneShade} stroke={INK} strokeWidth={2.4} />
      <ellipse cx="0" cy="-2" rx="46" ry="20" fill={GR.stoneLight} stroke={INK} strokeWidth={2.2} />
      {/* glowing moonlit water */}
      <ellipse cx="0" cy="-2" rx="37" ry="15" fill="url(#gr-water)" stroke={INK} strokeWidth={1.8} />
      <ellipse className="gr-ripple" cx="0" cy="-2" rx="22" ry="8" fill="none" stroke={GR.wisp} strokeWidth={1.8} opacity={0.8} />
      {/* central tiered mossy pedestal */}
      <rect x="-7" y="-22" width="14" height="20" rx="3" fill={GR.stone} stroke={INK} strokeWidth={2} />
      <ellipse cx="0" cy="-22" rx="14" ry="5" fill={GR.stoneLight} stroke={INK} strokeWidth={1.9} />
      {/* sparkling water arcs */}
      <path
        className="gr-glow"
        d="M-4 -23 C-14 -30 -18 -16 -20 -6 M4 -23 C14 -30 18 -16 20 -6"
        fill="none"
        stroke={GR.waterLight}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      {/* friendly ghost popping out happily on the rim */}
      <FriendlyGhost x={20} y={-22} s={0.74} flip lantern={false} delay={-1.6} />
      {/* moss patches on rim */}
      <path d="M-38 4 C-32 10 -22 10 -16 6" stroke={GR.ivyLight} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  )
}

/**
 * Low crumbling stone abbey curtain wall spanning horizontally in the background
 * with Gothic arched openings and draping ivy.
 */
function RuinCurtainWall({ x, y, width = 128, flip = false }: { x: number; y: number; width?: number; flip?: boolean }) {
  const hw = width / 2
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${flip ? -1 : 1} 1)`}>
      <ellipse cx="0" cy="4" rx={hw + 6} ry="8" fill="rgba(26,20,44,.22)" />
      {/* jagged ruined stone wall body */}
      <path
        d={`M${-hw} 2 V-34 L${-hw + 22} -40 L${-hw + 36} -28 L${-hw + 56} -36 L0 -26 L${hw - 40} -38 L${hw - 16} -24 L${hw} -30 V2 Z`}
        fill={GR.stone}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      {/* shadowed lower courses */}
      <path d={`M${-hw + 2} -12 H${hw - 2} V1 H${-hw + 2} Z`} fill={GR.stoneShade} opacity={0.45} />
      {/* two small Gothic arch openings */}
      {[-hw * 0.45, hw * 0.35].map((ax, i) => (
        <path
          key={i}
          d={`M${ax - 8} -4 V-18 A8 9 0 0 1 ${ax + 8} -18 V-4 Z`}
          fill={GR.turfDeep}
          stroke={INK}
          strokeWidth={1.8}
        />
      ))}
      {/* draping ivy */}
      <path
        d={`M${-hw + 14} -35 C${-hw + 18} -24 ${-hw + 10} -18 ${-hw + 16} -10 M${hw - 36} -34 C${hw - 30} -24 ${hw - 38} -16 ${hw - 32} -8`}
        fill="none"
        stroke={GR.ivy}
        strokeWidth={3.2}
        strokeLinecap="round"
      />
    </g>
  )
}

// ---------------------------------------------------------------- hero landmarks

/**
 * Grand Haunted Abbey (`GhostAbbey`) at the summit behind the treasure chest:
 * Storybook ruined Gothic abbey with a glowing stained-glass rose window, luminous moonlight
 * portal arch (`.gr-abbey-glow` brightens when chest is ready/open), asymmetric broken belfry
 * tower on the left with a waving friendly ghost, tall plum-roofed spire on the right, and
 * soft lavender mist along the foundation.
 */
function GhostAbbey({ x, y }: { x: number; y: number }) {
  const s = { fill: GR.stone, stroke: INK, strokeWidth: 2.4, strokeLinejoin: 'round' as const }
  const r = { fill: GR.roof, stroke: INK, strokeWidth: 2.5, strokeLinejoin: 'round' as const }
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="8" rx="158" ry="18" fill="rgba(26,20,44,.26)" />

      {/* soft lavender mist banks behind the abbey base */}
      <path
        className="gr-mist"
        d="M-162 10 C-178 10 -178 -8 -160 -10 C-152 -24 -128 -22 -120 -10 C-110 -16 -96 -10 -94 2 V12 Z"
        fill={GR.mist}
        opacity={0.78}
      />
      <path
        className="gr-mist"
        style={{ animationDelay: '-2.6s' }}
        d="M94 12 V2 C96 -10 112 -16 122 -10 C130 -24 154 -24 160 -10 C178 -8 178 10 162 10 Z"
        fill={GR.mist}
        opacity={0.78}
      />

      {/* left tall intact Gothic spire turret (frames the crescent moon on top-left) */}
      <rect x="-134" y="-110" width="46" height="116" rx="2" {...s} />
      <rect x="-108" y="-110" width="20" height="116" fill={GR.stoneShade} opacity={0.5} />
      {/* crooked cartoon spire roof */}
      <path d="M-142 -108 L-111 -162 L-80 -108 Z" {...r} />
      <path d="M-111 -162 L-80 -108 H-108 Z" fill={GR.roofDeep} opacity={0.5} />
      {/* flagpole + waving golden pennant */}
      <path d="M-111 -162 V-180" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      <path className="map-flag" d="M-111 -180 L-88 -173 L-111 -167 Z" fill={GR.gold} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      {/* warm glowing lancet window in left tower */}
      <path d="M-118 -68 V-88 A7 9 0 0 1 -104 -88 V-68 Z" fill={GR.lantern} stroke={INK} strokeWidth={2} />
      <path d="M-111 -96 V-68 M-118 -78 H-104" stroke={INK} strokeWidth={1.3} />

      {/* right crumbling belfry tower (lower silhouette, leaving open sky below World 8 teaser) */}
      <path d="M90 6 V-104 L106 -112 L120 -100 L136 -110 V6 Z" {...s} />
      <path d="M114 -102 L136 -110 V6 H114 Z" fill={GR.stoneShade} opacity={0.5} />
      {/* belfry arch with tiny golden bell */}
      <path d="M102 -62 V-84 A11 12 0 0 1 124 -84 V-62 Z" fill={GR.roofDeep} stroke={INK} strokeWidth={2.2} />
      <path d="M108 -70 C108 -79 118 -79 118 -70 L120 -66 H106 Z" fill={GR.gold} stroke={INK} strokeWidth={1.6} />
      {/* creeping ivy down right tower */}
      <path d="M134 -98 C128 -86 136 -74 128 -60 C134 -48 126 -38 132 -26" fill="none" stroke={GR.ivy} strokeWidth={3.6} strokeLinecap="round" />
      <circle cx="130" cy="-80" r="3.4" fill={GR.ivyLight} stroke={INK} strokeWidth={1.2} />
      <circle cx="129" cy="-50" r="3" fill={GR.ivyLight} stroke={INK} strokeWidth={1.2} />
      {/* cheerful ghost floating by the broken belfry */}
      <FriendlyGhost x={114} y={-112} s={0.74} flip lantern={false} delay={-0.8} />

      {/* central Gothic abbey nave + jagged gable roof */}
      <rect x="-92" y="-76" width="184" height="82" {...s} />
      <path d="M-98 -74 L-58 -122 L-26 -110 L0 -142 L28 -112 L58 -120 L98 -74 Z" {...r} />
      {/* stone gable front triangle */}
      <path d="M-54 -76 L0 -132 L54 -76 Z" fill={GR.stoneLight} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      {/* main flag on central gable */}
      <path d="M0 -142 V-168" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <path className="map-flag" d="M0 -168 L28 -160 L0 -152 Z" fill={GR.flag} stroke={INK} strokeWidth={2} strokeLinejoin="round" />

      {/* glowing stained-glass Gothic rose window */}
      <circle className="gr-glow" cx="0" cy="-95" r="24" fill="url(#gr-glow-warm)" />
      <circle cx="0" cy="-95" r="15" fill={GR.lantern} stroke={INK} strokeWidth={2.3} />
      <circle cx="0" cy="-95" r="9" fill="#FFF7D6" stroke={INK} strokeWidth={1.5} />
      <path d="M0 -110 V-80 M-15 -95 H15 M-10.5 -105.5 L10.5 -84.5 M10.5 -105.5 L-10.5 -84.5" stroke={INK} strokeWidth={1.3} />
      <circle cx="0" cy="-95" r="3.5" fill={GR.wisp} stroke={INK} strokeWidth={1.2} />

      {/* flanking warm lancet windows */}
      {[-66, 66].map((wx) => (
        <g key={wx}>
          <path d={`M${wx - 7} -34 V-56 A7 9 0 0 1 ${wx + 7} -56 V-34 Z`} fill={GR.lantern} stroke={INK} strokeWidth={2} />
          <path d={`M${wx} -64 V-34 M${wx - 7} -45 H${wx + 7}`} stroke={INK} strokeWidth={1.3} />
        </g>
      ))}

      {/* central pointed moonlight portal arch (`.gr-abbey-glow` brightens when chest is ready/open) */}
      <circle className="gr-abbey-glow" cx="0" cy="-22" r="50" fill="url(#gr-glow-portal)" />
      <path d="M-32 6 V-32 C-32 -54 0 -64 0 -64 C0 -64 32 -54 32 -32 V6 Z" fill={GR.roofDeep} stroke={INK} strokeWidth={2.6} />
      <path className="gr-abbey-glow" d="M-24 6 V-30 C-24 -48 0 -55 0 -55 C0 -55 24 -48 24 -30 V6 Z" fill="url(#gr-glow-portal)" />
      {/* wrought-iron open gate bars */}
      <path d="M-26 6 V-32 M-18 6 V-44 M18 6 V-44 M26 6 V-32" stroke={INK} strokeWidth={1.8} opacity={0.55} />
      {/* stone portal threshold */}
      <rect x="-42" y="2" width="84" height="7" rx="2.5" fill={GR.stoneLight} stroke={INK} strokeWidth={2} />
    </g>
  )
}

/**
 * Start Area Ruin Gatehouse (`RuinGatehouse`): wrought-iron gate pillar & mossy caretaker's
 * lantern cottage tucked on the bottom right of the entrance.
 */
function RuinGatehouse({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow rx={42} />
      {/* mossy stone gatehouse walls */}
      <rect x="-30" y="-44" width="60" height="46" rx="3" fill={GR.stone} stroke={INK} strokeWidth={2.4} />
      <rect x="6" y="-44" width="24" height="46" fill={GR.stoneShade} opacity={0.5} />
      {/* steep plum slate roof */}
      <path d="M-36 -42 L0 -76 L36 -42 Z" fill={GR.roof} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M0 -76 L36 -42 H6 Z" fill={GR.roofDeep} opacity={0.48} />
      {/* crooked chimney with soft twilight mist puff */}
      <rect x="14" y="-76" width="9" height="22" rx="1.5" fill={GR.stoneShade} stroke={INK} strokeWidth={2} />
      <circle className="gr-mist" cx="19" cy="-84" r="5" fill={GR.mist} opacity={0.75} />
      <circle className="gr-mist" style={{ animationDelay: '-1.5s' }} cx="24" cy="-94" r="7" fill={GR.mist} opacity={0.6} />
      {/* arched wooden door + glowing round window */}
      <path d="M-10 2 V-18 A10 10 0 0 1 10 -18 V2 Z" fill={GR.barkDeep} stroke={INK} strokeWidth={2.2} />
      <circle cx="5" cy="-7" r="1.6" fill={GR.gold} />
      <circle className="gr-glow" cx="-18" cy="-26" r="13" fill="url(#gr-glow-warm)" />
      <circle cx="-18" cy="-26" r="6" fill={GR.lantern} stroke={INK} strokeWidth={1.8} />
      <path d="M-18 -32 V-20 M-24 -26 H-12" stroke={INK} strokeWidth={1.2} />
      {/* ivy vine along roof eave */}
      <path d="M-28 -40 C-22 -34 -26 -26 -22 -20" fill="none" stroke={GR.ivyLight} strokeWidth={3} strokeLinecap="round" />
    </g>
  )
}

/**
 * Drachenburg teaser (World 8 · Dragon Castle):
 * Distant dramatic volcanic-slate crag with a crimson-roofed dragon fortress, warm amber
 * windows, and a friendly tiny winged dragon flying over the spires with a puff of gold flame.
 * Positioned at top-right (`x = 298, y = 122`) right below the `WORLD 8` signpost.
 */
function DragonCastleTeaser({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* soft warm dragon-glow behind the distant spires */}
      <circle className="gr-glow" cx="0" cy="-26" r="54" fill="url(#gr-glow-dragon)" />
      {/* craggy slate mountain peak */}
      <path
        d="M-58 20 L-36 -10 L-22 -4 L0 -26 L24 -8 L40 -14 L60 20 Z"
        fill={GR.dragonRock}
        stroke="rgba(47,36,32,.65)"
        strokeWidth={2.1}
        strokeLinejoin="round"
      />
      <path d="M0 -26 L24 -8 L40 -14 L60 20 H4 Z" fill={GR.dragonRockDeep} opacity={0.62} />
      {/* dragon castle silhouette: twin corner towers + central keep */}
      <rect x="-26" y="-44" width="14" height="36" fill={GR.dragonWall} stroke="rgba(47,36,32,.7)" strokeWidth={1.9} />
      <path d="M-30 -44 L-19 -60 L-8 -44 Z" fill={GR.dragonRoof} stroke="rgba(47,36,32,.7)" strokeWidth={1.9} strokeLinejoin="round" />
      <rect x="12" y="-44" width="14" height="36" fill={GR.dragonWall} stroke="rgba(47,36,32,.7)" strokeWidth={1.9} />
      <path d="M8 -44 L19 -60 L30 -44 Z" fill={GR.dragonRoof} stroke="rgba(47,36,32,.7)" strokeWidth={1.9} strokeLinejoin="round" />
      <rect x="-14" y="-52" width="28" height="44" fill={GR.dragonWall} stroke="rgba(47,36,32,.7)" strokeWidth={2} />
      <path d="M-19 -52 L0 -74 L19 -52 Z" fill={GR.dragonRoof} stroke="rgba(47,36,32,.7)" strokeWidth={2} strokeLinejoin="round" />
      {/* glowing amber windows */}
      <rect x="-4" y="-42" width="8" height="11" rx="4" fill={GR.dragonGold} stroke="rgba(47,36,32,.6)" strokeWidth={1.3} />
      <circle cx="-19" cy="-32" r="2.6" fill={GR.dragonGold} />
      <circle cx="19" cy="-32" r="2.6" fill={GR.dragonGold} />
      {/* tiny soaring dragon silhouette + playful puff of flame */}
      <g className="gr-float" transform="translate(-32 -62)">
        <path
          d="M-8 2 C-4 -6 2 -4 6 -2 C9 -4 12 -3 14 -1 C10 1 8 3 4 3 C1 6 -3 4 -8 2 Z"
          fill={GR.dragonRoof}
          stroke="rgba(47,36,32,.7)"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
        <path d="M-2 -2 L-10 -10 L2 -6 Z" fill={GR.dragonRoof} stroke="rgba(47,36,32,.7)" strokeWidth={1.3} strokeLinejoin="round" />
        <path d="M15 -1 Q22 -5 25 0 Q20 4 15 -1 Z" fill={GR.dragonFire} />
        <circle cx="18" cy="-1" r="2" fill={GR.dragonGold} />
      </g>
      {/* soft lavender twilight mist tucking the base */}
      <path
        d="M-64 22 C-72 22 -72 10 -60 10 C-52 2 -32 4 -24 12 C-12 4 12 4 22 12 C34 4 54 4 62 12 C72 12 72 22 62 22 Z"
        fill={GR.mist}
        opacity={0.78}
      />
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

  // Multi-stone landmarks placed in natural bays of the ruin courtyard path:
  // 1) Moonlit reflecting moat crossing under the trail between stone 1 & 2, pooling on the right bay.
  const moatBridgePt = pointOn(pts, 1, 0.52)
  const moatPool = { x: 312, y: S(2).y - 12 }
  // 2) Sunken chessboard courtyard plaza on the left bay beside stones 5–6.
  const courtyard = { x: 112, y: (S(5).y + S(6).y) / 2 }
  // 3) Glowing courtyard fountain on the right bay beside stones 8–9.
  const fountain = { x: 304, y: (S(8).y + S(9).y) / 2 }
  // 4) Two ruined Gothic cloister archways straddling directly over the trail (between 4–5 and 9–10).
  const archSpecs = [4, 9]
    .filter((seg) => seg < stones)
    .map((seg) => {
      const a = pointOn(pts, seg, 0.24)
      const b = pointOn(pts, seg, 0.42)
      const mid = pointOn(pts, seg, 0.33)
      // Angle perpendicular to the trail so the arch bridges across it cleanly between stones
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90
      return { seg, x: mid.x, y: mid.y + 8, angle: Math.max(-18, Math.min(18, angle)) }
    })

  // Low background curtain walls framing two open flanks.
  const curtainWalls = [
    { x: 316, y: S(4).y - 26, width: 120, flip: false },
    { x: 96, y: S(11).y + 24, width: 122, flip: true },
  ]

  // Keep scattered decor clear of multi-stone features, archways, start, and summit.
  const blocked = (p: Pt) => {
    if (p.y < skyEnd + 100 || p.y > height - 165) return true
    if (Math.hypot(p.x - moatPool.x, (p.y - moatPool.y) * 1.1) < 92) return true
    if (Math.hypot(p.x - moatBridgePt.x, p.y - moatBridgePt.y) < 70) return true
    if (p.x < moatBridgePt.x + 28 && Math.abs(p.y - (moatBridgePt.y + 42)) < 54) return true
    if (Math.hypot(p.x - courtyard.x, (p.y - courtyard.y) * 1.05) < 104) return true
    if (Math.hypot(p.x - fountain.x, (p.y - fountain.y) * 1.1) < 84) return true
    if (archSpecs.some((a) => Math.hypot(p.x - a.x, p.y - a.y) < 70)) return true
    if (curtainWalls.some((w) => Math.abs(p.x - w.x) < w.width * 0.65 && Math.abs(p.y - w.y) < 60)) return true
    return false
  }

  const spots = scatterSpots({ pts, stones, rand, perSide: 1, clear: 56, gap: 72, spread: 84, blocked })
  const deco: { y: number; node: ReactNode }[] = spots.map((p, k) => {
    const r = rand()
    const node =
      r < 0.24 ? (
        <MoonTree key={`mt${k}`} x={p.x} y={p.y} s={0.84 + rand() * 0.16} flip={p.side < 0} />
      ) : r < 0.42 ? (
        <RuinArch key={`ra${k}`} x={p.x} y={p.y} s={0.84 + rand() * 0.12} flip={p.side < 0} />
      ) : r < 0.56 ? (
        <RuinLantern key={`rl${k}`} x={p.x} y={p.y} s={0.88} flip={p.side < 0} />
      ) : r < 0.7 ? (
        <ChessStatue key={`cs${k}`} x={p.x} y={p.y} s={0.86} kind={k % 2 ? 'knight' : 'rook'} flip={p.side < 0} />
      ) : r < 0.82 ? (
        <FriendlyGhost key={`fg${k}`} x={p.x} y={p.y} s={0.86} flip={p.side < 0} lantern={k % 2 === 0} delay={-rand() * 4} />
      ) : r < 0.92 ? (
        <GlowMushrooms key={`gm${k}`} x={p.x} y={p.y} s={0.9} />
      ) : (
        <RuinsOwl key={`ro${k}`} x={p.x} y={p.y} s={0.86} flip={p.side < 0} />
      )
    return { y: p.y, node }
  })
  // Add a playful pair of chess-statue + ghost inside the chessboard courtyard!
  deco.push({ y: courtyard.y - 14, node: <ChessStatue key="cc-k" x={courtyard.x - 16} y={courtyard.y - 14} s={0.94} kind="knight" /> })
  deco.push({ y: courtyard.y + 18, node: <FriendlyGhost key="cc-g" x={courtyard.x + 24} y={courtyard.y + 18} s={0.9} flip delay={-1.1} /> })
  deco.sort((a, b) => a.y - b.y)

  // Scattered ground tufts, scattered pebbles, and cracked ruin flagstones.
  const groundCover: ReactNode[] = []
  for (let i = 0; i < stones * 6; i++) {
    const x = 14 + rand() * (MAP_W - 28)
    const y = skyEnd + 70 + rand() * (height - skyEnd - 110)
    if (pts.some((q) => Math.hypot(q.x - x, q.y - y) < 38)) continue
    if (Math.hypot(x - moatPool.x, (y - moatPool.y) * 1.2) < 62) continue
    if (Math.hypot(x - fountain.x, (y - fountain.y) * 1.2) < 52) continue
    const pick = rand()
    if (pick < 0.45) {
      groundCover.push(
        <path
          key={`gt${i}`}
          d={`M${(x - 5).toFixed(1)} ${y.toFixed(1)} q2 -7 3 -9 M${x.toFixed(1)} ${y.toFixed(1)} q0 -8 1 -10 M${(x + 5).toFixed(1)} ${y.toFixed(1)} q-2 -7 -3 -9`}
          stroke={GR.turfDeep}
          strokeWidth={1.9}
          fill="none"
          strokeLinecap="round"
        />,
      )
    } else if (pick < 0.78) {
      groundCover.push(
        <rect
          key={`gs${i}`}
          x={x - 7}
          y={y - 4}
          width={14}
          height={8}
          rx={2.5}
          fill="rgba(165,157,192,.36)"
          stroke="rgba(47,36,32,.22)"
          strokeWidth={1.1}
        />,
      )
    } else {
      groundCover.push(<circle key={`gf${i}`} cx={x} cy={y} r={2.3} fill={GR.wisp} stroke={INK} strokeWidth={0.9} opacity={0.85} />)
    }
  }

  // Floating mint will-o'-wisps drifting lazily across the ruins.
  const wisps: ReactNode[] = []
  for (let k = 0; k < 10; k++) {
    const x = 24 + rand() * (MAP_W - 48)
    const y = skyEnd + 110 + rand() * (height - skyEnd - 240)
    wisps.push(<WillOWisp key={`w${k}`} x={x} y={y} s={0.78 + (k % 3) * 0.12} delay={-rand() * 5.2} />)
  }

  // Twinkling stars across the upper twilight sky.
  const stars = [
    [34, 34, 0.9],
    [136, 44, 0.75],
    [186, 26, 1.0],
    [224, 62, 0.7],
    [244, 28, 0.85],
    [364, 36, 0.85],
    [152, 92, 0.65],
    [48, 126, 0.7],
  ]

  const road = pathD(pts, 0, stones + 1)
  const walked = walkedTo > 0 ? pathD(pts, 0, Math.min(walkedTo, stones + 1)) : ''

  return (
    <svg className="map__art" viewBox={`0 0 ${MAP_W} ${height}`} aria-hidden="true">
      <defs>
        <linearGradient id="gr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GR.skyTop} />
          <stop offset="0.38" stopColor={GR.skyMid} />
          <stop offset="0.76" stopColor={GR.skyLow} />
          <stop offset="1" stopColor={GR.skyHorizon} />
        </linearGradient>
        <linearGradient id="gr-turf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GR.turfTop} />
          <stop offset="0.52" stopColor={GR.turfMid} />
          <stop offset="1" stopColor={GR.turfBottom} />
        </linearGradient>
        <linearGradient id="gr-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GR.waterLight} />
          <stop offset="0.55" stopColor={GR.water} />
          <stop offset="1" stopColor={GR.waterDeep} />
        </linearGradient>
        <linearGradient id="gr-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GR.mist} stopOpacity="0" />
          <stop offset="1" stopColor={GR.mist} stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id="gr-moon-glow">
          <stop offset="0.2" stopColor={`rgb(${GR.moonGlow})`} stopOpacity="0.72" />
          <stop offset="1" stopColor={`rgb(${GR.moonGlow})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gr-glow-warm">
          <stop offset="0" stopColor={`rgb(${GR.lanternGlow})`} stopOpacity="0.82" />
          <stop offset="1" stopColor={`rgb(${GR.lanternGlow})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gr-glow-wisp">
          <stop offset="0" stopColor={`rgb(${GR.wispGlow})`} stopOpacity="0.8" />
          <stop offset="1" stopColor={`rgb(${GR.wispGlow})`} stopOpacity="0" />
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
      </defs>

      {/* 1. twilight mossy ruins ground + starry amethyst sky */}
      <rect width={MAP_W} height={height} fill="url(#gr-turf)" />
      <rect width={MAP_W} height={skyEnd + 14} fill="url(#gr-sky)" />

      {/* big friendly crescent moon on the TOP-LEFT */}
      <circle cx="80" cy="70" r="84" fill="url(#gr-moon-glow)" />
      <g transform="translate(80 70)">
        <path
          d="M12 -26 A28 28 0 1 0 12 26 A21 21 0 1 1 12 -26 Z"
          fill={GR.moon}
          stroke={INK}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
        <circle cx="-12" cy="-6" r="3.4" fill={GR.moonShade} opacity={0.75} />
        <circle cx="-6" cy="10" r="2.4" fill={GR.moonShade} opacity={0.7} />
      </g>

      {/* twinkling sky stars */}
      {stars.map(([sx, sy, ss], i) => (
        <TwinkleStar key={i} x={sx} y={sy} s={ss} delay={-i * 0.65} />
      ))}

      {/* soft twilight sky clouds */}
      <path
        d="M-10 144 C10 128 42 132 54 146 C68 136 96 140 102 152 H-10 Z"
        fill={GR.mist}
        opacity={0.34}
      />
      <path
        d="M148 118 C162 104 192 106 204 118 C218 112 238 118 242 128 H144 Z"
        fill={GR.mist}
        opacity={0.28}
      />

      {/* 2. Drachenburg teaser (World 8) on the TOP-RIGHT below its sign */}
      <DragonCastleTeaser x={304} y={148} s={0.8} />

      {/* 3. distant misty hills & abbey silhouette ridge */}
      <path
        d={`M0 ${skyEnd - 44} Q74 ${skyEnd - 96} 152 ${skyEnd - 54} Q236 ${skyEnd - 98} 320 ${skyEnd - 58} Q364 ${skyEnd - 78} ${MAP_W} ${skyEnd - 46} V${skyEnd + 24} H0 Z`}
        fill="#6A5A94"
        stroke="rgba(47,36,32,.24)"
        strokeWidth={2}
      />
      <rect y={skyEnd - 64} width={MAP_W} height={72} fill="url(#gr-haze)" />
      {/* abbey terrace hill */}
      <path
        d={`M0 ${skyEnd + 14} C95 ${skyEnd - 34} 305 ${skyEnd - 34} ${MAP_W} ${skyEnd + 14} V${skyEnd + 64} H0 Z`}
        fill={GR.turfTop}
        stroke="rgba(47,36,32,.22)"
        strokeWidth={2}
      />

      {/* 4. multi-stone landscape features: moonlit moat, chessboard courtyard, fountain, curtain walls */}
      {/* moonlit reflecting moat sweeping from the right bay under the trail to the left edge */}
      <path
        d={`M${MAP_W + 10} ${moatPool.y - 36} C326 ${moatPool.y - 54} 254 ${moatPool.y - 26} 240 ${moatPool.y + 10} C224 ${moatBridgePt.y - 12} 140 ${moatBridgePt.y - 22} 84 ${moatBridgePt.y + 18} C40 ${moatBridgePt.y + 46} -10 ${moatBridgePt.y + 30} -10 ${moatBridgePt.y + 30} V${moatBridgePt.y + 84} C46 ${moatBridgePt.y + 92} 102 ${moatBridgePt.y + 62} 152 ${moatBridgePt.y + 32} C208 ${moatBridgePt.y + 2} 252 ${moatPool.y + 52} 316 ${moatPool.y + 54} C362 ${moatPool.y + 56} ${MAP_W + 10} ${moatPool.y + 40} ${MAP_W + 10} ${moatPool.y + 40} Z`}
        fill="url(#gr-water)"
        stroke={INK}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      {/* water shimmer lines + floating lotus wisps on the moat */}
      <path
        className="gr-glow"
        d={`M288 ${moatPool.y - 6} q16 -6 32 0 M308 ${moatPool.y + 16} q14 -5 28 0 M56 ${moatBridgePt.y + 48} q16 -5 30 0`}
        fill="none"
        stroke={GR.waterLight}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <ellipse cx="326" cy={moatPool.y + 2} rx="10" ry="4.5" fill={GR.ivy} stroke={INK} strokeWidth={1.4} />
      <circle cx="326" cy={moatPool.y} r="2.8" fill={GR.lantern} stroke={INK} strokeWidth={1} />
      <ellipse cx="78" cy={moatBridgePt.y + 42} rx="9" ry="4" fill={GR.ivy} stroke={INK} strokeWidth={1.4} />

      <ChessCourtyard x={courtyard.x} y={courtyard.y} />
      <CourtyardFountain x={fountain.x} y={fountain.y} />
      {curtainWalls.map((w, i) => (
        <RuinCurtainWall key={`cw${i}`} x={w.x} y={w.y} width={w.width} flip={w.flip} />
      ))}

      {/* moonlit stone clearings under every puzzle stone */}
      {pts.slice(1, stones + 1).map((p, i) => (
        <ellipse key={`cl${i}`} cx={p.x} cy={p.y + 8} rx={44} ry={26} fill={GR.clearing} />
      ))}
      {groundCover}

      {/* 5. moonlit cobblestone trail + stone arch footbridge over the moat */}
      <path d={road} fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={GR.trailEdge} strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={GR.trail} strokeWidth={21} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={GR.trailSeam} strokeWidth={5} strokeLinecap="round" strokeDasharray="3 18" />
      <StoneFootbridge pts={pts} seg={1} t0={0.34} t1={0.7} />
      {walked && (
        <path d={walked} fill="none" stroke="#C9372C" strokeWidth={5} strokeLinecap="round" strokeDasharray="10 12" opacity={0.82} />
      )}

      {/* 6. ruined Gothic cloister archways straddling over the trail */}
      {archSpecs.map((a) => (
        <TrailArchway key={`ta${a.seg}`} x={a.x} y={a.y} angle={a.angle} />
      ))}

      {/* 7. distributed ruin decor (y-sorted) */}
      {deco.map((d) => d.node)}

      {/* 8. summit: Grand Ghost Abbey + flanking lantern & welcoming ghost */}
      <GhostAbbey x={MAP_W / 2} y={chest.y - 24} />
      <RuinLantern x={42} y={chest.y + 24} s={1.06} />
      <FriendlyGhost x={MAP_W - 44} y={chest.y + 24} s={0.96} flip delay={-2.1} />

      {/* 9. start area: mossy gatehouse on the right, welcoming ghost on the left */}
      <RuinGatehouse x={320} y={height - 76} s={0.96} />
      <FriendlyGhost x={58} y={height - 134} s={0.98} delay={-0.4} />
      <GlowMushrooms x={42} y={height - 32} s={1.08} />
      <RuinLantern x={236} y={height - 30} s={0.94} flip />
      <Signpost x={pts[0].x - 74} y={pts[0].y - 6} />

      {/* 10. magic layer: floating mint will-o'-wisps */}
      {wisps}
    </svg>
  )
}
