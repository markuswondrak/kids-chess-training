import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { usePuzzle, type PuzzleEvent } from '../hooks/usePuzzle'
import type { StarCount } from '../game/progress'
import { sfx } from '../game/sounds'
import { SEITE, type PieceColor } from '../game/types'
import type { Puzzle, World } from '../game/worlds'
import { Board } from './Board'
import { CoachKnight } from './CoachKnight'
import { CastleWall } from './Decor'
import { PieceIcon } from './pieces'
import { LanternIcon, StarIcon } from './Treasure'

const WRONG = [
  'Hmm, nicht ganz! Schau nochmal genau hin.',
  'Fast! Probier einen anderen Zug.',
  'Der König kann da noch entwischen – such weiter!',
  'Nicht aufgeben, tapferer Ritter! Versuch es nochmal.',
]

const other = (c: PieceColor): PieceColor => (c === 'w' ? 'b' : 'w')

function messageFor(e: PuzzleEvent, wrongCount: number): string | null {
  switch (e.kind) {
    case 'opponent':
      return null // wird unten abhängig vom Fortschritt gesetzt
    case 'good':
      return 'Richtig! Mal sehen, was der Gegner jetzt macht …'
    case 'wrong':
      return WRONG[(wrongCount - 1) % WRONG.length]
    case 'hint':
      return 'Psst … die leuchtende Figur ist dein Held! Wohin muss sie?'
    case 'solved':
      return e.mate ? 'Schachmatt! Großartig gemacht!' : 'Geschafft! Großartig gemacht!'
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

interface PuzzleScreenProps {
  world: World
  index: number
  puzzle: Puzzle
  onSolved: (stars: StarCount) => void
  onBack: () => void
  /** Wird angezeigt, sobald das Puzzle gelöst ist. */
  renderResult: (stars: StarCount) => ReactNode
  topRight: ReactNode
}

export function PuzzleScreen({ world, index, puzzle, onSolved, onBack, renderResult, topRight }: PuzzleScreenProps) {
  const pz = usePuzzle(puzzle)
  const opponent = SEITE[other(pz.playerColor)]
  const [message, setMessage] = useState({ id: 0, text: `Pass auf – ${opponent} zieht zuerst …` })
  const [wrongCount, setWrongCount] = useState(0)
  const [showResult, setShowResult] = useState(false)

  useLayoutEffect(() => window.scrollTo({ top: 0 }), [])

  useEffect(() => {
    const e = pz.event
    if (!e) return
    soundFor(e)
    let text = messageFor(e, e.kind === 'wrong' ? wrongCount + 1 : wrongCount)
    if (e.kind === 'wrong') setWrongCount((c) => c + 1)
    if (e.kind === 'opponent') {
      text =
        pz.moveCount <= 1
          ? `Jetzt du! Du spielst ${SEITE[pz.playerColor]}. ${world.task}`
          : `${opponent} hat geantwortet. Finde den nächsten Zug!`
    }
    if (text) setMessage({ id: e.id, text })
    if (e.kind === 'solved') {
      onSolved(pz.stars)
      const timer = setTimeout(() => setShowResult(true), 1100)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pz.event])

  return (
    <div className="screen screen--puzzle">
      <header className="topbar topbar--puzzle">
        <button type="button" className="btn btn--back" onClick={onBack} aria-label="Zurück zur Karte">
          <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true">
            <path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Karte
        </button>
        <div className="level-tag">
          <small>{world.name}</small>
          <strong>
            Aufgabe {index + 1}
            <span> / {world.puzzles.length}</span>
          </strong>
        </div>
        <div className="live-stars" aria-label={`${pz.stars} Sterne`}>
          {[1, 2, 3].map((i) => (
            <span key={`${i}-${pz.stars >= i}`} className={pz.stars >= i ? 'live-star' : 'live-star live-star--lost'}>
              <StarIcon empty={pz.stars < i} />
            </span>
          ))}
        </div>
        {topRight}
      </header>

      <div className="coach-row">
        <CoachKnight className="knight knight--small" />
        <div key={message.id} className="bubble">
          {message.text}
        </div>
      </div>

      <div className="board-frame">
        <CastleWall />
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
          Du bist {SEITE[pz.playerColor]}
        </span>
        <button
          type="button"
          className="btn btn--hint"
          onClick={pz.hint}
          disabled={pz.phase !== 'play' || pz.hintUsed}
        >
          <LanternIcon className="btn--hint__icon" />
          Hinweis
          <span className="btn--hint__cost">
            −1 <StarIcon />
          </span>
        </button>
      </div>

      {showResult && renderResult(pz.stars)}
    </div>
  )
}
