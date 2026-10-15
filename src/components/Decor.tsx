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
