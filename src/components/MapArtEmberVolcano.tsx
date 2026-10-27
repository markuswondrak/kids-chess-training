/**
 * REFERENCE – Glutvulkan (Ember Volcano): eigenständige Vulkanszene der Karte – warmer Glut-Abendhimmel
 * mit Kratersonne, rauchender Stratovulkan und gestufte Basalt-Tafelberge mit Lavakaskaden am Horizont,
 * großer Vulkankrater mit Lavagraben, Steinbogenbrücke, Obsidian-Hörnertor und hängenden Feuerkesseln
 * an der Truhe, offene Kuppel-Schmelzesse mit Lavarad, Blasebalg, Amboss und Löscheimer am Start,
 * blubbernder Lavasee mit Feuersalamander, kleine Schildkröte mit Glutschale, Drachenblutbäume,
 * Basalt-Orgelpfeifen, Flammen-Agaven, aufgebrochene Magma-Geoden, Geysir-Schlote, zweistufige
 * Lavakaskade, schwebende Glut-Funken und der Wolkeninseln-Teaser (Welt 6).
 * Props wie `MapArt`. Zufall nur über `seeded()`.
 *
 * Port 1:1 to `src/components/MapArtEmberVolcano.tsx`; only change the import below to `../game/mapPath`.
 * Bildsprache: art-guide.md (Feature 007).
 */
import type { ReactNode } from 'react'
import { MAP_W, chestSpot, pathD, pointOn, seeded, type Pt } from '../game/mapPath'

const INK = '#2F2420'

/** Ember Volcano palette – shared values mirror tokens.css (see art-guide.md §2). */
export const EV = {
  skyTop: '#7D4858',
  skyMid: '#B86852',
  skyLow: '#E49B62',
  skyHorizon: '#F7CA88',
  sun: '#FFF2C6',
  sunGlow: '255,220,140',
  cloud: '#FFF3E2',
  cloudShade: '#F0D2BA',
  farPeak: '#B38C98',
  farPeakShade: '#9A7380',
  midPeak: '#9C6252',
  midPeakShade: '#7F4C3E',
  nearPeak: '#5C4648',
  nearPeakShade: '#433234',
  haze: '#F5C896',
  ashWarm: '#DFBA96',
  ashDeep: '#C49A76',
  ashLight: '#F2DEC4',
  ashShade: '#C9A382',
  ashStone: '#E8CFB2',
  ashStoneMid: '#BFA189',
  ashStoneDeep: '#8F725D',
  floorTop: '#DFBA96',
  floorBottom: '#C49A76',
  floorPatch: 'rgba(110,72,48,.14)',
  clearing: 'rgba(255,238,210,.38)',
  trail: '#F2DEC4',
  trailEdge: '#9E7B66',
  trailDash: '#C9A686',
  basalt: '#6E5A58',
  basaltLight: '#8C7774',
  basaltDeep: '#4E3D3C',
  obsidian: '#463942',
  obsidianLight: '#63525E',
  obsidianDeep: '#31262E',
  keepRoof: '#8C2D22',
  keepRoofDeep: '#661E16',
  keepTrim: '#E49B62',
  magma: '#FF7A33',
  magmaDeep: '#D94B26',
  magmaGold: '#FFD466',
  magmaPale: '#FFF6D6',
  magmaCrust: '#8C3522',
  magmaGlow: '255,150,60',
  glowWarm: '255,200,100',
  dragonBark: '#7A5448',
  dragonBarkDeep: '#563830',
  dragonLeaf: '#C83E2B',
  dragonLeafLight: '#EB6A38',
  dragonLeafDeep: '#8F2619',
  agave: '#B8332A',
  agaveTip: '#6E2B3E',
  agaveCore: '#F59A2E',
  geodeOuter: '#5C4948',
  geodeRim: '#D99B66',
  geodeInner: '#A8261E',
  crystal: '#FF6B35',
  crystalLight: '#FFB84D',
  crystalDeep: '#C83722',
  crystalSparkle: '#FFF3B8',
  sulfur: '#E8B84B',
  kilnStone: '#78625E',
  kilnStoneLight: '#967E78',
  kilnStoneDeep: '#52413E',
  timber: '#8A4F36',
  timberDeep: '#633622',
  iron: '#433A42',
  ironLight: '#8E9CAB',
  water: '#7FB2AE',
  smoke: '#D8C2B8',
  smokeDeep: '#B89E94',
  salamander: '#FF6B35',
  salamanderDeep: '#D94B26',
  salamanderBelly: '#FFD466',
  salamanderGill: '#FF4726',
  cheek: '#FF9E99',
  flag: '#C9372C',
  pennant: '#F3B630',
  cloudIsleRock: '#8A9BB5',
  cloudIsleRockDeep: '#687A96',
  cloudIsleGrass: '#7BCB6A',
  cloudIsleTower: '#FBF6EA',
  cloudIsleRoof: '#3E7CB8',
  cloudIsleWater: '#82D1F7',
  cloudWhite: '#FFFDF7',
  cloudGold: '#F7E1B5',
}

/** Warm brown-red ground shadow on volcanic floor (art-guide §3.2). */
const Shadow = ({ rx, ry = rx / 3.4 }: { rx: number; ry?: number }) => (
  <ellipse cx="0" cy="2" rx={rx} ry={ry} fill="rgba(70,36,24,.18)" />
)

// ---------------------------------------------------------------- primitives

/**
 * Volcanic Dragon-Blood Tree (Drachenblutbaum): stout forked trunk with upturned branches
 * carrying flat, saucer-shaped crimson-and-amber umbrella canopies and glowing ember berries.
 */
function DragonTree({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={24} />
      {/* stout base + Y-forked branches */}
      <path
        d="M-6 2 C-5 -12 -4 -22 -2 -30 L-16 -46 L-12 -49 L0 -35 L13 -48 L17 -45 L3 -30 C4 -22 5 -12 6 2 Z"
        fill={EV.dragonBark}
        stroke={INK}
        strokeWidth={2.3}
        strokeLinejoin="round"
      />
      <path d="M1 -30 L13 -46 L16 -44 L4 -28 V2 H1 Z" fill={EV.dragonBarkDeep} opacity={0.55} />
      <path d="M0 -33 V-54" stroke={INK} strokeWidth={5.2} strokeLinecap="round" />
      <path d="M0 -33 V-54" stroke={EV.dragonBark} strokeWidth={2.4} strokeLinecap="round" />
      {/* left saucer canopy */}
      <path
        d="M-32 -45 C-32 -55 -2 -55 -2 -45 C-8 -41 -26 -41 -32 -45 Z"
        fill={EV.dragonLeaf}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path d="M-27 -48 q10 -4 20 0" stroke={EV.dragonLeafLight} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {/* right saucer canopy */}
      <path
        d="M2 -44 C2 -54 32 -54 32 -44 C26 -40 8 -40 2 -44 Z"
        fill={EV.dragonLeaf}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path d="M7 -47 q10 -4 20 0" stroke={EV.dragonLeafLight} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {/* central top umbrella crown */}
      <path
        d="M-24 -54 C-26 -68 26 -68 24 -54 C14 -49 -14 -49 -24 -54 Z"
        fill={EV.dragonLeafLight}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path d="M-22 -54 C-10 -50 10 -50 22 -54 L18 -51 C8 -48 -8 -48 -18 -51 Z" fill={EV.dragonLeafDeep} />
      <path d="M-15 -61 q15 -5 30 0" stroke={EV.magmaGold} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.85} />
      {/* glowing ember berries hanging under the canopy */}
      {[
        [-18, -42],
        [-12, -41],
        [14, -41],
        [20, -42],
        [-5, -50],
        [5, -50],
      ].map(([bx, by], i) => (
        <circle key={i} cx={bx} cy={by} r={2} fill={EV.magmaGold} stroke={INK} strokeWidth={1} />
      ))}
    </g>
  )
}

/**
 * Asymmetric organ-pipe cluster of hexagonal basalt columns with flat tilted geometric tops
 * and glowing magma cracks at the base.
 */
function BasaltColumns({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  const cols: [number, number, number, string][] = [
    [-11, 14, 34, EV.basalt],
    [9, 14, 46, EV.basalt],
    [-1, 15, 60, EV.basaltLight],
    [17, 11, 24, EV.basaltDeep],
    [-19, 11, 20, EV.basaltDeep],
  ]
  const order = [2, 1, 0, 3, 4]
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={25} />
      {order.map((idx) => {
        const [cx, w, h, fill] = cols[idx]
        const hw = w / 2
        return (
          <g key={idx}>
            <path
              d={`M${cx - hw} 0 V${-h} L${cx} ${-h - 5} L${cx + hw} ${-h} V0 Q${cx} 3 ${cx - hw} 0 Z`}
              fill={fill}
              stroke={INK}
              strokeWidth={2.2}
              strokeLinejoin="round"
            />
            <path d={`M${cx + 1} ${-h - 4} L${cx + hw} ${-h} V0 L${cx + 1} 1 Z`} fill={EV.basaltDeep} opacity={0.48} />
            <path
              d={`M${cx - hw} ${-h} L${cx} ${-h - 5} L${cx + hw} ${-h} L${cx} ${-h + 4} Z`}
              fill={EV.basaltLight}
              stroke={INK}
              strokeWidth={1.6}
              strokeLinejoin="round"
            />
            <path d={`M${cx - hw + 2} ${-h + 5} V-4`} stroke="rgba(255,240,210,.35)" strokeWidth={1.5} strokeLinecap="round" />
          </g>
        )
      })}
      <path className="ev-lava" d="M-12 -2 l6 -5 l5 2 l6 -4" stroke={EV.magmaGold} strokeWidth={1.8} fill="none" strokeLinecap="round" />
    </g>
  )
}

/**
 * Spiky rosette of curved flame-agave succulent blades (`FlameAgave`) with a glowing ember flower stalk.
 * Replaces generic round shrubs with a sharp, unmistakable volcanic desert silhouette.
 */
function FlameAgave({ x, y, s = 1, stalk = true }: { x: number; y: number; s?: number; stalk?: boolean }) {
  const blades: [string, string][] = [
    ['M-3 0 C-14 -2 -24 -8 -27 -16 C-18 -16 -9 -10 -1 -2 Z', EV.agave],
    ['M3 0 C14 -2 24 -8 27 -16 C18 -16 9 -10 1 -2 Z', EV.agave],
    ['M-2 0 C-10 -8 -17 -18 -18 -28 C-10 -24 -4 -14 0 -3 Z', EV.dragonLeafLight],
    ['M2 0 C10 -8 17 -18 18 -28 C10 -24 4 -14 0 -3 Z', EV.dragonLeafLight],
    ['M-3 0 C-5 -12 -4 -24 0 -33 C4 -24 5 -12 3 0 Z', EV.agaveCore],
  ]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow rx={22} />
      {stalk && (
        <g>
          <path d="M0 -24 V-48" stroke={INK} strokeWidth={4} strokeLinecap="round" />
          <path d="M0 -24 V-48" stroke={EV.dragonBark} strokeWidth={1.8} strokeLinecap="round" />
          {/* glowing ember-flower pods on the stalk */}
          <ellipse className="ev-lava" cx="-5" cy="-40" rx="3.5" ry="2.4" fill={EV.magmaGold} stroke={INK} strokeWidth={1.3} />
          <ellipse className="ev-lava" cx="5" cy="-43" rx="3.5" ry="2.4" fill={EV.magmaGold} stroke={INK} strokeWidth={1.3} />
          <circle className="ev-lava" cx="0" cy="-50" r="3.8" fill={EV.magma} stroke={INK} strokeWidth={1.4} />
          <circle cx="0" cy="-50" r="1.6" fill={EV.magmaPale} />
        </g>
      )}
      {blades.map(([d, fill], i) => (
        <path key={i} d={d} fill={fill} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      ))}
      <path d="M0 -5 V-25" stroke={EV.magmaPale} strokeWidth={1.6} strokeLinecap="round" opacity={0.85} />
    </g>
  )
}

/**
 * Cracked-open round volcanic geode boulder (`MagmaGeode`) split in two halves, revealing
 * a glowing golden-ruby crystal cavity inside.
 */
function MagmaGeode({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow rx={24} />
      <circle className="ev-lava" cx="0" cy="-12" r="24" fill="url(#ev-glow-warm)" />
      {/* left larger geode half */}
      <path
        d="M-22 1 C-25 -12 -18 -26 -6 -27 L-2 -1 Z"
        fill={EV.geodeOuter}
        stroke={INK}
        strokeWidth={2.3}
        strokeLinejoin="round"
      />
      <ellipse cx="-8" cy="-13" rx="6.5" ry="11" transform="rotate(-12 -8 -13)" fill={EV.geodeRim} stroke={INK} strokeWidth={1.8} />
      <ellipse cx="-8" cy="-13" rx="4.5" ry="8.2" transform="rotate(-12 -8 -13)" fill={EV.geodeInner} />
      {/* internal crystal teeth in left half */}
      <path
        className="ev-lava"
        d="M-11 -19 l4 3 l-3 3 l4 2 l-3 4 l5 -1"
        stroke={EV.magmaGold}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* right smaller tilted geode half */}
      <path
        d="M3 1 L7 -20 C17 -19 23 -9 20 1 Z"
        fill={EV.geodeOuter}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <ellipse cx="9" cy="-9" rx="5" ry="8.5" transform="rotate(18 9 -9)" fill={EV.geodeRim} stroke={INK} strokeWidth={1.7} />
      <ellipse cx="9" cy="-9" rx="3.2" ry="6" transform="rotate(18 9 -9)" fill={EV.geodeInner} />
      <path className="ev-lava" d="M8 -13 l3 3 l-2 3 l3 2" stroke={EV.magmaGold} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

/**
 * Twin crusty volcanic fumarole / geyser chimneys (`GeyserVent`) with sulfur-gold mineral rims,
 * glowing orange throats, and rising steam/smoke curls (`.ev-smoke`).
 */
function GeyserVent({ x, y, s = 1, flip = false, smoke = true, delay = 0 }: { x: number; y: number; s?: number; flip?: boolean; smoke?: boolean; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={24} ry={5.5} />
      {smoke && (
        <g transform="translate(-5 -28)">
          <g className="ev-smoke" style={{ animationDelay: `${delay}s` }} fill="none" stroke={EV.smoke} strokeWidth={4.2} strokeLinecap="round">
            <path d="M0 -4 c-6 -7 5 -13 -2 -20 c-6 -7 5 -12 -1 -18" />
          </g>
        </g>
      )}
      {/* taller left mineral cone */}
      <path d="M-19 1 L-12 -22 H-1 L5 1 Z" fill={EV.basalt} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M-4 -22 L-1 -22 L5 1 H-2 Z" fill={EV.basaltDeep} opacity={0.55} />
      <ellipse cx="-6.5" cy="-22" rx="6.5" ry="2.8" fill={EV.sulfur} stroke={INK} strokeWidth={1.7} />
      <ellipse className="ev-lava" cx="-6.5" cy="-22" rx="3.8" ry="1.4" fill={EV.magma} />
      {/* shorter right mineral cone */}
      <path d="M1 2 L6 -13 H15 L20 2 Z" fill={EV.basaltLight} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <ellipse cx="10.5" cy="-13" rx="5.2" ry="2.2" fill={EV.sulfur} stroke={INK} strokeWidth={1.5} />
      <ellipse className="ev-lava" cx="10.5" cy="-13" rx="2.8" ry="1.1" fill={EV.magmaGold} />
      {/* sulfur crust nodules at base */}
      <path d="M-15 1 q7 -4 14 0 q8 -3 16 0" stroke={EV.keepTrim} strokeWidth={2} fill="none" strokeLinecap="round" />
    </g>
  )
}

/**
 * Stepped basalt cliff terrace with a pouring lava waterfall splashing into a glowing rock basin (`LavaCascade`).
 */
function LavaCascade({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={42} ry={8} />
      {/* upper basalt step */}
      <path
        d="M-36 -6 V-32 L-24 -38 H14 L24 -32 V-6 Z"
        fill={EV.basalt}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path d="M6 -38 H14 L24 -32 V-6 H6 Z" fill={EV.basaltDeep} opacity={0.55} />
      <path d="M-36 -32 L-24 -38 H14 L24 -32 L12 -27 H-24 Z" fill={EV.basaltLight} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      {/* lower basalt terrace + catch basin */}
      <path
        d="M-40 2 V-14 L-28 -18 H28 L38 -12 V2 Q0 6 -40 2 Z"
        fill={EV.obsidianLight}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      {/* upper lava pool + pouring lava stream into lower basin */}
      <ellipse cx="-4" cy="-32" rx="14" ry="3.6" fill={EV.magma} stroke={INK} strokeWidth={1.5} />
      <path
        className="ev-lava"
        d="M-10 -31 C-11 -22 -12 -14 -13 -2 L3 -2 C2 -14 1 -22 0 -31 Z"
        fill={EV.magma}
        stroke={INK}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path className="ev-lava" d="M-6 -30 L-7 -3 M-2 -30 L-2 -3" stroke={EV.magmaGold} strokeWidth={2.2} strokeLinecap="round" />
      {/* glowing catch basin at bottom */}
      <ellipse cx="-4" cy="-1" rx="22" ry="5.5" fill={EV.magma} stroke={INK} strokeWidth={1.8} />
      <ellipse className="ev-lava" cx="-4" cy="-1" rx="14" ry="3" fill={EV.magmaGold} />
      <circle className="ev-lava" cx="-12" cy="-2" r="2" fill={EV.magmaPale} />
      <circle className="ev-lava" cx="5" cy="-1" r="1.6" fill={EV.magmaPale} />
    </g>
  )
}

/**
 * Stacked obsidian rune monolith (`ObsidianMonolith`): tall tapered dark glass stone with carved glowing runes.
 */
function ObsidianMonolith({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow rx={17} />
      <ellipse cx="0" cy="-2" rx="15" ry="5.5" fill={EV.basalt} stroke={INK} strokeWidth={2} />
      <path d="M-10 -2 L-7 -34 L0 -41 L7 -34 L10 -2 Z" fill={EV.obsidian} stroke={INK} strokeWidth={2.3} strokeLinejoin="round" />
      <path d="M0 -41 L7 -34 L10 -2 H0 Z" fill={EV.obsidianDeep} opacity={0.6} />
      <path d="M-5 -32 L-1 -37" stroke="rgba(255,240,210,.5)" strokeWidth={1.8} strokeLinecap="round" />
      {/* carved glowing pin/skewer diamond rune */}
      <path
        className="ev-lava"
        d="M0 -29 L4.5 -22 L0 -15 L-4.5 -22 Z M0 -15 V-8"
        stroke={EV.magmaGold}
        strokeWidth={2}
        fill={EV.magma}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  )
}

/** Small glowing ember spark that drifts gently upward (`.ev-ember`). */
function Ember({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="ev-ember" style={{ animationDelay: `${delay}s` }}>
        <path d="M0 -5.5 C2.5 -2 3.8 0.5 3.8 2.6 A3.8 3.8 0 1 1 -3.8 2.6 C-3.8 0.5 -2.5 -2 0 -5.5 Z" fill={EV.magma} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
        <circle cx="0" cy="2.2" r="1.9" fill={EV.magmaGold} />
        <circle cx="-0.6" cy="1.8" r="0.8" fill={EV.magmaPale} />
      </g>
    </g>
  )
}

/** Four-point warm golden crystal sparkle; scales and rotates in place (`.ev-sparkle`). */
function Sparkle({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        className="ev-sparkle"
        style={{ animationDelay: `${delay}s` }}
        d="M0 -8 Q1.2 -1.2 8 0 Q1.2 1.2 0 8 Q-1.2 1.2 -8 0 Q-1.2 -1.2 0 -8 Z"
        fill={EV.crystalSparkle}
        stroke={INK}
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
    </g>
  )
}

/** Bubbling lava lake / magma pool: stepped basalt rim, orange-gold magma, crust lines, rising bubbles (`.ev-bubble`), shimmer (`.ev-lava`). */
function LavaLake({ x, y, rx, ry, seed, children }: { x: number; y: number; rx: number; ry: number; seed: number; children?: ReactNode }) {
  const r = seeded(seed)
  const bubbles = Array.from({ length: 5 }, () => ({
    bx: (r() - 0.5) * rx * 1.25,
    by: (r() - 0.5) * ry * 1.05,
    br: 2.4 + r() * 2.4,
    delay: -r() * 4.4,
  }))
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse rx={rx + 10} ry={ry + 6} cy={3} fill={EV.basalt} stroke={INK} strokeWidth={1.8} />
      <ellipse rx={rx} ry={ry} fill="url(#ev-lava)" stroke={INK} strokeWidth={2.4} />
      <ellipse className="ev-lava" rx={rx - 7} ry={ry - 5} cy={-2} fill="none" stroke={EV.magmaGold} strokeWidth={2} opacity={0.75} />
      <path
        d={`M${-rx * 0.62} ${ry * 0.14} q${rx * 0.22} ${-ry * 0.28} ${rx * 0.44} ${-ry * 0.08} M${rx * 0.15} ${ry * 0.34} q${rx * 0.2} ${-ry * 0.22} ${rx * 0.4} 0`}
        stroke={EV.magmaCrust}
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="ev-lava"
        d={`M${-rx * 0.48} ${-ry * 0.42} q${rx * 0.16} -4 ${rx * 0.32} 0`}
        stroke={EV.magmaPale}
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
        style={{ animationDelay: `${-r() * 3}s` }}
      />
      <path
        className="ev-lava"
        d={`M${rx * 0.18} ${-ry * 0.22} q${rx * 0.14} -3 ${rx * 0.26} 0`}
        stroke={EV.magmaPale}
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
        style={{ animationDelay: `${-r() * 3}s` }}
      />
      {bubbles.map(({ bx, by, br, delay }, i) => (
        <g key={i} transform={`translate(${bx.toFixed(1)} ${by.toFixed(1)})`}>
          <g className="ev-bubble" style={{ animationDelay: `${delay.toFixed(2)}s` }}>
            <circle r={br} fill={EV.magmaGold} stroke={EV.magmaCrust} strokeWidth={1.2} />
            <circle cx={-br * 0.3} cy={-br * 0.3} r={br * 0.32} fill={EV.magmaPale} />
          </g>
        </g>
      ))}
      <path d={`M${rx * 0.52} ${ry * 0.42} q7 -9 16 0 Z`} fill={EV.basaltLight} stroke={INK} strokeWidth={1.5} />
      {children}
    </g>
  )
}

/**
 * Sinuous 3/4-view smiling Fire Salamander lounging on a flat basalt island in the lava lake;
 * dorsal flame crest, curled tail with flame tip, blinking eyes (`.ev-salamander-lid`).
 */
function FireSalamander({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {/* flat basalt basking rock */}
      <ellipse cx="0" cy="4" rx="25" ry="7" fill={EV.basaltDeep} stroke={INK} strokeWidth={1.8} />
      <ellipse cx="0" cy="2" rx="23" ry="5.8" fill={EV.basaltLight} stroke={INK} strokeWidth={1.6} />
      {/* curled sinuous tail + flame tip */}
      <path
        d="M8 -3 C20 -3 27 -12 22 -20 C18 -25 12 -21 15 -16"
        stroke={INK}
        strokeWidth={7}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M8 -3 C20 -3 27 -12 22 -20 C18 -25 12 -21 15 -16"
        stroke={EV.salamander}
        strokeWidth={4.2}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M15 -17 C11 -24 18 -30 23 -32 C24 -26 27 -21 21 -17 Z"
        fill={EV.magmaGold}
        stroke={INK}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {/* dorsal flame-fin along the back */}
      <path
        d="M-2 -14 l3 -5 l3 4 l4 -5 l2 5 l4 -4 l1 5 Z"
        fill={EV.magmaGold}
        stroke={INK}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      {/* elongated lizard body */}
      <path
        d="M-15 1 C-16 -9 -8 -15 2 -14 C12 -13 16 -6 14 1 C8 3 -9 3 -15 1 Z"
        fill={EV.salamander}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path d="M-11 1 C-11 -6 -5 -9 3 -9 C9 -9 11 -5 10 1 Z" fill={EV.salamanderBelly} />
      <circle cx="2" cy="-11" r="1.6" fill={EV.magmaGold} />
      <circle cx="7" cy="-9" r="1.4" fill={EV.magmaGold} />
      {/* four little feet */}
      <path d="M-11 2 q-4 2 -6 0 q2 -3 6 -2 Z M-2 2 q-3 2 -5 0 q2 -3 5 -2 Z M9 2 q4 2 6 0 q-2 -3 -6 -2 Z" fill={EV.salamanderDeep} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
      {/* head turned toward the viewer + external flame gills */}
      <path d="M-18 -19 l-6 -4 l2 5 l-5 1 l6 2 Z M2 -19 l6 -4 l-2 5 l5 1 l-6 2 Z" fill={EV.salamanderGill} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
      <ellipse cx="-8" cy="-18" rx="11" ry="8" fill={EV.salamander} stroke={INK} strokeWidth={2.2} />
      {[-12.2, -3.8].map((ex) => (
        <g key={ex} transform={`translate(${ex} -20)`}>
          <circle r="3.3" fill="#FFFFFF" stroke={INK} strokeWidth={1.5} />
          <circle cx="0.4" cy="0.3" r="1.6" fill={INK} />
          <circle cx="0.9" cy="-0.4" r="0.6" fill="#FFFFFF" />
          <rect className="ev-salamander-lid" transform="scale(1 0)" x="-3.4" y="-3.4" width="6.8" height="6.8" rx="3.4" fill={EV.salamander} stroke={INK} strokeWidth={1.3} />
        </g>
      ))}
      <circle cx="-14.8" cy="-15.8" r="1.7" fill={EV.cheek} opacity={0.85} />
      <circle cx="-1.2" cy="-15.8" r="1.7" fill={EV.cheek} opacity={0.85} />
      <path d="M-11.8 -14.8 Q-8 -11.2 -4.2 -14.8" stroke={INK} strokeWidth={1.7} fill="none" strokeLinecap="round" />
    </g>
  )
}

/**
 * Friendly Magma-Shell Tortoise (`MagmaTortoise`) near the start forge:
 * domed dark basalt shell with glowing golden magma seams, warm orange legs, and a happy smile.
 */
function MagmaTortoise({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow rx={24} ry={5.5} />
      {/* stubby legs & little tail */}
      <path d="M16 -2 L22 -4 L18 0 Z" fill={EV.salamanderDeep} stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
      <rect x="-14" y="-4" width="7" height="6" rx="2.5" fill={EV.salamander} stroke={INK} strokeWidth={1.8} />
      <rect x="6" y="-4" width="7" height="6" rx="2.5" fill={EV.salamander} stroke={INK} strokeWidth={1.8} />
      {/* head poking out on the left */}
      <path
        d="M-14 -6 C-24 -6 -27 -16 -20 -19 C-14 -21 -10 -15 -12 -8 Z"
        fill={EV.salamander}
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <circle cx="-19.5" cy="-14.5" r="2.6" fill="#FFFFFF" stroke={INK} strokeWidth={1.3} />
      <circle cx="-19.8" cy="-14.5" r="1.3" fill={INK} />
      <circle cx="-19.3" cy="-15" r="0.5" fill="#FFFFFF" />
      <circle cx="-21.5" cy="-11" r="1.4" fill={EV.cheek} opacity={0.85} />
      <path d="M-22 -10 q3 2.5 5.5 0" stroke={INK} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      {/* domed basalt volcano shell with glowing magma plate seams */}
      <path
        d="M-16 -3 C-17 -22 17 -22 18 -3 Z"
        fill={EV.obsidian}
        stroke={INK}
        strokeWidth={2.3}
        strokeLinejoin="round"
      />
      <path
        className="ev-lava"
        d="M-9 -4 L-5 -13 L2 -14 L7 -4 M-5 -13 L-2 -18 M2 -14 L5 -17"
        stroke={EV.magmaGold}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* mini crater rim on top of the shell */}
      <ellipse cx="0" cy="-17" rx="5.5" ry="2" fill={EV.basaltLight} stroke={INK} strokeWidth={1.5} />
      <ellipse className="ev-lava" cx="0" cy="-17" rx="3.2" ry="1" fill={EV.magma} />
      {/* shell rim */}
      <rect x="-17" y="-5" width="35" height="4" rx="2" fill={EV.keepTrim} stroke={INK} strokeWidth={1.7} />
    </g>
  )
}

/**
 * Open-Air Volcanic Dome Kiln & Lava-Wheel Smithy (`LavaForge`) at the start:
 * beehive stone smelting dome bound with riveted iron straps, lava-powered paddlewheel on the right,
 * crooked stovepipe chimney with `.ev-smoke`, and open cobble terrace with anvil, hot sword & quench barrel.
 */
function LavaForge({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="-4" cy="4" rx="74" ry="10" fill="rgba(70,36,24,.18)" />
      {/* crooked iron stovepipe chimney + rising smoke curl */}
      <g transform="translate(-8 -86)">
        <g className="ev-smoke" fill="none" stroke={EV.smoke} strokeWidth={5} strokeLinecap="round">
          <path d="M0 -6 c-8 -8 6 -14 -2 -22 c-8 -8 6 -14 -2 -22" />
        </g>
      </g>
      <path d="M-16 -64 L-13 -84 H-3 L0 -64 Z" fill={EV.iron} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <rect x="-15" y="-87" width="14" height="4.5" rx="2" fill={EV.ironLight} stroke={INK} strokeWidth={1.7} />
      <ellipse className="ev-lava" cx="-8" cy="-87" rx="4.5" ry="1.5" fill={EV.magmaGold} />

      {/* lava chute & iron paddlewheel on the right side of the kiln */}
      <g transform="translate(36 -22)">
        {/* stone lava chute */}
        <path d="M-12 -22 H14 L18 -14 H-12 Z" fill={EV.basalt} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <path className="ev-lava" d="M8 -16 C12 -8 13 4 12 18" stroke={EV.magma} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path className="ev-lava" d="M8 -16 C12 -8 13 4 12 18" stroke={EV.magmaGold} strokeWidth={2} fill="none" strokeLinecap="round" />
        {/* paddlewheel */}
        <circle cx="0" cy="4" r="16" fill={EV.timberDeep} stroke={INK} strokeWidth={2.2} />
        <circle cx="0" cy="4" r="12" fill={EV.basaltDeep} stroke={INK} strokeWidth={1.6} />
        {[0, 45, 90, 135].map((a) => (
          <line
            key={a}
            x1={Math.cos((a * Math.PI) / 180) * -15}
            y1={4 + Math.sin((a * Math.PI) / 180) * -15}
            x2={Math.cos((a * Math.PI) / 180) * 15}
            y2={4 + Math.sin((a * Math.PI) / 180) * 15}
            stroke={EV.keepTrim}
            strokeWidth={2}
          />
        ))}
        <circle cx="0" cy="4" r="4" fill={EV.ironLight} stroke={INK} strokeWidth={1.6} />
      </g>

      {/* cobbled basalt terrace base */}
      <rect x="-56" y="-12" width="104" height="14" rx="4" fill={EV.basalt} stroke={INK} strokeWidth={2.2} />
      <path d="M-40 -12 V2 M-20 -12 V2 M0 -12 V2 M20 -12 V2 M-56 -5 H48" stroke={EV.basaltDeep} strokeWidth={1.4} />

      {/* domed beehive basalt smelting kiln */}
      <path
        d="M-38 -12 C-40 -48 -24 -68 -6 -68 C12 -68 28 -48 26 -12 Z"
        fill={EV.kilnStone}
        stroke={INK}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path d="M-2 -68 C12 -68 28 -48 26 -12 H6 C8 -38 4 -56 -2 -68 Z" fill={EV.kilnStoneDeep} opacity={0.55} />
      {/* stone block courses on the dome */}
      <path d="M-35 -28 Q-6 -33 23 -28 M-30 -44 Q-6 -49 18 -44 M-20 -57 Q-6 -60 8 -57" stroke={EV.kilnStoneDeep} strokeWidth={1.6} fill="none" />
      {/* riveted iron band around the dome */}
      <path d="M-36 -34 Q-6 -39 24 -34 L25 -29 Q-6 -34 -37 -29 Z" fill={EV.iron} stroke={INK} strokeWidth={1.7} />
      {[-28, -18, -6, 6, 16].map((rx) => (
        <circle key={rx} cx={rx} cy={-32.5} r={1.3} fill={EV.ironLight} />
      ))}
      <path d="M-28 -48 Q-18 -60 -8 -63" stroke={EV.kilnStoneLight} strokeWidth={2.6} fill="none" strokeLinecap="round" />

      {/* wide arched glowing furnace mouth + molten cauldron inside */}
      <circle cx="-6" cy="-24" r="24" fill="url(#ev-glow-warm)" />
      <path d="M-22 -12 V-28 A16 16 0 0 1 10 -28 V-12 Z" fill={EV.obsidianDeep} stroke={INK} strokeWidth={2.4} />
      <path className="ev-lava" d="M-17 -12 V-26 A11 11 0 0 1 5 -26 V-12 Z" fill={EV.magma} />
      <path className="ev-lava" d="M-12 -12 C-12 -22 -6 -27 -6 -31 C-6 -27 0 -22 0 -12 Z" fill={EV.magmaGold} />
      <circle className="ev-lava" cx="-6" cy="-16" r="3" fill={EV.magmaPale} />
      {/* stone keystone arch stones around furnace mouth */}
      <path d="M-24 -28 A18 18 0 0 1 12 -28" stroke={EV.keepTrim} strokeWidth={3.2} fill="none" strokeLinecap="round" />

      {/* outdoor anvil + glowing sword blade on the left of the terrace */}
      <g transform="translate(-48 -12)">
        <rect x="-8" y="-10" width="16" height="10" rx="1.5" fill={EV.timber} stroke={INK} strokeWidth={1.8} />
        <path
          d="M-10 -10 H10 L7 -14 H4 V-18 H11 L18 -21 L11 -23 H-9 L-16 -20 L-9 -18 H-4 V-14 H-7 Z"
          fill={EV.iron}
          stroke={INK}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        {/* glowing red-hot sword blade being forged on top of the anvil */}
        <path className="ev-lava" d="M-8 -24 H8 L11 -25.5 L8 -27 H-8 Z" fill={EV.magmaGold} stroke={EV.magma} strokeWidth={1.1} />
        <path d="M-12 -25.5 H-8" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      </g>

      {/* wooden quench barrel on the front-right */}
      <g transform="translate(26 -4)">
        <ellipse cx="0" cy="-9" rx="9.5" ry="10.5" fill={EV.timber} stroke={INK} strokeWidth={2} />
        <ellipse cx="0" cy="-17.5" rx="8" ry="3" fill={EV.water} stroke={INK} strokeWidth={1.6} />
        <path d="M-9 -12 H9 M-9 -5 H9" stroke={EV.iron} strokeWidth={2} />
      </g>
    </g>
  )
}

/** Signpost at the start with a basalt base and crossed smith's hammer and tongs. */
function Signpost({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 V-34" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <g transform="translate(-18 2)">
        <path d="M-7 0 L7 -36 M-3 -36 q4 -5 8 0" stroke={INK} strokeWidth={4.2} strokeLinecap="round" fill="none" />
        <path d="M-7 0 L7 -36" stroke={EV.ironLight} strokeWidth={2} strokeLinecap="round" />
        <path d="M7 0 L-7 -34" stroke={INK} strokeWidth={4.6} strokeLinecap="round" />
        <path d="M7 0 L-7 -34" stroke={EV.keepTrim} strokeWidth={2.2} strokeLinecap="round" />
        <rect x="-14" y="-39" width="14" height="7" rx="1.8" transform="rotate(-22 -7 -35)" fill={EV.iron} stroke={INK} strokeWidth={1.8} />
      </g>
      <ellipse cx="3" cy="1" rx="12" ry="4.5" fill={EV.basalt} stroke={INK} strokeWidth={1.8} />
      <ellipse cx="-4" cy="2" rx="7" ry="3" fill={EV.basaltLight} stroke={INK} strokeWidth={1.5} />
    </g>
  )
}

/**
 * Chained iron fire-cauldron suspended from a curved obsidian-horn tripod (`FireCauldron`);
 * its halo and flame brighten when the chest is ready (`.ev-caldera-glow`).
 */
function FireCauldron({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <ellipse className="ev-caldera-glow" cx="4" cy="2" rx="44" ry="12" fill="url(#ev-glow-magma)" />
      <circle className="ev-caldera-glow" cx="6" cy="-46" r="54" fill="url(#ev-glow-magma)" />
      <path
        className="ev-caldera-glow"
        d="M6 -82 V-92 M-22 -46 H-32 M34 -46 H44 M-14 -68 l-7 -7 M26 -68 l7 -7"
        stroke={EV.magmaGold}
        strokeWidth={2.8}
        strokeLinecap="round"
      />
      <Shadow rx={16} />
      {/* curved obsidian horn post */}
      <path
        d="M-12 2 C-14 -28 -10 -58 8 -68 C2 -54 0 -32 -2 2 Z"
        fill={EV.obsidian}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path d="M6 -66 V-50" stroke={INK} strokeWidth={2.2} />
      {/* round iron cauldron */}
      <path
        d="M-7 -38 H19 C21 -24 14 -18 6 -18 C-2 -18 -9 -24 -7 -38 Z"
        fill={EV.iron}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <rect x="-9" y="-40" width="30" height="4" rx="2" fill={EV.keepTrim} stroke={INK} strokeWidth={1.6} />
      {/* sculpted cartoon flame in cauldron */}
      <path
        d="M-4 -40 C-6 -52 2 -60 6 -66 C10 -60 18 -52 16 -40 Z"
        fill={EV.magma}
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path d="M0 -40 C-1 -48 3 -54 6 -59 C9 -54 13 -48 12 -40 Z" fill={EV.magmaGold} />
      <circle cx="6" cy="-44" r="2.8" fill={EV.magmaPale} />
    </g>
  )
}

/**
 * The landmark at the chest end (`VolcanoCaldera`):
 * A wide, twin-peaked volcanic caldera crater with a bubbling lava cauldron at the summit,
 * two cascading lava rivers feeding a glowing lava moat, an ancient obsidian-horn portal
 * carved into the crater face, and an arched basalt stone bridge where the path reaches the chest.
 */
function VolcanoCaldera({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="10" rx="168" ry="20" fill="rgba(70,36,24,.22)" />
      {/* summit crater glow */}
      <ellipse className="ev-lava" cx="0" cy="-152" rx="92" ry="42" fill="url(#ev-glow-magma)" />

      {/* wide terraced volcanic crater cone (no castle walls or conical towers!) */}
      <path
        d="M-168 6 C-152 -42 -128 -96 -96 -144 L-68 -132 L-46 -156 Q0 -144 46 -156 L68 -132 L96 -144 C128 -96 152 -42 168 6 Z"
        fill={EV.obsidianLight}
        stroke={INK}
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      {/* right-side crater shadow */}
      <path
        d="M16 -150 L46 -156 L68 -132 L96 -144 C128 -96 152 -42 168 6 H32 C28 -52 22 -106 16 -150 Z"
        fill={EV.obsidian}
        opacity={0.75}
      />
      {/* bubbling summit lava lake inside the upper crater rim */}
      <ellipse cx="0" cy="-148" rx="48" ry="10" fill={EV.obsidianDeep} stroke={INK} strokeWidth={2.2} />
      <ellipse className="ev-lava" cx="0" cy="-147" rx="38" ry="6.5" fill={EV.magma} />
      <ellipse className="ev-lava" cx="0" cy="-147" rx="22" ry="3.5" fill={EV.magmaGold} />

      {/* stepped basalt cliff ribs across the caldera face */}
      <path
        d="M-134 -56 L-96 -64 L-64 -52 M64 -52 L96 -64 L134 -56 M-148 -18 L-104 -26 M104 -26 L148 -18"
        stroke={EV.obsidianDeep}
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* two winding lava rivers cascading down the left & right crater flanks */}
      <path
        className="ev-lava"
        d="M-36 -144 C-56 -116 -84 -92 -82 -56 C-80 -28 -104 -12 -114 4
           M36 -144 C56 -116 84 -92 82 -56 C80 -28 104 -12 114 4"
        stroke={EV.magma}
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="ev-lava"
        d="M-36 -144 C-56 -116 -84 -92 -82 -56 C-80 -28 -104 -12 -114 4
           M36 -144 C56 -116 84 -92 82 -56 C80 -28 104 -12 114 4"
        stroke={EV.magmaGold}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />

      {/* glowing lava moat around the base of the caldera */}
      <path
        d="M-170 8 C-140 -6 140 -6 170 8 C130 24 -130 24 -170 8 Z"
        fill={EV.basaltDeep}
        stroke={INK}
        strokeWidth={2.4}
      />
      <path
        className="ev-lava"
        d="M-154 8 C-120 -2 120 -2 154 8 C116 19 -116 19 -154 8 Z"
        fill="url(#ev-lava)"
      />
      <path className="ev-lava" d="M-128 9 Q-80 15 -28 11 M48 11 Q96 15 134 8" stroke={EV.magmaGold} strokeWidth={2.2} fill="none" strokeLinecap="round" />

      {/* expedition banner planted on the summit crag */}
      <path d="M0 -156 V-204" stroke={INK} strokeWidth={2.6} />
      <path className="map-flag" d="M0 -204 L30 -196 L0 -188 Z" fill={EV.flag} stroke={INK} strokeWidth={2} />

      {/* curved obsidian monolith horns framing the central caldera gate */}
      <path
        d="M-56 4 C-66 -44 -58 -92 -34 -122 C-38 -86 -36 -44 -32 4 Z"
        fill={EV.obsidian}
        stroke={INK}
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      <path
        d="M56 4 C66 -44 58 -92 34 -122 C38 -86 36 -44 32 4 Z"
        fill={EV.obsidian}
        stroke={INK}
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      <path className="ev-lava" d="M-45 -24 L-48 -56 L-41 -82 M45 -24 L48 -56 L41 -82" stroke={EV.magmaGold} strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* side pennants on the obsidian horns */}
      <path d="M-34 -122 V-140 M34 -122 V-140" stroke={INK} strokeWidth={2.2} />
      <path className="map-flag" d="M-34 -140 L-16 -135 L-34 -130 Z" fill={EV.pennant} stroke={INK} strokeWidth={1.8} />
      <path className="map-flag" d="M34 -140 L52 -135 L34 -130 Z" fill={EV.pennant} stroke={INK} strokeWidth={1.8} />

      {/* central Caldera Arch Gate with inner magma glow & golden sun-anvil crest */}
      <circle className="ev-caldera-glow" cx="0" cy="-24" r="50" fill="url(#ev-glow-magma)" />
      <path d="M-34 4 V-34 A34 34 0 0 1 34 -34 V4 Z" fill={EV.obsidianDeep} stroke={INK} strokeWidth={2.6} />
      <path className="ev-lava" d="M-26 4 V-32 A26 26 0 0 1 26 -32 V4 Z" fill={EV.magmaDeep} opacity={0.88} />
      <ellipse className="ev-caldera-glow" cx="0" cy="-18" rx="20" ry="25" fill="url(#ev-glow-magma)" />
      {/* heavy stepped basalt arch stones */}
      <path d="M-40 -32 A40 40 0 0 1 40 -32" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <path d="M-40 -32 A40 40 0 0 1 40 -32" fill="none" stroke={EV.keepTrim} strokeWidth={4.6} strokeLinecap="round" />
      {/* golden sun-anvil keystone crest */}
      <path d="M-12 -74 H12 L8 -64 H-8 Z" fill={EV.magmaGold} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <circle cx="0" cy="-80" r="5" fill={EV.magma} stroke={INK} strokeWidth={1.6} />

      {/* basalt stone bridge spanning the lava moat to the gate */}
      <path
        d="M-68 20 C-56 4 -20 4 -8 20 Z"
        fill={EV.basaltLight}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <rect x="-44" y="0" width="88" height="7" rx="2.5" fill={EV.ashStone} stroke={INK} strokeWidth={1.8} />
    </g>
  )
}

/**
 * Stepped flat-topped basalt mesa cliff wall (`basaltMesaPath`) across the horizon.
 */
function basaltMesaPath(baseY: number, bottomY: number) {
  return `M0 ${baseY - 18} H44 L58 ${baseY - 52} H136 L152 ${baseY - 22} H248 L266 ${baseY - 58} H352 L368 ${baseY - 26} H${MAP_W} V${bottomY} H0 Z`
}

/**
 * Wolkeninseln teaser (World 6 · Cloud Isles): floating sky islands on fluffy golden-white clouds
 * with a sky-tower and waterfall (`.ev-cloud-isle`).
 */
function CloudIslesTeaser({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="ev-cloud-isle">
        <g transform="translate(-58 -4) scale(0.62)">
          <path d="M-24 0 L-10 26 L4 18 L14 28 L24 0 Z" fill={EV.cloudIsleRock} stroke="rgba(47,36,32,.55)" strokeWidth={2} strokeLinejoin="round" />
          <path d="M0 0 L14 28 L24 0 Z" fill={EV.cloudIsleRockDeep} opacity={0.65} />
          <path d="M-28 2 C-28 -8 28 -8 28 2 Z" fill={EV.cloudIsleGrass} stroke="rgba(47,36,32,.55)" strokeWidth={2} />
          <circle cx="0" cy="-12" r="9" fill={EV.cloudIsleGrass} stroke="rgba(47,36,32,.55)" strokeWidth={1.8} />
          <rect x="-2" y="-5" width="4" height="6" fill={EV.timber} />
          <path d="M-30 4 C-38 4 -38 -6 -26 -6 C-20 -12 -8 -10 -4 -4 C4 -10 18 -10 24 -4 C34 -4 34 6 24 6 Z" fill={EV.cloudWhite} stroke="rgba(47,36,32,.35)" strokeWidth={1.6} />
        </g>
        <path
          d="M-46 4 L-28 34 L-12 22 L0 42 L14 24 L30 34 L46 4 Z"
          fill={EV.cloudIsleRock}
          stroke="rgba(47,36,32,.6)"
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
        <path d="M0 4 L0 42 L14 24 L30 34 L46 4 Z" fill={EV.cloudIsleRockDeep} opacity={0.6} />
        <path
          d="M-50 4 C-50 -8 -24 -12 0 -12 C24 -12 50 -8 50 4 Q25 10 0 6 Q-25 10 -50 4 Z"
          fill={EV.cloudIsleGrass}
          stroke="rgba(47,36,32,.6)"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <rect x="-11" y="-30" width="22" height="24" rx="2" fill={EV.cloudIsleTower} stroke="rgba(47,36,32,.6)" strokeWidth={2} />
        <rect x="2" y="-29" width="8" height="22" fill={EV.cloudGold} opacity={0.55} />
        <path d="M-16 -28 L0 -46 L16 -28 Z" fill={EV.cloudIsleRoof} stroke="rgba(47,36,32,.6)" strokeWidth={2} strokeLinejoin="round" />
        <path d="M0 -46 V-54" stroke="rgba(47,36,32,.6)" strokeWidth={1.8} />
        <path d="M0 -54 L11 -51 L0 -48 Z" fill={EV.pennant} stroke="rgba(47,36,32,.55)" strokeWidth={1.3} />
        <rect x="-3.5" y="-23" width="7" height="10" rx="3.5" fill={EV.cloudIsleRoof} stroke="rgba(47,36,32,.55)" strokeWidth={1.4} />
        <path d="M14 2 C18 14 16 28 19 42" stroke={EV.cloudIsleWater} strokeWidth={5.5} fill="none" strokeLinecap="round" />
        <path d="M14 2 C18 14 16 28 19 42" stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" strokeDasharray="4 6" />
        <path
          d="M-54 10 C-64 10 -66 -2 -54 -4 C-52 -14 -34 -16 -26 -8 C-18 -16 -2 -14 4 -6 C14 -14 32 -12 38 -4 C52 -6 62 2 54 10 C42 14 -42 14 -54 10 Z"
          fill={EV.cloudWhite}
          stroke="rgba(47,36,32,.4)"
          strokeWidth={1.8}
        />
        <path d="M-48 9 C-24 13 24 13 48 9" stroke={EV.cloudGold} strokeWidth={3} fill="none" strokeLinecap="round" />
        <circle cx="19" cy="43" r="6.5" fill={EV.cloudWhite} stroke="rgba(47,36,32,.35)" strokeWidth={1.4} />
        <circle cx="25" cy="45" r="4.5" fill={EV.cloudWhite} />
      </g>
    </g>
  )
}

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M-40 14 C-56 14 -58 -4 -44 -8 C-46 -24 -24 -30 -14 -18 C-8 -34 18 -36 24 -18 C38 -26 56 -16 50 0 C64 2 62 14 50 14 Z"
        fill={EV.cloud}
        stroke="rgba(47,36,32,.14)"
        strokeWidth={2}
        opacity={0.95}
      />
      <path d="M-38 11 H46" stroke={EV.cloudShade} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
    </g>
  )
}

/** Two warm basalt rocks beside the flagstone trail (between stones). */
function TrailBasalt({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <ellipse cx="-5" cy="0" rx="6.4" ry="4.4" fill={EV.basalt} stroke={INK} strokeWidth={1.3} />
      <path d="M-9 -1.5 q4 -3 8 0" stroke={EV.keepTrim} strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <ellipse cx="5" cy="2" rx="4.6" ry="3.2" fill={EV.basaltLight} stroke={INK} strokeWidth={1.2} />
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

export function MapArtEmberVolcano({ height, pts, walkedTo, stones }: MapArtProps) {
  const rand = seeded(53)
  const chest = chestSpot(pts)
  const skyEnd = chest.y - 40
  const freeSide = (p: Pt) => (p.x > MAP_W / 2 ? -1 : 1)
  const free = (p: Pt, min: number, spread: number) => (p.x > MAP_W / 2 ? min + rand() * spread : MAP_W - min - rand() * spread)

  // Special stones: small magma pool (3), bubbling lava lake + fire salamander (6), stepped lava cascade + geode (9).
  const pondIdx = Math.min(3, stones)
  const lakeIdx = Math.min(6, stones)
  const cascadeIdx = Math.min(9, stones)
  const sideX = (p: Pt, d: number) => (p.x > MAP_W / 2 ? d : MAP_W - d)
  const pond = { x: sideX(pts[pondIdx], 90), y: pts[pondIdx].y + 26 }
  const lake = { x: sideX(pts[lakeIdx], 104), y: pts[lakeIdx].y + 30 }

  const deco: { y: number; node: ReactNode }[] = []
  for (let i = 1; i <= stones; i++) {
    const p = pts[i]
    const side = freeSide(p)
    if (i === pondIdx) {
      deco.push({ y: pond.y - 12, node: <DragonTree key={`dt${i}`} x={pond.x + side * 62} y={pond.y - 12} s={0.96} /> })
      deco.push({ y: pond.y + 50, node: <FlameAgave key={`fa${i}`} x={pond.x - side * 62} y={pond.y + 50} s={0.92} /> })
      continue
    }
    if (i === lakeIdx) {
      deco.push({ y: lake.y - 18, node: <BasaltColumns key={`lc${i}`} x={lake.x + side * 72} y={lake.y - 18} s={1.06} /> })
      deco.push({ y: lake.y + 50, node: <GeyserVent key={`lg${i}`} x={lake.x + side * 38} y={lake.y + 50} s={0.92} flip delay={-1.8} /> })
      continue
    }
    if (i === cascadeIdx) {
      const sx = sideX(p, 96)
      deco.push({ y: p.y + 28, node: <LavaCascade key={`ls${i}`} x={sx} y={p.y + 28} s={1.12} flip={side < 0} /> })
      deco.push({ y: p.y + 60, node: <MagmaGeode key={`mg${i}`} x={sx - side * 36} y={p.y + 60} s={1.02} /> })
      deco.push({ y: p.y - 24, node: <DragonTree key={`sc${i}`} x={sx + side * 34} y={p.y - 24} s={0.9} /> })
      continue
    }
    const x1 = free(p, 28, 54)
    const y1 = p.y + 36 + rand() * 22
    if (i % 2 === 1) {
      deco.push({ y: y1, node: <DragonTree key={`d${i}`} x={x1} y={y1} s={0.95 + rand() * 0.22} flip={rand() > 0.5} /> })
    } else {
      deco.push({ y: y1, node: <BasaltColumns key={`b${i}`} x={x1} y={y1} s={0.95 + rand() * 0.2} flip={rand() > 0.5} /> })
    }
    const x2 = x1 < MAP_W / 2 ? (x1 < 56 ? x1 + 44 : x1 - 30) : x1 > MAP_W - 56 ? x1 - 44 : x1 + 30
    const y2 = p.y - 26 + rand() * 16
    if (i % 3 === 0) deco.push({ y: y2, node: <ObsidianMonolith key={`o${i}`} x={x2} y={y2} s={0.95 + rand() * 0.18} /> })
    else if (i % 3 === 1) deco.push({ y: y2, node: <FlameAgave key={`f${i}`} x={x2} y={y2} s={0.92 + rand() * 0.18} stalk={i % 2 === 1} /> })
    else deco.push({ y: y2, node: <GeyserVent key={`g${i}`} x={x2} y={y2} s={0.9 + rand() * 0.16} smoke={i > 4} delay={-rand() * 5} /> })
    if ([2, 7, 11].includes(i)) deco.push({ y: p.y + 68, node: <GeyserVent key={`gv${i}`} x={sideX(p, 96)} y={p.y + 68} flip={side < 0} smoke delay={-i * 1.1} /> })
    if ([4, 10].includes(i)) deco.push({ y: p.y - 32, node: <MagmaGeode key={`x${i}`} x={sideX(p, 92)} y={p.y - 32} s={0.92} /> })
  }
  deco.sort((a, b) => a.y - b.y)

  // Floor texture: warm darker ash patches, glowing ember cracks, pumice pebbles, and spiky cinder-grass tufts.
  const patches: ReactNode[] = []
  for (let i = 0; i < stones * 3; i++) {
    const x = rand() * MAP_W
    const y = skyEnd + 140 + rand() * (height - skyEnd - 160)
    patches.push(<ellipse key={`ep${i}`} cx={x} cy={y} rx={30 + rand() * 40} ry={8 + rand() * 8} fill={EV.floorPatch} />)
  }
  const cover: ReactNode[] = []
  for (let i = 0; i < stones * 5; i++) {
    const x = 12 + rand() * (MAP_W - 24)
    const y = skyEnd + 140 + rand() * (height - skyEnd - 160)
    const r = rand()
    if (r < 0.28)
      cover.push(<circle key={`p${i}`} cx={x} cy={y} r={2} fill={EV.ashLight} stroke={EV.ashStoneDeep} strokeWidth={0.9} />)
    else if (r < 0.54)
      cover.push(
        <path
          key={`t${i}`}
          d={`M${x - 5} ${y} q2 -7 3 -9 M${x} ${y} q0 -8 1 -11 M${x + 5} ${y} q-2 -7 -3 -9`}
          stroke={EV.agave}
          strokeWidth={1.9}
          fill="none"
          strokeLinecap="round"
        />,
      )
    else if (r < 0.8)
      cover.push(
        <g key={`c${i}`}>
          <path d={`M${x - 12} ${y} l8 -4 l6 3 l9 -4`} stroke={EV.basaltDeep} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path className="ev-lava" d={`M${x - 11} ${y} l8 -4 l6 3 l8 -3.5`} stroke={EV.magmaGold} strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>,
      )
    else
      // small volcanic cinder-pod puffball
      cover.push(
        <g key={`h${i}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
          <ellipse cx="0" cy="1" rx="9" ry="2.5" fill={EV.floorPatch} />
          <path d="M-7 0 C-8 -7 8 -7 7 0 Z" fill={EV.basalt} stroke={INK} strokeWidth={1.3} />
          <circle cx="-2" cy="-3.5" r="1.2" fill={EV.magmaGold} />
          <circle cx="2.5" cy="-2.5" r="1" fill={EV.magma} />
        </g>,
      )
  }

  // Basalt rocks along the trail edges (between stones, alternating sides).
  const rocks: ReactNode[] = []
  for (let i = 0; i < stones; i++) {
    const a = pointOn(pts, i, 0.45)
    const b = pointOn(pts, i, 0.5)
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
    const sgn = i % 2 ? 1 : -1
    rocks.push(<TrailBasalt key={`tr${i}`} x={b.x - ((b.y - a.y) / len) * 25 * sgn} y={b.y + ((b.x - a.x) / len) * 25 * sgn} />)
  }

  // Magic layer: 16 floating embers and 9 crystal sparkles, seeded, on the free side.
  const embers: ReactNode[] = []
  for (let i = 0; i < 16; i++) {
    const p = pts[1 + Math.floor(rand() * stones)]
    embers.push(<Ember key={`em${i}`} x={free(p, 20, 100)} y={p.y - 50 + rand() * 90} s={0.85 + rand() * 0.4} delay={-rand() * 6.4} />)
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
        <linearGradient id="ev-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={EV.skyTop} />
          <stop offset="0.38" stopColor={EV.skyMid} />
          <stop offset="0.74" stopColor={EV.skyLow} />
          <stop offset="1" stopColor={EV.skyHorizon} />
        </linearGradient>
        <linearGradient id="ev-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={EV.floorTop} />
          <stop offset="1" stopColor={EV.floorBottom} />
        </linearGradient>
        <linearGradient id="ev-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={EV.haze} stopOpacity="0" />
          <stop offset="1" stopColor={EV.haze} stopOpacity="0.68" />
        </linearGradient>
        <linearGradient id="ev-lava" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={EV.magmaGold} />
          <stop offset="0.55" stopColor={EV.magma} />
          <stop offset="1" stopColor={EV.magmaDeep} />
        </linearGradient>
        <radialGradient id="ev-sun-glow">
          <stop offset="0.25" stopColor={`rgb(${EV.sunGlow})`} stopOpacity="0.88" />
          <stop offset="1" stopColor={`rgb(${EV.sunGlow})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ev-glow-warm">
          <stop offset="0" stopColor={`rgb(${EV.glowWarm})`} stopOpacity="0.78" />
          <stop offset="1" stopColor={`rgb(${EV.glowWarm})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ev-glow-magma">
          <stop offset="0" stopColor={EV.magmaPale} stopOpacity="0.95" />
          <stop offset="0.28" stopColor={`rgb(${EV.magmaGlow})`} stopOpacity="0.82" />
          <stop offset="0.6" stopColor={`rgb(${EV.magmaGlow})`} stopOpacity="0.38" />
          <stop offset="1" stopColor={`rgb(${EV.magmaGlow})`} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1 warm ember-sunset sky, crater sun, soft ash-tinted clouds */}
      <rect width={MAP_W} height={height} fill="url(#ev-floor)" />
      <rect width={MAP_W} height={skyEnd + 10} fill="url(#ev-sky)" />
      <circle cx="320" cy="62" r="86" fill="url(#ev-sun-glow)" />
      <circle cx="320" cy="62" r="22" fill={EV.sun} stroke="rgba(47,36,32,.22)" strokeWidth={2} />
      <Cloud x={236} y={28} s={0.7} />
      <Cloud x={390} y={128} s={0.62} />

      {/* 2 distant smoking stratovolcano + Wolkeninseln teaser (World 6) behind the generic sign */}
      <g opacity={0.92}>
        {/* billowing ash plume from distant volcano */}
        <g fill={EV.smoke} stroke="rgba(47,36,32,.24)" strokeWidth={1.6}>
          <circle cx="292" cy="76" r="14" />
          <circle cx="316" cy="68" r="17" />
          <circle cx="346" cy="64" r="19" />
          <circle cx="376" cy="66" r="15" />
        </g>
        <path d="M180 280 C216 210 248 136 266 92 H310 C328 136 360 210 396 280 Z" fill={EV.farPeak} stroke="rgba(47,36,32,.28)" strokeWidth={2} />
        <path d="M294 92 L310 92 C328 136 360 210 396 280 H312 Z" fill={EV.farPeakShade} />
        <ellipse cx="288" cy="92" rx="22" ry="5" fill={EV.nearPeakShade} stroke="rgba(47,36,32,.3)" strokeWidth={1.6} />
        <ellipse className="ev-lava" cx="288" cy="92" rx="15" ry="2.8" fill={EV.magmaGold} />
      </g>
      <CloudIslesTeaser x={108} y={124} s={0.82} />
      <rect y={skyEnd - 150} width={MAP_W} height={80} fill="url(#ev-haze)" />

      {/* 3 stepped basalt mesa cliff wall with cascading lava waterfalls */}
      <path d={basaltMesaPath(skyEnd - 44, skyEnd + 20)} fill={EV.midPeak} stroke="rgba(47,36,32,.38)" strokeWidth={2} strokeLinejoin="round" />
      <path d={`M96 ${skyEnd - 96} H136 L152 ${skyEnd - 66} V${skyEnd + 20} H96 Z M308 ${skyEnd - 102} H352 L368 ${skyEnd - 70} V${skyEnd + 20} H308 Z`} fill={EV.midPeakShade} opacity={0.65} />
      {/* lava falls pouring over the mesa ledges */}
      <path
        className="ev-lava"
        d={`M82 ${skyEnd - 95} C80 ${skyEnd - 68} 76 ${skyEnd - 40} 74 ${skyEnd - 10}
           M296 ${skyEnd - 101} C298 ${skyEnd - 72} 302 ${skyEnd - 42} 304 ${skyEnd - 10}`}
        stroke={EV.magma}
        strokeWidth={6.5}
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="ev-lava"
        d={`M82 ${skyEnd - 95} C80 ${skyEnd - 68} 76 ${skyEnd - 40} 74 ${skyEnd - 10}
           M296 ${skyEnd - 101} C298 ${skyEnd - 72} 302 ${skyEnd - 42} 304 ${skyEnd - 10}`}
        stroke={EV.magmaGold}
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
      />
      <rect y={skyEnd - 80} width={MAP_W} height={60} fill="url(#ev-haze)" />

      {/* 4 near jagged obsidian crags framing the caldera */}
      <path
        d={`M-8 ${skyEnd + 40} L8 ${skyEnd - 48} L32 ${skyEnd - 14} L52 ${skyEnd - 38} L78 ${skyEnd + 40} Z
           M322 ${skyEnd + 40} L348 ${skyEnd - 42} L368 ${skyEnd - 16} L392 ${skyEnd - 52} L410 ${skyEnd + 40} Z`}
        fill={EV.nearPeak}
        stroke="rgba(47,36,32,.5)"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <rect y={skyEnd - 30} width={MAP_W} height={40} fill="url(#ev-haze)" />

      {/* 5 caldera rim + VolcanoCaldera + chained FireCauldron */}
      <path
        d={`M0 ${skyEnd + 30} C80 ${skyEnd - 34} 320 ${skyEnd - 34} ${MAP_W} ${skyEnd + 30} V${skyEnd + 90} H0 Z`}
        fill={EV.floorTop}
        stroke="rgba(47,36,32,.22)"
        strokeWidth={2}
      />
      <path
        d={`M0 ${skyEnd + 34} C80 ${skyEnd - 28} 320 ${skyEnd - 28} ${MAP_W} ${skyEnd + 34} V${skyEnd + 52} C320 ${skyEnd} 80 ${skyEnd} 0 ${skyEnd + 52} Z`}
        fill={EV.ashLight}
        opacity={0.75}
      />
      <VolcanoCaldera x={MAP_W / 2} y={chest.y - 24} />
      <g transform={`translate(46 ${chest.y + 8}) scale(1.08)`}>
        <FireCauldron x={0} y={0} />
      </g>
      <Sparkle x={70} y={chest.y - 150} s={1.1} delay={-0.4} />
      <Sparkle x={338} y={chest.y - 128} s={0.9} delay={-1.6} />
      <Sparkle x={256} y={chest.y - 182} s={0.8} delay={-2.5} />
      <GeyserVent x={356} y={chest.y + 30} s={0.9} flip smoke delay={-2.2} />

      {/* 6 floor texture; pale warm clearing under every stone keeps it readable */}
      {patches}
      {pts.slice(1, stones + 1).map((p, i) => (
        <ellipse key={`cl${i}`} cx={p.x} cy={p.y + 8} rx={50} ry={34} fill={EV.clearing} />
      ))}
      {cover}

      {/* 7 bubbling lava lake with sinuous fire salamander, plus second magma pool */}
      <LavaLake x={pond.x} y={pond.y} rx={52} ry={19} seed={15} />
      <LavaLake x={lake.x} y={lake.y} rx={78} ry={28} seed={29}>
        <FireSalamander x={-12} y={5} s={1.05} flip={lake.x < MAP_W / 2} />
      </LavaLake>

      {/* 8 basalt flagstone trail: same widths as Burgdorf; warm ash-stone edge + pale sandstone centre */}
      {rocks}
      <path d={road} fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={EV.trailEdge} strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={EV.trail} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={EV.trailDash} strokeWidth={4} strokeLinecap="round" strokeDasharray="6 16" />
      {walked && <path d={walked} fill="none" stroke="#C9372C" strokeWidth={5} strokeLinecap="round" strokeDasharray="10 12" opacity={0.8} />}

      {deco.map((d) => d.node)}

      {/* 9 start: open-air LavaForge dome kiln with lava wheel & anvil, MagmaTortoise, DragonTree, Signpost */}
      <LavaForge x={316} y={height - 48} s={1.14} />
      <DragonTree x={386} y={height - 148} s={1.02} flip />
      <BasaltColumns x={30} y={height - 134} s={1.06} />
      <MagmaTortoise x={106} y={height - 128} s={1.08} />
      <FlameAgave x={56} y={height - 12} s={1} />
      <GeyserVent x={224} y={height - 6} s={0.88} flip smoke delay={-3.1} />
      <Signpost x={pts[0].x - 74} y={pts[0].y - 6} />

      {/* 10 magic layer: sparkles & floating embers */}
      {sparkles}
      {embers}
      <Ember x={206} y={56} s={1.05} delay={-1.5} />
      <Ember x={370} y={208} s={0.9} delay={-4.1} />
      <Ember x={26} y={238} s={0.95} delay={-5.3} />
    </svg>
  )
}
