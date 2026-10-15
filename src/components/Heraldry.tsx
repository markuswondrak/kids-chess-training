const INK = '#2F2420'
const GOLD = '#F3B630'
const STEEL = '#E3E9EF'
const LEATHER = '#7A4B2A'

/** Wappen mit gekreuzten Schwertern – Logo und Sieg-Emblem. */
export function Crest({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {/* Schwerter hinter dem Schild */}
      <path d="M9 7 L45 43 M55 7 L19 43" stroke={INK} strokeWidth={7.5} strokeLinecap="round" />
      <path d="M9 7 L45 43 M55 7 L19 43" stroke={STEEL} strokeWidth={3.8} strokeLinecap="round" />
      <path d="M45 43 L53 51 M19 43 L11 51" stroke={INK} strokeWidth={7.5} strokeLinecap="round" />
      <path d="M45 43 L53 51 M19 43 L11 51" stroke={LEATHER} strokeWidth={3.6} strokeLinecap="round" />
      <path d="M40 48 L50 38 M14 38 L24 48" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d="M40 48 L50 38 M14 38 L24 48" stroke={GOLD} strokeWidth={3.4} strokeLinecap="round" />
      <circle cx="54.5" cy="52.5" r="3.4" fill={GOLD} stroke={INK} strokeWidth={2} />
      <circle cx="9.5" cy="52.5" r="3.4" fill={GOLD} stroke={INK} strokeWidth={2} />

      {/* Schild, gespalten Rot/Blau */}
      <path d="M16 12 H48 V30 C48 44 40 53 32 58 C24 53 16 44 16 30 Z" fill="#C9372C" />
      <path d="M32 12 H48 V30 C48 44 40 53 32 58 Z" fill="#2F62A8" />
      <path
        d="M19.5 15.5 H44.5 V30 C44.5 41 38.5 48.5 32 53 C25.5 48.5 19.5 41 19.5 30 Z"
        fill="none"
        stroke={GOLD}
        strokeWidth={1.8}
      />
      <path
        d="M25 22 h3 v3 h2.5 v-3 h3 v3 h2.5 v-3 h3 v7 l-2 1.5 v9 h-10 v-9 l-2 -1.5 Z"
        fill={GOLD}
        stroke={INK}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <path d="M30.5 39.5 v-3.5 a1.5 1.5 0 0 1 3 0 v3.5 Z" fill={INK} />
      <path
        d="M16 12 H48 V30 C48 44 40 53 32 58 C24 53 16 44 16 30 Z"
        fill="none"
        stroke={INK}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Kleines Angriffs-Abzeichen für schlagbare Felder. */
export function SwordsBadge() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="#C9372C" stroke={INK} strokeWidth={2.6} />
      <g strokeLinecap="round">
        <path d="M9 9 L20.5 20.5 M23 9 L11.5 20.5" stroke="#FFF6E6" strokeWidth={2.8} />
        <path d="M17.6 22.6 L22.6 17.6 M9.4 17.6 L14.4 22.6" stroke={GOLD} strokeWidth={2.8} />
        <path d="M21 21 L23.5 23.5 M11 21 L8.5 23.5" stroke={INK} strokeWidth={2.8} />
      </g>
    </svg>
  )
}
