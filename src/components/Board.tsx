import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import type { Move } from 'chess.js'
import type { BoardCell } from '../hooks/usePuzzle'
import type { PieceColor, PieceType } from '../game/types'
import { FIGUR, SEITE } from '../game/types'
import { SwordsBadge } from './Heraldry'
import { PieceIcon } from './pieces'

interface BoardProps {
  board: BoardCell[][]
  selected: string | null
  targets: Move[]
  lastMove: { from: string; to: string } | null
  checkSquare: string | null
  /** Farbe, deren Figuren angetippt werden dürfen. */
  pickColor: PieceColor
  interactive: boolean
  flipped: boolean
  moveCount: number
  hintSquare: string | null
  wrong: { from: string; to: string; id: number } | null
  onSquare: (square: string) => void
}

const fileOf = (square: string) => square.charCodeAt(0) - 97
const rankOf = (square: string) => Number(square[1]) - 1
const squareName = (file: number, rank: number) => String.fromCharCode(97 + file) + (rank + 1)

export function Board({
  board,
  selected,
  targets,
  lastMove,
  checkSquare,
  pickColor,
  interactive,
  flipped,
  moveCount,
  hintSquare,
  wrong,
  onSquare,
}: BoardProps) {
  const files = flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7]
  const ranks = flipped ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0]

  const [intro, setIntro] = useState(true)
  const [anim, setAnim] = useState<{ from: string; to: string } | null>(null)
  const prevCount = useRef(moveCount)

  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 1000)
    return () => clearTimeout(t)
  }, [])

  // Layout-Effect: Animation wird vor dem nächsten Paint gesetzt – kein Aufblitzen am Zielfeld.
  useLayoutEffect(() => {
    if (moveCount > prevCount.current && lastMove) {
      setAnim(lastMove)
      setIntro(false)
    }
    prevCount.current = moveCount
  }, [moveCount, lastMove])

  useEffect(() => {
    if (!anim) return
    const t = setTimeout(() => setAnim(null), 420)
    return () => clearTimeout(t)
  }, [anim])

  const targetMap = new Map<string, Move>(targets.map((t) => [t.to, t]))
  const targetOrder = new Map<string, number>(targets.map((t, i) => [t.to, i]))

  return (
    <div className="board-fit">
      <div className="board" role="grid" aria-label="Schachbrett">
        {ranks.map((rank, rowIndex) =>
          files.map((file, colIndex) => {
            const name = squareName(file, rank)
            const cell = board[7 - rank][file]
            const dark = (file + rank) % 2 === 0
            const isSelected = selected === name
            const target = targetMap.get(name)
            const isLast = lastMove !== null && (lastMove.from === name || lastMove.to === name)
            const isCheck = checkSquare === name
            const pickable = interactive && !!cell && cell.color === pickColor
            const isAnimTo = anim !== null && anim.to === name
            const capture = target ? target.flags.includes('c') || target.flags.includes('e') : false
            const isHint = hintSquare === name
            const isWrongTo = wrong?.to === name
            const isWrongFrom = wrong?.from === name

            const className = [
              'sq',
              dark ? 'sq--dark' : 'sq--light',
              isSelected && 'sq--selected',
              isLast && 'sq--last',
              isCheck && 'sq--check',
              pickable && 'sq--pick',
              isHint && 'sq--hint',
              isWrongTo && 'sq--wrong',
            ]
              .filter(Boolean)
              .join(' ')

            const pieceStyle = { '--d': `${(colIndex + rowIndex) * 24}ms` } as CSSProperties
            if (isAnimTo && anim) {
              // Startversatz relativ zum Zielfeld: Figur beginnt sichtbar auf dem Ausgangsfeld.
              let dx = fileOf(anim.from) - fileOf(anim.to)
              let dy = rankOf(anim.to) - rankOf(anim.from)
              if (flipped) {
                dx = -dx
                dy = -dy
              }
              Object.assign(pieceStyle, { '--dx': dx, '--dy': dy })
            }

            const label = cell
              ? `Feld ${name}, ${SEITE[cell.color as PieceColor]} ${FIGUR[cell.type as PieceType]}`
              : `Feld ${name}, leer`

            const pieceClass = [
              'piece',
              intro && !isAnimTo && 'piece--intro',
              isAnimTo && 'piece--slide',
              isWrongFrom && 'piece--shake',
              isHint && 'piece--hint',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <button key={name} type="button" className={className} onClick={() => onSquare(name)} aria-label={label}>
                {colIndex === 0 && <span className="coord coord--rank">{name[1]}</span>}
                {rowIndex === 7 && <span className="coord coord--file">{name[0]}</span>}
                {isSelected && <span className="sel-ring" />}
                {isHint && <span className="hint-glow" />}
                {cell && (
                  <span key={isWrongFrom ? `w${wrong?.id}` : 'p'} className={pieceClass} style={pieceStyle}>
                    <PieceIcon type={cell.type as PieceType} color={cell.color as PieceColor} />
                  </span>
                )}
                {target && (
                  <span
                    className={`target ${capture ? 'target--capture' : 'target--dot'}`}
                    style={{ '--d': `${(targetOrder.get(name) ?? 0) * 22}ms` } as CSSProperties}
                  >
                    {capture && (
                      <span className="target__swords">
                        <SwordsBadge />
                      </span>
                    )}
                  </span>
                )}
                {isWrongTo && <span key={wrong?.id} className="wrong-mark" aria-hidden="true" />}
              </button>
            )
          }),
        )}
      </div>
    </div>
  )
}
