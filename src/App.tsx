import { useCallback, useEffect, useRef, useState } from 'react'
import { Confetti } from './components/Confetti'
import { Crest } from './components/Heraldry'
import { MapScreen, type Walk } from './components/MapScreen'
import { PuzzleScreen } from './components/PuzzleScreen'
import { ResultBanner } from './components/ResultBanner'
import { Chest } from './components/Treasure'
import { GitHubIcon, SoundOffIcon, SoundOnIcon } from './components/icons'
import { frontier, useProgress, worldStars, type StarCount } from './game/progress'
import { setMuted, sfx } from './game/sounds'
import { COMING_SOON, WORLDS } from './game/worlds'

type Route = { screen: 'map' } | { screen: 'puzzle'; index: number }

const world = WORLDS[0]

function parseHash(): Route {
  const m = window.location.hash.match(/^#\/([\w-]+)\/(\d+)$/)
  if (m && m[1] === world.id) {
    const index = Number(m[2]) - 1
    if (index >= 0 && index < world.puzzles.length) return { screen: 'puzzle', index }
  }
  return { screen: 'map' }
}

const RESULT_TEXT: Record<StarCount, { title: string; subtitle: string }> = {
  3: { title: 'Perfekt!', subtitle: 'Alle drei Sterne – ganz ohne Hilfe!' },
  2: { title: 'Super!', subtitle: 'Zwei Sterne! Du wirst immer stärker.' },
  1: { title: 'Geschafft!', subtitle: 'Ein Stern! Probier es nochmal für mehr Sterne.' },
}

export default function App() {
  const { progress, recordStars, openChest } = useProgress()
  const [route, setRoute] = useState<Route>(parseHash)
  const [attempt, setAttempt] = useState(0)
  const [walk, setWalk] = useState<Walk | null>(null)
  const pendingWalk = useRef<Walk | null>(null)
  const [muted, setMutedState] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [chestBanner, setChestBanner] = useState(false)

  useEffect(() => setMuted(muted), [muted])

  // Einfaches Hash-Routing, damit der Zurück-Knopf des Handys funktioniert.
  useEffect(() => {
    history.scrollRestoration = 'manual'
    const onPop = () => {
      const next = parseHash()
      setRoute(next)
      // Zurück auf der Karte: offenen Laufweg gleich mitstarten (im selben Render).
      if (next.screen === 'map' && pendingWalk.current) {
        setWalk(pendingWalk.current)
        pendingWalk.current = null
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

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
      setRoute({ screen: 'map' })
      setWalk(pendingWalk.current)
      pendingWalk.current = null
    }
  }, [])

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
      aria-label={muted ? 'Ton einschalten' : 'Ton ausschalten'}
    >
      {muted ? <SoundOffIcon /> : <SoundOnIcon />}
    </button>
  )

  const total = worldStars(world, progress)

  return (
    <div className="app">
      <div className="grain" />

      {route.screen === 'map' ? (
        <MapScreen
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
          }}
          header={
            <header className="topbar topbar--map">
              <Crest className="brand__crest" />
              <div className="brand__text">
                <h1>Burgensturm</h1>
                <p>Die Reise des Ritters</p>
              </div>
              <div className="topbar__spacer" />
              {soundButton}
            </header>
          }
        />
      ) : (
        <PuzzleScreen
          key={`${route.index}-${attempt}`}
          world={world}
          index={route.index}
          puzzle={world.puzzles[route.index]}
          onSolved={(stars) => solved(route.index, stars)}
          onBack={goMap}
          topRight={soundButton}
          renderResult={(stars) => (
            <ResultBanner stars={stars} {...RESULT_TEXT[stars]}>
              {stars < 3 && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setConfetti(false)
                    setAttempt((a) => a + 1)
                  }}
                >
                  Nochmal
                </button>
              )}
              <button type="button" className="btn btn--red btn--big" onClick={goMap}>
                Weiter
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
          Quellcode auf GitHub
        </a>
      </footer>

      {chestBanner && (
        <ResultBanner
          title="Welt geschafft!"
          subtitle={`Du hast ${total} von ${world.puzzles.length * 3} Sternen gesammelt. Bald geht die Reise weiter in den ${COMING_SOON.name}!`}
          emblem={<Chest open className="banner__chest" />}
        >
          <button type="button" className="btn btn--red btn--big" onClick={() => setChestBanner(false)}>
            Hurra!
          </button>
        </ResultBanner>
      )}
      {confetti && <Confetti />}
    </div>
  )
}
