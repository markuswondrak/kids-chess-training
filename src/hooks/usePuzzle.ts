import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Chess, type Move, type Square } from 'chess.js'
import type { StarCount } from '../game/progress'
import type { PieceColor, PieceType } from '../game/types'
import type { Puzzle } from '../game/worlds'

export type BoardCell = ReturnType<Chess['board']>[number][number]

/**
 * intro  – Brett steht, gleich zieht der Gegner
 * play   – das Kind ist am Zug
 * reply  – richtiger Zug, der Gegner antwortet gleich
 * solved – geschafft
 */
export type PuzzlePhase = 'intro' | 'play' | 'reply' | 'solved'

export type PuzzleEventKind = 'opponent' | 'select' | 'good' | 'wrong' | 'hint' | 'solved'

export interface PuzzleEvent {
  id: number
  kind: PuzzleEventKind
  piece?: PieceType
  capture?: boolean
  check?: boolean
  mate?: boolean
}

const OPENING_DELAY = 1100
const REPLY_DELAY = 700

const uciFrom = (uci: string) => uci.slice(0, 2) as Square
const uciTo = (uci: string) => uci.slice(2, 4) as Square

export function usePuzzle(puzzle: Puzzle) {
  const gameRef = useRef(new Chess(puzzle.fen))
  const [version, setVersion] = useState(0)
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<PuzzlePhase>('intro')
  const [selected, setSelected] = useState<Square | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const [hints, setHints] = useState(0)
  const [hintSquare, setHintSquare] = useState<Square | null>(null)
  const [wrong, setWrong] = useState<{ from: Square; to: Square; id: number } | null>(null)
  const [event, setEvent] = useState<PuzzleEvent | null>(null)
  const eventId = useRef(0)

  // Wer am Zug ist, spielt den ersten (Gegner-)Zug – das Kind hat also die andere Farbe.
  const playerColor: PieceColor = useMemo(() => (new Chess(puzzle.fen).turn() === 'w' ? 'b' : 'w'), [puzzle.fen])

  const emit = useCallback((e: Omit<PuzzleEvent, 'id'>) => {
    eventId.current += 1
    setEvent({ ...e, id: eventId.current })
  }, [])

  /** Zug ausführen und das passende Ereignis melden. */
  const play = useCallback((from: Square, to: Square, promotion = 'q') => {
    const game = gameRef.current
    const move = game.move({ from, to, promotion })
    setVersion((v) => v + 1)
    return {
      piece: move.piece as PieceType,
      capture: move.flags.includes('c') || move.flags.includes('e'),
      check: game.inCheck(),
      mate: game.isCheckmate(),
    }
  }, [])

  // Gegnerzüge: zu Beginn (step 0) und nach jedem richtigen Zug des Kindes.
  useEffect(() => {
    if (phase !== 'intro' && phase !== 'reply') return
    const uci = puzzle.moves[step]
    if (!uci) return
    const timer = setTimeout(
      () => {
        const info = play(uciFrom(uci), uciTo(uci), uci[4])
        setStep((s) => s + 1)
        setPhase('play')
        emit({ kind: 'opponent', ...info })
      },
      phase === 'intro' ? OPENING_DELAY : REPLY_DELAY,
    )
    return () => clearTimeout(timer)
  }, [phase, step, puzzle.moves, play, emit])

  const state = useMemo(() => {
    const game = gameRef.current
    const history = game.history({ verbose: true })
    const last = history[history.length - 1]
    let checkSquare: Square | null = null
    if (game.inCheck()) {
      for (const row of game.board())
        for (const cell of row) if (cell && cell.type === 'k' && cell.color === game.turn()) checkSquare = cell.square
    }
    return {
      board: game.board(),
      moveCount: history.length,
      lastMove: last ? { from: last.from, to: last.to } : null,
      checkSquare,
      targets: selected ? game.moves({ square: selected, verbose: true }) : ([] as Move[]),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, selected])

  const tryMove = useCallback(
    (from: Square, to: Square) => {
      const expected = puzzle.moves[step]
      const isLast = step === puzzle.moves.length - 1
      let correct = from === uciFrom(expected) && to === uciTo(expected)

      // Lichess akzeptiert beim letzten Zug jedes Matt – wir auch.
      if (!correct && isLast) {
        const probe = new Chess(gameRef.current.fen())
        try {
          probe.move({ from, to, promotion: 'q' })
          correct = probe.isCheckmate()
        } catch {
          correct = false
        }
      }

      setSelected(null)
      if (!correct) {
        setMistakes((m) => m + 1)
        setWrong({ from, to, id: eventId.current + 1 })
        emit({ kind: 'wrong' })
        return
      }

      const promotion = from === uciFrom(expected) && to === uciTo(expected) ? (expected[4] ?? 'q') : 'q'
      const info = play(from, to, promotion)
      setHintSquare(null)
      setWrong(null)
      setStep((s) => s + 1)
      if (isLast) {
        setPhase('solved')
        emit({ kind: 'solved', ...info })
      } else {
        setPhase('reply')
        emit({ kind: 'good', ...info })
      }
    },
    [puzzle.moves, step, play, emit],
  )

  const clickSquare = useCallback(
    (name: string) => {
      if (phase !== 'play') return
      const square = name as Square
      if (selected && state.targets.some((t) => t.to === square)) {
        tryMove(selected, square)
        return
      }
      const piece = gameRef.current.get(square)
      if (piece && piece.color === playerColor) {
        setSelected(square === selected ? null : square)
        if (square !== selected) emit({ kind: 'select', piece: piece.type as PieceType })
        return
      }
      setSelected(null)
    },
    [phase, selected, state.targets, playerColor, tryMove, emit],
  )

  const hint = useCallback(() => {
    if (phase !== 'play' || hintSquare) return
    setHints((h) => h + 1)
    setHintSquare(uciFrom(puzzle.moves[step]))
    setSelected(null)
    emit({ kind: 'hint' })
  }, [phase, hintSquare, puzzle.moves, step, emit])

  // Roter Fehler-Blitz verschwindet nach kurzer Zeit wieder.
  useEffect(() => {
    if (!wrong) return
    const timer = setTimeout(() => setWrong(null), 900)
    return () => clearTimeout(timer)
  }, [wrong])

  const stars = Math.max(1, 3 - mistakes - hints) as StarCount

  return {
    ...state,
    phase,
    playerColor,
    selected,
    hintSquare,
    hintUsed: hintSquare !== null,
    wrong,
    stars,
    event,
    clickSquare,
    hint,
  }
}
