import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { sfx } from '../game/sounds'
import { StarIcon } from './Treasure'

interface ResultBannerProps {
  stars?: number
  title: string
  subtitle: string
  emblem?: ReactNode
  children: ReactNode
}

/** Sieg-Overlay mit nacheinander aufploppenden Sternen. */
export function ResultBanner({ stars, title, subtitle, emblem, children }: ResultBannerProps) {
  useEffect(() => {
    if (!stars) return
    const timers = Array.from({ length: stars }, (_, i) => setTimeout(() => sfx.star(i), 380 + i * 280))
    return () => timers.forEach(clearTimeout)
  }, [stars])

  return (
    <div className="banner-wrap">
      <div className="banner-backdrop" />
      <div className="banner" role="alert">
        {emblem}
        {stars !== undefined && (
          <div className="banner__stars">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`banner__star${i < stars ? '' : ' banner__star--empty'}`}
                style={{ '--i': i } as CSSProperties}
              >
                <StarIcon empty={i >= stars} />
              </span>
            ))}
          </div>
        )}
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <div className="banner__buttons">{children}</div>
      </div>
    </div>
  )
}
