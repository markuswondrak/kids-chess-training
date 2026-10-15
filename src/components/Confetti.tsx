import { useMemo, type CSSProperties } from 'react'

const COLORS = ['#C9372C', '#F3B630', '#2F62A8', '#FCF5E3', '#CBD5DE', '#F3B630', '#9B261E']

export function Confetti() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.8,
        duration: 3 + Math.random() * 2.4,
        size: 8 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
        rotation: 360 + Math.random() * 720,
        round: Math.random() < 0.35,
      })),
    [],
  )

  return (
    <div className="confetti" aria-hidden="true">
      {flakes.map((flake, i) => (
        <i
          key={i}
          style={
            {
              left: `${flake.left}%`,
              width: flake.size,
              height: flake.round ? flake.size : flake.size * 1.6,
              background: flake.color,
              borderRadius: flake.round ? '50%' : 3,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
              '--rot': `${flake.rotation}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
