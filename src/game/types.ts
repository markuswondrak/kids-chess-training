export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
export type PieceColor = 'w' | 'b'

export const FIGUR: Record<PieceType, string> = {
  p: 'Bauer',
  n: 'Springer',
  b: 'Läufer',
  r: 'Turm',
  q: 'Dame',
  k: 'König',
}

export const SEITE: Record<PieceColor, string> = {
  w: 'Weiß',
  b: 'Schwarz',
}
