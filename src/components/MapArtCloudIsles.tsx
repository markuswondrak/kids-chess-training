/**
 * REFERENCE – Wolkeninseln (Cloud Isles): eigenständige Himmels- und Wolkeninseln-Szene der Karte –
 * strahlender Azur-Himmel mit Höhensonne, schwebende Archipel-Inseln und Geisterruine-Teaser (Welt 7)
 * am Horizont, Wolkenzitadelle mit Sternwarten-Kuppel, Astrolabium, Regenbogenbrücke, Sonnenportal
 * und Himmelsleuchtfeuer an der Truhe, Segel-Windmühle mit Luftschiff-Anlegesteg, gefesseltem
 * Heißluftballon-Beiboot und Fernrohr am Start, türkisfarbene Wolkenlagune mit lächelndem
 * Baby-Himmelsgreif, flauschiges Wolkenschaf mit kleinen Flügeln, Windbäume, kannelierte Marmorsäulen,
 * Regenbogenbögen, schwebende Celestit-Kristalle, Himmelswasserfälle, Windglocken-Posten,
 * Windkompass-Monolithen sowie segelnde Drachen und Wolkenschwalben.
 * Props wie `MapArt`. Zufall nur über `seeded()`.
 *
 * Port 1:1 to `src/components/MapArtCloudIsles.tsx`; only change the import below to `../game/mapPath`.
 * Bildsprache: art-guide.md (Feature 008).
 */
import type { ReactNode } from 'react'
import { MAP_W, chestSpot, pathD, pointOn, seeded, type Pt } from '../game/mapPath'

const INK = '#2F2420'

/** Cloud Isles palette – shared values mirror tokens.css (see art-guide.md §2). */
export const CI = {
  skyTop: '#2B78C2',
  skyMid: '#58A6E2',
  skyLow: '#98D4F8',
  skyHorizon: '#FFF5DC',
  sun: '#FFF8D6',
  sunGlow: '255,238,160',
  cloud: '#FFFDF7',
  cloudShade: '#DCEAF8',
  cloudDeep: '#BFD5EC',
  cloudGold: '#F7E1B5',
  farIsle: '#92A8C4',
  farIsleShade: '#768CA8',
  midBank: '#FFFDF8',
  midBankShade: '#E2EEFA',
  nearCloud: '#FFFFFF',
  nearCloudShade: '#D6E6F7',
  haze: '#FFF7E2',
  floorTop: '#BCE1FA',
  floorMid: '#D8EEFB',
  floorBottom: '#B8DCF5',
  cloudSeaWave: 'rgba(255,253,247,.58)',
  cloudSeaShade: 'rgba(130,168,210,.22)',
  clearing: 'rgba(255,253,245,.58)',
  trail: '#FDFBF4',
  trailEdge: '#7E96B8',
  trailDash: '#B6CCE4',
  isleRock: '#8A9BB5',
  isleRockLight: '#A8B8CF',
  isleRockDeep: '#687A96',
  isleRockDark: '#4E607A',
  grass: '#7BCB6A',
  grassLight: '#98E285',
  grassDeep: '#5CAE4E',
  marble: '#FBF6EA',
  marbleShade: '#E2D8C3',
  marbleDeep: '#C5B89E',
  roof: '#3E7CB8',
  roofLight: '#5D9AD4',
  roofDeep: '#295887',
  gold: '#F5C84C',
  goldLight: '#FFE885',
  goldDeep: '#C99722',
  sunPale: '#FFFBE6',
  sunGlowRgb: '255,214,92',
  glowWarm: '255,222,120',
  glowCyan: '130,232,255',
  water: '#4BC0F2',
  waterLight: '#9BE6FF',
  waterDeep: '#2692C9',
  waterFoam: '#FFFDF9',
  treeBark: '#8C786A',
  treeBarkDeep: '#69574B',
  crystal: '#52D1F7',
  crystalLight: '#A8F0FF',
  crystalDeep: '#2398C4',
  crystalSparkle: '#FFF9C8',
  coral: '#FF786E',
  coralDeep: '#D95348',
  timber: '#9E6846',
  timberDeep: '#73482C',
  sail: '#FFF9EC',
  sailStripe: '#4A90D6',
  griffinBody: '#F7C85C',
  griffinShade: '#D9A136',
  griffinFeather: '#FFFDF7',
  griffinWing: '#62B6F7',
  cheek: '#FF9E99',
  flag: '#C9372C',
  pennant: '#F5C84C',
  ghostRock: '#6E6888',
  ghostRockDeep: '#4E4866',
  ghostGrass: '#5E9E8C',
  ghostStone: '#948CAE',
  ghostStoneDeep: '#6B6385',
  ghostRoof: '#523E78',
  ghostMist: '#E8DFF7',
  ghostWindow: '#FFE082',
}

/** Soft sky-slate ground shadow on floating island turf (art-guide §3.2). */
const Shadow = ({ rx, ry = rx / 3.4 }: { rx: number; ry?: number }) => (
  <ellipse cx="0" cy="2" rx={rx} ry={ry} fill="rgba(45,68,98,.18)" />
)

// ---------------------------------------------------------------- primitives

/**
 * Sculpted Floating Sky-Island Base (`FloatingIslePad`):
 * Tapered faceted blue-slate cliff underside with levitating rock shards, fluffy golden-rimmed
 * cumulus cloud collars on both flanks, and a rounded emerald sky-meadow top with overhanging turf scallops.
 */
function FloatingIslePad({
  x,
  y,
  rx,
  ry = 44,
  depth = 56,
  lobe = 1,
  waterfall = 0,
}: {
  x: number
  y: number
  rx: number
  ry?: number
  depth?: number
  lobe?: -1 | 0 | 1
  waterfall?: -1 | 0 | 1
}) {
  const w = rx * 0.94
  const lx = lobe * rx * 0.42
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      {/* soft ambient shadow on the cloud sea below */}
      <ellipse cx="0" cy={depth + 12} rx={rx * 0.76} ry={13} fill={CI.cloudSeaShade} />
      {/* tiny levitating rock shards below the island tip */}
      <path
        d={`M-22 ${depth - 2} L-13 ${depth + 10} L-6 ${depth - 1} Z M16 ${depth - 5} L23 ${depth + 6} L29 ${depth - 4} Z`}
        fill={CI.isleRockDeep}
        stroke={INK}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      {/* tapered multi-faceted floating cliff underside */}
      <path
        d={`M${-w} 2 L${-w * 0.72} ${depth * 0.68} L${-w * 0.32} ${depth * 0.52} L0 ${depth} L${w * 0.32} ${depth * 0.56} L${w * 0.72} ${depth * 0.72} L${w} 2 Z`}
        fill={CI.isleRock}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      {/* right-hand shaded rock facets */}
      <path
        d={`M0 6 L0 ${depth} L${w * 0.32} ${depth * 0.56} L${w * 0.72} ${depth * 0.72} L${w} 2 Z`}
        fill={CI.isleRockDeep}
        opacity={0.68}
      />
      <path
        d={`M${-w * 0.38} 8 L${-w * 0.32} ${depth * 0.52} L0 ${depth} L0 8 Z`}
        fill={CI.isleRockLight}
        opacity={0.45}
      />
      {/* vertical crag ridge lines & hanging ivy vine */}
      <path
        d={`M${-w * 0.32} ${depth * 0.52} L${-w * 0.36} 10 M0 ${depth} V12 M${w * 0.32} ${depth * 0.56} L${w * 0.36} 10`}
        stroke={INK}
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.65}
      />
      <path
        d={`M${-w * 0.16} 12 C${-w * 0.18} 22 ${-w * 0.12} 30 ${-w * 0.15} 38`}
        stroke={CI.grassDeep}
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
      />
      {/* fluffy cumulus cloud collars hugging the left and right island flanks */}
      <path
        d={`M${-rx - 6} 12 C${-rx - 20} 12 ${-rx - 20} -4 ${-rx - 6} -6 C${-rx - 2} -16 ${-rx + 16} -16 ${-rx + 22} -6 C${-rx + 34} -6 ${-rx + 34} 12 ${-rx + 20} 14 Z`}
        fill={CI.cloud}
        stroke={INK}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <path
        d={`M${rx - 20} 14 C${rx - 34} 12 ${rx - 34} -6 ${rx - 22} -6 C${rx - 16} -16 ${rx + 2} -16 ${rx + 6} -6 C${rx + 20} -4 ${rx + 20} 12 ${rx + 6} 12 Z`}
        fill={CI.cloud}
        stroke={INK}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      {/* warm limestone rim under the turf */}
      <ellipse cx="0" cy="4" rx={rx * 0.98} ry={ry * 0.98} fill={CI.marbleShade} stroke={INK} strokeWidth={2} />
      {lobe !== 0 && (
        <ellipse
          cx={lx}
          cy={ry * 0.56}
          rx={rx * 0.55}
          ry={ry * 0.66}
          fill={CI.grass}
          stroke={INK}
          strokeWidth={2.3}
        />
      )}
      {/* main lush emerald sky-meadow top (outer stroke + unstroked fill cover over lobe seam) */}
      <ellipse cx="0" cy="-2" rx={rx} ry={ry} fill={CI.grass} stroke={INK} strokeWidth={2.3} />
      {lobe !== 0 && <ellipse cx={lx} cy={ry * 0.54} rx={rx * 0.54 - 1.2} ry={ry * 0.65 - 1.2} fill={CI.grass} />}
      <ellipse cx="0" cy="-2" rx={rx - 1.2} ry={ry - 1.2} fill={CI.grass} />
      <ellipse cx="-6" cy="-5" rx={rx * 0.82} ry={ry * 0.74} fill={CI.grassLight} opacity={0.55} />
      {/* overhanging turf lip along the front rim */}
      <path
        d={`M${-rx * 0.78} ${ry * 0.62} Q${-rx * 0.4} ${ry * 1.06} 0 ${ry * 0.92} Q${rx * 0.4} ${ry * 1.06} ${rx * 0.78} ${ry * 0.62}`}
        fill="none"
        stroke={CI.grassDeep}
        strokeWidth={3.2}
        strokeLinecap="round"
      />
      {/* optional mini edge waterfall pouring off the island rim */}
      {waterfall !== 0 && (
        <g transform={`translate(${waterfall * rx * 0.54} ${ry * 0.76})`}>
          <path
            className="ci-shimmer"
            d={`M-6 0 C-7 12 -8 24 -9 ${depth * 0.56} L7 ${depth * 0.56} C6 24 5 12 4 0 Z`}
            fill={CI.water}
            stroke={INK}
            strokeWidth={1.5}
          />
          <path className="ci-shimmer" d={`M-2 2 V${depth * 0.52}`} stroke={CI.waterFoam} strokeWidth={2} strokeLinecap="round" strokeDasharray="4 6" />
          <path
            d={`M-14 ${depth * 0.56} C-20 ${depth * 0.56} -20 ${depth * 0.4} -10 ${depth * 0.4} C-6 ${depth * 0.32} 6 ${depth * 0.32} 10 ${depth * 0.4} C20 ${depth * 0.4} 20 ${depth * 0.56} 14 ${depth * 0.56} Z`}
            fill={CI.cloud}
            stroke={INK}
            strokeWidth={1.6}
          />
        </g>
      )}
    </g>
  )
}

/**
 * Wind-Swept Sky-Tree (`CloudTree`): graceful curved silver-bark trunk with three billowing
 * cumulus-shaped mint-and-emerald canopy puffs, golden wind-swirl highlights, and star-blossoms.
 */
function CloudTree({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={24} />
      {/* wind-curved trunk + forked boughs */}
      <path
        d="M-6 2 C-5 -12 -2 -24 2 -34 L-12 -46 L-9 -49 L4 -38 L15 -47 L18 -44 L6 -32 C4 -20 4 -10 6 2 Z"
        fill={CI.treeBark}
        stroke={INK}
        strokeWidth={2.3}
        strokeLinejoin="round"
      />
      <path d="M1 -32 L15 -45 L17 -43 L5 -30 V2 H1 Z" fill={CI.treeBarkDeep} opacity={0.5} />
      {/* left cloud-puff canopy */}
      <path
        d="M-28 -40 C-36 -40 -36 -54 -24 -56 C-20 -64 -6 -62 -2 -54 C4 -54 4 -40 -6 -40 Z"
        fill={CI.grass}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      {/* right cloud-puff canopy */}
      <path
        d="M4 -39 C-4 -39 -4 -53 6 -55 C10 -63 24 -63 28 -55 C38 -53 36 -39 26 -39 Z"
        fill={CI.grass}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      {/* main top cumulus-crown canopy */}
      <path
        d="M-20 -50 C-30 -50 -32 -66 -18 -68 C-14 -78 4 -80 12 -70 C24 -72 30 -56 18 -50 Z"
        fill={CI.grassLight}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path d="M-16 -52 C-4 -48 8 -48 16 -52" stroke={CI.grassDeep} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      {/* golden wind-swirl highlight */}
      <path d="M-12 -64 q12 -6 22 0" stroke={CI.sunPale} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.9} />
      {/* glowing golden star-blossoms */}
      {[
        [-18, -47],
        [18, -46],
        [-4, -60],
        [8, -62],
      ].map(([bx, by], i) => (
        <circle key={i} cx={bx} cy={by} r={2.3} fill={CI.goldLight} stroke={INK} strokeWidth={1.1} />
      ))}
    </g>
  )
}

/**
 * Fluted Marble Temple Columns (`MarbleColumns`): asymmetric cluster of ivory-and-gold sky-ruin
 * pillars with scrolled capitals and a hovering golden wind-crystal between them.
 */
function MarbleColumns({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={26} />
      {/* stepped marble plinth base */}
      <rect x="-22" y="-5" width="44" height="7" rx="2" fill={CI.marbleShade} stroke={INK} strokeWidth={2} />
      {/* taller left fluted column */}
      <rect x="-16" y="-48" width="12" height="43" fill={CI.marble} stroke={INK} strokeWidth={2.2} />
      <rect x="-9" y="-48" width="5" height="43" fill={CI.marbleShade} opacity={0.65} />
      <path d="M-13 -43 V-9 M-9 -43 V-9" stroke={CI.marbleDeep} strokeWidth={1.3} strokeLinecap="round" />
      {/* scrolled Ionic capital on left column */}
      <rect x="-19" y="-53" width="18" height="5" rx="2" fill={CI.gold} stroke={INK} strokeWidth={1.9} />
      <circle cx="-18" cy="-50.5" r="2.6" fill={CI.marble} stroke={INK} strokeWidth={1.5} />
      <circle cx="-2" cy="-50.5" r="2.6" fill={CI.marble} stroke={INK} strokeWidth={1.5} />
      {/* shorter right broken column */}
      <path d="M4 -5 V-32 L10 -36 L16 -30 V-5 Z" fill={CI.marble} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M10 -36 L16 -30 V-5 H10 Z" fill={CI.marbleShade} opacity={0.65} />
      <path d="M7 -28 V-9 M11 -28 V-9" stroke={CI.marbleDeep} strokeWidth={1.3} strokeLinecap="round" />
      {/* levitating golden diamond crystal above the broken column */}
      <path
        className="ci-shimmer"
        d="M10 -52 L14 -45 L10 -38 L6 -45 Z"
        fill={CI.goldLight}
        stroke={INK}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
    </g>
  )
}

/**
 * Radiant Rainbow Bridge (`RainbowArc`) arching between two fluffy cumulus cloud pillows.
 */
function RainbowArc({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={28} />
      {/* 4-band cartoon rainbow arch */}
      <path d="M-24 -4 A24 24 0 0 1 24 -4" fill="none" stroke={INK} strokeWidth={15.5} strokeLinecap="round" />
      <path className="ci-shimmer" d="M-24 -4 A24 24 0 0 1 24 -4" fill="none" stroke={CI.coral} strokeWidth={11.5} strokeLinecap="round" />
      <path className="ci-shimmer" d="M-21 -4 A21 21 0 0 1 21 -4" fill="none" stroke={CI.goldLight} strokeWidth={8.5} strokeLinecap="round" />
      <path className="ci-shimmer" d="M-18 -4 A18 18 0 0 1 18 -4" fill="none" stroke={CI.grassLight} strokeWidth={5.5} strokeLinecap="round" />
      <path className="ci-shimmer" d="M-15 -4 A15 15 0 0 1 15 -4" fill="none" stroke={CI.water} strokeWidth={2.8} strokeLinecap="round" />
      <path d="M-13.5 -4 A13.5 13.5 0 0 1 13.5 -4" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      {/* left & right cloud cushions anchoring the rainbow */}
      {[-22, 22].map((cx) => (
        <g key={cx} transform={`translate(${cx} 0)`}>
          <path
            d="M-12 3 C-18 3 -18 -6 -10 -7 C-8 -13 2 -13 5 -7 C13 -7 13 3 8 3 Z"
            fill={CI.cloud}
            stroke={INK}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <path d="M-9 1 H6" stroke={CI.cloudGold} strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}
    </g>
  )
}

/**
 * Levitating Celestite Sky-Crystal (`LevitationCrystal`):
 * Carved stone pedestal ring above which a glowing cyan-and-gold crystal prism hovers with orbiting pebbles.
 */
function LevitationCrystal({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow rx={22} />
      <circle className="ci-shimmer" cx="0" cy="-22" r="24" fill="url(#ci-glow-cyan)" />
      {/* carved marble & slate pedestal base */}
      <ellipse cx="0" cy="-1" rx="16" ry="5" fill={CI.isleRock} stroke={INK} strokeWidth={2} />
      <ellipse cx="0" cy="-3" rx="11" ry="3.2" fill={CI.gold} stroke={INK} strokeWidth={1.5} />
      {/* hovering central celestite crystal + two side shards */}
      <path
        className="ci-shimmer"
        d="M-13 -14 L-17 -26 L-11 -31 L-6 -17 Z M13 -14 L17 -25 L11 -30 L6 -17 Z"
        fill={CI.crystal}
        stroke={INK}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <path
        className="ci-shimmer"
        d="M0 -42 L9 -28 L5 -10 L0 -6 L-5 -10 L-9 -28 Z"
        fill={CI.crystalLight}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path d="M0 -42 L9 -28 L5 -10 L0 -6 Z" fill={CI.crystal} opacity={0.65} />
      <path d="M-4 -27 L0 -36" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
      {/* orbiting golden sky-pebbles */}
      <circle cx="-16" cy="-11" r="2.2" fill={CI.goldLight} stroke={INK} strokeWidth={1.2} />
      <circle cx="16" cy="-12" r="2" fill={CI.goldLight} stroke={INK} strokeWidth={1.2} />
    </g>
  )
}

/**
 * Painted Sky-Lantern & Wind-Chime Post (`WindChimePost`) with cobalt pagoda cap,
 * brass chimes, and a fluttering coral-and-gold wind streamer.
 */
function WindChimePost({
  x,
  y,
  s = 1,
  flip = false,
}: {
  x: number
  y: number
  s?: number
  flip?: boolean
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={16} />
      <ellipse cx="0" cy="0" rx="11" ry="4" fill={CI.marbleShade} stroke={INK} strokeWidth={1.8} />
      {/* curved wooden post + cross-arm */}
      <path d="M-4 0 V-38 Q-4 -46 4 -46 H16" fill="none" stroke={INK} strokeWidth={4.4} strokeLinecap="round" />
      <path d="M-4 0 V-38 Q-4 -46 4 -46 H16" fill="none" stroke={CI.timber} strokeWidth={2.2} strokeLinecap="round" />
      {/* small cobalt pagoda roof over the chimes */}
      <path d="M0 -46 L10 -53 L20 -46 Z" fill={CI.roof} stroke={INK} strokeWidth={1.9} strokeLinejoin="round" />
      {/* 3 hanging golden wind-chime tubes */}
      <path d="M6 -45 V-35 M10 -45 V-32 M14 -45 V-36" stroke={INK} strokeWidth={2.8} strokeLinecap="round" />
      <path className="ci-shimmer" d="M6 -45 V-35 M10 -45 V-32 M14 -45 V-36" stroke={CI.goldLight} strokeWidth={1.6} strokeLinecap="round" />
      {/* fluttering coral wind streamer */}
      <path
        className="ci-shimmer"
        d="M10 -31 C14 -27 19 -29 23 -25 C18 -23 13 -25 9 -28 Z"
        fill={CI.coral}
        stroke={INK}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </g>
  )
}

/**
 * Stepped Sky-Waterfall Terrace (`SkyWaterfall`):
 * Two-tiered floating stone-and-meadow ledge where a bright turquoise stream plunges into
 * a billowing cumulus cloud-basin with rising mist curls (`.ci-mist`).
 */
function SkyWaterfall({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shadow rx={42} ry={8} />
      {/* upper sky-stone terrace */}
      <path
        d="M-36 -6 V-32 L-24 -38 H14 L24 -32 V-6 Z"
        fill={CI.isleRock}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path d="M6 -38 H14 L24 -32 V-6 H6 Z" fill={CI.isleRockDeep} opacity={0.55} />
      <path d="M-38 -32 C-38 -40 26 -40 26 -32 Z" fill={CI.grass} stroke={INK} strokeWidth={2} />
      {/* lower sky-stone basin ledge */}
      <path
        d="M-40 2 V-14 L-28 -18 H28 L38 -12 V2 Q0 6 -40 2 Z"
        fill={CI.isleRockDeep}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      {/* upper pool + cascading turquoise waterfall */}
      <ellipse cx="-4" cy="-33" rx="14" ry="3.6" fill={CI.water} stroke={INK} strokeWidth={1.5} />
      <path
        className="ci-shimmer"
        d="M-11 -32 C-12 -22 -13 -14 -14 -1 L4 -1 C3 -14 2 -22 1 -32 Z"
        fill="url(#ci-water)"
        stroke={INK}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <path
        className="ci-shimmer"
        d="M-7 -30 L-8 -3 M-2 -30 L-2 -3"
        stroke={CI.waterFoam}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeDasharray="5 5"
      />
      {/* foaming cumulus cloud-mist catch-basin at the bottom */}
      <path
        d="M-28 4 C-36 4 -36 -6 -24 -7 C-18 -14 -4 -14 2 -8 C10 -14 22 -12 26 -6 C34 -5 34 4 24 4 Z"
        fill={CI.cloud}
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path d="M-22 2 H20" stroke={CI.cloudGold} strokeWidth={2.2} strokeLinecap="round" />
      {/* rising waterfall mist curl */}
      <g transform="translate(-4 -8)">
        <g className="ci-mist" fill="none" stroke={CI.cloud} strokeWidth={4} strokeLinecap="round">
          <path d="M0 -2 c-5 -6 4 -11 -2 -17" />
        </g>
      </g>
    </g>
  )
}

/**
 * Carved Wind-Compass Monolith (`WindMonolith`): tapered sky-slate stone with a glowing golden
 * wind-swirl & lightning rune (symbolizing discovered attack & double check).
 */
function WindMonolith({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow rx={17} />
      <ellipse cx="0" cy="-2" rx="15" ry="5.5" fill={CI.marbleShade} stroke={INK} strokeWidth={2} />
      <path d="M-10 -2 L-7 -34 L0 -42 L7 -34 L10 -2 Z" fill={CI.isleRockDeep} stroke={INK} strokeWidth={2.3} strokeLinejoin="round" />
      <path d="M0 -42 L7 -34 L10 -2 H0 Z" fill={CI.isleRockDark} opacity={0.55} />
      <path d="M-5 -32 L-1 -38" stroke="rgba(255,253,240,.6)" strokeWidth={1.8} strokeLinecap="round" />
      {/* glowing golden four-point wind-star & spiral rune */}
      <path
        className="ci-shimmer"
        d="M0 -31 L3.5 -23 L0 -15 L-3.5 -23 Z M-5 -23 H5 M0 -15 V-9"
        stroke={CI.goldLight}
        strokeWidth={2}
        fill={CI.gold}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  )
}

/**
 * Drifting Sky Floater (`SkyFloater`, `.ci-floater`):
 * Alternates between a colourful diamond Sky-Kite with a ribbon tail (`kind = 0`)
 * and a cute soaring white-and-azure Cloud-Swallow bird (`kind = 1`).
 */
function SkyFloater({
  x,
  y,
  s = 1,
  delay = 0,
  kind = 0,
}: {
  x: number
  y: number
  s?: number
  delay?: number
  kind?: number
}) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})`}>
      <g className="ci-floater" style={{ animationDelay: `${delay.toFixed(2)}s` }}>
        {kind === 0 ? (
          <g>
            {/* waving kite tail with two ribbon bows */}
            <path d="M0 7 C-3 13 4 17 0 23" stroke={INK} strokeWidth={1.6} fill="none" strokeLinecap="round" />
            <path d="M-3 12 L3 14 M-2 18 L4 19" stroke={CI.goldLight} strokeWidth={2.2} strokeLinecap="round" />
            {/* diamond kite body */}
            <path d="M0 -8 L7 -1 L0 8 L-7 -1 Z" fill={CI.coral} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
            <path d="M0 -8 L7 -1 L0 8 Z" fill={CI.goldLight} opacity={0.85} />
            <path d="M0 -8 V8 M-7 -1 H7" stroke={INK} strokeWidth={1.1} />
          </g>
        ) : (
          <g>
            {/* soaring cartoon cloud-swallow with forked tail */}
            <path
              d="M-11 -3 Q-4 -9 0 -2 Q4 -9 11 -3 Q5 1 2 3 L4 7 L0 5 L-4 7 L-2 3 Q-5 1 -11 -3 Z"
              fill={CI.cloud}
              stroke={INK}
              strokeWidth={1.6}
              strokeLinejoin="round"
            />
            <path d="M-8 -3 Q-4 -6 0 -1 Q4 -6 8 -3" stroke={CI.water} strokeWidth={1.5} fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>
    </g>
  )
}

/** Four-point golden sun-sparkle; scales and rotates in place (`.ci-sparkle`). */
function Sparkle({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        className="ci-sparkle"
        style={{ animationDelay: `${delay}s` }}
        d="M0 -8 Q1.2 -1.2 8 0 Q1.2 1.2 0 8 Q-1.2 1.2 -8 0 Q-1.2 -1.2 0 -8 Z"
        fill={CI.crystalSparkle}
        stroke={INK}
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
    </g>
  )
}

/**
 * Celestial Cloud-Lagoon (`CloudLagoon`):
 * Turquoise sky-pool rimmed by carved marble stones and fluffy cumulus cloud cushions,
 * with concentric shimmer rings (`.ci-shimmer`) and rising pearlescent sky-bubbles (`.ci-bubble`).
 */
function CloudLagoon({
  x,
  y,
  rx,
  ry,
  seed,
  children,
}: {
  x: number
  y: number
  rx: number
  ry: number
  seed: number
  children?: ReactNode
}) {
  const r = seeded(seed)
  const bubbles = Array.from({ length: 5 }, () => ({
    bx: (r() - 0.5) * rx * 1.2,
    by: (r() - 0.5) * ry * 1.0,
    br: 2.3 + r() * 2.3,
    delay: -r() * 4.4,
  }))
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* marble & cloud-stone outer coping rim */}
      <ellipse rx={rx + 9} ry={ry + 5.5} cy={2.5} fill={CI.marbleShade} stroke={INK} strokeWidth={1.9} />
      <ellipse rx={rx} ry={ry} fill="url(#ci-water)" stroke={INK} strokeWidth={2.4} />
      <ellipse className="ci-shimmer" rx={rx - 7} ry={ry - 5} cy={-1.5} fill="none" stroke={CI.waterLight} strokeWidth={2} opacity={0.85} />
      {/* gentle water-surface wave lines */}
      <path
        className="ci-shimmer"
        d={`M${-rx * 0.52} ${-ry * 0.36} q${rx * 0.18} -4 ${rx * 0.36} 0 M${rx * 0.12} ${ry * 0.25} q${rx * 0.16} -3 ${rx * 0.32} 0`}
        stroke={CI.waterFoam}
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
        style={{ animationDelay: `${-r() * 3}s` }}
      />
      {/* rising pearlescent sky-bubbles */}
      {bubbles.map(({ bx, by, br, delay }, i) => (
        <g key={i} transform={`translate(${bx.toFixed(1)} ${by.toFixed(1)})`}>
          <g className="ci-bubble" style={{ animationDelay: `${delay.toFixed(2)}s` }}>
            <circle r={br} fill={CI.waterLight} stroke={CI.waterDeep} strokeWidth={1.2} />
            <circle cx={-br * 0.3} cy={-br * 0.3} r={br * 0.34} fill="#FFFFFF" />
          </g>
        </g>
      ))}
      {/* fluffy cloud pillow on the right rim of the lagoon */}
      <path
        d={`M${rx * 0.42} ${ry * 0.62} C${rx * 0.32} ${ry * 0.62} ${rx * 0.32} ${ry * 0.25} ${rx * 0.48} ${ry * 0.22} C${rx * 0.56} ${ry * 0.02} ${rx * 0.78} ${ry * 0.05} ${rx * 0.84} ${ry * 0.24} C${rx * 0.98} ${ry * 0.26} ${rx * 0.96} ${ry * 0.64} ${rx * 0.8} ${ry * 0.64} Z`}
        fill={CI.cloud}
        stroke={INK}
        strokeWidth={1.7}
      />
      {children}
    </g>
  )
}

/**
 * Friendly 3/4-view Baby Sky-Griffin (`SkyGriffin`) perched on a mossy sky-stone island in the lagoon:
 * golden lion cub body with tufted tail, snowy-white feathered head & crest, azure-tipped wings,
 * golden beak, rosy cheeks, and blinking eyes (`.ci-griffin-lid`).
 */
function SkyGriffin({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {/* mossy marble basking rock */}
      <ellipse cx="0" cy="4" rx="25" ry="7" fill={CI.isleRockDeep} stroke={INK} strokeWidth={1.8} />
      <ellipse cx="0" cy="2" rx="22" ry="5.5" fill={CI.marble} stroke={INK} strokeWidth={1.6} />
      {/* curled golden tail with white cloud-tuft tip */}
      <path d="M9 -4 C20 -4 25 -13 20 -20" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M9 -4 C20 -4 25 -13 20 -20" stroke={CI.griffinBody} strokeWidth={3.6} fill="none" strokeLinecap="round" />
      <circle cx="20" cy="-21" r="4.5" fill={CI.griffinFeather} stroke={INK} strokeWidth={1.6} />
      {/* plump golden body */}
      <path
        d="M-13 1 C-14 -10 -7 -16 3 -15 C12 -14 15 -7 13 1 C7 3 -7 3 -13 1 Z"
        fill={CI.griffinBody}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      {/* folded feathered sky-wing with azure tips */}
      <path
        d="M-3 -13 C5 -14 13 -10 14 -3 C9 -1 1 -1 -3 -5 Z"
        fill={CI.griffinFeather}
        stroke={INK}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <path d="M3 -10 C8 -10 12 -7 12 -3" stroke={CI.griffinWing} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      {/* little golden paws */}
      <ellipse cx="-9" cy="2" rx="3.8" ry="2.2" fill={CI.griffinShade} stroke={INK} strokeWidth={1.4} />
      <ellipse cx="1" cy="2.2" rx="3.8" ry="2.2" fill={CI.griffinShade} stroke={INK} strokeWidth={1.4} />
      {/* snowy-white feathered head + ear-tufts */}
      <path
        d="M-17 -22 L-22 -28 L-13 -25 Z M2 -22 L7 -28 L-2 -25 Z"
        fill={CI.griffinFeather}
        stroke={INK}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <ellipse cx="-7.5" cy="-18.5" rx="11" ry="8.5" fill={CI.griffinFeather} stroke={INK} strokeWidth={2.2} />
      {/* blinking eyes (static fallback scale(1 0) keeps eyes open under reduced motion) */}
      {[-11.8, -3.2].map((ex) => (
        <g key={ex} transform={`translate(${ex} -20)`}>
          <circle r="3.2" fill="#FFFFFF" stroke={INK} strokeWidth={1.5} />
          <circle cx="0.3" cy="0.3" r="1.6" fill={INK} />
          <circle cx="0.8" cy="-0.4" r="0.6" fill="#FFFFFF" />
          <rect
            className="ci-griffin-lid"
            transform="scale(1 0)"
            x="-3.3"
            y="-3.3"
            width="6.6"
            height="6.6"
            rx="3.3"
            fill={CI.griffinFeather}
            stroke={INK}
            strokeWidth={1.3}
          />
        </g>
      ))}
      <circle cx="-14.2" cy="-16.2" r="1.7" fill={CI.cheek} opacity={0.85} />
      <circle cx="-0.8" cy="-16.2" r="1.7" fill={CI.cheek} opacity={0.85} />
      {/* smiling golden eagle beak */}
      <path d="M-10 -16 L-7.5 -12 L-5 -16 Z" fill={CI.gold} stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
    </g>
  )
}

/**
 * Smiling Winged Cloud-Sheep (`CloudSheep`) near the start windmill:
 * puffy cream-white cumulus fleece, curled golden horns, tiny sky-wings, and a happy face.
 */
function CloudSheep({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow rx={23} ry={5.5} />
      {/* four little legs */}
      <rect x="-11" y="-5" width="4.2" height="7" rx="2" fill={CI.isleRockDark} stroke={INK} strokeWidth={1.6} />
      <rect x="-5" y="-4" width="4.2" height="6" rx="2" fill={CI.isleRockDark} stroke={INK} strokeWidth={1.6} />
      <rect x="4" y="-5" width="4.2" height="7" rx="2" fill={CI.isleRockDark} stroke={INK} strokeWidth={1.6} />
      <rect x="10" y="-4" width="4.2" height="6" rx="2" fill={CI.isleRockDark} stroke={INK} strokeWidth={1.6} />
      {/* puffy cumulus cloud wool body */}
      <path
        d="M-15 -3 C-22 -3 -23 -14 -15 -16 C-13 -24 -2 -25 3 -19 C9 -25 19 -22 19 -14 C25 -12 24 -3 16 -3 Z"
        fill={CI.cloud}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path d="M-13 -5 Q2 -2 15 -5" stroke={CI.cloudGold} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {/* tiny golden-and-azure feather wing on its back */}
      <path
        d="M-1 -13 C5 -19 13 -17 12 -10 C8 -8 2 -9 -1 -13 Z"
        fill={CI.goldLight}
        stroke={INK}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      {/* friendly head on the left + curled golden horn */}
      <ellipse cx="-16" cy="-12" rx="7.5" ry="6.2" fill={CI.marbleShade} stroke={INK} strokeWidth={2} />
      <path d="M-13 -17 C-9 -21 -4 -17 -7 -13" fill="none" stroke={INK} strokeWidth={3.6} strokeLinecap="round" />
      <path d="M-13 -17 C-9 -21 -4 -17 -7 -13" fill="none" stroke={CI.gold} strokeWidth={1.8} strokeLinecap="round" />
      {/* wool tuft on forehead */}
      <path d="M-21 -16 C-21 -21 -12 -21 -12 -16 Z" fill={CI.cloud} stroke={INK} strokeWidth={1.6} />
      <circle cx="-18.5" cy="-13" r="2.2" fill="#FFFFFF" stroke={INK} strokeWidth={1.2} />
      <circle cx="-18.8" cy="-13" r="1.1" fill={INK} />
      <circle cx="-20" cy="-10" r="1.4" fill={CI.cheek} opacity={0.85} />
      <path d="M-21 -9.5 q2.5 2 4.8 0" stroke={INK} strokeWidth={1.3} fill="none" strokeLinecap="round" />
    </g>
  )
}

/**
 * Sky-Sail Windmill & Airship Mooring Dock (`SkyWindmill`) at the start:
 * Round ivory-marble windmill tower with cobalt dome, four large canvas wind-sails,
 * wooden airship boarding jetty with a tethered mini hot-air balloon skiff (`.ci-ghost-isle`),
 * brass telescope on a tripod, and a puffing cloud-kettle chimney (`.ci-mist`).
 */
function SkyWindmill({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="-2" cy="4" rx="74" ry="10" fill="rgba(45,68,98,.18)" />

      {/* wooden airship mooring jetty + tethered mini hot-air balloon skiff on the right */}
      <g transform="translate(36 -16)">
        <rect x="-14" y="4" width="38" height="6" rx="2" fill={CI.timber} stroke={INK} strokeWidth={2} />
        <rect x="-6" y="10" width="5" height="10" fill={CI.timberDeep} stroke={INK} strokeWidth={1.7} />
        <rect x="14" y="10" width="5" height="10" fill={CI.timberDeep} stroke={INK} strokeWidth={1.7} />
        {/* brass mooring bollard + tether rope */}
        <rect x="16" y="-2" width="5" height="6" rx="1.5" fill={CI.gold} stroke={INK} strokeWidth={1.6} />
        <path d="M18.5 -2 C22 -14 24 -24 22 -34" stroke={INK} strokeWidth={1.6} fill="none" strokeDasharray="3 2" />
        {/* tethered mini sky-skiff balloon bobbing gently */}
        <g transform="translate(22 -48)">
          <g className="ci-ghost-isle">
            {/* wicker gondola basket */}
            <rect x="-6" y="8" width="12" height="8" rx="2" fill={CI.timber} stroke={INK} strokeWidth={1.7} />
            <path d="M-4 2 L-4 8 M4 2 L4 8" stroke={INK} strokeWidth={1.3} />
            {/* striped azure & gold hot-air balloon envelope */}
            <path
              d="M-13 -8 C-13 -20 13 -20 13 -8 C13 -1 8 3 5 4 H-5 C-8 3 -13 -1 -13 -8 Z"
              fill={CI.roofLight}
              stroke={INK}
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <path
              d="M-6 -16 C-2 -18 2 -18 6 -16 C7 -8 5 0 3 4 H-3 C-5 0 -7 -8 -6 -16 Z"
              fill={CI.goldLight}
              stroke={INK}
              strokeWidth={1.4}
            />
            <path d="M-12 -8 H12" stroke={CI.coral} strokeWidth={2.2} />
          </g>
        </g>
      </g>

      {/* brass cloud-pipe chimney + rising white cloud-puff */}
      <g transform="translate(-24 -68)">
        <g className="ci-mist" fill="none" stroke={CI.cloud} strokeWidth={4.8} strokeLinecap="round">
          <path d="M0 -4 c-6 -7 5 -13 -2 -20 c-6 -7 5 -12 -1 -18" />
        </g>
      </g>
      <path d="M-28 -48 L-26 -66 H-19 L-17 -48 Z" fill={CI.goldDeep} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <rect x="-28" y="-69" width="11" height="4" rx="1.5" fill={CI.gold} stroke={INK} strokeWidth={1.6} />

      {/* marble terrace base */}
      <rect x="-54" y="-10" width="96" height="12" rx="4" fill={CI.marbleShade} stroke={INK} strokeWidth={2.2} />
      <path d="M-36 -10 V2 M-16 -10 V2 M4 -10 V2 M24 -10 V2" stroke={CI.marbleDeep} strokeWidth={1.4} />

      {/* tapered ivory-marble windmill tower */}
      <path
        d="M-28 -10 L-22 -64 H10 L16 -10 Z"
        fill={CI.marble}
        stroke={INK}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path d="M2 -64 H10 L16 -10 H4 Z" fill={CI.marbleShade} opacity={0.65} />
      {/* wooden balcony gallery band */}
      <rect x="-27" y="-38" width="42" height="5.5" rx="2" fill={CI.timber} stroke={INK} strokeWidth={1.9} />
      {/* cobalt-blue domed cap on the windmill tower */}
      <path
        d="M-24 -62 C-24 -82 12 -82 12 -62 Z"
        fill={CI.roof}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path d="M-16 -68 Q-6 -76 4 -68" stroke={CI.roofLight} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <circle cx="-6" cy="-81" r="3.2" fill={CI.gold} stroke={INK} strokeWidth={1.6} />

      {/* arched wooden doorway + round sky-window */}
      <circle cx="-6" cy="-20" r="18" fill="url(#ci-glow-warm)" />
      <path d="M-15 -10 V-22 A9 9 0 0 1 3 -22 V-10 Z" fill={CI.timberDeep} stroke={INK} strokeWidth={2.2} />
      <path d="M-12 -10 V-21 A6 6 0 0 1 0 -21 V-10 Z" fill={CI.goldLight} opacity={0.9} />
      <circle cx="-6" cy="-48" r="5" fill={CI.roofDeep} stroke={INK} strokeWidth={1.8} />

      {/* four-bladed canvas Windmill Sails centered on the upper tower (`cx = -6, cy = -58`) */}
      <g transform="translate(-6 -58)">
        {[35, 125, 215, 305].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <path d="M0 0 H38" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
            <path
              d="M8 0 H36 L34 10 H10 Z"
              fill={CI.sail}
              stroke={INK}
              strokeWidth={1.7}
              strokeLinejoin="round"
            />
            <path d="M26 0 H34 L32.5 10 H25 Z" fill={CI.sailStripe} />
            <path d="M16 0 V10 M24 0 V10" stroke={CI.timber} strokeWidth={1.2} />
          </g>
        ))}
        <circle r="5" fill={CI.gold} stroke={INK} strokeWidth={2} />
        <circle r="1.8" fill={CI.sunPale} />
      </g>

      {/* brass stargazer's telescope on a tripod on the left terrace */}
      <g transform="translate(-44 -10)">
        <path d="M0 -10 L-7 0 M0 -10 L7 0 M0 -10 V0" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
        <g transform="translate(0 -12) rotate(-24)">
          <path d="M-8 -2.5 L8 -4.5 V4.5 L-8 2.5 Z" fill={CI.gold} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          <ellipse cx="8" cy="0" rx="1.8" ry="4.5" fill={CI.crystalLight} stroke={INK} strokeWidth={1.5} />
        </g>
      </g>
    </g>
  )
}

/** Signpost at the start with a cloud-stone base, brass sun-weathervane, and a striped sky windsock. */
function Signpost({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 V-36" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      {/* brass weathervane arrow at top */}
      <path d="M-8 -36 H8 M4 -39 L9 -36 L4 -33" stroke={INK} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="0" cy="-36" r="2.8" fill={CI.gold} stroke={INK} strokeWidth={1.5} />
      {/* side arm with fluttering striped windsock */}
      <g transform="translate(-2 -26)">
        <path
          d="M-2 0 L-22 -4 L-20 4 L-2 5 Z"
          fill={CI.coral}
          stroke={INK}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        <path d="M-8 -1.2 L-8 4.4 M-14 -2.4 L-14 4.2" stroke={CI.goldLight} strokeWidth={2.6} />
      </g>
      {/* cloud-stone & puff base */}
      <ellipse cx="3" cy="1" rx="12" ry="4.5" fill={CI.isleRock} stroke={INK} strokeWidth={1.8} />
      <ellipse cx="-4" cy="2" rx="7.5" ry="3.2" fill={CI.cloud} stroke={INK} strokeWidth={1.5} />
    </g>
  )
}

/**
 * Floating Sun-Lantern Beacon (`SkyBeacon`) on a fluted marble pillar left of the chest;
 * its sun-halo and rays brighten and pulse when the chest is ready (`.ci-citadel-glow`).
 */
function SkyBeacon({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <ellipse className="ci-citadel-glow" cx="2" cy="2" rx="44" ry="12" fill="url(#ci-glow-sun)" />
      <circle className="ci-citadel-glow" cx="4" cy="-50" r="54" fill="url(#ci-glow-sun)" />
      <path
        className="ci-citadel-glow"
        d="M4 -86 V-96 M-24 -50 H-34 M32 -50 H42 M-16 -72 l-7 -7 M24 -72 l7 -7"
        stroke={CI.goldLight}
        strokeWidth={2.8}
        strokeLinecap="round"
      />
      <Shadow rx={16} />
      {/* fluted marble pedestal & curved brass swan-neck arm */}
      <rect x="-9" y="-32" width="14" height="34" rx="2" fill={CI.marble} stroke={INK} strokeWidth={2.2} />
      <path d="M-4 -28 V0 M0 -28 V0" stroke={CI.marbleDeep} strokeWidth={1.3} />
      <rect x="-12" y="-35" width="20" height="5" rx="2" fill={CI.gold} stroke={INK} strokeWidth={1.8} />
      <path d="M-2 -35 C-2 -56 4 -68 12 -64" fill="none" stroke={INK} strokeWidth={3.2} strokeLinecap="round" />
      {/* suspended brass armillary ring & glowing sun-star lantern */}
      <circle cx="6" cy="-50" r="14" fill="none" stroke={INK} strokeWidth={4.2} />
      <circle cx="6" cy="-50" r="14" fill="none" stroke={CI.gold} strokeWidth={2.2} />
      <path
        d="M6 -62 L9.5 -53.5 L18 -50 L9.5 -46.5 L6 -38 L2.5 -46.5 L-6 -50 L2.5 -53.5 Z"
        fill={CI.goldLight}
        stroke={INK}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <circle cx="6" cy="-50" r="4" fill={CI.sunPale} />
    </g>
  )
}

/**
 * The Summit Landmark at the chest end (`CloudCitadel`):
 * A luminous Celestial Sky-Sanctuary & Observatory perched on a floating island:
 * ivory-marble colonnade walls, a ribbed cobalt-and-gold observatory dome crowned by a brass
 * celestial astrolabe, twin fluted wind-towers with onion spires and waving pennants (`.map-flag`),
 * cascading sky-waterfalls into a turquoise cloud-moat, an arched rainbow-marble sky-bridge,
 * and a central Golden Sunburst Portal (`.ci-citadel-glow`).
 */
function CloudCitadel({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="10" rx="166" ry="20" fill="rgba(45,68,98,.2)" />
      {/* summit astrolabe & dome sun-glow */}
      <ellipse className="ci-shimmer" cx="0" cy="-148" rx="92" ry="44" fill="url(#ci-glow-sun)" />

      {/* summit banner pole & waving red flag behind the astrolabe */}
      <path d="M0 -168 V-208" stroke={INK} strokeWidth={2.6} />
      <path className="map-flag" d="M0 -208 L30 -200 L0 -192 Z" fill={CI.flag} stroke={INK} strokeWidth={2} />

      {/* brass celestial astrolabe sun-rings crowning the central dome */}
      <circle cx="0" cy="-154" r="16" fill="none" stroke={INK} strokeWidth={4.2} />
      <circle cx="0" cy="-154" r="16" fill="none" stroke={CI.gold} strokeWidth={2.2} />
      <ellipse cx="0" cy="-154" rx="22" ry="7" transform="rotate(-20 0 -154)" fill="none" stroke={INK} strokeWidth={3.2} />
      <ellipse cx="0" cy="-154" rx="22" ry="7" transform="rotate(-20 0 -154)" fill="none" stroke={CI.goldLight} strokeWidth={1.6} />
      <circle className="ci-citadel-glow" cx="0" cy="-154" r="6.5" fill={CI.goldLight} stroke={INK} strokeWidth={1.8} />

      {/* grand central ribbed cobalt-blue Observatory Dome */}
      <path
        d="M-68 -78 C-68 -126 -38 -144 0 -144 C38 -144 68 -126 68 -78 Z"
        fill={CI.roof}
        stroke={INK}
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      <path d="M8 -143 C38 -141 68 -124 68 -78 H22 C22 -112 16 -132 8 -143 Z" fill={CI.roofDeep} opacity={0.6} />
      {/* golden meridian ribs on the dome */}
      <path
        d="M-36 -78 C-34 -116 -18 -138 0 -144 C18 -138 34 -116 36 -78 M0 -144 V-78"
        fill="none"
        stroke={CI.gold}
        strokeWidth={2.2}
      />
      <rect x="-74" y="-82" width="148" height="7" rx="3" fill={CI.gold} stroke={INK} strokeWidth={2} />

      {/* main ivory-marble sanctuary rotunda & side colonnade wings */}
      <rect x="-118" y="-58" width="236" height="62" rx="6" fill={CI.marble} stroke={INK} strokeWidth={2.6} />
      <rect x="34" y="-58" width="84" height="62" fill={CI.marbleShade} opacity={0.55} />
      <rect x="-70" y="-76" width="140" height="80" rx="4" fill={CI.marble} stroke={INK} strokeWidth={2.6} />
      {/* golden frieze band + arched celestial windows on the side wings */}
      <rect x="-120" y="-62" width="240" height="6" rx="2" fill={CI.gold} stroke={INK} strokeWidth={1.8} />
      {[-92, -68, 68, 92].map((wx) => (
        <path
          key={wx}
          d={`M${wx - 7} -22 V-42 A7 7 0 0 1 ${wx + 7} -42 V-22 Z`}
          fill={CI.roofDeep}
          stroke={INK}
          strokeWidth={1.8}
        />
      ))}

      {/* twin fluted marble Wind-Towers on the left and right (`x = -104` and `x = 104`) */}
      {[-104, 104].map((tx) => (
        <g key={tx} transform={`translate(${tx} 0)`}>
          <rect x="-20" y="-106" width="40" height="110" rx="3" fill={CI.marble} stroke={INK} strokeWidth={2.5} />
          <rect x="2" y="-106" width="18" height="110" fill={CI.marbleShade} opacity={0.55} />
          <path d="M-10 -98 V-12 M0 -98 V-12 M10 -98 V-12" stroke={CI.marbleDeep} strokeWidth={1.4} />
          {/* arched belfry window */}
          <path d="M-8 -72 V-88 A8 8 0 0 1 8 -88 V-72 Z" fill={CI.goldLight} stroke={INK} strokeWidth={1.8} />
          {/* cobalt onion-spire roof */}
          <path
            d="M-24 -106 C-26 -122 -10 -132 0 -146 C10 -132 26 -122 24 -106 Z"
            fill={CI.roof}
            stroke={INK}
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
          <rect x="-24" y="-108" width="48" height="5" rx="2" fill={CI.gold} stroke={INK} strokeWidth={1.7} />
          <path d="M0 -146 V-164" stroke={INK} strokeWidth={2.2} />
        </g>
      ))}
      {/* separate `.map-flag` paths so each pennant waves around its own pole (`0% 50%`) */}
      <path className="map-flag" d="M-104 -164 L-84 -159 L-104 -154 Z" fill={CI.pennant} stroke={INK} strokeWidth={1.8} />
      <path className="map-flag" d="M104 -164 L124 -159 L104 -154 Z" fill={CI.pennant} stroke={INK} strokeWidth={1.8} />

      {/* two turquoise sky-streams cascading down from the wing fountains into the cloud moat */}
      <path
        className="ci-shimmer"
        d="M-80 -18 C-84 -6 -92 2 -96 10 M80 -18 C84 -6 92 2 96 10"
        stroke={CI.water}
        strokeWidth={9}
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="ci-shimmer"
        d="M-80 -18 C-84 -6 -92 2 -96 10 M80 -18 C84 -6 92 2 96 10"
        stroke={CI.waterFoam}
        strokeWidth={3.2}
        fill="none"
        strokeLinecap="round"
      />

      {/* turquoise sky-lagoon moat & billowing cloud cushions around the citadel base */}
      <path
        d="M-164 8 C-134 -6 134 -6 164 8 C126 24 -126 24 -164 8 Z"
        fill={CI.marbleShade}
        stroke={INK}
        strokeWidth={2.3}
      />
      <path
        className="ci-shimmer"
        d="M-148 8 C-116 -2 116 -2 148 8 C112 19 -112 19 -148 8 Z"
        fill="url(#ci-water)"
      />
      {/* fluffy cumulus cloud banks framing the left and right of the citadel */}
      <path
        d="M-168 6 C-182 6 -182 -12 -164 -14 C-160 -28 -138 -28 -130 -16 C-122 -24 -104 -22 -100 -10 C-88 -10 -88 6 -102 8 Z"
        fill={CI.cloud}
        stroke={INK}
        strokeWidth={2.1}
        strokeLinejoin="round"
      />
      <path
        d="M102 8 C88 6 88 -10 100 -10 C104 -22 122 -24 130 -16 C138 -28 160 -28 164 -14 C182 -12 182 6 168 6 Z"
        fill={CI.cloud}
        stroke={INK}
        strokeWidth={2.1}
        strokeLinejoin="round"
      />

      {/* central Golden Sunburst Portal Arch (`.ci-citadel-glow`) */}
      <circle className="ci-citadel-glow" cx="0" cy="-24" r="52" fill="url(#ci-glow-sun)" />
      <path d="M-34 4 V-34 A34 34 0 0 1 34 -34 V4 Z" fill={CI.roofDeep} stroke={INK} strokeWidth={2.6} />
      <path className="ci-shimmer" d="M-26 4 V-32 A26 26 0 0 1 26 -32 V4 Z" fill={CI.gold} opacity={0.9} />
      <ellipse className="ci-citadel-glow" cx="0" cy="-18" rx="20" ry="25" fill="url(#ci-glow-sun)" />
      {/* golden sun-ray arch molding + winged sun keystone crest */}
      <path d="M-40 -32 A40 40 0 0 1 40 -32" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <path d="M-40 -32 A40 40 0 0 1 40 -32" fill="none" stroke={CI.gold} strokeWidth={4.6} strokeLinecap="round" />
      <path
        d="M-22 -74 C-14 -80 -6 -78 0 -74 C6 -78 14 -80 22 -74 C14 -68 6 -68 0 -70 C-6 -68 -14 -68 -22 -74 Z"
        fill={CI.cloud}
        stroke={INK}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <circle cx="0" cy="-74" r="5.5" fill={CI.goldLight} stroke={INK} strokeWidth={1.8} />

      {/* arched marble & rainbow sky-bridge spanning the moat to the portal */}
      <path
        d="M-68 20 C-56 4 -20 4 -8 20 Z"
        fill={CI.marble}
        stroke={INK}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path d="M-62 18 C-52 8 -24 8 -14 18" fill="none" stroke={CI.coral} strokeWidth={2.8} strokeLinecap="round" />
      <path d="M-60 20 C-50 11 -26 11 -16 20" fill="none" stroke={CI.goldLight} strokeWidth={2.4} strokeLinecap="round" />
      <rect x="-44" y="0" width="88" height="7" rx="2.5" fill={CI.marble} stroke={INK} strokeWidth={1.8} />
    </g>
  )
}

/**
 * Middle horizon layer: billowing sunlit cumulus cloud-cliff bank (`cumulusBankPath`).
 */
function cumulusBankPath(baseY: number, bottomY: number) {
  return `M0 ${baseY - 14} C22 ${baseY - 46} 68 ${baseY - 48} 88 ${baseY - 18} C112 ${baseY - 58} 174 ${baseY - 58} 198 ${baseY - 20} C224 ${baseY - 52} 282 ${baseY - 54} 306 ${baseY - 20} C332 ${baseY - 56} 378 ${baseY - 48} ${MAP_W} ${baseY - 16} V${bottomY} H0 Z`
}

/**
 * Geisterruine teaser (World 7 · Ghost Ruins):
 * A friendly twilight-violet floating ruin island with a crooked Gothic archway, crenellated tower
 * with warm glowing lantern-window, soft lavender mist, and two cute smiling little cartoon ghosts
 * holding a glowing lantern (`.ci-ghost-isle`). Positioned at `y = 124` below the `WORLD 7` sign.
 */
function GhostRuinsTeaser({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="ci-ghost-isle">
        {/* small companion floating ruin rock on the left */}
        <g transform="translate(-58 -2) scale(0.62)">
          <path d="M-24 0 L-10 26 L4 18 L14 28 L24 0 Z" fill={CI.ghostRock} stroke="rgba(47,36,32,.6)" strokeWidth={2} strokeLinejoin="round" />
          <path d="M0 0 L14 28 L24 0 Z" fill={CI.ghostRockDeep} opacity={0.65} />
          <path d="M-28 2 C-28 -8 28 -8 28 2 Z" fill={CI.ghostGrass} stroke="rgba(47,36,32,.6)" strokeWidth={2} />
          {/* crooked broken pillar */}
          <path d="M-6 0 L-4 -18 L5 -15 L4 0 Z" fill={CI.ghostStone} stroke="rgba(47,36,32,.6)" strokeWidth={1.8} />
          <path d="M-30 4 C-38 4 -38 -6 -26 -6 C-20 -12 -8 -10 -4 -4 C4 -10 18 -10 24 -4 C34 -4 34 6 24 6 Z" fill={CI.ghostMist} stroke="rgba(47,36,32,.38)" strokeWidth={1.6} />
        </g>

        {/* main floating ghost-ruin island underside */}
        <path
          d="M-46 4 L-28 34 L-12 22 L0 42 L14 24 L30 34 L46 4 Z"
          fill={CI.ghostRock}
          stroke="rgba(47,36,32,.65)"
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
        <path d="M0 4 L0 42 L14 24 L30 34 L46 4 Z" fill={CI.ghostRockDeep} opacity={0.65} />
        <path
          d="M-50 4 C-50 -8 -24 -12 0 -12 C24 -12 50 -8 50 4 Q25 10 0 6 Q-25 10 -50 4 Z"
          fill={CI.ghostGrass}
          stroke="rgba(47,36,32,.65)"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* broken Gothic stone archway on the left of the island */}
        <path
          d="M-34 2 V-18 C-34 -28 -16 -28 -16 -18 V2 H-21 V-16 C-21 -21 -29 -21 -29 -16 V2 Z"
          fill={CI.ghostStone}
          stroke="rgba(47,36,32,.65)"
          strokeWidth={1.8}
          strokeLinejoin="round"
        />

        {/* slightly tilted Gothic ruin tower + crooked purple spire roof */}
        <g transform="translate(6 0) rotate(3)">
          <rect x="-12" y="-32" width="24" height="34" rx="2" fill={CI.ghostStone} stroke="rgba(47,36,32,.65)" strokeWidth={2} />
          <rect x="2" y="-32" width="10" height="34" fill={CI.ghostStoneDeep} opacity={0.55} />
          <path d="M-16 -30 L0 -49 L16 -30 Z" fill={CI.ghostRoof} stroke="rgba(47,36,32,.65)" strokeWidth={2} strokeLinejoin="round" />
          {/* warm glowing Gothic arched window */}
          <path d="M-4 -14 V-23 A4 4 0 0 1 4 -23 V-14 Z" fill={CI.ghostWindow} stroke="rgba(47,36,32,.6)" strokeWidth={1.5} />
        </g>

        {/* friendly little smiling cartoon ghost floating on the right with a tiny warm lantern */}
        <g transform="translate(34 -20)">
          <path
            d="M-8 6 C-8 -5 8 -5 8 6 L8 13 L5 10 L2 13 L-1 10 L-4 13 L-8 10 Z"
            fill="#FFFFFF"
            stroke="rgba(47,36,32,.65)"
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <circle cx="-2.4" cy="2" r="1.2" fill={INK} />
          <circle cx="2.4" cy="2" r="1.2" fill={INK} />
          <circle cx="-4.2" cy="4" r="1.2" fill={CI.cheek} opacity={0.85} />
          <circle cx="4.2" cy="4" r="1.2" fill={CI.cheek} opacity={0.85} />
          <path d="M-2 4.5 q2 1.8 4 0" stroke={INK} strokeWidth={1.2} fill="none" strokeLinecap="round" />
          {/* tiny glowing golden lantern held by the ghost */}
          <circle cx="10" cy="7" r="3.2" fill={CI.ghostWindow} stroke="rgba(47,36,32,.6)" strokeWidth={1.3} />
        </g>

        {/* lavender mist collar around the ghost island */}
        <path
          d="M-54 10 C-64 10 -66 -2 -54 -4 C-52 -14 -34 -16 -26 -8 C-18 -16 -2 -14 4 -6 C14 -14 32 -12 38 -4 C52 -6 62 2 54 10 C42 14 -42 14 -54 10 Z"
          fill={CI.ghostMist}
          stroke="rgba(47,36,32,.42)"
          strokeWidth={1.8}
        />
        <path d="M-46 9 C-22 13 22 13 46 9" stroke="#C9BBE6" strokeWidth={2.8} fill="none" strokeLinecap="round" />
      </g>
    </g>
  )
}

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M-40 14 C-56 14 -58 -4 -44 -8 C-46 -24 -24 -30 -14 -18 C-8 -34 18 -36 24 -18 C38 -26 56 -16 50 0 C64 2 62 14 50 14 Z"
        fill={CI.cloud}
        stroke="rgba(47,36,32,.18)"
        strokeWidth={2}
        opacity={0.96}
      />
      <path d="M-38 11 H46" stroke={CI.cloudGold} strokeWidth={3} strokeLinecap="round" opacity={0.8} />
    </g>
  )
}

/** Puffy cloud-stone & golden-trimmed cloud-pillow beside the skyway trail (between stones). */
function TrailCloud({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <path
        d="M-9 3 C-14 3 -14 -4 -8 -5 C-6 -9 2 -9 4 -5 C10 -5 10 3 6 3 Z"
        fill={CI.cloud}
        stroke={INK}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <path d="M-6 1.5 H4" stroke={CI.cloudGold} strokeWidth={1.6} strokeLinecap="round" />
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

export function MapArtCloudIsles({ height, pts, walkedTo, stones }: MapArtProps) {
  const rand = seeded(67)
  const chest = chestSpot(pts)
  const skyEnd = chest.y - 40

  // Special stones: mirror cloud-lagoon (3), large cloud-lagoon + baby sky-griffin (6), stepped sky-waterfall (9).
  const pondIdx = Math.min(3, stones)
  const lakeIdx = Math.min(6, stones)
  const cascadeIdx = Math.min(9, stones)
  const pond = { x: 96, y: pts[pondIdx].y + 18 }
  const lake = { x: 290, y: pts[lakeIdx].y + 20 }
  const cascade = { x: 86, y: pts[cascadeIdx].y + 18 }

  // Path-following island specs for stones 1..12 (centers closely track pts[i].x along the S-curve)
  // plus compact satellite islets in the open bays of the S-curve so islands follow the path and assets spread out.
  const pathIsleCfg: { cx: number; rx: number; ry: number; depth: number; wf: -1 | 0 | 1 }[] = [
    { cx: 206, rx: 86, ry: 36, depth: 44, wf: 0 }, // 1 (p.x ≈ 235)
    { cx: 286, rx: 86, ry: 36, depth: 46, wf: 0 }, // 2 (p.x ≈ 304)
    { cx: 290, rx: 80, ry: 35, depth: 44, wf: 0 }, // 3 (p.x ≈ 285)
    { cx: 195, rx: 92, ry: 36, depth: 48, wf: 0 }, // 4 (p.x ≈ 195)
    { cx: 114, rx: 86, ry: 36, depth: 46, wf: 1 }, // 5 (p.x ≈ 109)
    { cx: 96, rx: 76, ry: 34, depth: 44, wf: 0 }, // 6 (p.x ≈ 100)
    { cx: 176, rx: 92, ry: 36, depth: 48, wf: 0 }, // 7 (p.x ≈ 175)
    { cx: 264, rx: 86, ry: 36, depth: 44, wf: 0 }, // 8 (p.x ≈ 271)
    { cx: 300, rx: 78, ry: 34, depth: 46, wf: 0 }, // 9 (p.x ≈ 307)
    { cx: 252, rx: 88, ry: 36, depth: 48, wf: -1 }, // 10 (p.x ≈ 254)
    { cx: 156, rx: 88, ry: 36, depth: 44, wf: 0 }, // 11 (p.x ≈ 155)
    { cx: 108, rx: 86, ry: 36, depth: 46, wf: 0 }, // 12 (p.x ≈ 94)
  ]
  const pathIsleSpecs = pts.slice(1, stones + 1).map((p, idx) => {
    const cfg = pathIsleCfg[idx] ?? { cx: Math.round(p.x * 0.85 + 30), rx: 84, ry: 35, depth: 45, wf: 0 as const }
    return { x: cfg.cx, y: p.y + 12, rx: cfg.rx, ry: cfg.ry, depth: cfg.depth, wf: cfg.wf }
  })

  const sideIsleSpecs: { afterStone: number; x: number; y: number; rx: number; ry: number; depth: number; wf: -1 | 0 | 1 }[] = [
    { afterStone: pondIdx, x: 88, y: pond.y + 4, rx: 70, ry: 28, depth: 40, wf: 0 },
    { afterStone: lakeIdx, x: 300, y: lake.y + 4, rx: 86, ry: 34, depth: 44, wf: 0 },
    { afterStone: cascadeIdx, x: cascade.x, y: cascade.y + 6, rx: 70, ry: 29, depth: 42, wf: 1 },
    { afterStone: stones, x: 318, y: pts[stones].y + 24, rx: 56, ry: 23, depth: 34, wf: 0 },
  ]

  // Render floating islands top-to-bottom so nearer (lower) islands naturally overlap higher cliff tips.
  const islands: ReactNode[] = []
  for (let i = stones; i >= 1; i--) {
    for (const s of sideIsleSpecs) {
      if (s.afterStone === i) {
        islands.push(
          <FloatingIslePad
            key={`side-isle-${i}`}
            x={s.x}
            y={s.y}
            rx={s.rx}
            ry={s.ry}
            depth={s.depth}
            lobe={0}
            waterfall={s.wf}
          />,
        )
      }
    }
    const spec = pathIsleSpecs[i - 1]
    islands.push(
      <FloatingIslePad
        key={`isle-${i}`}
        x={spec.x}
        y={spec.y}
        rx={spec.rx}
        ry={spec.ry}
        depth={spec.depth}
        lobe={0}
        waterfall={spec.wf}
      />,
    )
  }

  // Balanced, non-clumping asset choreography across the path islands and the 4 bay islets:
  const deco: { y: number; node: ReactNode }[] = [
    // Stone 1 (p.x ≈ 235): RainbowArc on the left meadow of Stone 1's island
    { y: pts[1].y + 12, node: <RainbowArc key="d1-l" x={152} y={pts[1].y + 12} s={0.86} /> },

    // Stone 2 (p.x ≈ 304): MarbleColumns left of Stone 2, LevitationCrystal right of Stone 2
    { y: pts[2].y + 12, node: <MarbleColumns key="d2-l" x={228} y={pts[2].y + 12} s={0.9} /> },
    { y: pts[2].y + 8, node: <LevitationCrystal key="d2-r" x={348} y={pts[2].y + 8} s={0.88} /> },

    // Stone 3 (p.x ≈ 285): WindChimePost beside Mirror Lagoon on left isle, CloudTree right of Stone 3
    { y: pond.y + 2, node: <WindChimePost key="d3-l" x={36} y={pond.y + 2} s={0.86} /> },
    { y: pts[3].y + 10, node: <CloudTree key="d3-r" x={344} y={pts[3].y + 10} s={0.92} flip /> },

    // Stone 4 (p.x ≈ 195): CloudTree below-left of diagonal road, WindMonolith above-right of road
    { y: pts[4].y + 16, node: <CloudTree key="d4-l" x={126} y={pts[4].y + 16} s={0.94} /> },
    { y: pts[4].y + 4, node: <WindMonolith key="d4-r" x={262} y={pts[4].y + 4} s={0.94} /> },

    // Stone 5 (p.x ≈ 109): MarbleColumns left of Stone 5, LevitationCrystal right of Stone 5
    { y: pts[5].y + 12, node: <MarbleColumns key="d5-l" x={54} y={pts[5].y + 12} s={0.88} /> },
    { y: pts[5].y + 14, node: <LevitationCrystal key="d5-r" x={172} y={pts[5].y + 14} s={0.88} /> },

    // Stone 6 (p.x ≈ 100): WindChimePost left of Stone 6, CloudTree on right Griffin Lagoon isle
    { y: pts[6].y + 10, node: <WindChimePost key="d6-l" x={46} y={pts[6].y + 10} s={0.9} /> },
    { y: lake.y + 2, node: <CloudTree key="d6-r" x={362} y={lake.y + 2} s={0.86} flip /> },

    // Stone 7 (p.x ≈ 175): LevitationCrystal above-left of diagonal road, RainbowArc below-right of road
    { y: pts[7].y + 4, node: <LevitationCrystal key="d7-l" x={110} y={pts[7].y + 4} s={0.9} /> },
    { y: pts[7].y + 14, node: <RainbowArc key="d7-r" x={236} y={pts[7].y + 14} s={0.86} flip /> },

    // Stone 8 (p.x ≈ 271): MarbleColumns left of Stone 8, WindChimePost right of Stone 8
    { y: pts[8].y + 12, node: <MarbleColumns key="d8-l" x={206} y={pts[8].y + 12} s={0.88} /> },
    { y: pts[8].y + 10, node: <WindChimePost key="d8-r" x={326} y={pts[8].y + 10} s={0.88} flip /> },

    // Stone 9 (p.x ≈ 307): SkyWaterfall on left terrace isle, WindMonolith right of Stone 9
    { y: cascade.y, node: <SkyWaterfall key="d9-wf" x={cascade.x} y={cascade.y} s={1.04} flip /> },
    { y: pts[9].y + 10, node: <WindMonolith key="d9-r" x={352} y={pts[9].y + 10} s={0.92} /> },

    // Stone 10 (p.x ≈ 254): LevitationCrystal below-left of Stone 10, CloudTree above-right of Stone 10
    { y: pts[10].y + 12, node: <LevitationCrystal key="d10-l" x={190} y={pts[10].y + 12} s={0.9} /> },
    { y: pts[10].y + 4, node: <CloudTree key="d10-r" x={314} y={pts[10].y + 4} s={0.92} flip /> },

    // Stone 11 (p.x ≈ 155): CloudTree below-left of Stone 11, MarbleColumns above-right of Stone 11
    { y: pts[11].y + 12, node: <CloudTree key="d11-l" x={94} y={pts[11].y + 12} s={0.92} /> },
    { y: pts[11].y + 6, node: <MarbleColumns key="d11-r" x={216} y={pts[11].y + 6} s={0.88} flip /> },

    // Stone 12 (p.x ≈ 94): WindMonolith left of Stone 12, RainbowArc right of Stone 12, LevitationCrystal on right shrine islet
    { y: pts[12].y + 10, node: <WindMonolith key="d12-l" x={44} y={pts[12].y + 10} s={0.9} /> },
    { y: pts[12].y + 14, node: <RainbowArc key="d12-m" x={160} y={pts[12].y + 14} s={0.86} /> },
    { y: pts[12].y + 18, node: <LevitationCrystal key="d12-r" x={318} y={pts[12].y + 18} s={0.92} /> },
  ]
  deco.sort((a, b) => a.y - b.y)

  // Cloud-sea background waves & small surface details strictly inside each floating island's meadow.
  const waves: ReactNode[] = []
  for (let i = 0; i < stones * 3; i++) {
    const x = rand() * MAP_W
    const y = skyEnd + 140 + rand() * (height - skyEnd - 160)
    const rx = 36 + rand() * 44
    waves.push(
      <g key={`cw${i}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
        <ellipse rx={rx} ry={10 + rand() * 8} fill={CI.cloudSeaWave} />
        <path d={`M${-rx * 0.7} 2 Q0 8 ${rx * 0.7} 2`} stroke={CI.cloudGold} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.55} />
      </g>,
    )
  }
  const cover: ReactNode[] = []
  for (let i = 0; i < stones * 3; i++) {
    const spec = pathIsleSpecs[i % pathIsleSpecs.length]
    const p = pts[1 + (i % stones)]
    const dir = i % 2 === 0 ? -1 : 1
    const x = Math.max(spec.x - spec.rx * 0.72, Math.min(spec.x + spec.rx * 0.72, p.x + dir * (34 + rand() * 38)))
    const y = spec.y - 14 + (rand() - 0.5) * spec.ry * 0.9
    const r = rand()
    if (r < 0.3)
      cover.push(<circle key={`p${i}`} cx={x} cy={y} r={2.2} fill={CI.goldLight} stroke={INK} strokeWidth={0.9} />)
    else if (r < 0.62)
      cover.push(
        <path
          key={`t${i}`}
          d={`M${x - 5} ${y} q2 -7 3 -9 M${x} ${y} q0 -8 1 -11 M${x + 5} ${y} q-2 -7 -3 -9`}
          stroke={CI.grassDeep}
          strokeWidth={1.9}
          fill="none"
          strokeLinecap="round"
        />,
      )
    else if (r < 0.82)
      cover.push(
        <g key={`c${i}`}>
          <path d={`M${x - 10} ${y} q5 -4 10 0 q5 4 10 0`} stroke={CI.waterLight} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        </g>,
      )
    else
      cover.push(
        <g key={`h${i}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
          <path d="M-7 0 C-8 -7 8 -7 7 0 Z" fill={CI.cloud} stroke={INK} strokeWidth={1.3} />
          <circle cx="-2" cy="-3" r="1.2" fill={CI.goldLight} />
        </g>,
      )
  }

  // Cloud-stone stepping puffs along the skyway edges (between stones, alternating sides).
  const trailClouds: ReactNode[] = []
  for (let i = 0; i < stones; i++) {
    const a = pointOn(pts, i, 0.45)
    const b = pointOn(pts, i, 0.5)
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
    const sgn = i % 2 ? 1 : -1
    trailClouds.push(<TrailCloud key={`tc${i}`} x={b.x - ((b.y - a.y) / len) * 25 * sgn} y={b.y + ((b.x - a.x) / len) * 25 * sgn} />)
  }

  // Magic layer: drifting sky-kites & cloud-swallows (`.ci-floater`) in the open sky bays, plus sun-sparkles (`.ci-sparkle`).
  const floaterSpots: [number, number][] = [
    [52, pts[1].y - 12],
    [82, pts[2].y + 18],
    [354, pts[4].y + 12],
    [318, pts[5].y + 18],
    [34, pts[7].y + 22],
    [356, pts[7].y - 16],
    [76, pts[8].y + 18],
    [38, pts[10].y + 14],
    [348, pts[11].y + 16],
    [244, pts[12].y - 36],
  ]
  const floaters: ReactNode[] = floaterSpots.map(([fx, fy], i) => (
    <SkyFloater
      key={`fl${i}`}
      x={fx}
      y={fy}
      s={0.88 + (i % 3) * 0.08}
      delay={-rand() * 6.4}
      kind={i % 2}
    />
  ))
  const sparkles: ReactNode[] = []
  for (let i = 0; i < 6; i++) {
    const spec = pathIsleSpecs[(i * 2) % pathIsleSpecs.length]
    sparkles.push(
      <Sparkle
        key={`sk${i}`}
        x={spec.x + (i % 2 === 0 ? -1 : 1) * (36 + rand() * 34)}
        y={spec.y - 8 + (rand() - 0.5) * 24}
        s={0.8 + rand() * 0.4}
        delay={-rand() * 3.4}
      />,
    )
  }

  const road = pathD(pts, 0, stones + 1)
  const walked = walkedTo > 0 ? pathD(pts, 0, Math.min(walkedTo, stones + 1)) : ''

  return (
    <svg className="map__art" viewBox={`0 0 ${MAP_W} ${height}`} aria-hidden="true">
      <defs>
        <linearGradient id="ci-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={CI.skyTop} />
          <stop offset="0.38" stopColor={CI.skyMid} />
          <stop offset="0.74" stopColor={CI.skyLow} />
          <stop offset="1" stopColor={CI.skyHorizon} />
        </linearGradient>
        <linearGradient id="ci-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={CI.floorTop} />
          <stop offset="0.5" stopColor={CI.floorMid} />
          <stop offset="1" stopColor={CI.floorBottom} />
        </linearGradient>
        <linearGradient id="ci-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={CI.haze} stopOpacity="0" />
          <stop offset="1" stopColor={CI.haze} stopOpacity="0.72" />
        </linearGradient>
        <linearGradient id="ci-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={CI.waterLight} />
          <stop offset="0.55" stopColor={CI.water} />
          <stop offset="1" stopColor={CI.waterDeep} />
        </linearGradient>
        <radialGradient id="ci-sun-glow">
          <stop offset="0.25" stopColor={`rgb(${CI.sunGlow})`} stopOpacity="0.88" />
          <stop offset="1" stopColor={`rgb(${CI.sunGlow})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ci-glow-warm">
          <stop offset="0" stopColor={`rgb(${CI.glowWarm})`} stopOpacity="0.78" />
          <stop offset="1" stopColor={`rgb(${CI.glowWarm})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ci-glow-cyan">
          <stop offset="0" stopColor={`rgb(${CI.glowCyan})`} stopOpacity="0.78" />
          <stop offset="1" stopColor={`rgb(${CI.glowCyan})`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ci-glow-sun">
          <stop offset="0" stopColor={CI.sunPale} stopOpacity="0.95" />
          <stop offset="0.28" stopColor={`rgb(${CI.sunGlowRgb})`} stopOpacity="0.82" />
          <stop offset="0.6" stopColor={`rgb(${CI.sunGlowRgb})`} stopOpacity="0.38" />
          <stop offset="1" stopColor={`rgb(${CI.sunGlowRgb})`} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1 radiant azure sky, high-altitude golden sun, billowing cumulus clouds */}
      <rect width={MAP_W} height={height} fill="url(#ci-floor)" />
      <rect width={MAP_W} height={skyEnd + 16} fill="url(#ci-sky)" />
      <circle cx="322" cy="60" r="88" fill="url(#ci-sun-glow)" />
      <circle cx="322" cy="60" r="22" fill={CI.sun} stroke="rgba(47,36,32,.22)" strokeWidth={2} />
      <Cloud x={236} y={28} s={0.7} />
      <Cloud x={390} y={128} s={0.62} />

      {/* 2 distant floating sky-archipelago + Geisterruine teaser (World 7) behind the generic sign */}
      <g opacity={0.92}>
        {/* distant floating spire-island in the upper right sky */}
        <path
          d="M236 142 L258 188 L276 170 L292 204 L310 172 L328 188 L346 142 Z"
          fill={CI.farIsle}
          stroke="rgba(47,36,32,.32)"
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        <path d="M292 142 V204 L310 172 L328 188 L346 142 Z" fill={CI.farIsleShade} />
        <path d="M230 142 C230 130 352 130 352 142 Z" fill={CI.grass} stroke="rgba(47,36,32,.32)" strokeWidth={1.8} />
        <rect x="282" y="114" width="18" height="22" fill={CI.marble} stroke="rgba(47,36,32,.32)" strokeWidth={1.6} />
        <path d="M278 116 L291 98 L304 116 Z" fill={CI.roof} stroke="rgba(47,36,32,.32)" strokeWidth={1.6} strokeLinejoin="round" />
        <path className="ci-shimmer" d="M306 142 C309 158 308 176 310 194" stroke={CI.water} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        <path
          d="M226 148 C216 148 216 136 228 134 C234 126 252 126 258 134 C270 126 292 126 300 134 C312 126 334 128 340 136 C354 136 354 148 342 148 Z"
          fill={CI.cloud}
          stroke="rgba(47,36,32,.26)"
          strokeWidth={1.6}
        />
      </g>
      <GhostRuinsTeaser x={108} y={124} s={0.82} />
      <rect y={skyEnd - 150} width={MAP_W} height={80} fill="url(#ci-haze)" />

      {/* 3 middle sunlit cumulus cloud-bank ridge with sky-pillars & waterfalls */}
      <path d={cumulusBankPath(skyEnd - 40, skyEnd + 20)} fill={CI.midBank} stroke="rgba(47,36,32,.32)" strokeWidth={2} strokeLinejoin="round" />
      <path
        d={`M64 ${skyEnd - 64} L72 ${skyEnd - 96} H118 L126 ${skyEnd - 64} Z M284 ${skyEnd - 66} L292 ${skyEnd - 100} H338 L346 ${skyEnd - 66} Z`}
        fill={CI.isleRock}
        stroke="rgba(47,36,32,.38)"
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <path d={`M68 ${skyEnd - 96} C68 ${skyEnd - 104} 122 ${skyEnd - 104} 122 ${skyEnd - 96} Z M288 ${skyEnd - 100} C288 ${skyEnd - 108} 342 ${skyEnd - 108} 342 ${skyEnd - 100} Z`} fill={CI.grass} stroke="rgba(47,36,32,.38)" strokeWidth={1.7} />
      {/* sky-waterfalls pouring from the middle horizon ledges */}
      <path
        className="ci-shimmer"
        d={`M92 ${skyEnd - 95} C90 ${skyEnd - 68} 88 ${skyEnd - 40} 86 ${skyEnd - 10}
           M312 ${skyEnd - 99} C314 ${skyEnd - 72} 316 ${skyEnd - 42} 318 ${skyEnd - 10}`}
        stroke={CI.water}
        strokeWidth={6.5}
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="ci-shimmer"
        d={`M92 ${skyEnd - 95} C90 ${skyEnd - 68} 88 ${skyEnd - 40} 86 ${skyEnd - 10}
           M312 ${skyEnd - 99} C314 ${skyEnd - 72} 316 ${skyEnd - 42} 318 ${skyEnd - 10}`}
        stroke={CI.waterFoam}
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="4 6"
      />
      <rect y={skyEnd - 80} width={MAP_W} height={60} fill="url(#ci-haze)" />

      {/* 4 near billowy cloud-sea ridge & wind-carved sky crags framing the citadel */}
      <path
        d={`M-8 ${skyEnd + 40} L10 ${skyEnd - 44} L34 ${skyEnd - 18} L58 ${skyEnd - 36} L84 ${skyEnd + 40} Z
           M316 ${skyEnd + 40} L342 ${skyEnd - 40} L366 ${skyEnd - 16} L390 ${skyEnd - 48} L410 ${skyEnd + 40} Z`}
        fill={CI.isleRockDeep}
        stroke="rgba(47,36,32,.48)"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <rect y={skyEnd - 30} width={MAP_W} height={40} fill="url(#ci-haze)" />

      {/* 5 Grand Summit Floating Island + CloudCitadel + SkyBeacon */}
      <FloatingIslePad x={MAP_W / 2} y={skyEnd + 42} rx={186} ry={44} depth={76} lobe={0} waterfall={-1} />
      <CloudCitadel x={MAP_W / 2} y={chest.y - 24} />
      <g transform={`translate(46 ${chest.y + 8}) scale(1.08)`}>
        <SkyBeacon x={0} y={0} />
      </g>
      <Sparkle x={70} y={chest.y - 150} s={1.1} delay={-0.4} />
      <Sparkle x={338} y={chest.y - 128} s={0.9} delay={-1.6} />
      <Sparkle x={256} y={chest.y - 182} s={0.8} delay={-2.5} />
      <WindChimePost x={356} y={chest.y + 30} s={0.94} flip />

      {/* 6 cloud-sea waves, floating island pads carrying the path + pale sunlit clearing under every stone */}
      {waves}
      <FloatingIslePad x={298} y={height - 72} rx={94} ry={48} depth={48} lobe={0} waterfall={0} />
      <FloatingIslePad x={122} y={height - 76} rx={104} ry={52} depth={46} lobe={0} waterfall={0} />
      {islands}
      {pts.slice(1, stones + 1).map((p, i) => (
        <ellipse key={`cl${i}`} cx={p.x} cy={p.y + 8} rx={46} ry={30} fill={CI.clearing} />
      ))}
      {cover}

      {/* 7 turquoise cloud-lagoons with baby sky-griffin */}
      <CloudLagoon x={pond.x} y={pond.y} rx={42} ry={16} seed={19} />
      <CloudLagoon x={lake.x} y={lake.y} rx={56} ry={21} seed={37}>
        <SkyGriffin x={-8} y={4} s={1.02} flip={lake.x < MAP_W / 2} />
      </CloudLagoon>

      {/* 8 marble & cloud-stone skyway trail: same widths as Burgdorf; sky-slate edge + ivory marble centre */}
      {trailClouds}
      <path d={road} fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={CI.trailEdge} strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={CI.trail} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke={CI.trailDash} strokeWidth={4} strokeLinecap="round" strokeDasharray="6 16" />
      {walked && <path d={walked} fill="none" stroke="#C9372C" strokeWidth={5} strokeLinecap="round" strokeDasharray="10 12" opacity={0.8} />}

      {deco.map((d) => d.node)}

      {/* 9 start: SkyWindmill with airship jetty & tethered balloon skiff, CloudSheep, Signpost */}
      <SkyWindmill x={306} y={height - 50} s={1.1} />
      <CloudSheep x={84} y={height - 108} s={1.06} />
      <Signpost x={pts[0].x - 74} y={pts[0].y - 6} />

      {/* 10 magic layer: sun-sparkles & drifting sky-kites / cloud-swallows */}
      {sparkles}
      {floaters}
      <SkyFloater x={206} y={56} s={1.05} delay={-1.5} kind={0} />
      <SkyFloater x={370} y={208} s={0.95} delay={-4.1} kind={1} />
      <SkyFloater x={26} y={238} s={0.95} delay={-5.3} kind={0} />
    </svg>
  )
}
