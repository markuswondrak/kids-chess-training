const base = {
  viewBox: '0 0 24 24',
  width: 20,
  height: 20,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const SoundOnIcon = () => (
  <svg {...base}>
    <path d="M4 9.5 v5 h3.2 L12 18.5 V5.5 L7.2 9.5 Z" fill="currentColor" strokeWidth={1.8} />
    <path d="M15.5 9 a4.5 4.5 0 0 1 0 6" />
    <path d="M18 6.5 a8.5 8.5 0 0 1 0 11" />
  </svg>
)

export const SoundOffIcon = () => (
  <svg {...base}>
    <path d="M4 9.5 v5 h3.2 L12 18.5 V5.5 L7.2 9.5 Z" fill="currentColor" strokeWidth={1.8} />
    <path d="M15.5 9.5 l5 5 M20.5 9.5 l-5 5" />
  </svg>
)
