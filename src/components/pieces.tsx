import type { ReactNode, SVGAttributes } from 'react'
import type { PieceColor, PieceType } from '../game/types'

interface Palette {
  fill: string
  line: string
  accent: string
  eye: string
  pupil: string
  blush: string
  beard: string
}

const LIGHT: Palette = {
  fill: '#FFF6E7',
  line: '#3B2A20',
  accent: '#F2A93B',
  eye: '#FFFFFF',
  pupil: '#3B2A20',
  blush: '#FFB08A',
  beard: '#9A6440',
}

const DARK: Palette = {
  fill: '#4A4778',
  line: '#2B2846',
  accent: '#FFC94A',
  eye: '#FFFFFF',
  pupil: '#2B2846',
  blush: '#E87A5E',
  beard: '#E4E0F7',
}

// Linienstärke bewusst kräftig: Figuren sind auf dem Handy nur ~40px groß.
const W = 5

const S = (p: Palette, fill = p.fill): SVGAttributes<SVGElement> => ({
  stroke: p.line,
  strokeWidth: W,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
  fill,
})

const Eye = ({ p, x, y }: { p: Palette; x: number; y: number }) => (
  <g>
    <ellipse cx={x} cy={y} rx={5} ry={5.8} fill={p.eye} stroke={p.line} strokeWidth={2.2} />
    <ellipse cx={x + 0.5} cy={y + 0.8} rx={3.2} ry={3.8} fill={p.pupil} />
  </g>
)

const Face = ({ p, y, dx = 7 }: { p: Palette; y: number; dx?: number }) => (
  <g>
    <Eye p={p} x={50 - dx} y={y} />
    <Eye p={p} x={50 + dx} y={y} />
    <ellipse cx={50 - dx - 4} cy={y + 8} rx={3.6} ry={2.4} fill={p.blush} opacity={0.75} />
    <ellipse cx={50 + dx + 4} cy={y + 8} rx={3.6} ry={2.4} fill={p.blush} opacity={0.75} />
  </g>
)

// Schatten direkt im SVG statt CSS-Filter: bleibt beim Skalieren scharf.
const Base = ({ p, x = 20, w = 60 }: { p: Palette; x?: number; w?: number }) => (
  <g>
    <rect x={x} y={85} width={w} height={13} rx={6.5} fill="rgba(47, 36, 32, 0.2)" />
    <rect x={x} y={81} width={w} height={13} rx={6.5} {...S(p)} />
  </g>
)

const GLYPHS: Record<PieceType, (p: Palette) => ReactNode> = {
  p: (p) => (
    <g>
      <path d="M50 44 C40 44 37 54 35 64 L32 82 L68 82 L65 64 C63 54 60 44 50 44 Z" {...S(p)} />
      <rect x={31} y={64} width={38} height={10} rx={5} {...S(p)} />
      <circle cx={50} cy={31} r={16} {...S(p)} />
      <Face p={p} y={30} dx={6.5} />
      <Base p={p} />
    </g>
  ),
  r: (p) => (
    <g>
      <path d="M30 44 h40 l-3 32 h-34 Z" {...S(p)} />
      <path d="M25 46 V20 h11 v8 h8.5 v-8 h11 v8 h8.5 v-8 h11 v26 Z" {...S(p)} />
      <rect x={26} y={71} width={48} height={10} rx={5} {...S(p)} />
      <Face p={p} y={56} />
      <Base p={p} />
    </g>
  ),
  n: (p) => (
    <g>
      {/* Mähne hinter dem Kopf, ragt am Rücken als Wellen heraus */}
      <path
        d="M58 14 C68 14 75 22 72 30 C79 34 79 44 74 48 C80 53 79 62 73 65 C77 70 75 77 69 79 L60 60 Z"
        {...S(p, p.accent)}
      />
      <path
        d="M68 81 C71 66 71 52 67 40 C65 33 64 27 63 21 L62 5 L55 14 L48 7 L45 18 C37 22 29 29 24 37 C20 43 19 49 23 53 C27 57 33 58 38 55 C41 53 44 52 47 52 C43 59 39 69 37 81 Z"
        {...S(p)}
      />
      {/* Stirnlocke */}
      <path d="M48 10 C44 14 43 18 44 23 C48 21 51 17 52 12 Z" {...S(p, p.accent)} strokeWidth={3.5} />
      <ellipse cx={26.5} cy={46} rx={2.2} ry={2.8} fill={p.line} />
      <Eye p={p} x={44} y={32} />
      <ellipse cx={36} cy={44} rx={3.6} ry={2.4} fill={p.blush} opacity={0.75} />
      <rect x={31} y={71} width={42} height={10} rx={5} {...S(p)} />
      <Base p={p} />
    </g>
  ),
  b: (p) => (
    <g>
      <path d="M40 68 L36 82 L64 82 L60 68 Z" {...S(p)} />
      <path d="M50 17 C37 25 29 38 29 51 C29 61 38 68 50 68 C62 68 71 61 71 51 C71 38 63 25 50 17 Z" {...S(p)} />
      <path d="M61 27 L51 37" stroke={p.line} strokeWidth={W} strokeLinecap="round" />
      <circle cx={50} cy={11} r={6} {...S(p, p.accent)} strokeWidth={4} />
      <rect x={33} y={63} width={34} height={10} rx={5} {...S(p)} />
      <Face p={p} y={48} dx={6.5} />
      <Base p={p} />
    </g>
  ),
  q: (p) => (
    <g>
      {/* Kleid: schmal oben, Taille, weiter Rock */}
      <path d="M34 40 h32 C65 49 62 55 59 59 C65 65 70 72 73 82 L27 82 C30 72 35 65 41 59 C38 55 35 49 34 40 Z" {...S(p)} />
      <path d="M41 60 h18" stroke={p.line} strokeWidth={4} strokeLinecap="round" />
      {/* Diadem mit Kugeln auf den Zacken */}
      <path d="M31 42 L27 20 L39 30 L50 14 L61 30 L73 20 L69 42 Z" {...S(p, p.accent)} />
      <circle cx={27} cy={18} r={4.2} {...S(p, p.accent)} strokeWidth={3.5} />
      <circle cx={50} cy={11} r={4.6} {...S(p, p.accent)} strokeWidth={3.5} />
      <circle cx={73} cy={18} r={4.2} {...S(p, p.accent)} strokeWidth={3.5} />
      {/* Wimpern */}
      <path d="M38.5 44.5 l-3.5 -2.5 M61.5 44.5 l3.5 -2.5" stroke={p.line} strokeWidth={2.6} strokeLinecap="round" />
      <Face p={p} y={49} dx={6.5} />
      <Base p={p} x={22} w={56} />
    </g>
  ),
  k: (p) => (
    <g>
      {/* Breiter, gerader Körper */}
      <path d="M29 38 h42 l-2 38 h-38 Z" {...S(p)} />
      {/* Geschlossene Krone mit Kreuz */}
      <path d="M46 2 h8 v6 h6 v8 h-6 v6 h-8 v-6 h-6 v-8 h6 Z" {...S(p, p.accent)} strokeWidth={4} />
      <path d="M29 37 C29 27 37 21 50 21 C63 21 71 27 71 37 Z" {...S(p, p.accent)} />
      <rect x={25} y={33} width={50} height={9} rx={4.5} {...S(p, p.accent)} />
      <Face p={p} y={52} />
      {/* Schnurrbart */}
      <path
        d="M50 64 C46 60 39 60 35 64 C33 66 34 68 36 68 C40 68 45 67 50 65 C55 67 60 68 64 68 C66 68 67 66 65 64 C61 60 54 60 50 64 Z"
        {...S(p, p.beard)}
        strokeWidth={3}
      />
      <rect x={25} y={71} width={50} height={10} rx={5} {...S(p)} />
      <Base p={p} x={18} w={64} />
    </g>
  ),
}

export function PieceIcon({ type, color }: { type: PieceType; color: PieceColor }) {
  const palette = color === 'w' ? LIGHT : DARK
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {GLYPHS[type](palette)}
    </svg>
  )
}
