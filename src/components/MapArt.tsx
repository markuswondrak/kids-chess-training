import type { ReactNode } from 'react'
import { MAP_W, chestSpot, pathD, seeded, type Pt } from '../game/mapPath'
import type { WorldId } from '../game/worlds'
import { MapArtDarkwood } from './MapArtDarkwood'

const INK = '#2F2420'

function Tree({ x, y, s = 1, kind = 0, color }: { x: number; y: number; s?: number; kind?: number; color?: string }) {
  const leaf = color ?? ['#5E9A4E', '#4E8A4F', '#6FAA55'][kind % 3]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="16" ry="4.5" fill="rgba(47,36,32,.16)" />
      <rect x="-3.5" y="-16" width="7" height="18" rx="2" fill="#8A5A34" stroke={INK} strokeWidth={2.2} />
      {kind === 1 ? (
        <g stroke={INK} strokeWidth={2.4} strokeLinejoin="round">
          <path d="M0 -40 L25 -9 Q0 -14 -25 -9 Z" fill={leaf} />
          <path d="M0 -56 L20 -26 Q0 -30 -20 -26 Z" fill={leaf} />
          <path d="M0 -72 L15 -43 Q0 -46 -15 -43 Z" fill={leaf} />
          <path d="M-5 -50 L-11 -34 M-8 -64 L-3 -54" stroke="rgba(255,255,255,.28)" strokeWidth={2.4} strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g>
          <circle cx="0" cy="-30" r="17" fill={leaf} stroke={INK} strokeWidth={2.4} />
          <circle cx="-6" cy="-36" r="5" fill="rgba(255,255,255,.22)" />
          {kind === 2 && (
            <g fill="#D9443A" stroke={INK} strokeWidth={1.2}>
              <circle cx="7" cy="-26" r="2.6" />
              <circle cx="-8" cy="-22" r="2.6" />
              <circle cx="2" cy="-40" r="2.6" />
            </g>
          )}
        </g>
      )}
    </g>
  )
}

function House({ x, y, roof, flip = false }: { x: number; y: number; roof: string; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <ellipse cx="0" cy="2" rx="30" ry="5" fill="rgba(47,36,32,.16)" />
      <rect x="-22" y="-30" width="44" height="32" fill="#FBF1DC" stroke={INK} strokeWidth={2.4} />
      <path d="M-22 -30 L-22 2 M-8 -30 V2 M8 -30 V2" stroke="#B88B5A" strokeWidth={2} />
      <path d="M-28 -28 L0 -54 L28 -28 Z" fill={roof} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <rect x="10" y="-60" width="7" height="16" fill="#B8B0A1" stroke={INK} strokeWidth={2} />
      <rect x="-5" y="-14" width="10" height="16" rx="5" fill="#6E3D1C" stroke={INK} strokeWidth={2} />
      <rect x="-18" y="-22" width="8" height="8" fill="#FFE07A" stroke={INK} strokeWidth={1.8} />
    </g>
  )
}

function Castle({ x, y }: { x: number; y: number }) {
  const s = { fill: '#D4CDBF', stroke: INK, strokeWidth: 2.6, strokeLinejoin: 'round' as const }
  const r = { fill: '#4C5C80', stroke: INK, strokeWidth: 2.6, strokeLinejoin: 'round' as const }
  const merlons = (x0: number, w: number, y0: number) => {
    const n = Math.floor(w / 14)
    return Array.from({ length: n }, (_, i) => (
      <rect key={i} x={x0 + i * (w / n) + 2} y={y0 - 9} width={w / n - 5} height={10} {...s} />
    ))
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="4" rx="150" ry="16" fill="rgba(47,36,32,.14)" />
      {merlons(-110, 220, -60)}
      <rect x="-110" y="-60" width="220" height="64" {...s} />
      {merlons(-44, 88, -120)}
      <rect x="-44" y="-120" width="88" height="62" {...s} />
      <rect x="-140" y="-96" width="44" height="100" {...s} />
      <path d="M-148 -94 L-118 -134 L-88 -94 Z" {...r} />
      <rect x="96" y="-96" width="44" height="100" {...s} />
      <path d="M88 -94 L118 -134 L148 -94 Z" {...r} />
      <path d="M0 -120 V-160" stroke={INK} strokeWidth={2.6} />
      <path className="map-flag" d="M0 -160 L30 -152 L0 -144 Z" fill="#C9372C" stroke={INK} strokeWidth={2} />
      <path d="M-118 -134 V-150 M118 -134 V-150" stroke={INK} strokeWidth={2.2} />
      <path className="map-flag" d="M-118 -150 L-100 -145 L-118 -140 Z M118 -150 L136 -145 L118 -140 Z" fill="#F3B630" stroke={INK} strokeWidth={1.8} />
      <rect x="-124" y="-74" width="10" height="16" rx="5" fill="#4A3A30" />
      <rect x="114" y="-74" width="10" height="16" rx="5" fill="#4A3A30" />
      <rect x="-26" y="-100" width="10" height="16" rx="5" fill="#4A3A30" />
      <rect x="16" y="-100" width="10" height="16" rx="5" fill="#4A3A30" />
      <path d="M-26 4 V-22 A26 26 0 0 1 26 -22 V4 Z" fill="#4A3A30" stroke={INK} strokeWidth={2.4} />
      <path d="M-20 -14 H20 M-20 -6 H20 M-10 -36 V4 M0 -38 V4 M10 -36 V4" stroke="#7A6A5A" strokeWidth={1.6} />
      <path d="M-80 -30 h12 M60 -40 h16 M-60 -12 h10" stroke="rgba(47,36,32,.2)" strokeWidth={2} />
    </g>
  )
}

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M-40 14 C-56 14 -58 -4 -44 -8 C-46 -24 -24 -30 -14 -18 C-8 -34 18 -36 24 -18 C38 -26 56 -16 50 0 C64 2 62 14 50 14 Z"
      fill="#FFFFFF"
      stroke="rgba(47,36,32,.14)"
      strokeWidth={2}
    />
  )
}

function Flower({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 3.2} cy={Math.sin((a * Math.PI) / 180) * 3.2} r={2.6} fill={color} />
      ))}
      <circle r={2} fill="#F3B630" />
    </g>
  )
}

interface MapArtProps {
  worldId: WorldId
  height: number
  pts: Pt[]
  /** Wegpunkt-Index, bis zu dem der Weg schon gegangen wurde. */
  walkedTo: number
  stones: number
}

/** Die gemalte Landschaft unter den Level-Steinen – je Welt eine eigene Szene. */
export function MapArt({ worldId, ...props }: MapArtProps) {
  return worldId === 'finsterwald' ? <MapArtDarkwood {...props} /> : <MeadowMap {...props} />
}

type SceneProps = Omit<MapArtProps, 'worldId'>

/** Burgdorf: Wiese, Burg und Dorf. */
function MeadowMap({ height, pts, walkedTo, stones }: SceneProps) {
  const rand = seeded(7)
  const chest = chestSpot(pts)
  const skyEnd = chest.y - 40

  // Deko abseits des Weges: auf der jeweils freien Seite.
  const deco: ReactNode[] = []
  for (let i = 1; i <= stones; i++) {
    const p = pts[i]
    const far = p.x > MAP_W / 2 ? 18 + rand() * 70 : MAP_W - 18 - rand() * 70
    const kind = Math.floor(rand() * 3)
    deco.push(<Tree key={`t${i}`} x={far} y={p.y + 30 + rand() * 30} s={0.9 + rand() * 0.35} kind={kind} />)
    if (rand() > 0.35) {
      const far2 = p.x > MAP_W / 2 ? 30 + rand() * 60 : MAP_W - 30 - rand() * 60
      deco.push(<Tree key={`u${i}`} x={far2} y={p.y - 30 + rand() * 20} s={0.75 + rand() * 0.3} kind={(kind + 1) % 3} />)
    }
  }

  const tufts: ReactNode[] = []
  const flowerColors = ['#FFFFFF', '#F58FA8', '#9DB8F2', '#FFFFFF']
  for (let i = 0; i < stones * 5; i++) {
    const x = 12 + rand() * (MAP_W - 24)
    const y = skyEnd + 60 + rand() * (height - skyEnd - 80)
    if (rand() > 0.5) tufts.push(<Flower key={`f${i}`} x={x} y={y} color={flowerColors[i % 4]} />)
    else
      tufts.push(
        <path
          key={`g${i}`}
          d={`M${x - 6} ${y} q3 -8 5 -10 M${x} ${y} q0 -9 1 -12 M${x + 6} ${y} q-3 -8 -5 -10`}
          stroke="#4E8A4F"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />,
      )
  }

  const pond = pts[Math.min(stones, 6)]
  const pondX = pond.x > MAP_W / 2 ? 80 : MAP_W - 80

  const road = pathD(pts, 0, stones + 1)
  const walked = walkedTo > 0 ? pathD(pts, 0, Math.min(walkedTo, stones + 1)) : ''

  return (
    <svg className="map__art" viewBox={`0 0 ${MAP_W} ${height}`} aria-hidden="true">
      <defs>
        <linearGradient id="map-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FBBE6" />
          <stop offset="1" stopColor="#D9ECF0" />
        </linearGradient>
        <linearGradient id="map-meadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9CCB80" />
          <stop offset="1" stopColor="#86BC6B" />
        </linearGradient>
      </defs>

      <rect width={MAP_W} height={height} fill="url(#map-meadow)" />
      <rect width={MAP_W} height={skyEnd} fill="url(#map-sky)" />
      {/* Ferne Berge und Burghügel */}
      <path
        d={`M0 ${skyEnd - 70} L60 ${skyEnd - 150} L110 ${skyEnd - 90} L170 ${skyEnd - 190} L240 ${skyEnd - 100} L300 ${skyEnd - 170} L360 ${skyEnd - 110} L${MAP_W} ${skyEnd - 140} V${skyEnd + 10} H0 Z`}
        fill="#A9B8CC"
        stroke="rgba(47,36,32,.18)"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d={`M170 ${skyEnd - 190} L150 ${skyEnd - 160} L162 ${skyEnd - 156} L172 ${skyEnd - 166} L184 ${skyEnd - 156} L194 ${skyEnd - 164} Z`}
        fill="#FFFFFF"
      />
      <path
        d={`M0 ${skyEnd + 30} C80 ${skyEnd - 40} 320 ${skyEnd - 40} ${MAP_W} ${skyEnd + 30} V${skyEnd + 80} H0 Z`}
        fill="#9CCB80"
        stroke="rgba(47,36,32,.16)"
        strokeWidth={2}
      />

      <Castle x={MAP_W / 2} y={chest.y - 30} />

      {/* Teich */}
      <g transform={`translate(${pondX} ${pond.y + 52})`}>
        <ellipse rx="46" ry="20" fill="#6FAEDB" stroke={INK} strokeWidth={2.4} />
        <path d="M-24 -4 q8 -5 16 0 M6 6 q8 -5 16 0" stroke="#FFFFFF" strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.7} />
        <ellipse cx="22" cy="-6" rx="7" ry="3.5" fill="#5E9A4E" />
      </g>

      {tufts}

      {/* Weg */}
      <path d={road} fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke="#EAD6A4" strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" />
      <path d={road} fill="none" stroke="#DCC285" strokeWidth={8} strokeLinecap="round" strokeDasharray="1 22" />
      {walked && (
        <path d={walked} fill="none" stroke="#C9372C" strokeWidth={5} strokeLinecap="round" strokeDasharray="10 12" opacity={0.75} />
      )}

      {deco}

      {/* Dorf am Start */}
      <House x={60} y={height - 92} roof="#C9372C" />
      <House x={330} y={height - 120} roof="#2F62A8" flip />
      <House x={300} y={height - 30} roof="#F3B630" />
      <Tree x={36} y={height - 20} s={1.1} kind={2} />
      <g transform={`translate(${pts[0].x - 74} ${pts[0].y - 6})`}>
        <path d="M0 0 V-34" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      </g>

      {/* Finsterwald im Nebel – die nächste Welt */}
      <g opacity={0.9}>
        {[
          [26, 112, 1],
          [52, 96, 1.2],
          [80, 116, 0.95],
          [104, 100, 1.1],
          [352, 120, 1],
          [376, 104, 1.15],
        ].map(([x, y, s], i) => (
          <Tree key={i} x={x} y={y} s={s} kind={1} color="#3E5A4A" />
        ))}
      </g>
      <Cloud x={60} y={118} s={1.15} />
      <Cloud x={350} y={128} s={1} />
      <Cloud x={200} y={40} s={0.9} />
    </svg>
  )
}
