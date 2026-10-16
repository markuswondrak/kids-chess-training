const INK = '#2F2420'
const STEEL = '#CBD5DE'
const STEEL_DEEP = '#8E9CAB'
const SKIN = '#FFDDBF'
const RED = '#C9372C'
const GOLD = '#F3B630'
const BLUE = '#2F62A8'
const LEATHER = '#7A4B2A'

interface KnightProps {
  className?: string
  /** Wappenrock-, Helmbusch- und Schildfarbe. */
  tunic?: string
  plume?: string
  shield?: string
  /** Sprachrichtiger Name (Wörterbuch: `coach.name` bzw. `map.playerKnight`). */
  label: string
}

/** Ritter Kuno (Standard) – mit anderen Farben auch der Spieler-Ritter auf der Karte. */
export function CoachKnight({ className, tunic = RED, plume = RED, shield = BLUE, label }: KnightProps) {
  return (
    <svg viewBox="0 0 150 160" className={className} role="img" aria-label={label}>
      <ellipse cx="74" cy="153" rx="44" ry="6" fill="rgba(47,36,32,.16)" />

      {/* Helmbusch */}
      <g className="knight__plume">
        <path
          d="M74 24 C70 8 54 0 38 4 C30 6 24 12 22 20 C32 14 44 14 54 20 C46 20 40 24 36 30 C50 26 62 26 70 30 Z"
          fill={plume}
          stroke={INK}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <path d="M33 10 C42 8 52 10 60 16" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth={2.4} strokeLinecap="round" />
        <path
          d="M76 22 C78 8 90 2 100 6 C92 8 86 14 84 22 Z"
          fill={GOLD}
          stroke={INK}
          strokeWidth={2.8}
          strokeLinejoin="round"
        />
      </g>

      {/* Beine */}
      <rect x="52" y="134" width="19" height="15" rx="5" fill={STEEL} stroke={INK} strokeWidth={3} />
      <rect x="79" y="134" width="19" height="15" rx="5" fill={STEEL} stroke={INK} strokeWidth={3} />

      {/* Wappenrock */}
      <ellipse cx="75" cy="105" rx="24" ry="7" fill={STEEL_DEEP} stroke={INK} strokeWidth={2.6} />
      <path d="M46 106 Q75 98 104 106 L110 140 Q75 149 40 140 Z" fill={tunic} stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />
      <path d="M43 127 Q75 134 107 127 L108 134 Q75 141 42 134 Z" fill={GOLD} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <rect x="70" y="127.5" width="10" height="9" rx="2" fill={STEEL} stroke={INK} strokeWidth={2.2} />
      <path d="M75 108 V123 M68 114.5 H82" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d="M75 108 V123 M68 114.5 H82" stroke={GOLD} strokeWidth={3.6} strokeLinecap="round" />

      {/* Schwertarm */}
      <path d="M99 112 L115 100" stroke={INK} strokeWidth={15} strokeLinecap="round" />
      <path d="M99 112 L115 100" stroke={STEEL} strokeWidth={9} strokeLinecap="round" />
      <circle cx="100" cy="110" r="9.5" fill={STEEL} stroke={INK} strokeWidth={3} />

      <g className="knight__sword">
        <path
          d="M113.6 89.2 L125.9 22.3 L132 12 L134.7 23.9 L122.4 90.8 Z"
          fill="#E6ECF1"
          stroke={INK}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <path d="M119.4 84 L129.4 28" stroke={STEEL_DEEP} strokeWidth={2.2} strokeLinecap="round" />
        <path d="M118 91 L115 106" stroke={INK} strokeWidth={10} strokeLinecap="round" />
        <path d="M118 91 L115 106" stroke={LEATHER} strokeWidth={5.6} strokeLinecap="round" />
        <path d="M104.2 88.5 L131.8 93.5" stroke={INK} strokeWidth={9.5} strokeLinecap="round" />
        <path d="M104.2 88.5 L131.8 93.5" stroke={GOLD} strokeWidth={5} strokeLinecap="round" />
        <circle cx="114.4" cy="110" r="4.8" fill={GOLD} stroke={INK} strokeWidth={2.6} />
        <circle cx="116.6" cy="99" r="7.5" fill={STEEL} stroke={INK} strokeWidth={3} />
        <path
          d="M141 5 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z"
          fill={GOLD}
          stroke={INK}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </g>

      {/* Helm */}
      <path
        d="M30 70 C30 34 48 20 74 20 C100 20 118 34 118 70 L118 88 Q118 104 102 104 L46 104 Q30 104 30 88 Z"
        fill={STEEL}
        stroke={INK}
        strokeWidth={3.6}
        strokeLinejoin="round"
      />
      <path
        d="M104 30 C114 40 116 56 116 70 L116 88 Q116 102 102 102 L96 102 Q109 95 109 80 L109 64 C109 50 107 39 104 30 Z"
        fill={STEEL_DEEP}
        opacity={0.5}
      />
      <path d="M40 54 C42 40 51 30 63 26" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.75} />
      <rect x="68" y="14" width="12" height="10" rx="3" fill={GOLD} stroke={INK} strokeWidth={2.6} />

      {/* Gesicht */}
      <rect x="46" y="52" width="56" height="40" rx="16" fill={SKIN} stroke={INK} strokeWidth={3.2} />
      <ellipse cx="63" cy="70" rx="3.8" ry="4.8" fill={INK} />
      <ellipse cx="85" cy="70" rx="3.8" ry="4.8" fill={INK} />
      <circle cx="64.3" cy="68.2" r="1.5" fill="#FFFFFF" />
      <circle cx="86.3" cy="68.2" r="1.5" fill="#FFFFFF" />
      <ellipse className="knight__lid" cx="63" cy="70" rx="5.6" ry="6" fill={SKIN} opacity={0} />
      <ellipse className="knight__lid" cx="85" cy="70" rx="5.6" ry="6" fill={SKIN} opacity={0} />
      <path d="M56.5 61 L68 63.2 M91.5 61 L80 63.2" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx="55" cy="79" rx="5" ry="3" fill="#F59A84" opacity={0.75} />
      <ellipse cx="93" cy="79" rx="5" ry="3" fill="#F59A84" opacity={0.75} />
      <path d="M66 79.5 Q74 90 82 79.5 Z" fill="#8A2C24" stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />

      {/* Hochgeklapptes Visier */}
      <path d="M40 54 Q74 40 108 54 L108 45 Q74 30 40 45 Z" fill={STEEL_DEEP} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <circle cx="62" cy="43.2" r="1.7" fill={INK} />
      <circle cx="74" cy="42.2" r="1.7" fill={INK} />
      <circle cx="86" cy="43.2" r="1.7" fill={INK} />
      <circle cx="39" cy="50" r="4.2" fill={GOLD} stroke={INK} strokeWidth={2.2} />
      <circle cx="109" cy="50" r="4.2" fill={GOLD} stroke={INK} strokeWidth={2.2} />
      <circle cx="36.5" cy="82" r="2.2" fill={INK} />
      <circle cx="111.5" cy="82" r="2.2" fill={INK} />

      {/* Schild */}
      <path
        d="M20 100 L60 100 L60 118 C60 134 50 145 40 151 C30 145 20 134 20 118 Z"
        fill={shield}
        stroke={INK}
        strokeWidth={3.4}
        strokeLinejoin="round"
      />
      <path
        d="M25 105 L55 105 L55 118 C55 131 47 140 40 145 C33 140 25 131 25 118 Z"
        fill="none"
        stroke={GOLD}
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      <path
        d="M31 112 h4 v4 h3.5 v-4 h3 v4 h3.5 v-4 h4 v9 l-2.5 2 v11 h-13 v-11 l-2.5 -2 Z"
        fill={GOLD}
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path d="M38 134 v-5 a2 2 0 0 1 4 0 v5 Z" fill={INK} />
    </svg>
  )
}
