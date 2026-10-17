/** Holzpalisade rund ums Brett (Finsterwald): Bohlen, Pfähle, Moos und ein Pilz. */
export function ForestFrame() {
  return (
    <>
      <svg className="bark-grain" aria-hidden="true">
        <defs>
          <pattern id="bark-grain" width="120" height="30" patternUnits="userSpaceOnUse">
            {/* Bohlennähte */}
            <path d="M0 29.5H120" stroke="rgba(47,36,32,.38)" strokeWidth={1.8} />
            <path d="M0 1.5H120" stroke="rgba(255,255,255,.2)" strokeWidth={1.4} />
            {/* Maserung */}
            <path d="M0 10 C22 7 40 13 62 10 S100 7 120 10 M0 20 C28 17 52 23 80 20 S108 18 120 20" fill="none" stroke="rgba(47,36,32,.2)" strokeWidth={1.4} />
            {/* Astloch */}
            <ellipse cx="36" cy="15" rx="5.5" ry="2.8" fill="rgba(47,36,32,.12)" stroke="rgba(47,36,32,.32)" strokeWidth={1.3} />
            <path d="M88 6 l6 0" stroke="rgba(255,255,255,.2)" strokeWidth={1.4} strokeLinecap="round" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bark-grain)" />
      </svg>
      {/* runde Pfähle statt Zinnen; die Höhen wechseln */}
      <div className="palisade" aria-hidden="true">
        {Array.from({ length: 11 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <svg className="forest-frame__moss" viewBox="0 0 90 28" aria-hidden="true">
        <path d="M2 26 C2 14 12 10 20 14 C24 4 40 4 44 13 C52 8 64 10 66 18 C76 16 88 20 88 26 Z" fill="#5E9A4E" stroke="#2F2420" strokeWidth={2.4} strokeLinejoin="round" />
        <path d="M18 18 q4 -4 8 0 M48 16 q4 -4 8 0" stroke="#86BC6B" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      </svg>
      <svg className="forest-frame__shroom" viewBox="0 0 44 40" aria-hidden="true">
        <g stroke="#2F2420" strokeWidth={2} strokeLinejoin="round">
          <path d="M12 38 Q13 30 13 26 H19 Q19 30 20 38 Z" fill="#F6EAD0" />
          <path d="M3 27 Q3 12 16 12 Q29 12 29 27 Z" fill="#D9443A" />
          <path d="M28 38 Q29 33 29 31 H33 Q33 33 34 38 Z" fill="#F6EAD0" />
          <path d="M23 32 Q23 23 31 23 Q39 23 39 32 Z" fill="#D9443A" />
        </g>
        <circle cx="10" cy="20" r="2.2" fill="#fff" />
        <circle cx="19" cy="16.5" r="1.8" fill="#fff" />
        <circle cx="22" cy="23" r="1.5" fill="#fff" />
        <circle cx="29" cy="27" r="1.4" fill="#fff" />
        <circle cx="34" cy="26" r="1.2" fill="#fff" />
      </svg>
    </>
  )
}

/** Burgmauer rund ums Brett: Steinfugen und Zinnen. */
export function CastleWall() {
  return (
    <>
      <svg className="wall-stones" aria-hidden="true">
        <defs>
          <pattern id="wall-stones" width="64" height="32" patternUnits="userSpaceOnUse">
            <path
              d="M0 15.5H64M0 31.5H64M16 0v15.5M48 0v15.5M0 15.5v16M32 15.5v16"
              fill="none"
              stroke="rgba(47,36,32,.22)"
              strokeWidth={1.6}
            />
            <path
              d="M1 1.5H15M17 1.5H47M49 1.5H63M1 17.5H31M33 17.5H63"
              fill="none"
              stroke="rgba(255,255,255,.3)"
              strokeWidth={1.4}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wall-stones)" />
      </svg>
      <div className="battlements" aria-hidden="true">
        {Array.from({ length: 11 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </>
  )
}
