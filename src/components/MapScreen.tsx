import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { MAP_W, chestSpot, mapHeight, pointOn, waypoints, type Pt } from '../game/mapPath'
import { frontier, worldStars, type Progress } from '../game/progress'
import { sfx } from '../game/sounds'
import { findWorld, roadmapAfter, type World } from '../game/worlds'
import { useI18n } from '../i18n'
import { CoachKnight } from './CoachKnight'
import { MapArt } from './MapArt'
import { Chest, LockIcon, StarIcon, StarRow } from './Treasure'

export interface Walk {
  /** Wegpunkt-Indizes (1 … n = Steine, n + 1 = Truhe). */
  from: number
  to: number
}

interface MapScreenProps {
  world: World
  progress: Progress
  walk: Walk | null
  onWalkDone: () => void
  onPlay: (index: number) => void
  onChest: () => void
  header: ReactNode
}

const WALK_MS = 1300
const HOPS = 4

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

export function MapScreen({ world, progress, walk, onWalkDone, onPlay, onChest, header }: MapScreenProps) {
  const { t, tn } = useI18n()
  const n = world.puzzles.length
  const height = mapHeight(n)
  const pts = waypoints(n)
  const front = frontier(world, progress)
  const allSolved = front === n
  const chestOpen = !!progress.chests[world.id]
  /** Die geplante Welt nach dieser – „bald!“ nur, solange sie noch nicht gebaut ist. */
  const after = roadmapAfter(world)

  // Standort des Ritters als Wegpunkt-Index (Stein i → i + 1, Truhe → n + 1).
  const home = front + 1
  const [pos, setPos] = useState<{ p: Pt; hop: number; faceLeft: boolean }>(() => ({
    p: pts[walk ? walk.from : home],
    hop: 0,
    faceLeft: false,
  }))
  const [walking, setWalking] = useState(!!walk)
  const [arrived, setArrived] = useState<number | null>(null)
  const knightRef = useRef<HTMLDivElement>(null)

  // Beim Öffnen der Karte: Ritter in die Mitte des Bildschirms holen.
  useLayoutEffect(() => {
    knightRef.current?.scrollIntoView({ block: 'center' })
  }, [])

  useEffect(() => {
    if (!walk) return
    setPos({ p: pts[walk.from], hop: 0, faceLeft: false })
    setWalking(true)
    setArrived(null)
    let raf = 0
    let start = 0
    const segs = walk.to - walk.from
    const duration = WALK_MS * segs
    let landed = 0
    const delay = setTimeout(() => {
      const tick = (now: number) => {
        if (!start) start = now
        const t = Math.min(1, (now - start) / duration)
        const u = ease(t) * segs
        const seg = Math.min(segs - 1, Math.floor(u))
        const p = pointOn(pts, walk.from + seg, u - seg)
        const before = pointOn(pts, walk.from + seg, Math.max(0, u - seg - 0.02))
        setPos({
          p,
          hop: Math.abs(Math.sin(t * Math.PI * HOPS * segs)) * (1 - t * 0.3),
          faceLeft: p.x < before.x - 0.01,
        })
        knightRef.current?.scrollIntoView({ block: 'center' })
        const hops = Math.floor(t * HOPS * segs)
        if (hops > landed) {
          landed = hops
          sfx.step()
        }
        if (t < 1) raf = requestAnimationFrame(tick)
        else {
          setWalking(false)
          setArrived(walk.to)
          onWalkDone()
        }
      }
      raf = requestAnimationFrame(tick)
    }, 500)
    return () => {
      clearTimeout(delay)
      cancelAnimationFrame(raf)
    }
    // Nur beim Betreten der Karte mit einem neuen Weg.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walk])

  const at = (p: Pt): CSSProperties => ({ left: `${(p.x / MAP_W) * 100}%`, top: `${(p.y / height) * 100}%` })
  const total = worldStars(world, progress)

  return (
    <div className="screen screen--map">
      {header}
      <div className="map-head">
        <div className="map-head__ribbon">
          <span className="map-head__world">{t('map.world', { n: world.number })}</span>
          <strong>{t(`world.${world.id}.name`)}</strong>
          <span className="map-head__sub">{t(`world.${world.id}.subtitle`)}</span>
        </div>
        <div className="star-count" aria-label={t('map.stars', { got: total, max: n * 3 })}>
          <StarIcon />
          <span>
            {total}
            <small>/{n * 3}</small>
          </span>
        </div>
      </div>

      <div className="map" style={{ aspectRatio: `${MAP_W} / ${height}` }}>
        <MapArt
          worldId={world.id}
          height={height}
          pts={pts}
          walkedTo={walking ? (walk?.from ?? home) : home}
          stones={n}
        />

        <div className="map-sign map-sign--start" style={at({ x: pts[0].x - 74, y: pts[0].y - 40 })}>
          {t(`world.${world.id}.name`)}
        </div>
        {after && (
          <div className="map-sign map-sign--next" style={at({ x: 112, y: 52 })}>
            <small>{t('map.nextWorld', { n: after.number })}</small>
            {t(`world.${after.id}.name`)}
            {!findWorld(after.id) && <em>{t('map.soon')}</em>}
          </div>
        )}

        {world.puzzles.map((puzzle, i) => {
          const stars = progress.stars[puzzle.id] ?? 0
          const unlocked = i <= front
          const current = i === front && !walking
          const cls = [
            'stone',
            !unlocked && 'stone--locked',
            stars > 0 && 'stone--done',
            current && 'stone--current',
            arrived === i + 1 && 'stone--arrived',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={puzzle.id}
              type="button"
              className={cls}
              style={at(pts[i + 1])}
              disabled={!unlocked || walking}
              onClick={() => onPlay(i)}
              aria-label={
                unlocked
                  ? stars
                    ? t('map.stoneStars', { n: i + 1, stars: tn('common.stars', stars) })
                    : t('map.stone', { n: i + 1 })
                  : t('map.stoneLocked', { n: i + 1 })
              }
            >
              <span className="stone__face">{unlocked ? i + 1 : <LockIcon className="stone__lock" />}</span>
              {stars > 0 && <StarRow count={stars} className="stone__stars" />}
            </button>
          )
        })}

        <button
          type="button"
          className={`chest${allSolved && !chestOpen && !walking ? ' chest--ready' : ''}${chestOpen ? ' chest--open' : ''}`}
          style={at(chestSpot(pts))}
          disabled={!allSolved || walking}
          onClick={onChest}
          aria-label={chestOpen ? t('map.chestOpen') : allSolved ? t('map.chestReady') : t('map.chestLocked')}
        >
          <Chest open={chestOpen} className="chest__art" />
          {allSolved && !chestOpen && !walking && <span className="chest__tap">{t('map.openMe')}</span>}
        </button>

        <div
          ref={knightRef}
          className={`hero${walking ? ' hero--walking' : ''}`}
          style={
            {
              ...at(pos.p),
              '--hop': pos.hop,
              '--face': pos.faceLeft ? -1 : 1,
            } as CSSProperties
          }
          aria-hidden="true"
        >
          <CoachKnight className="hero__art" tunic="#2F62A8" plume="#F3B630" shield="#C9372C" label={t('map.playerKnight')} />
        </div>
      </div>
    </div>
  )
}
