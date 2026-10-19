import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { usePuzzle, type PuzzleEvent } from '../hooks/usePuzzle'
import type { StarCount } from '../game/progress'
import { sfx } from '../game/sounds'
import type { PieceColor } from '../game/types'
import { taskKey, type Puzzle, type World } from '../game/worlds'
import { useI18n, type MessageKey, type TParams } from '../i18n'
import { Board } from './Board'
import { CoachKnight } from './CoachKnight'
import { CastleWall, ForestFrame } from './Decor'
import { PieceIcon } from './pieces'
import { LanternIcon, StarIcon } from './Treasure'

const WRONG_KEYS = ['puzzle.wrong.1', 'puzzle.wrong.2', 'puzzle.wrong.3', 'puzzle.wrong.4'] as const

const other = (c: PieceColor): PieceColor => (c === 'w' ? 'b' : 'w')

/** Verweis auf einen Seitennamen – wird erst beim Rendern übersetzt. */
const sideKey = (c: PieceColor) => ({ key: `side.${c}` as const })

/** Die Sprechblase speichert Schlüssel + Parameter, nie fertigen Text (FR-005). */
interface Bubble {
  id: number
  key: MessageKey
  params?: TParams
}

function messageFor(e: PuzzleEvent, wrongCount: number): Omit<Bubble, 'id'> | null {
  switch (e.kind) {
    case 'opponent':
      return null // wird unten abhängig vom Fortschritt gesetzt
    case 'good':
      return { key: 'puzzle.good' }
    case 'wrong':
      return { key: WRONG_KEYS[(wrongCount - 1) % WRONG_KEYS.length] }
    case 'hint':
      return { key: 'puzzle.hintMessage' }
    case 'solved':
      return { key: e.mate ? 'puzzle.solvedMate' : 'puzzle.solved' }
    case 'select':
      return null
  }
}

function soundFor(e: PuzzleEvent) {
  switch (e.kind) {
    case 'opponent':
    case 'good':
      if (e.check) sfx.check()
      else if (e.capture) sfx.capture()
      else if (e.piece) sfx.move(e.piece)
      break
    case 'select':
      sfx.pick()
      break
    case 'wrong':
      sfx.wrong()
      break
    case 'hint':
      sfx.hint()
      break
    case 'solved':
      sfx.mate()
      break
  }
}

interface PuzzleScreenCommon {
  world: World
  puzzle: Puzzle
  /** Endet den Lauf sofort (Karte). */
  onBack: () => void
  /** Wird angezeigt, sobald das Puzzle gelöst ist. */
  renderResult: (stars: StarCount) => ReactNode
  topRight: ReactNode
}

/**
 * `world`: Aufgabe einer Welt mit Sternen und Fortschritt.
 * `endless`: Lauf ohne Bewertung – hat bewusst kein `onSolved`, damit nichts gespeichert werden kann.
 */
export type PuzzleScreenProps =
  | (PuzzleScreenCommon & { variant: 'world'; index: number; onSolved: (stars: StarCount) => void })
  | (PuzzleScreenCommon & { variant: 'endless' })

export function PuzzleScreen(props: PuzzleScreenProps) {
  const { world, puzzle, onBack, renderResult, topRight } = props
  const onSolved = props.variant === 'world' ? props.onSolved : undefined
  const { t, tn } = useI18n()
  const pz = usePuzzle(puzzle)
  const [message, setMessage] = useState<Bubble>(() => ({
    id: 0,
    key: 'puzzle.opponentFirst',
    params: { side: sideKey(other(pz.playerColor)) },
  }))
  const [wrongCount, setWrongCount] = useState(0)
  const [showResult, setShowResult] = useState(false)

  useLayoutEffect(() => window.scrollTo({ top: 0 }), [])

  useEffect(() => {
    const e = pz.event
    if (!e) return
    soundFor(e)
    let msg = messageFor(e, e.kind === 'wrong' ? wrongCount + 1 : wrongCount)
    if (e.kind === 'wrong') setWrongCount((c) => c + 1)
    if (e.kind === 'opponent') {
      msg =
        pz.moveCount <= 1
          ? { key: 'puzzle.yourTurn', params: { side: sideKey(pz.playerColor), task: { key: taskKey(puzzle.motif) } } }
          : { key: 'puzzle.opponentReplied', params: { side: sideKey(other(pz.playerColor)) } }
    }
    if (msg) setMessage({ id: e.id, ...msg })
    if (e.kind === 'solved') {
      onSolved?.(pz.stars)
      const timer = setTimeout(() => setShowResult(true), 1100)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pz.event])

  return (
    <div className="screen screen--puzzle">
      <header className="topbar topbar--puzzle">
        <button type="button" className="btn btn--back" onClick={onBack} aria-label={t('puzzle.back')}>
          <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true">
            <path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('puzzle.mapButton')}
        </button>
        <div className="level-tag">
          <small>{t(`world.${world.id}.name`)}</small>
          <strong>
            {props.variant === 'world' ? (
              <>
                {t('puzzle.level', { n: props.index + 1 })}
                <span>{t('puzzle.levelTotal', { total: world.puzzles.length })}</span>
              </>
            ) : (
              t('endless.tag')
            )}
          </strong>
        </div>
        {props.variant === 'world' && (
          <div className="live-stars" aria-label={tn('puzzle.liveStars', pz.stars)}>
            {[1, 2, 3].map((i) => (
              <span key={`${i}-${pz.stars >= i}`} className={pz.stars >= i ? 'live-star' : 'live-star live-star--lost'}>
                <StarIcon empty={pz.stars < i} />
              </span>
            ))}
          </div>
        )}
        {topRight}
      </header>

      <div className="coach-row">
        <CoachKnight className="knight knight--small" label={t('coach.name')} />
        <div key={message.id} className="bubble">
          {t(message.key, message.params)}
        </div>
      </div>

      <div className={`board-frame${world.id === 'finsterwald' ? ' board-frame--forest' : ''}`}>
        {world.id === 'finsterwald' ? <ForestFrame /> : <CastleWall />}
        <Board
          key={puzzle.id}
          board={pz.board}
          selected={pz.selected}
          targets={pz.targets}
          lastMove={pz.lastMove}
          checkSquare={pz.checkSquare}
          pickColor={pz.playerColor}
          interactive={pz.phase === 'play'}
          flipped={pz.playerColor === 'b'}
          moveCount={pz.moveCount}
          hintSquare={pz.hintSquare}
          wrong={pz.wrong}
          onSquare={pz.clickSquare}
        />
      </div>

      <div className="puzzle-actions">
        <span className="side-chip">
          <span className="side-chip__piece">
            <PieceIcon type="k" color={pz.playerColor} />
          </span>
          {t('puzzle.side', { side: t(`side.${pz.playerColor}`) })}
        </span>
        <button
          type="button"
          className="btn btn--hint"
          onClick={pz.hint}
          disabled={pz.phase !== 'play' || pz.hintUsed}
        >
          <LanternIcon className="btn--hint__icon" />
          {t('puzzle.hint')}
          {props.variant === 'world' && (
            <span className="btn--hint__cost">
              −1 <StarIcon />
            </span>
          )}
        </button>
      </div>

      {showResult && renderResult(pz.stars)}
    </div>
  )
}
