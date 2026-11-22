/**
 * Drachenburg (Dragon Castle · World 8) – das große Finale der Reise.
 * Sonnenuntergang über einer prächtigen Drachenburg: oben thront der große, freundliche
 * Drache mit ausgebreiteten Flügeln auf dem Bergfried, dahinter Abendsonne, Feuerwerk
 * (zündet richtig, sobald die Truhe bereit ist) und kleine fliegende Drachen.
 * Von unten nach oben: Bach mit Holzbrücke am Start, Drachennest mit schlüpfendem Baby-Drachen,
 * Ritterlager mit Zelten und Wimpelketten, Schatzhöhle mit überquellendem Gold,
 * goldene Drachenstatue, Formgarten mit Schachfiguren-Hecken und Drachenbrunnen und
 * zum Schluss eine Freitreppe mit rotem Teppich bis vor das Burgtor.
 * Props wie `MapArt`. Zufall nur über `seeded()`.
 */
import type { ReactNode } from 'react'
import { MAP_W, chestSpot, pathD, pointOn, scatterSpots, seeded, type Pt } from '../game/mapPath'

const INK = '#2F2420'

/** Dragon Castle palette – shared CSS values mirror tokens.css (`--dragon-*`). */
export const DC = {
  skyTop: '#3E2463',
  skyMid: '#A33E6E',
  skyLow: '#F27E56',
  skyHorizon: '#FFD58A',
  sun: '#FFF1B8',
  sunGlow: '255,214,120',
  cloud: '#FFC7A8',
  cloudLight: '#FFE3CC',
  cloudShade: '#E98E86',
  mountain: '#8A4C7E',
  mountainDeep: '#6C3B6C',
  groundTop: '#B8C764',
  groundMid: '#8FBE5A',
  groundBottom: '#6FA94F',
  grass: '#5E9A45',
  grassLight: '#C8DC78',
  meadowLight: '255,236,160',
  road: '#F4E2BC',
  roadEdge: '#C29A62',
  roadPaver: '#FFF1D4',
  stone: '#F0DDB8',
  stoneLight: '#FFF2D8',
  stoneShade: '#D3B68A',
  stoneDeep: '#A88A62',
  roof: '#C8372D',
  roofLight: '#E65A45',
  roofDeep: '#962721',
  gold: '#F3B630',
  goldLight: '#FFE07A',
  goldDeep: '#C98E12',
  carpet: '#C02E2B',
  carpetDeep: '#8E1E1F',
  dragon: '#E4543E',
  dragonLight: '#F57A55',
  dragonDeep: '#B5372D',
  belly: '#FFD27A',
  bellyDeep: '#E9AE4C',
  wing: '#F59A4E',
  wingDeep: '#D96F35',
  horn: '#FFF0D2',
  baby: '#62C27A',
  babyDeep: '#3F9A5B',
  babyBelly: '#E4F5B8',
  water: '#4FB8E0',
  waterLight: '#A9E6FA',
  waterDeep: '#2E8DBF',
  wood: '#A0683F',
  woodDeep: '#71452A',
  leaf: '#5FAF4E',
  leafLight: '#86CF63',
  leafDeep: '#3F8A3C',
  rock: '#9C8C9E',
  rockLight: '#BFB0BE',
  rockDeep: '#6F6276',
  gem: ['#E8414B', '#3E8BEA', '#3FBF7F', '#B064E0'],
  tentA: '#C8372D',
  tentB: '#2F62A8',
  canvas: '#FFF7E6',
  flame: '#FFB238',
  flameHot: '#FFE27A',
  cheek: '#FF9EAA',
  fire1: '#FFD24A',
  fire2: '#FF7AA8',
  fire3: '#7FE0FF',
  fire4: '#B9FF7A',
}

const f = (v: number) => v.toFixed(1)
const at = (x: number, y: number, s = 1, flip = false) => `translate(${f(x)} ${f(y)}) scale(${flip ? -s : s} ${s})`

/** Smooth closed path through points (Catmull-Rom → Bézier). */
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

/** Long warm evening shadow. */
const Shadow = ({ rx, ry = rx / 3.4, cx = 4 }: { rx: number; ry?: number; cx?: number }) => (
  <ellipse cx={cx} cy="2" rx={rx} ry={ry} fill="rgba(60,40,30,.22)" />
)

// ---------------------------------------------------------------- small decor

/** Round orchard tree lit by the setting sun. */
function SunTree({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={at(x, y, s, flip)}>
      <ellipse cx="18" cy="3" rx="34" ry="8" fill="rgba(60,40,30,.2)" />
      <path
        d="M-5 2 C-3 -12 -6 -22 -2 -34 L4 -34 C6 -22 4 -12 6 2 Z"
        fill={DC.wood}
        stroke={INK}
        strokeWidth={2.3}
        strokeLinejoin="round"
      />
      <path d="M0 -24 L-10 -34 M2 -28 L10 -38" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      <circle cx="-14" cy="-44" r="16" fill={DC.leafDeep} stroke={INK} strokeWidth={2.3} />
      <circle cx="14" cy="-44" r="16" fill={DC.leaf} stroke={INK} strokeWidth={2.3} />
      <circle cx="0" cy="-58" r="19" fill={DC.leaf} stroke={INK} strokeWidth={2.3} />
      <path d="M-10 -66 q8 -6 18 -2" fill="none" stroke={DC.grassLight} strokeWidth={3} strokeLinecap="round" />
      <path d="M14 -44 a16 16 0 0 1 -6 13" fill="none" stroke={DC.leafLight} strokeWidth={3} strokeLinecap="round" opacity={0.8} />
      {[
        [-12, -50],
        [8, -62],
        [16, -40],
      ].map(([ax, ay], i) => (
        <circle key={i} cx={ax} cy={ay} r="3.2" fill="#FF7A4E" stroke={INK} strokeWidth={1.3} />
      ))}
    </g>
  )
}

/** Small round bush with flowers. */
function Bush({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={at(x, y, s)}>
      <Shadow rx={18} />
      <path
        d="M-18 0 C-24 -10 -16 -22 -6 -18 C-2 -28 14 -26 14 -16 C24 -16 24 0 14 0 Z"
        fill={DC.leaf}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path d="M-8 -14 q6 -4 12 0" fill="none" stroke={DC.leafLight} strokeWidth={2.4} strokeLinecap="round" />
      <circle cx="-8" cy="-8" r="2.6" fill="#FF8FB0" stroke={INK} strokeWidth={1.1} />
      <circle cx="6" cy="-12" r="2.6" fill="#FFF2A8" stroke={INK} strokeWidth={1.1} />
      <circle cx="12" cy="-5" r="2.4" fill="#FF8FB0" stroke={INK} strokeWidth={1.1} />
    </g>
  )
}

/** Tall banner pole with a swallow-tailed flag. */
function BannerPole({ x, y, s = 1, color = DC.roof, flip = false }: { x: number; y: number; s?: number; color?: string; flip?: boolean }) {
  return (
    <g transform={at(x, y, s, flip)}>
      <Shadow rx={8} />
      <path d="M0 2 V-62" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />
      <circle cx="0" cy="-64" r="3.4" fill={DC.gold} stroke={INK} strokeWidth={1.6} />
      <path className="map-flag" d="M1 -58 H24 L18 -50 L24 -42 H1 Z" fill={color} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M6 -54 l3 4 l3 -4" fill="none" stroke={DC.goldLight} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

/** Fire brazier on a stone plinth. */
function Brazier({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={at(x, y, s)}>
      <Shadow rx={12} />
      <circle className="dc-glow" cx="0" cy="-30" r="22" fill="url(#dc-glow-fire)" />
      <rect x="-8" y="-12" width="16" height="14" rx="2" fill={DC.stone} stroke={INK} strokeWidth={2} />
      <path d="M-12 -14 H12 L8 -22 H-8 Z" fill={DC.goldDeep} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path
        className="dc-flicker"
        d="M0 -40 C7 -32 8 -26 4 -22 H-4 C-8 -26 -7 -32 0 -40 Z"
        fill={DC.flame}
        stroke={INK}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path d="M0 -32 C3 -28 3 -25 1 -23 H-1 C-3 -25 -3 -28 0 -32 Z" fill={DC.flameHot} />
    </g>
  )
}

/** Little pile of gold coins with a gem. */
function CoinPile({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={at(x, y, s)}>
      <Shadow rx={12} />
      {[
        [-7, 0],
        [6, 0],
        [0, -4],
        [-3, -8],
      ].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="6" ry="3" fill={DC.gold} stroke={INK} strokeWidth={1.5} />
      ))}
      <path d="M5 -12 L9 -8 L5 -3 L1 -8 Z" fill={DC.gem[1]} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
      <path className="dc-twinkle" d="M-6 -16 l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 l3 -1 Z" fill="#FFFFFF" />
    </g>
  )
}

/** Flower tuft. */
function Flowers({ x, y, c = '#FF8FB0' }: { x: number; y: number; c?: string }) {
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      <path d="M-4 0 q1 -6 0 -9 M3 0 q0 -7 2 -10" stroke={DC.grass} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <circle cx="0" cy="-10" r="3" fill={c} stroke={INK} strokeWidth={1.1} />
      <circle cx="5" cy="-11" r="2.6" fill={DC.goldLight} stroke={INK} strokeWidth={1.1} />
    </g>
  )
}

/** Garland of triangular pennants between two points. */
function Bunting({ a, b, sag = 18, n = 9 }: { a: Pt; b: Pt; sag?: number; n?: number }) {
  const cx = (a.x + b.x) / 2
  const cy = (a.y + b.y) / 2 + sag * 2
  const q = (t: number) => ({
    x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * cx + t * t * b.x,
    y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * cy + t * t * b.y,
  })
  const colors = [DC.roof, DC.gold, DC.tentB, '#3FA27C', '#FF8FB0']
  return (
    <g>
      <path d={`M${f(a.x)} ${f(a.y)} Q${f(cx)} ${f(cy)} ${f(b.x)} ${f(b.y)}`} fill="none" stroke={INK} strokeWidth={1.6} />
      {Array.from({ length: n }, (_, i) => {
        const p = q((i + 0.5) / n)
        return (
          <path
            key={i}
            className="dc-pennant"
            style={{ animationDelay: `${-i * 0.3}s` }}
            d={`M${f(p.x - 5)} ${f(p.y)} H${f(p.x + 5)} L${f(p.x)} ${f(p.y + 10)} Z`}
            fill={colors[i % colors.length]}
            stroke={INK}
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
        )
      })}
    </g>
  )
}

/** Exploding firework – bursts big once the chest is ready. */
function Firework({ x, y, color, s = 1, delay = 0 }: { x: number; y: number; color: string; s?: number; delay?: number }) {
  return (
    <g transform={at(x, y, s)}>
      <g className="dc-firework" style={{ animationDelay: `${f(delay)}s` }}>
        <circle r="30" fill={color} opacity={0.16} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6
          return (
            <g key={i}>
              <path
                d={`M${f(Math.cos(a) * 9)} ${f(Math.sin(a) * 9)} L${f(Math.cos(a) * 24)} ${f(Math.sin(a) * 24)}`}
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
              />
              <circle cx={f(Math.cos(a) * 29)} cy={f(Math.sin(a) * 29)} r="2.4" fill="#FFFFFF" />
            </g>
          )
        })}
        <circle r="4" fill="#FFFFFF" />
      </g>
    </g>
  )
}

/** Small dragon flying in the sky (flapping). */
function SkyDragon({
  x,
  y,
  s = 1,
  flip = false,
  color = DC.dragonDeep,
  delay = 0,
}: {
  x: number
  y: number
  s?: number
  flip?: boolean
  color?: string
  delay?: number
}) {
  return (
    <g transform={at(x, y, s, flip)}>
      <g className="dc-glide" style={{ animationDelay: `${f(delay)}s` }}>
        <path
          d="M-22 4 C-14 0 -4 2 4 0 C10 -2 14 -6 20 -6 L24 -3 L20 0 C14 2 10 6 2 7 C-8 8 -16 8 -22 4 Z"
          fill={color}
          stroke={INK}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        <path
          className="dc-flap"
          d="M-4 1 C-8 -12 -2 -20 6 -24 C6 -16 8 -8 6 0 Z"
          fill={DC.wing}
          stroke={INK}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
        <path d="M-22 4 L-30 0 L-26 6 Z" fill={color} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
        <circle cx="19" cy="-4" r="1.2" fill={INK} />
      </g>
    </g>
  )
}

/** Puffy sunset cloud. */
function Cloud({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={at(x, y, s, flip)}>
      <g className="dc-drift">
        <path
          d="M-44 8 C-56 8 -56 -8 -42 -10 C-40 -24 -20 -28 -10 -18 C-4 -32 22 -32 26 -14 C40 -18 52 -6 44 8 Z"
          fill={DC.cloud}
          stroke="rgba(47,36,32,.5)"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <path
          d="M-38 -6 C-34 -16 -22 -18 -14 -12 M-4 -18 C2 -26 16 -24 20 -16"
          fill="none"
          stroke={DC.cloudLight}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <path d="M-44 8 H44 C40 2 30 2 26 4 C16 0 -10 0 -20 4 C-30 0 -40 2 -44 8 Z" fill={DC.cloudShade} opacity={0.7} />
      </g>
    </g>
  )
}

// ---------------------------------------------------------------- set pieces

/** Twig nest with spotted dragon eggs and a baby dragon hatching. */
function EggNest({ x, y }: { x: number; y: number }) {
  const egg = (ex: number, ey: number, c: string, spot: string, r = 0, key = '') => (
    <g key={key} transform={`translate(${ex} ${ey}) rotate(${r})`}>
      <path
        d="M0 -26 C12 -26 17 -8 17 2 C17 12 9 18 0 18 C-9 18 -17 12 -17 2 C-17 -8 -12 -26 0 -26 Z"
        fill={c}
        stroke={INK}
        strokeWidth={2.4}
      />
      <circle cx="-6" cy="-6" r="3.4" fill={spot} />
      <circle cx="6" cy="4" r="4" fill={spot} />
      <circle cx="-3" cy="10" r="2.4" fill={spot} />
      <path d="M-8 -16 q4 -6 9 -6" fill="none" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" opacity={0.7} />
    </g>
  )
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      <ellipse cx="10" cy="14" rx="96" ry="22" fill="rgba(60,40,30,.22)" />
      {/* back rim of the nest */}
      <path
        d="M-82 0 C-84 -22 -40 -34 0 -34 C40 -34 84 -22 82 0 Z"
        fill={DC.woodDeep}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      {egg(-40, -14, '#FFE3A8', '#F2A93B', -10, 'e1')}
      {egg(42, -12, '#C9E8FF', '#6FA8E8', 12, 'e2')}
      {/* hatched egg with baby dragon */}
      <g transform="translate(2 -22)">
        <path
          d="M-17 2 C-17 12 -9 18 0 18 C9 18 17 12 17 2 L12 -2 L7 4 L2 -4 L-4 3 L-9 -3 L-14 2 Z"
          fill="#FFD6E6"
          stroke={INK}
          strokeWidth={2.4}
          strokeLinejoin="round"
        />
        <g className="dc-peek">
          <path
            d="M-12 -2 C-14 -18 -8 -30 0 -32 C8 -30 14 -18 12 -2 Z"
            fill={DC.baby}
            stroke={INK}
            strokeWidth={2.3}
            strokeLinejoin="round"
          />
          <path
            d="M-7 -28 L-10 -38 L-3 -31 Z M7 -28 L10 -38 L3 -31 Z"
            fill={DC.horn}
            stroke={INK}
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
          <ellipse cx="0" cy="-10" rx="7" ry="7" fill={DC.babyBelly} />
          <ellipse cx="-4.5" cy="-20" rx="2.4" ry="3" fill={INK} />
          <ellipse cx="4.5" cy="-20" rx="2.4" ry="3" fill={INK} />
          <circle cx="-5.2" cy="-21" r="0.9" fill="#FFFFFF" />
          <circle cx="3.8" cy="-21" r="0.9" fill="#FFFFFF" />
          <ellipse cx="-8" cy="-15" rx="2.2" ry="1.5" fill={DC.cheek} />
          <ellipse cx="8" cy="-15" rx="2.2" ry="1.5" fill={DC.cheek} />
          <path d="M-3 -14 q3 3 6 0" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
          <path d="M-12 -8 C-18 -12 -20 -6 -15 -3" fill={DC.baby} stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        </g>
        <path d="M-17 2 L-14 2 L-9 -3 L-4 3 L2 -4 L7 4 L12 -2 L17 2" fill="none" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
        {/* shell cap on the ground */}
        <path
          d="M24 26 C24 16 34 14 40 20 L36 22 L33 18 L30 23 L27 20 Z"
          fill="#FFD6E6"
          stroke={INK}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </g>
      {/* front rim of twigs */}
      <path
        d="M-86 -4 C-80 18 -40 26 0 26 C40 26 80 18 86 -4 C70 6 40 10 0 10 C-40 10 -70 6 -86 -4 Z"
        fill={DC.wood}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path
        d="M-74 4 L-40 14 M-50 8 L-14 18 M-20 14 L20 16 M10 18 L46 10 M36 14 L74 2 M-62 12 L-80 0 M60 10 L82 -2"
        stroke={DC.woodDeep}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <path d="M-88 -6 l-8 -6 M88 -6 l8 -8 M-30 22 l-4 8 M30 22 l6 8" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
      {/* soft feathers / leaves */}
      <ellipse cx="-62" cy="-4" rx="7" ry="3.4" fill={DC.leafLight} stroke={INK} strokeWidth={1.3} transform="rotate(-20 -62 -4)" />
      <ellipse cx="66" cy="-6" rx="7" ry="3.4" fill={DC.leafLight} stroke={INK} strokeWidth={1.3} transform="rotate(24 66 -6)" />
      <path className="dc-twinkle" d="M-8 -69 L-6 -64 L-1 -62 L-6 -60 L-8 -55 L-10 -60 L-15 -62 L-10 -64 Z" fill="#FFFFFF" />
    </g>
  )
}

/** Striped knight's tent with a pennant. */
function Tent({ x, y, s = 1, color = DC.tentA, flip = false }: { x: number; y: number; s?: number; color?: string; flip?: boolean }) {
  const stripes = [-24, -8, 8, 24]
  return (
    <g transform={at(x, y, s, flip)}>
      <ellipse cx="10" cy="3" rx="44" ry="10" fill="rgba(60,40,30,.22)" />
      <path d="M-36 2 L0 -50 L36 2 Z" fill={DC.canvas} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      {stripes.map((sx, i) => (i % 2 === 0 ? <path key={sx} d={`M0 -50 L${sx} 2 L${sx + 16} 2 Z`} fill={color} /> : null))}
      <path d="M-36 2 L0 -50 L36 2 Z" fill="none" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M0 -50 L18 2 H36 Z" fill="rgba(60,40,30,.14)" />
      <path d="M-10 2 L0 -22 L10 2 Z" fill={DC.woodDeep} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path
        d="M-40 -8 C-30 -4 -20 -12 -10 -8 C0 -4 10 -12 20 -8 C30 -4 36 -10 40 -8"
        fill="none"
        stroke={DC.gold}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path d="M0 -50 V-68" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      <path className="map-flag" d="M0 -68 L18 -63 L0 -58 Z" fill={DC.gold} stroke={INK} strokeWidth={1.7} strokeLinejoin="round" />
      <circle cx="0" cy="-50" r="3" fill={DC.gold} stroke={INK} strokeWidth={1.4} />
    </g>
  )
}

/** Knights' camp outside the castle: tents, bunting, campfire and a training dummy. */
function KnightsCamp({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      <Bunting a={{ x: -70, y: -96 }} b={{ x: 68, y: -66 }} sag={10} n={10} />
      <BannerPole x={-72} y={-36} s={0.95} color={DC.tentB} />
      <BannerPole x={66} y={-6} s={0.95} />
      <Tent x={-28} y={-34} s={1.15} color={DC.tentA} />
      <Tent x={46} y={48} s={1.05} color={DC.tentB} flip />
      {/* campfire */}
      <g transform="translate(-36 40)">
        <ellipse cx="0" cy="2" rx="18" ry="6" fill="rgba(60,40,30,.2)" />
        <circle className="dc-glow" cx="0" cy="-10" r="26" fill="url(#dc-glow-fire)" />
        {[-12, -4, 4, 12].map((sx) => (
          <ellipse key={sx} cx={sx} cy="0" rx="5" ry="3.4" fill={DC.rock} stroke={INK} strokeWidth={1.5} />
        ))}
        <path d="M-10 -2 L10 -8 M-10 -8 L10 -2" stroke={DC.woodDeep} strokeWidth={4} strokeLinecap="round" />
        <path
          className="dc-flicker"
          d="M0 -26 C8 -16 9 -8 4 -4 H-4 C-9 -8 -8 -16 0 -26 Z"
          fill={DC.flame}
          stroke={INK}
          strokeWidth={1.7}
          strokeLinejoin="round"
        />
        <path d="M0 -16 C3 -12 3 -8 1 -6 H-1 C-3 -8 -3 -12 0 -16 Z" fill={DC.flameHot} />
      </g>
      {/* straw training dummy with a dragon-shield */}
      <g transform="translate(-74 74)">
        <Shadow rx={12} />
        <path d="M0 2 V-40 M-16 -30 H16" stroke={DC.woodDeep} strokeWidth={4} strokeLinecap="round" />
        <ellipse cx="0" cy="-26" rx="10" ry="14" fill="#E9C46A" stroke={INK} strokeWidth={2} />
        <circle cx="0" cy="-46" r="8" fill="#E9C46A" stroke={INK} strokeWidth={2} />
        <path d="M-4 -46 h2 M2 -46 h2 M-3 -42 q3 2 6 0" stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
        <path
          d="M6 -34 C6 -24 12 -18 16 -16 C20 -18 26 -24 26 -34 Z"
          fill={DC.roof}
          stroke={INK}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        <path d="M16 -30 v8" stroke={DC.gold} strokeWidth={2.4} strokeLinecap="round" />
      </g>
      {/* weapon rack */}
      <g transform="translate(18 -2)">
        <Shadow rx={14} />
        <path d="M-14 2 V-22 M14 2 V-22 M-16 -18 H16" stroke={DC.woodDeep} strokeWidth={3.2} strokeLinecap="round" />
        <path d="M-8 -2 L-4 -36 M0 -2 L4 -38 M8 -2 L10 -34" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
        <path
          d="M-4 -36 l-2 -6 l4 2 Z M4 -38 l0 -6 l3 4 Z M10 -34 l1 -6 l2 5 Z"
          fill="#DDE3EA"
          stroke={INK}
          strokeWidth={1.3}
          strokeLinejoin="round"
        />
      </g>
    </g>
  )
}

/** Rocky dragon's lair with a mountain of gold pouring out of the cave. */
function TreasureCave({ x, y, rand }: { x: number; y: number; rand: () => number }) {
  const coins: ReactNode[] = []
  for (let i = 0; i < 26; i++) {
    const cx = -10 + rand() * 110
    const cy = 30 + rand() * 40 - (cx - 40) * 0.2
    coins.push(
      <ellipse
        key={i}
        cx={f(cx)}
        cy={f(cy)}
        rx="5.5"
        ry="2.8"
        fill={rand() < 0.5 ? DC.gold : DC.goldLight}
        stroke={INK}
        strokeWidth={1.3}
      />,
    )
  }
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      <ellipse cx="20" cy="66" rx="120" ry="20" fill="rgba(60,40,30,.22)" />
      {/* rock mass */}
      <path
        d={smooth([
          [-110, 70],
          [-112, -30],
          [-80, -86],
          [-30, -104],
          [20, -92],
          [62, -60],
          [92, -10],
          [104, 48],
          [70, 74],
          [0, 80],
        ])}
        fill={DC.rock}
        stroke={INK}
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      <path
        d={smooth([
          [-20, -96],
          [20, -88],
          [58, -58],
          [88, -10],
          [98, 40],
          [70, 60],
          [50, 0],
          [30, -50],
        ])}
        fill={DC.rockLight}
        opacity={0.55}
      />
      <path
        d="M-90 -40 L-60 -60 M-80 10 L-50 0 M-40 -80 L-10 -70 M50 -40 L70 -20"
        stroke={DC.rockDeep}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* moss & grass on top */}
      <path
        d="M-82 -84 C-60 -100 -20 -112 20 -96 C30 -92 30 -84 20 -86 C-10 -94 -50 -90 -78 -76 Z"
        fill={DC.leaf}
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* cave mouth */}
      <path d="M-46 70 C-50 20 -30 -24 6 -26 C42 -24 58 20 54 70 Z" fill="#3A2436" stroke={INK} strokeWidth={2.6} />
      <circle className="dc-glow" cx="4" cy="30" r="56" fill="url(#dc-glow-gold)" />
      {/* glowing eyes of a sleepy dragon deep inside */}
      <g className="dc-blink">
        <ellipse cx="-6" cy="6" rx="5" ry="2.2" fill={DC.goldLight} />
        <ellipse cx="14" cy="6" rx="5" ry="2.2" fill={DC.goldLight} />
      </g>
      {/* gold hoard spilling out */}
      <path
        d={smooth([
          [-44, 72],
          [-36, 34],
          [-10, 18],
          [20, 20],
          [46, 36],
          [80, 50],
          [110, 70],
          [40, 80],
        ])}
        fill={DC.gold}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path d="M-30 40 C-14 28 10 26 30 32" fill="none" stroke={DC.goldLight} strokeWidth={4} strokeLinecap="round" />
      {coins}
      {/* crown, goblet, gems and a sword in the hoard */}
      <g transform="translate(-14 24) rotate(-10)">
        <path
          d="M-12 6 L-14 -8 L-6 -2 L0 -12 L6 -2 L14 -8 L12 6 Z"
          fill={DC.goldLight}
          stroke={INK}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <circle cx="0" cy="1" r="2.6" fill={DC.gem[0]} stroke={INK} strokeWidth={1.1} />
      </g>
      <g transform="translate(30 30)">
        <path
          d="M-7 -16 H7 C7 -8 4 -4 0 -4 C-4 -4 -7 -8 -7 -16 Z M0 -4 V4 M-5 4 H5"
          fill={DC.goldLight}
          stroke={INK}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <circle cx="0" cy="-11" r="2.2" fill={DC.gem[2]} stroke={INK} strokeWidth={1} />
      </g>
      <g transform="translate(58 38) rotate(28)">
        <path d="M-2 -34 H2 V-6 H-2 Z" fill="#E8EEF4" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M-9 -6 H9 M0 -6 V4" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        <path d="M-9 -6 H9" stroke={DC.gold} strokeWidth={1.6} strokeLinecap="round" />
        <circle cx="0" cy="6" r="2.6" fill={DC.gem[0]} stroke={INK} strokeWidth={1.1} />
      </g>
      {[
        [4, 44, 0],
        [-28, 56, 1],
        [76, 60, 3],
        [44, 56, 2],
        [90, 66, 0],
      ].map(([gx, gy, c], i) => (
        <path
          key={i}
          d={`M${gx} ${gy - 6} L${gx + 5} ${gy - 1} L${gx} ${gy + 4} L${gx - 5} ${gy - 1} Z`}
          fill={DC.gem[c]}
          stroke={INK}
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      ))}
      {[
        [-20, 10],
        [40, 14],
        [70, 40],
        [-36, 50],
      ].map(([sx, sy], i) => (
        <path
          key={`s${i}`}
          className="dc-twinkle"
          style={{ animationDelay: `${-i * 0.7}s` }}
          d={`M${sx} ${sy - 7} L${sx + 2} ${sy - 2} L${sx + 7} ${sy} L${sx + 2} ${sy + 2} L${sx} ${sy + 7} L${sx - 2} ${sy + 2} L${sx - 7} ${sy} L${sx - 2} ${sy - 2} Z`}
          fill="#FFFFFF"
        />
      ))}
    </g>
  )
}

/** Golden dragon statue on a plinth, breathing a little flame. */
function DragonStatue({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  const g = { fill: DC.gold, stroke: INK, strokeWidth: 2.3, strokeLinejoin: 'round' as const }
  return (
    <g transform={at(x, y, s, flip)}>
      <ellipse cx="10" cy="3" rx="36" ry="9" fill="rgba(60,40,30,.22)" />
      <rect x="-26" y="-18" width="52" height="20" rx="3" fill={DC.stone} stroke={INK} strokeWidth={2.3} />
      <rect x="-30" y="-24" width="60" height="8" rx="2.5" fill={DC.stoneLight} stroke={INK} strokeWidth={2.2} />
      <path d="M-26 -8 H26" stroke={DC.stoneShade} strokeWidth={1.6} />
      {/* wing */}
      <path
        d="M-4 -52 C-18 -74 -38 -80 -46 -74 C-40 -68 -40 -60 -34 -56 C-38 -50 -34 -44 -28 -44 C-22 -40 -12 -42 -6 -46 Z"
        fill={DC.goldLight}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path d="M-8 -50 L-40 -72 M-10 -48 L-34 -56 M-10 -46 L-28 -44" stroke={DC.goldDeep} strokeWidth={1.4} />
      {/* body sitting */}
      <path
        d="M-20 -24 C-24 -40 -14 -56 0 -58 C8 -60 12 -70 10 -80 C18 -84 28 -80 30 -72 C32 -64 26 -58 20 -56 C24 -46 22 -32 16 -24 Z"
        {...g}
      />
      <path d="M-4 -28 C-6 -40 0 -50 8 -52" fill="none" stroke={DC.goldLight} strokeWidth={4} strokeLinecap="round" />
      <path d="M-20 -24 C-30 -26 -38 -22 -40 -14 L-34 -16" fill="none" stroke={INK} strokeWidth={2.3} strokeLinecap="round" />
      <path d="M12 -80 L10 -90 L18 -84 Z M22 -82 L24 -92 L28 -82 Z" fill={DC.horn} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <circle cx="22" cy="-72" r="1.8" fill={INK} />
      <path d="M28 -66 q2 2 4 1" fill="none" stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
      {/* tiny flame */}
      <circle className="dc-glow" cx="42" cy="-66" r="14" fill="url(#dc-glow-fire)" />
      <path
        className="dc-flicker"
        d="M32 -66 C38 -74 46 -72 50 -66 C46 -60 38 -60 32 -66 Z"
        fill={DC.flame}
        stroke={INK}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </g>
  )
}

/** Clipped hedge shaped like a chess piece. */
function Topiary({ x, y, kind, s = 1 }: { x: number; y: number; kind: 'pawn' | 'rook' | 'knight' | 'king'; s?: number }) {
  const h = { fill: DC.leaf, stroke: INK, strokeWidth: 2.3, strokeLinejoin: 'round' as const }
  return (
    <g transform={at(x, y, s)}>
      <Shadow rx={18} />
      <path d="M-14 2 L-11 -10 H11 L14 2 Z" fill={DC.roof} stroke={INK} strokeWidth={2.1} strokeLinejoin="round" />
      <path d="M-14 -3 H14" stroke={DC.gold} strokeWidth={2} />
      {kind === 'pawn' && (
        <g>
          <path d="M-10 -10 L-7 -30 H7 L10 -10 Z" {...h} />
          <circle cx="0" cy="-38" r="11" {...h} />
        </g>
      )}
      {kind === 'rook' && <path d="M-11 -10 L-9 -38 H-13 V-50 H-7 V-44 H-2 V-50 H2 V-44 H7 V-50 H13 V-38 H9 L11 -10 Z" {...h} />}
      {kind === 'knight' && (
        <path d="M-11 -10 C-11 -22 -6 -30 -2 -38 L-10 -34 C-14 -32 -15 -36 -12 -40 L-2 -50 L1 -56 L4 -50 C12 -46 14 -32 11 -10 Z" {...h} />
      )}
      {kind === 'king' && (
        <g>
          <path d="M-11 -10 L-9 -40 H9 L11 -10 Z" {...h} />
          <ellipse cx="0" cy="-42" rx="13" ry="6" {...h} />
          <path d="M-3 -60 h6 v5 h5 v6 h-5 v5 h-6 v-5 h-5 v-6 h5 Z" {...h} />
        </g>
      )}
      <path d="M-5 -24 q3 -4 7 -3" fill="none" stroke={DC.leafLight} strokeWidth={2.4} strokeLinecap="round" />
      <circle cx="-4" cy="-18" r="1.8" fill="#FF8FB0" />
      <circle cx="5" cy="-30" r="1.8" fill={DC.goldLight} />
    </g>
  )
}

/** Formal garden with a dragon fountain and chess-piece topiaries. */
function DragonFountainGarden({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      {/* gravel bed */}
      <ellipse cx="0" cy="10" rx="98" ry="56" fill={DC.road} stroke={INK} strokeWidth={2.2} />
      <ellipse cx="0" cy="10" rx="88" ry="48" fill="none" stroke={DC.roadEdge} strokeWidth={1.6} strokeDasharray="4 8" />
      <Topiary x={-70} y={-12} kind="rook" s={0.82} />
      <Topiary x={72} y={-10} kind="knight" s={0.82} />
      {/* basin */}
      <ellipse cx="0" cy="22" rx="52" ry="22" fill={DC.stoneShade} stroke={INK} strokeWidth={2.4} />
      <ellipse cx="0" cy="18" rx="50" ry="20" fill={DC.stoneLight} stroke={INK} strokeWidth={2.2} />
      <ellipse cx="0" cy="19" rx="40" ry="14" fill="url(#dc-water)" stroke={INK} strokeWidth={1.8} />
      <ellipse className="dc-ripple" cx="0" cy="19" rx="24" ry="8" fill="none" stroke={DC.waterLight} strokeWidth={1.8} />
      {/* dragon on a pedestal spouting water */}
      <rect x="-8" y="-2" width="16" height="20" rx="2" fill={DC.stone} stroke={INK} strokeWidth={2} />
      <ellipse cx="0" cy="-2" rx="13" ry="4.5" fill={DC.stoneLight} stroke={INK} strokeWidth={1.9} />
      <path
        d="M-10 -4 C-14 -16 -8 -28 0 -30 C4 -36 4 -44 10 -48 C16 -48 20 -42 18 -36 C14 -34 10 -32 8 -26 C12 -18 10 -8 8 -4 Z"
        fill={DC.baby}
        stroke={INK}
        strokeWidth={2.1}
        strokeLinejoin="round"
      />
      <path d="M-8 -10 C-18 -12 -24 -8 -24 -2" fill="none" stroke={INK} strokeWidth={2.1} strokeLinecap="round" />
      <path d="M8 -46 L6 -54 L12 -48 Z" fill={DC.horn} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
      <circle cx="13" cy="-42" r="1.5" fill={INK} />
      <path
        className="dc-shimmer"
        d="M19 -38 C30 -46 40 -30 38 10 M18 -36 C24 -30 28 -10 26 10"
        fill="none"
        stroke={DC.waterLight}
        strokeWidth={2.8}
        strokeLinecap="round"
      />
      <circle cx="38" cy="12" r="2.2" fill={DC.waterLight} />
      {/* flowerbeds */}
      {[
        [-44, 52],
        [44, 52],
      ].map(([bx, by], i) => (
        <g key={i} transform={`translate(${bx} ${by})`}>
          <ellipse cx="0" cy="0" rx="22" ry="8" fill={DC.leafDeep} stroke={INK} strokeWidth={1.8} />
          {[-12, -4, 4, 12].map((fx, k) => (
            <circle key={fx} cx={fx} cy={-2 + (k % 2) * 3} r="2.8" fill={k % 2 ? DC.goldLight : '#FF8FB0'} stroke={INK} strokeWidth={1.1} />
          ))}
        </g>
      ))}
    </g>
  )
}

/** Little stream crossing the meadow at the start with a wooden plank bridge. */
function Stream({ y, rand }: { y: number; rand: () => number }) {
  const top: [number, number][] = [
    [-20, y + 10],
    [80, y - 6],
    [170, y + 4],
    [260, y - 10],
    [420, y - 4],
  ]
  const bottom: [number, number][] = [
    [420, y + 26],
    [260, y + 20],
    [170, y + 32],
    [80, y + 24],
    [-20, y + 40],
  ]
  const outline = smooth([...top, ...bottom])
  const reeds: ReactNode[] = []
  for (let i = 0; i < 6; i++) {
    const rx = 20 + rand() * 360
    if (rx > 120 && rx < 230) continue
    reeds.push(
      <path
        key={i}
        d={`M${f(rx)} ${f(y + 30)} q-2 -12 -4 -18 M${f(rx + 4)} ${f(y + 30)} q1 -14 2 -20`}
        stroke={DC.leafDeep}
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
      />,
    )
  }
  return (
    <g>
      <path d={outline} fill="url(#dc-water)" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path
        className="dc-shimmer"
        d={`M40 ${y + 12} q10 -4 20 0 M250 ${y + 6} q12 -4 24 0 M320 ${y + 14} q8 -3 16 0`}
        fill="none"
        stroke={DC.waterLight}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      {reeds}
    </g>
  )
}

/** Wooden plank bridge along the trail where it crosses the stream. */
function PlankBridge({ pts, y0, y1 }: { pts: Pt[]; y0: number; y1: number }) {
  let t0 = 0
  let t1 = 1
  for (let t = 0; t <= 1; t += 0.01) {
    const p = pointOn(pts, 0, t)
    if (p.y <= y1 && t0 === 0) t0 = t
    if (p.y >= y0) t1 = t
  }
  const n = 10
  const line = Array.from({ length: n + 1 }, (_, k) => pointOn(pts, 0, t0 + ((t1 - t0) * k) / n))
  const normal = (k: number) => {
    const a = line[Math.max(0, k - 1)]
    const b = line[Math.min(n, k + 1)]
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
    return { x: -(b.y - a.y) / len, y: (b.x - a.x) / len }
  }
  const deck = line.map((p, k) => `${k ? 'L' : 'M'}${f(p.x)} ${f(p.y)}`).join(' ')
  const rail = (o: number) => line.map((p, k) => `${k ? 'L' : 'M'}${f(p.x + normal(k).x * o)} ${f(p.y + normal(k).y * o)}`).join(' ')
  const posts = [0, n].flatMap((k) => [-22, 22].map((o) => ({ x: line[k].x + normal(k).x * o, y: line[k].y + normal(k).y * o })))
  return (
    <g>
      <path d={deck} fill="none" stroke="rgba(60,40,30,.25)" strokeWidth={50} transform="translate(3 7)" />
      <path d={deck} fill="none" stroke={INK} strokeWidth={46} />
      <path d={deck} fill="none" stroke={DC.wood} strokeWidth={40} />
      <path d={deck} fill="none" stroke={DC.woodDeep} strokeWidth={40} strokeDasharray="1.6 7" />
      {[-20, 20].map((o) => (
        <g key={o}>
          <path d={rail(o)} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
          <path d={rail(o)} fill="none" stroke={DC.wood} strokeWidth={4} strokeLinecap="round" />
        </g>
      ))}
      {posts.map((p, i) => (
        <g key={i} transform={`translate(${f(p.x)} ${f(p.y)})`}>
          <rect x="-4.5" y="-12" width="9" height="14" rx="2" fill={DC.wood} stroke={INK} strokeWidth={1.8} />
          <circle cx="0" cy="-13" r="3.4" fill={DC.gold} stroke={INK} strokeWidth={1.4} />
        </g>
      ))}
    </g>
  )
}

/** Garland of pennants strung across the trail between two banner poles. */
function TrailGarland({ pts, seg, t = 0.5, w = 52 }: { pts: Pt[]; seg: number; t?: number; w?: number }) {
  const a = pointOn(pts, seg, t - 0.05)
  const b = pointOn(pts, seg, t + 0.05)
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
  const nx = -(b.y - a.y) / len
  const ny = (b.x - a.x) / len
  const m = pointOn(pts, seg, t)
  const l = { x: m.x + nx * w, y: m.y + ny * w }
  const r = { x: m.x - nx * w, y: m.y - ny * w }
  const [left, right] = l.x < r.x ? [l, r] : [r, l]
  return (
    <g>
      <BannerPole x={left.x} y={left.y + 14} s={0.9} color={DC.tentB} flip />
      <BannerPole x={right.x} y={right.y + 14} s={0.9} />
      <Bunting a={{ x: left.x, y: left.y - 44 }} b={{ x: right.x, y: right.y - 44 }} sag={8} n={9} />
    </g>
  )
}

// ---------------------------------------------------------------- summit: castle + great dragon

/** The great dragon's wings – drawn behind the castle. */
function DragonWings({ x, y }: { x: number; y: number }) {
  const wing = (dir: 1 | -1) => (
    <g transform={`scale(${dir} 1)`}>
      <path
        d="M10 -10 C30 -60 70 -110 128 -130 C126 -116 132 -104 142 -98 C126 -90 122 -76 128 -64 C112 -62 104 -50 108 -36 C92 -38 80 -28 80 -14 C62 -22 40 -18 30 -6 Z"
        fill={DC.wing}
        stroke={INK}
        strokeWidth={2.8}
        strokeLinejoin="round"
      />
      <path d="M20 -12 C40 -64 80 -108 128 -130" fill="none" stroke={DC.dragonDeep} strokeWidth={5} strokeLinecap="round" />
      <path d="M20 -12 C40 -64 80 -108 128 -130" fill="none" stroke={DC.dragon} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M40 -40 L142 -98 M46 -30 L128 -64 M50 -22 L108 -36" stroke={DC.wingDeep} strokeWidth={2.2} strokeLinecap="round" />
      <path d="M128 -130 l6 -8 l-1 9 Z" fill={DC.horn} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
    </g>
  )
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      <g className="dc-wing-l">{wing(-1)}</g>
      <g className="dc-wing-r">{wing(1)}</g>
    </g>
  )
}

/** The great friendly dragon curled on top of the keep (body, head, tail). */
function GreatDragon({ x, y }: { x: number; y: number }) {
  const body = { fill: DC.dragon, stroke: INK, strokeWidth: 2.8, strokeLinejoin: 'round' as const }
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      {/* tail hanging down the left side of the keep */}
      <path d="M-30 6 C-60 10 -70 40 -58 70 C-50 90 -66 104 -80 100" fill="none" stroke={INK} strokeWidth={17} strokeLinecap="round" />
      <path
        d="M-30 6 C-60 10 -70 40 -58 70 C-50 90 -66 104 -80 100"
        fill="none"
        stroke={DC.dragon}
        strokeWidth={11.5}
        strokeLinecap="round"
      />
      <path d="M-62 48 l-8 -4 M-60 64 l-9 1 M-60 30 l-7 -6" stroke={DC.gold} strokeWidth={3} strokeLinecap="round" />
      <path d="M-80 100 L-96 92 L-90 108 L-100 116 L-80 112 Z" fill={DC.gold} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      {/* body draped over the battlements */}
      <path d="M-44 10 C-46 -16 -26 -34 0 -36 C26 -38 46 -22 48 2 C40 10 -36 16 -44 10 Z" {...body} />
      <path d="M-26 6 C-24 -14 -10 -24 6 -24 C22 -24 30 -12 30 4 Z" fill={DC.belly} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M-20 -4 H24 M-22 -14 H18" stroke={DC.bellyDeep} strokeWidth={2} strokeLinecap="round" />
      {/* back spikes */}
      <path
        d="M-40 -14 l-6 -10 l10 4 M-28 -28 l-4 -12 l10 6 M-12 -34 l0 -12 l8 9 M6 -36 l4 -11 l5 10 M24 -32 l8 -9 l2 11"
        fill={DC.gold}
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* front paws hugging the wall */}
      <path
        d="M-34 6 C-36 16 -30 22 -22 20 C-18 26 -10 24 -10 16"
        fill={DC.dragonLight}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path d="M22 8 C22 18 28 22 34 20 C38 26 46 22 44 12" fill={DC.dragonLight} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M-24 20 l-1 4 M-17 22 l0 4 M30 20 l0 4 M38 21 l1 4" stroke={DC.horn} strokeWidth={2.2} strokeLinecap="round" />
      {/* neck rising to the right, head looking down at the chest */}
      <path d="M30 -24 C52 -44 70 -62 92 -64 C104 -64 108 -52 102 -42 C90 -40 70 -30 46 -6 Z" {...body} />
      <path d="M44 -12 C60 -30 76 -44 94 -46" fill="none" stroke={DC.belly} strokeWidth={6} strokeLinecap="round" />
      <g transform="translate(100 -60)">
        <g className="dc-head">
          <path
            d="M-20 -6 C-22 -24 -6 -34 10 -32 C24 -30 32 -20 30 -8 C38 -6 44 2 40 10 C34 18 14 18 4 14 C-8 16 -20 8 -20 -6 Z"
            {...body}
          />
          {/* snout & nostrils */}
          <path d="M20 4 C30 2 40 4 40 10 C34 16 22 16 16 12" fill={DC.dragonLight} stroke="none" />
          <ellipse cx="32" cy="2" rx="1.8" ry="1.3" fill={INK} />
          <ellipse cx="37" cy="4" rx="1.6" ry="1.2" fill={INK} />
          <path d="M14 12 C22 16 32 15 38 10" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          <path d="M24 13 l2 4 l2 -4" fill="#FFFFFF" stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
          {/* horns + ear frill */}
          <path
            d="M-4 -30 C-8 -42 -16 -48 -24 -48 C-18 -42 -14 -36 -12 -28 Z"
            fill={DC.horn}
            stroke={INK}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <path d="M8 -32 C8 -44 2 -52 -4 -56 C4 -54 14 -46 16 -32 Z" fill={DC.horn} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <path d="M-20 -8 L-32 -14 L-26 -4 L-34 2 L-20 2 Z" fill={DC.gold} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          {/* big friendly eye with a wink-ready lid */}
          <ellipse cx="8" cy="-12" rx="8" ry="9" fill="#FFFFFF" stroke={INK} strokeWidth={2} />
          <ellipse cx="10" cy="-10" rx="4.4" ry="5.4" fill={INK} />
          <circle cx="8.4" cy="-12.6" r="1.8" fill="#FFFFFF" />
          <path className="dc-blink" d="M0 -14 C0 -22 16 -22 16 -14 Z" fill={DC.dragon} />
          <path d="M-2 -24 q8 -5 16 -2" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
          <ellipse cx="20" cy="0" rx="4" ry="2.4" fill={DC.cheek} opacity={0.8} />
          {/* little heart puff */}
          <path
            className="dc-heart"
            d="M46 -8 c0 -4 6 -4 6 0 c0 -4 6 -4 6 0 c0 4 -6 8 -6 8 c0 0 -6 -4 -6 -8 Z"
            fill="#FF6F91"
            stroke={INK}
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
        </g>
      </g>
    </g>
  )
}

/** The grand Dragon Castle at the summit. Base line at y. */
function DragonCastle({ x, y }: { x: number; y: number }) {
  const st = { fill: DC.stone, stroke: INK, strokeWidth: 2.6, strokeLinejoin: 'round' as const }
  const roof = { fill: DC.roof, stroke: INK, strokeWidth: 2.6, strokeLinejoin: 'round' as const }
  const merlons = (x0: number, x1: number, top: number, w = 10, gap = 7) => {
    const out: ReactNode[] = []
    for (let mx = x0; mx + w <= x1 + 0.1; mx += w + gap)
      out.push(<rect key={mx} x={mx} y={top - 9} width={w} height={10} rx="1.5" {...st} strokeWidth={2.1} />)
    return out
  }
  const window = (wx: number, wy: number, w = 7, h = 16, key = '') => (
    <g key={key}>
      <path
        d={`M${wx - w} ${wy} V${wy - h + w} A${w} ${w} 0 0 1 ${wx + w} ${wy - h + w} V${wy} Z`}
        fill={DC.goldLight}
        stroke={INK}
        strokeWidth={2}
      />
      <path d={`M${wx} ${wy - h + 1} V${wy}`} stroke={INK} strokeWidth={1.3} />
    </g>
  )
  const tower = (tx: number, w: number, top: number, roofH: number, flag: string, key: string) => (
    <g key={key}>
      <rect x={tx - w / 2} y={top} width={w} height={-top + 4} {...st} />
      <rect x={tx + w / 6} y={top} width={w / 3} height={-top + 4} fill={DC.stoneShade} opacity={0.55} />
      <path d={`M${tx - w / 2 - 7} ${top + 4} L${tx} ${top - roofH} L${tx + w / 2 + 7} ${top + 4} Z`} {...roof} />
      <path d={`M${tx} ${top - roofH} L${tx + w / 2 + 7} ${top + 4} H${tx + w / 6} Z`} fill={DC.roofDeep} opacity={0.45} />
      <path d={`M${tx - w / 4} ${top - 6} L${tx - 4} ${top - roofH * 0.6}`} stroke={DC.roofLight} strokeWidth={2.4} strokeLinecap="round" />
      <rect x={tx - w / 2 - 8} y={top - 2} width={w + 16} height="8" rx="3" fill={DC.goldDeep} stroke={INK} strokeWidth={2.2} />
      <path d={`M${tx} ${top - roofH} V${top - roofH - 22}`} stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={tx} cy={top - roofH} r="3.6" fill={DC.gold} stroke={INK} strokeWidth={1.6} />
      <path
        className="map-flag"
        d={`M${tx} ${top - roofH - 22} L${tx + 22} ${top - roofH - 16} L${tx} ${top - roofH - 10} Z`}
        fill={flag}
        stroke={INK}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      {window(tx, top + 40, 6, 16, `${key}w1`)}
      <circle className="dc-glow" cx={tx} cy={top + 32} r="18" fill="url(#dc-glow-warm)" />
    </g>
  )
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      <ellipse cx="0" cy="10" rx="200" ry="22" fill="rgba(60,40,30,.26)" />
      {/* outer towers */}
      {tower(-160, 46, -150, 64, DC.tentB, 't1')}
      {tower(160, 46, -150, 64, DC.tentB, 't2')}
      {/* curtain wall */}
      {merlons(-140, 140, -86)}
      <rect x="-142" y="-86" width="284" height="90" {...st} />
      <path d="M-142 -40 H142 M-100 -86 V-40 M-50 -40 V4 M0 -86 V-40 M50 -40 V4 M100 -86 V-40" stroke={DC.stoneShade} strokeWidth={1.6} />
      <path d="M-142 -16 H142 V4 H-142 Z" fill={DC.stoneShade} opacity={0.45} />
      {/* inner towers */}
      {tower(-96, 40, -176, 56, DC.roof, 't3')}
      {tower(96, 40, -176, 56, DC.roof, 't4')}
      {/* keep */}
      <rect x="-56" y="-188" width="112" height="140" {...st} />
      <rect x="14" y="-188" width="42" height="140" fill={DC.stoneShade} opacity={0.5} />
      {merlons(-58, 56, -188, 12, 8)}
      {/* central spire with golden roof */}
      <rect x="-22" y="-238" width="44" height="54" {...st} />
      <path d="M-30 -234 L0 -300 L30 -234 Z" fill={DC.gold} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <path d="M0 -300 L30 -234 H6 Z" fill={DC.goldDeep} opacity={0.55} />
      <path d="M-14 -246 L-4 -276" stroke={DC.goldLight} strokeWidth={2.6} strokeLinecap="round" />
      <path d="M0 -300 V-326" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <path
        className="map-flag"
        d="M0 -326 L34 -318 L22 -312 L34 -304 L0 -304 Z"
        fill={DC.roof}
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path d="M8 -320 l4 4 l4 -4" fill="none" stroke={DC.goldLight} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      {window(0, -196, 7, 18, 'sw')}
      <circle className="dc-glow" cx="0" cy="-206" r="20" fill="url(#dc-glow-warm)" />
      {/* keep windows with heraldic banners */}
      {window(-30, -120, 7, 20, 'kw1')}
      {window(30, -120, 7, 20, 'kw2')}
      {[-30, 30].map((bx) => (
        <g key={bx} transform={`translate(${bx} -96)`}>
          <path d="M-10 0 H10 V30 L0 38 L-10 30 Z" fill={bx < 0 ? DC.roof : DC.tentB} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <path d="M-4 10 C-4 18 0 22 0 22 C0 22 4 18 4 10 Z" fill={DC.gold} stroke={INK} strokeWidth={1.4} />
        </g>
      ))}
      {/* the great gate */}
      <circle className="dc-gate-glow" cx="-12" cy="-30" r="58" fill="url(#dc-glow-gold)" />
      <path d="M-46 4 V-44 C-46 -70 -12 -82 -12 -82 C-12 -82 22 -70 22 -44 V4 Z" fill={DC.stoneLight} stroke={INK} strokeWidth={2.6} />
      <path d="M-38 4 V-42 C-38 -62 -12 -72 -12 -72 C-12 -72 14 -62 14 -42 V4 Z" fill={DC.woodDeep} stroke={INK} strokeWidth={2.4} />
      <path className="dc-gate-glow" d="M-36 4 V-41 C-36 -60 -12 -70 -12 -70 C-12 -70 12 -60 12 -41 V4 Z" fill="url(#dc-glow-gold)" />
      <path
        d="M-30 -60 V-50 M-21 -66 V-50 M-12 -70 V-50 M-3 -66 V-50 M6 -60 V-50 M-36 -52 H12"
        stroke={INK}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.7}
      />
      {/* dragon-head keystone */}
      <g transform="translate(-12 -84)">
        <path
          d="M-12 0 C-12 -10 -6 -16 0 -16 C6 -16 12 -10 12 0 C8 6 -8 6 -12 0 Z"
          fill={DC.gold}
          stroke={INK}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <path
          d="M-8 -14 L-12 -22 L-4 -16 Z M8 -14 L12 -22 L4 -16 Z"
          fill={DC.goldLight}
          stroke={INK}
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
        <circle cx="-4" cy="-6" r="1.6" fill={INK} />
        <circle cx="4" cy="-6" r="1.6" fill={INK} />
        <path d="M-4 0 q4 3 8 0" fill="none" stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
      </g>
      {/* torches beside the gate */}
      {[-56, 32].map((tx) => (
        <g key={tx} transform={`translate(${tx} -36)`}>
          <circle className="dc-glow" cx="0" cy="-8" r="18" fill="url(#dc-glow-fire)" />
          <path d="M-3 0 H3 L1.5 10 H-1.5 Z" fill={DC.woodDeep} stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
          <path className="dc-flicker" d="M0 -12 C5 -7 5 -3 0 0 C-5 -3 -5 -7 0 -12 Z" fill={DC.flame} stroke={INK} strokeWidth={1.3} />
        </g>
      ))}
      {/* side windows in the curtain wall */}
      {window(-112, -46, 6, 16, 'cw1')}
      {window(112, -46, 6, 16, 'cw2')}
      {window(-70, -50, 6, 16, 'cw3')}
      {window(70, -50, 6, 16, 'cw4')}
    </g>
  )
}

/** Grand stairs with a red carpet along the last stretch to the gate. */
function CarpetStairs({ d }: { d: string }) {
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={46} strokeLinecap="butt" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={DC.stone} strokeWidth={40} strokeLinecap="butt" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={DC.stoneShade} strokeWidth={40} strokeDasharray="2.5 9" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={DC.goldDeep} strokeWidth={26} strokeLinejoin="round" />
      <path d={d} fill="none" stroke={DC.carpet} strokeWidth={21} strokeLinejoin="round" />
      <path d={d} fill="none" stroke={DC.carpetDeep} strokeWidth={21} strokeDasharray="2 9" strokeLinejoin="round" opacity={0.6} />
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

export function MapArtDragonCastle({ height, pts, walkedTo, stones }: MapArtProps) {
  const rand = seeded(88)
  const chest = chestSpot(pts)
  const skyEnd = chest.y - 40
  const S = (i: number) => pts[Math.max(1, Math.min(stones, i))]
  const H = height
  const end = pts[stones + 1]

  // ---- set-piece anchors
  const streamY = pointOn(pts, 0, 0.4).y - 14
  const nest = { x: 98, y: (S(2).y + S(3).y) / 2 + 30 }
  const camp = { x: 300, y: (S(5).y + S(6).y) / 2 + 26 }
  const cave = { x: 92, y: (S(8).y + S(9).y) / 2 + 10 }
  const statue = { x: 66, y: S(10).y + 20 }
  const garden = { x: 300, y: (S(11).y + S(12).y) / 2 + 20 }
  const castle = { x: MAP_W / 2, y: chest.y - 20 }

  const near = (p: Pt, c: Pt, rx: number, ry: number) => ((p.x - c.x) / rx) ** 2 + ((p.y - c.y) / ry) ** 2 < 1
  const blocked = (p: Pt) => {
    if (p.y < skyEnd + 110 || p.y > streamY - 30) return true
    if (near(p, nest, 120, 70)) return true
    if (near(p, camp, 130, 130)) return true
    if (near(p, cave, 140, 120)) return true
    if (near(p, statue, 60, 60)) return true
    if (near(p, garden, 120, 80)) return true
    return false
  }

  const spots = scatterSpots({ pts, stones, rand, perSide: 1, clear: 56, gap: 66, spread: 80, blocked })
  const deco: { y: number; node: ReactNode }[] = spots.map((p, k) => {
    const r = rand()
    const node =
      r < 0.4 ? (
        <SunTree key={`t${k}`} x={p.x} y={p.y} s={0.82 + rand() * 0.2} flip={p.side < 0} />
      ) : r < 0.6 ? (
        <Bush key={`b${k}`} x={p.x} y={p.y} s={0.95} />
      ) : r < 0.74 ? (
        <g key={`f${k}`}>
          <Flowers x={p.x - 8} y={p.y} c="#FF8FB0" />
          <Flowers x={p.x + 8} y={p.y + 6} c="#B58BFF" />
        </g>
      ) : (
        <CoinPile key={`c${k}`} x={p.x} y={p.y} s={1} />
      )
    return { y: p.y, node }
  })
  deco.push({ y: nest.y, node: <EggNest key="nest" x={nest.x} y={nest.y} /> })
  deco.push({ y: camp.y + 40, node: <KnightsCamp key="camp" x={camp.x} y={camp.y} /> })
  deco.push({ y: statue.y, node: <DragonStatue key="statue" x={statue.x} y={statue.y} s={0.95} /> })
  deco.push({ y: garden.y + 40, node: <DragonFountainGarden key="garden" x={garden.x} y={garden.y} /> })
  deco.push({ y: S(1).y + 40, node: <SunTree key="t-s1" x={360} y={S(1).y + 40} s={0.95} /> })
  deco.push({ y: S(7).y + 10, node: <SunTree key="t-s7" x={52} y={S(7).y + 10} s={0.9} /> })
  // braziers flanking the grand stairs
  deco.push({ y: S(12).y + 40, node: <Brazier key="br1" x={S(12).x - 40} y={S(12).y + 40} s={1.05} /> })
  deco.sort((a, b) => a.y - b.y)

  // ---- ground texture
  const groundCover: ReactNode[] = []
  const flowerColors = ['#FF8FB0', '#FFFFFF', '#B58BFF', '#FF7A4E']
  for (let i = 0; i < stones * 6; i++) {
    const x = 10 + rand() * (MAP_W - 20)
    const y = skyEnd + 60 + rand() * (H - skyEnd - 80)
    if (pts.some((q) => Math.hypot(q.x - x, q.y - y) < 40)) continue
    if (near({ x, y }, cave, 120, 100) || near({ x, y }, garden, 100, 60) || near({ x, y }, nest, 96, 40)) continue
    if (Math.abs(y - streamY - 16) < 26) continue
    const pick = rand()
    if (pick < 0.55) {
      groundCover.push(
        <path
          key={`g${i}`}
          d={`M${f(x - 5)} ${f(y)} q2 -7 3 -9 M${f(x)} ${f(y)} q0 -8 1 -11 M${f(x + 5)} ${f(y)} q-2 -7 -3 -9`}
          stroke={DC.grass}
          strokeWidth={1.9}
          fill="none"
          strokeLinecap="round"
        />,
      )
    } else if (pick < 0.85) {
      groundCover.push(<Flowers key={`f${i}`} x={x} y={y} c={flowerColors[i % flowerColors.length]} />)
    } else {
      groundCover.push(<ellipse key={`c${i}`} cx={f(x)} cy={f(y)} rx="4.5" ry="2.3" fill={DC.gold} stroke={INK} strokeWidth={1.1} />)
    }
  }
  const patches: ReactNode[] = []
  for (let k = 0; k < 16; k++) {
    const x = rand() * MAP_W
    const y = skyEnd + 80 + rand() * (H - skyEnd - 100)
    patches.push(
      <ellipse
        key={`p${k}`}
        cx={f(x)}
        cy={f(y)}
        rx={f(60 + rand() * 60)}
        ry={f(26 + rand() * 20)}
        fill={k % 2 ? 'url(#dc-patch-light)' : 'url(#dc-patch-dark)'}
      />,
    )
  }
  // golden sparkles drifting up toward the castle
  const sparkles: ReactNode[] = []
  for (let k = 0; k < 14; k++) {
    const x = 20 + rand() * (MAP_W - 40)
    const y = skyEnd + 100 + rand() * (H - skyEnd - 300)
    sparkles.push(
      <path
        key={`sp${k}`}
        className="dc-twinkle"
        style={{ animationDelay: `${f(-rand() * 4)}s` }}
        d={`M${f(x)} ${f(y - 6)} l1.6 4.4 l4.4 1.6 l-4.4 1.6 l-1.6 4.4 l-1.6 -4.4 l-4.4 -1.6 l4.4 -1.6 Z`}
        fill="#FFF6C8"
      />,
    )
  }

  // ---- trail
  const lastStone = Math.min(stones, pts.length - 2)
  const road = pathD(pts, 0, lastStone)
  const stairs = pathD(pts, lastStone, stones + 1)
  const walked = walkedTo > 0 ? pathD(pts, 0, Math.min(walkedTo, stones + 1)) : ''

  return (
    <svg className="map__art" viewBox={`0 0 ${MAP_W} ${H}`} aria-hidden="true">
      <defs>
        <linearGradient id="dc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={DC.skyTop} />
          <stop offset="0.38" stopColor={DC.skyMid} />
          <stop offset="0.74" stopColor={DC.skyLow} />
          <stop offset="1" stopColor={DC.skyHorizon} />
        </linearGradient>
        <linearGradient id="dc-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={DC.groundTop} />
          <stop offset="0.35" stopColor={DC.groundMid} />
          <stop offset="1" stopColor={DC.groundBottom} />
        </linearGradient>
        <linearGradient id="dc-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={DC.waterLight} />
          <stop offset="0.5" stopColor={DC.water} />
          <stop offset="1" stopColor={DC.waterDeep} />
        </linearGradient>
        <linearGradient id="dc-sunlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`rgb(${DC.meadowLight})`} stopOpacity="0.55" />
          <stop offset="1" stopColor={`rgb(${DC.meadowLight})`} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="dc-sun-glow">
          <stop offset="0" stopColor={`rgb(${DC.sunGlow})`} stopOpacity="0.9" />
          <stop offset="0.45" stopColor={`rgb(${DC.sunGlow})`} stopOpacity="0.3" />
          <stop offset="1" stopColor={`rgb(${DC.sunGlow})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dc-glow-warm">
          <stop offset="0" stopColor="#FFE38A" stopOpacity="0.75" />
          <stop offset="1" stopColor="#FFE38A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dc-glow-fire">
          <stop offset="0" stopColor="#FFB238" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFB238" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dc-glow-gold">
          <stop offset="0" stopColor="#FFF3B0" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#FFD24A" stopOpacity="0.45" />
          <stop offset="1" stopColor="#FFD24A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dc-ridge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={DC.grassLight} stopOpacity="0.5" />
          <stop offset="1" stopColor={DC.grassLight} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="dc-patch-light">
          <stop offset="0" stopColor={DC.grassLight} stopOpacity="0.55" />
          <stop offset="1" stopColor={DC.grassLight} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dc-patch-dark">
          <stop offset="0" stopColor={DC.grass} stopOpacity="0.45" />
          <stop offset="1" stopColor={DC.grass} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dc-stone-light">
          <stop offset="0" stopColor="#FFF6D0" stopOpacity="0.6" />
          <stop offset="1" stopColor="#FFF6D0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. meadow + sunset sky */}
      <rect width={MAP_W} height={H} fill="url(#dc-ground)" />
      <rect width={MAP_W} height={skyEnd + 14} fill="url(#dc-sky)" />

      {/* setting sun with slowly turning rays */}
      <g transform={`translate(${MAP_W / 2} ${castle.y - 300})`}>
        <circle r="190" fill="url(#dc-sun-glow)" />
        <g className="dc-rays">
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d="M-14 -70 L0 -260 L14 -70 Z" fill="rgba(255,236,170,.22)" transform={`rotate(${i * 30})`} />
          ))}
        </g>
        <circle r="62" fill={DC.sun} stroke="rgba(47,36,32,.35)" strokeWidth={2} />
        <circle r="50" fill="#FFF8D8" />
      </g>

      {/* fireworks (go wild once the chest is ready) */}
      <Firework x={60} y={70} color={DC.fire1} s={1} delay={0} />
      <Firework x={344} y={60} color={DC.fire2} s={1.1} delay={-0.9} />
      <Firework x={262} y={30} color={DC.fire3} s={0.65} delay={-1.6} />
      <Firework x={130} y={28} color={DC.fire4} s={0.6} delay={-2.2} />
      <Firework x={370} y={170} color={DC.fire4} s={0.55} delay={-0.4} />
      <Firework x={28} y={186} color={DC.fire3} s={0.55} delay={-1.2} />

      {/* sunset clouds and tiny dragons */}
      <Cloud x={26} y={castle.y - 250} s={0.9} />
      <Cloud x={384} y={castle.y - 268} s={0.85} flip />
      <Cloud x={200} y={40} s={0.55} />
      <SkyDragon x={58} y={castle.y - 340} s={0.85} delay={-0.6} />
      <SkyDragon x={300} y={castle.y - 400} s={0.7} flip color={'#3F9A5B'} delay={-1.9} />

      {/* distant mountains */}
      <path
        d={`M0 ${skyEnd - 40} L40 ${skyEnd - 90} L76 ${skyEnd - 60} L120 ${skyEnd - 110} L160 ${skyEnd - 64} L240 ${skyEnd - 64} L282 ${skyEnd - 112} L322 ${skyEnd - 70} L360 ${skyEnd - 98} L${MAP_W} ${skyEnd - 52} V${skyEnd + 20} H0 Z`}
        fill={DC.mountain}
        stroke="rgba(47,36,32,.35)"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d={`M40 ${skyEnd - 90} L52 ${skyEnd - 74} L46 ${skyEnd - 70} M120 ${skyEnd - 110} L134 ${skyEnd - 92} L124 ${skyEnd - 88} M282 ${skyEnd - 112} L296 ${skyEnd - 94} L286 ${skyEnd - 90}`}
        fill="none"
        stroke="#FFD1B8"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M0 ${skyEnd - 10} Q100 ${skyEnd - 50} 200 ${skyEnd - 30} Q300 ${skyEnd - 50} ${MAP_W} ${skyEnd - 14} V${skyEnd + 24} H0 Z`}
        fill={DC.mountainDeep}
        opacity={0.75}
      />

      {/* 2. the great dragon's wings behind the castle */}
      <DragonWings x={castle.x + 6} y={castle.y - 196} />

      {/* 3. castle hill */}
      <path
        d={`M0 ${skyEnd + 20} C90 ${skyEnd - 24} 310 ${skyEnd - 24} ${MAP_W} ${skyEnd + 20} V${skyEnd + 80} H0 Z`}
        fill={DC.groundTop}
        stroke="rgba(47,36,32,.3)"
        strokeWidth={2}
      />
      <rect y={skyEnd} width={MAP_W} height={260} fill="url(#dc-sunlight)" />

      {/* 4. rolling hills + ground texture */}
      {[S(2).y - 70, S(5).y - 40, S(8).y - 60, S(11).y - 40].map((ry, k) => {
        const d =
          k % 2
            ? `M-10 ${f(ry - 10)} C110 ${f(ry + 30)} 260 ${f(ry - 40)} 410 ${f(ry + 10)}`
            : `M-10 ${f(ry + 10)} C120 ${f(ry - 40)} 280 ${f(ry + 30)} 410 ${f(ry - 14)}`
        return (
          <g key={`ridge${k}`}>
            <path d={`${d} V${f(ry + 90)} H-10 Z`} fill="url(#dc-ridge)" />
            <path d={d} fill="none" stroke={DC.grassLight} strokeWidth={3} opacity={0.7} />
            <path d={d} fill="none" stroke="rgba(47,36,32,.12)" strokeWidth={2} transform="translate(0 -3)" />
          </g>
        )
      })}
      {patches}
      {groundCover}
      {sparkles}

      {/* 5. stream at the start */}
      <Stream y={streamY} rand={rand} />

      {/* warm light under every puzzle stone */}
      {pts.slice(1, stones + 1).map((p, i) => (
        <ellipse key={`l${i}`} cx={p.x} cy={p.y + 6} rx={56} ry={32} fill="url(#dc-stone-light)" />
      ))}

      {/* 6. sandstone road + carpet stairs to the gate */}
      <path
        d={road}
        fill="none"
        stroke="rgba(60,40,30,.22)"
        strokeWidth={44}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(4 6)"
      />
      <path d={road} fill="none" stroke={INK} strokeWidth={38} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={DC.roadEdge} strokeWidth={32} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={DC.road} strokeWidth={25} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={DC.roadPaver} strokeWidth={17} strokeDasharray="10 5" strokeLinejoin="round" />
      <CarpetStairs d={stairs} />
      <PlankBridge pts={pts} y0={streamY - 16} y1={streamY + 46} />
      {walked && (
        <path d={walked} fill="none" stroke="#C9372C" strokeWidth={5} strokeLinecap="round" strokeDasharray="10 12" opacity={0.85} />
      )}

      {/* 7. treasure cave (beside the trail) + y-sorted decor */}
      <TreasureCave x={cave.x} y={cave.y} rand={rand} />
      {deco.map((d) => d.node)}

      {/* festive garlands across the parade route */}
      {[2, 6, 9]
        .filter((seg) => seg < stones)
        .map((seg) => (
          <TrailGarland key={`tg${seg}`} pts={pts} seg={seg} />
        ))}

      {/* 8. start area */}
      <SunTree x={36} y={H - 20} s={0.9} />
      <Bush x={258} y={H - 24} s={1} />
      <Tent x={344} y={H - 36} s={0.8} color={DC.tentA} />
      <BannerPole x={pts[0].x + 40} y={pts[0].y + 6} s={0.9} />
      <Signpost x={pts[0].x - 74} y={pts[0].y - 6} />

      {/* 9. summit: castle + great dragon */}
      <DragonCastle x={castle.x} y={castle.y} />
      <GreatDragon x={castle.x} y={castle.y - 194} />
      <Bunting a={{ x: 40, y: castle.y - 150 }} b={{ x: 104, y: castle.y - 176 }} sag={6} n={5} />
      <Bunting a={{ x: 296, y: castle.y - 176 }} b={{ x: 360, y: castle.y - 150 }} sag={6} n={5} />
      <Brazier x={end.x - 62} y={end.y + 8} s={1} />
      <BannerPole x={MAP_W - 26} y={chest.y + 50} s={1} />
      <BannerPole x={24} y={chest.y + 50} s={1} color={DC.tentB} flip />
    </svg>
  )
}
