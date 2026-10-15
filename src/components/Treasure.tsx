const INK = '#2F2420'
const GOLD = '#F3B630'
const GOLD_DEEP = '#CF9415'
const WOOD = '#9A5B2E'
const WOOD_DEEP = '#6E3D1C'

/** Goldstern mit Tintenrand. `empty` = ausgegrauter Platzhalter. */
export function StarIcon({ empty = false, className }: { empty?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M20 3.5 L25 14 L36.5 15.4 L28 23.3 L30.2 34.8 L20 29.2 L9.8 34.8 L12 23.3 L3.5 15.4 L15 14 Z"
        fill={empty ? 'rgba(47,36,32,.14)' : GOLD}
        stroke={empty ? 'rgba(47,36,32,.32)' : INK}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {!empty && (
        <path d="M14.5 17.5 L19 16.6 L20.4 12.5" fill="none" stroke="#FFF3C4" strokeWidth={2.6} strokeLinecap="round" />
      )}
    </svg>
  )
}

export function StarRow({ count, max = 3, className }: { count: number; max?: number; className?: string }) {
  return (
    <span className={className}>
      {Array.from({ length: max }, (_, i) => (
        <StarIcon key={i} empty={i >= count} />
      ))}
    </span>
  )
}

/** Schatztruhe am Ende einer Welt. */
export function Chest({ open = false, className }: { open?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 120 110" className={className} aria-hidden="true">
      <ellipse cx="60" cy="102" rx="46" ry="6" fill="rgba(47,36,32,.2)" />
      {open && (
        <g className="chest__glow">
          <path d="M60 40 L30 -10 L90 -10 Z" fill="rgba(255,236,150,.55)" />
          <path d="M60 40 L6 4 L22 -10 Z M60 40 L114 4 L98 -10 Z" fill="rgba(255,236,150,.35)" />
        </g>
      )}
      {open && (
        <g>
          {/* aufgeklappter Deckel (hinter dem Korpus) */}
          <path d="M16 54 L12 22 C30 8 90 8 108 22 L104 54 Z" fill={WOOD_DEEP} stroke={INK} strokeWidth={3.2} strokeLinejoin="round" />
          <path d="M22 50 L19 24 C36 14 84 14 101 24 L98 50 Z" fill="#4E2A12" />
        </g>
      )}
      {/* Korpus */}
      <rect x="14" y="52" width="92" height="46" rx="6" fill={WOOD} stroke={INK} strokeWidth={3.4} />
      <path d="M14 66 H106" stroke={WOOD_DEEP} strokeWidth={2} />
      <path d="M14 82 H106" stroke={WOOD_DEEP} strokeWidth={2} />
      <rect x="24" y="52" width="10" height="46" fill={GOLD} stroke={INK} strokeWidth={2.6} />
      <rect x="86" y="52" width="10" height="46" fill={GOLD} stroke={INK} strokeWidth={2.6} />

      {open ? (
        <g>
          {/* Gold quillt heraus */}
          <path d="M18 56 C26 40 44 36 60 38 C78 36 96 40 102 56 Z" fill={GOLD} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          {[
            [34, 46],
            [48, 41],
            [62, 44],
            [76, 41],
            [88, 48],
            [55, 50],
            [70, 51],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={5.2} fill="#FFD660" stroke={GOLD_DEEP} strokeWidth={2} />
          ))}
          <path d="M50 34 L54 22 L60 30 L66 22 L70 34 Z" fill={GOLD} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
          <circle cx="60" cy="29" r="2.4" fill="#C9372C" />
        </g>
      ) : (
        <g>
          {/* gewölbter Deckel */}
          <path d="M12 54 C12 28 32 20 60 20 C88 20 108 28 108 54 Z" fill={WOOD} stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />
          <path d="M20 40 C34 32 86 32 100 40" fill="none" stroke={WOOD_DEEP} strokeWidth={2} />
          <path d="M24 54 C24 32 28 26 34 23 L34 54 Z" fill={GOLD} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
          <path d="M96 54 C96 32 92 26 86 23 L86 54 Z" fill={GOLD} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
          <path d="M26 30 C40 24 54 23 60 23" stroke="rgba(255,255,255,.3)" strokeWidth={3} fill="none" strokeLinecap="round" />
          {/* Schloss */}
          <rect x="50" y="48" width="20" height="22" rx="4" fill={GOLD} stroke={INK} strokeWidth={3} />
          <path d="M60 56 v7" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />
          <circle cx="60" cy="56" r="3" fill={INK} />
        </g>
      )}
    </svg>
  )
}

/** Kleines Vorhängeschloss für gesperrte Steine. */
export function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M7.5 11 V8 a4.5 4.5 0 0 1 9 0 v3" fill="none" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" />
      <rect x="5" y="10.5" width="14" height="10.5" rx="2.5" fill="currentColor" />
    </svg>
  )
}

/** Laterne für den Hinweis-Knopf. */
export function LanternIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M12 6 a4 4 0 0 1 8 0" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M9 8 H23 L21 11 H11 Z" fill={INK} />
      <path d="M11 11 H21 L22.5 24 H9.5 Z" fill="#FFE07A" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M16 14.5 C18.2 17 18 19.6 16 21 C14 19.6 13.8 17 16 14.5 Z" fill="#F08A2C" />
      <path d="M8 24 H24 V27 H8 Z" fill={INK} />
    </svg>
  )
}

export function MapIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} width={22} height={22} aria-hidden="true">
      <path
        d="M3.5 6 L9 4 L15 6 L20.5 4 V18 L15 20 L9 18 L3.5 20 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path d="M9 4 V18 M15 6 V20" stroke="currentColor" strokeWidth={2} />
    </svg>
  )
}
