#!/usr/bin/env node
/**
 * Zieht kindgerechte Puzzles aus der Lichess-Puzzle-Datenbank (CC0) und
 * schreibt sie nach src/data/puzzles.json.
 *
 * Die komplette Datenbank (~300 MB) muss nicht geladen werden – die Datei ist
 * nach Puzzle-ID sortiert, die Ratings sind also zufällig verteilt. Die ersten
 * ~1 Mio. Zeilen reichen locker:
 *
 *   curl -s https://database.lichess.org/lichess_db_puzzle.csv.zst \
 *     | zstd -dc | head -n 1000000 | node scripts/extract-puzzles.mjs
 *
 * Spalten: PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningTags
 * Achtung: FEN ist die Stellung VOR dem Gegnerzug. moves[0] ist der Gegnerzug,
 * ab moves[1] folgt die Lösung (Spieler, Gegner, Spieler, …).
 */
import { createInterface } from 'node:readline'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Chess } from 'chess.js'

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/puzzles.json')

/** Welten-Konfiguration. Weitere Welten (bis Elo 1200) einfach hier ergänzen. */
const WORLDS = [
  {
    id: 'burgdorf',
    count: 12,
    minRating: 0,
    maxRating: 650,
    themes: ['mateIn1'],
    maxSolutionMoves: 1,
    maxPerPiece: 4,
  },
]

const MIN_PLAYS = 500
const MIN_POPULARITY = 85
const MAX_DEVIATION = 90

const pieceCount = (fen) => [...fen.split(' ')[0]].filter((c) => /[a-z]/i.test(c)).length

function parse(line) {
  const [id, fen, moves, rating, deviation, popularity, plays, themes] = line.split(',')
  return {
    id,
    fen,
    moves: moves.split(' '),
    rating: Number(rating),
    deviation: Number(deviation),
    popularity: Number(popularity),
    plays: Number(plays),
    themes: themes.split(' '),
  }
}

function candidateFor(world, p) {
  if (p.rating < world.minRating || p.rating > world.maxRating) return null
  if (p.deviation > MAX_DEVIATION || p.popularity < MIN_POPULARITY || p.plays < MIN_PLAYS) return null
  if (!world.themes.some((t) => p.themes.includes(t))) return null
  const solution = p.moves.slice(1)
  const playerMoves = Math.ceil(solution.length / 2)
  if (playerMoves > world.maxSolutionMoves) return null
  // Keine Umwandlungen – die Kinder bekommen automatisch eine Dame.
  if (p.moves.some((m) => m.length > 4)) return null

  // Prüfen, dass alles mit chess.js spielbar ist, und die Figur des ersten Lösungszugs merken.
  const game = new Chess(p.fen)
  let hero
  try {
    for (let i = 0; i < p.moves.length; i++) {
      const uci = p.moves[i]
      if (i === 1) hero = game.get(uci.slice(0, 2))?.type
      game.move({ from: uci.slice(0, 2), to: uci.slice(2, 4) })
    }
  } catch {
    return null
  }
  return { ...p, hero, pieces: pieceCount(p.fen), score: p.rating + pieceCount(p.fen) * 10 }
}

const buckets = new Map(WORLDS.map((w) => [w.id, []]))
const rl = createInterface({ input: process.stdin, crlfDelay: Infinity })
let lines = 0
for await (const line of rl) {
  if (lines++ === 0 || !line) continue
  const p = parse(line)
  for (const world of WORLDS) {
    const c = candidateFor(world, p)
    if (c) buckets.get(world.id).push(c)
  }
}

const out = {}
for (const world of WORLDS) {
  const pool = buckets.get(world.id).sort((a, b) => a.score - b.score)
  const perPiece = {}
  const picked = []
  for (const c of pool) {
    if (picked.length >= world.count) break
    if ((perPiece[c.hero] ?? 0) >= world.maxPerPiece) continue
    perPiece[c.hero] = (perPiece[c.hero] ?? 0) + 1
    picked.push(c)
  }
  picked.sort((a, b) => a.score - b.score)
  out[world.id] = picked.map(({ id, fen, moves, rating, themes }) => ({
    id,
    fen,
    moves,
    rating,
    themes: themes.filter((t) => !['oneMove', 'short', 'mate'].includes(t)),
  }))
  console.error(`${world.id}: ${pool.length} Kandidaten, ${picked.length} gewählt`, perPiece)
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n')
console.error(`→ ${OUT}`)
