import { useCallback, useEffect, useRef, useState } from 'react'
import { Confetti } from './components/Confetti'
import { Crest } from './components/Heraldry'
import { MapScreen, type Walk } from './components/MapScreen'
import { PuzzleScreen } from './components/PuzzleScreen'
import { ResultBanner } from './components/ResultBanner'
import { Chest } from './components/Treasure'
import { GitHubIcon, SoundOffIcon, SoundOnIcon } from './components/icons'
import { LanguageSwitch } from './components/LanguageSwitch'
import { createRun, loadEndlessPool, type EndlessRun } from './game/endless'
import { currentWorld, frontier, useProgress, worldStars, type StarCount } from './game/progress'
import { setMuted, sfx } from './game/sounds'
import { nextBuiltWorld, upcomingWorld, type Puzzle, type World, type WorldId } from './game/worlds'
import { useI18n, type MessageKey } from './i18n'

type Route = { screen: 'map' } | { screen: 'puzzle'; index: number } | { screen: 'endless' }

/** Vorrat des Endlosmodus. Er wird höchstens einmal pro Sitzung geladen (FR-015). */
type PoolAvailability = { status: 'unknown' } | { status: 'ready'; pool: Puzzle[] } | { status: 'unavailable' }

/** Hash-Route: nur Aufgaben der angezeigten Welt (kein Zurück zu fertigen Welten, FR-011). */
function parseHash(world: World): Route {
  const m = window.location.hash.match(/^#\/([\w-]+)\/(\d+)$/)
  if (m && m[1] === world.id) {
    const index = Number(m[2]) - 1
    if (index >= 0 && index < world.puzzles.length) return { screen: 'puzzle', index }
  }
  return { screen: 'map' }
}

const RESULT_KEYS: Record<StarCount, { title: MessageKey; subtitle: MessageKey }> = {
  3: { title: 'result.3.title', subtitle: 'result.3.subtitle' },
  2: { title: 'result.2.title', subtitle: 'result.2.subtitle' },
  1: { title: 'result.1.title', subtitle: 'result.1.subtitle' },
}

export default function App() {
  const { t, lang } = useI18n()
  const { progress, recordStars, openChest } = useProgress()
  /** Die Welt, die gerade auf der Karte gezeigt wird. Wechselt nur über den Banner-Knopf. */
  const [viewedWorld, setViewedWorld] = useState<World>(() => currentWorld(progress))
  const world = viewedWorld
  const [route, setRoute] = useState<Route>(() => parseHash(viewedWorld))
  const [attempt, setAttempt] = useState(0)
  const [walk, setWalk] = useState<Walk | null>(null)
  const pendingWalk = useRef<Walk | null>(null)
  const [muted, setMutedState] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [chestBanner, setChestBanner] = useState(false)
  const [availability, setAvailability] = useState<Partial<Record<WorldId, PoolAvailability>>>({})
  const poolRequested = useRef(new Set<WorldId>())
  const poolState: PoolAvailability = availability[world.id] ?? { status: 'unknown' }
  const [run, setRun] = useState<EndlessRun | null>(null)
  const [endlessPuzzle, setEndlessPuzzle] = useState<Puzzle | null>(null)

  useEffect(() => setMuted(muted), [muted])

  // Titel, Beschreibung und Dokumentsprache folgen der aktiven Sprache (FR-009).
  useEffect(() => {
    document.title = `${t('app.title')} – ${t('brand.tagline')}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('app.description'))
    document.documentElement.lang = lang
  }, [t, lang])

  // Einfaches Hash-Routing, damit der Zurück-Knopf des Handys funktioniert.
  useEffect(() => {
    history.scrollRestoration = 'manual'
    const onPop = () => {
      const next = parseHash(viewedWorld)
      setRoute(next)
      // Zurück auf der Karte: Endlos-Lauf verwerfen (FR-009) und offenen Laufweg gleich mitstarten.
      if (next.screen === 'map') {
        setRun(null)
        setEndlessPuzzle(null)
      }
      if (next.screen === 'map' && pendingWalk.current) {
        setWalk(pendingWalk.current)
        pendingWalk.current = null
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [viewedWorld])

  useEffect(() => {
    if (!confetti) return
    const t = setTimeout(() => setConfetti(false), 6000)
    return () => clearTimeout(t)
  }, [confetti])

  const goMap = useCallback(() => {
    setConfetti(false)
    // Kamen wir per Klick von der Karte, einfach einen Schritt zurück – sonst Eintrag ersetzen.
    if ((history.state as { fromMap?: boolean } | null)?.fromMap) history.back()
    else {
      history.replaceState(null, '', window.location.pathname)
      setRun(null)
      setEndlessPuzzle(null)
      setRoute({ screen: 'map' })
      setWalk(pendingWalk.current)
      pendingWalk.current = null
    }
  }, [])

  // Beim Öffnen der Truhen-Ansicht einmal pro Sitzung und Welt den Vorrat laden (FR-015).
  const requestPool = (worldId: WorldId) => {
    if (poolRequested.current.has(worldId)) return
    poolRequested.current.add(worldId)
    loadEndlessPool(worldId).then((pool) =>
      setAvailability((prev) => ({ ...prev, [worldId]: pool ? { status: 'ready', pool } : { status: 'unavailable' } })),
    )
  }

  /** Banner-Knopf „Auf nach …!“: die nächste Welt wird angezeigt, Kuno steht am ersten Stein. */
  const continueTo = (next: World) => {
    setConfetti(false)
    setChestBanner(false)
    setRun(null)
    setEndlessPuzzle(null)
    setWalk(null)
    pendingWalk.current = null
    history.replaceState(null, '', window.location.pathname)
    setRoute({ screen: 'map' })
    setViewedWorld(next)
  }

  const startEndless = (pool: Puzzle[]) => {
    const next = createRun(pool)
    setRun(next)
    setEndlessPuzzle(next.next())
    setChestBanner(false)
    setConfetti(false)
    setAttempt((a) => a + 1)
    history.pushState({ fromMap: true }, '', '#/endless')
    setRoute({ screen: 'endless' })
  }

  const nextEndless = () => {
    if (!run) return
    setConfetti(false)
    setEndlessPuzzle(run.next())
    setAttempt((a) => a + 1)
  }

  const play = (index: number) => {
    sfx.place()
    setWalk(null)
    setAttempt((a) => a + 1)
    history.pushState({ fromMap: true }, '', `#/${world.id}/${index + 1}`)
    setRoute({ screen: 'puzzle', index })
  }

  const solved = (index: number, stars: StarCount) => {
    const firstTime = !progress.stars[world.puzzles[index].id]
    if (firstTime && index === frontier(world, progress)) pendingWalk.current = { from: index + 1, to: index + 2 }
    recordStars(world.puzzles[index].id, stars)
    setConfetti(true)
  }

  const soundButton = (
    <button
      type="button"
      className="btn btn--icon"
      onClick={() => setMutedState((m) => !m)}
      aria-label={muted ? t('misc.sound.on') : t('misc.sound.off')}
    >
      {muted ? <SoundOffIcon /> : <SoundOnIcon />}
    </button>
  )

  const total = worldStars(world, progress)
  const next = nextBuiltWorld(world)
  const upcoming = upcomingWorld()

  return (
    <div className="app" data-world={world.id}>
      <div className="grain" />

      {route.screen === 'map' && (
        <MapScreen
          key={world.id}
          world={world}
          progress={progress}
          walk={walk}
          onWalkDone={() => setWalk(null)}
          onPlay={play}
          onChest={() => {
            openChest(world.id)
            sfx.chest()
            setConfetti(true)
            setChestBanner(true)
            requestPool(world.id)
          }}
          header={
            <header className="topbar topbar--map">
              <Crest className="brand__crest" />
              <div className="brand__text">
                <h1>{t('app.title')}</h1>
                <p>{t('brand.tagline')}</p>
              </div>
              <div className="topbar__spacer" />
              <LanguageSwitch />
              {soundButton}
            </header>
          }
        />
      )}

      {route.screen === 'puzzle' && (
        <PuzzleScreen
          key={`${route.index}-${attempt}`}
          variant="world"
          world={world}
          index={route.index}
          puzzle={world.puzzles[route.index]}
          onSolved={(stars) => solved(route.index, stars)}
          onBack={goMap}
          topRight={soundButton}
          renderResult={(stars) => (
            <ResultBanner stars={stars} title={t(RESULT_KEYS[stars].title)} subtitle={t(RESULT_KEYS[stars].subtitle)}>
              {stars < 3 && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setConfetti(false)
                    setAttempt((a) => a + 1)
                  }}
                >
                  {t('result.again')}
                </button>
              )}
              <button type="button" className="btn btn--red btn--big" onClick={goMap}>
                {t('result.continue')}
              </button>
            </ResultBanner>
          )}
        />
      )}

      {route.screen === 'endless' && endlessPuzzle && (
        <PuzzleScreen
          key={`${endlessPuzzle.id}-${attempt}`}
          variant="endless"
          world={world}
          puzzle={endlessPuzzle}
          onBack={goMap}
          topRight={soundButton}
          renderResult={() => (
            <ResultBanner title={t('endless.solved.title')} subtitle={t('endless.solved.subtitle')}>
              <button type="button" className="btn btn--gold btn--big" onClick={nextEndless}>
                {t('endless.next')}
              </button>
              <button type="button" className="btn btn--red btn--big" onClick={goMap}>
                {t('endless.toMap')}
              </button>
            </ResultBanner>
          )}
        />
      )}

      <footer className="footer">
        <a
          className="footer__link"
          href="https://github.com/markuswondrak/kids-chess-training"
          target="_blank"
          rel="noreferrer"
        >
          <GitHubIcon />
          {t('misc.footer.code')}
        </a>
      </footer>

      {chestBanner && (
        <ResultBanner
          title={t('result.chest.title')}
          subtitle={
            next
              ? t('result.chest.subtitleNext', {
                  got: total,
                  max: world.puzzles.length * 3,
                  world: t(`world.${next.id}.name`),
                })
              : upcoming
                ? t('result.chest.subtitle', {
                    got: total,
                    max: world.puzzles.length * 3,
                    world: t(`world.${upcoming.id}.name`),
                  })
                : ''
          }
          emblem={<Chest open className="banner__chest" />}
          note={poolState.status === 'unavailable' ? t('endless.unavailable') : undefined}
        >
          {next && (
            <button type="button" className="btn btn--red btn--big" onClick={() => continueTo(next)}>
              {t('result.chest.next', { world: t(`world.${next.id}.name`) })}
            </button>
          )}
          {poolState.status === 'ready' && (
            <button
              type="button"
              className="btn btn--gold btn--big"
              onClick={() => startEndless(poolState.pool)}
            >
              {t('endless.button')}
            </button>
          )}
          <button
            type="button"
            className={next ? 'btn' : 'btn btn--red btn--big'}
            onClick={() => setChestBanner(false)}
          >
            {t('result.chest.button')}
          </button>
        </ResultBanner>
      )}
      {confetti && <Confetti />}
    </div>
  )
}
