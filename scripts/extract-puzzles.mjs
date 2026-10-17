#!/usr/bin/env node
/**
 * Zieht kindgerechte Puzzles aus der Lichess-Puzzle-Datenbank (CC0) und
 * schreibt sie nach src/data/puzzles.json (12 kuratierte Aufgaben je Welt)
 * sowie nach src/data/endless.<worldId>.json (Vorrat für den Endlosmodus).
 * Ein Lauf erzeugt beides (contracts/endless-pool.md).
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

const DATA_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data')
const OUT = resolve(DATA_DIR, 'puzzles.json')
const endlessOut = (worldId) => resolve(DATA_DIR, `endless.${worldId}.json`)

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
    endlessCount: 100,
    endlessMaxPerPiece: 40,
  },
]

const MIN_PLAYS = 500
const MIN_POPULARITY = 85
const MAX_DEVIATION = 90

/** Qualitätsschwellen des Endlos-Vorrats (research.md Nr. 4). */
const ENDLESS_MIN_SIZE = 50
const ENDLESS_MAX_DELTA = 50

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

/** Puzzle-Format für die Ausgabe: Meta-Themen entfernen, Rest unverändert. */
const toPuzzle = ({ id, fen, moves, rating, themes }) => ({
  id,
  fen,
  moves,
  rating,
  themes: themes.filter((t) => !['oneMove', 'short', 'mate'].includes(t)),
})

const mean = (xs) => xs.reduce((sum, x) => sum + x, 0) / xs.length

/** Figuren-Mix als kompakte Zeichenkette, häufigste zuerst: {r:40,q:40,b:13,n:7}. */
const mix = (perPiece) =>
  `{${Object.entries(perPiece)
    .sort((a, b) => b[1] - a[1])
    .map(([piece, n]) => `${piece}:${n}`)
    .join(',')}}`

/** Vorrat: Kandidaten ohne die 12 Kuratierten, nach Abstand zum kuratierten Elo-Mittel. */
function endlessPoolFor(world, rest, kuratiertMittel) {
  const sorted = [...rest].sort(
    (a, b) =>
      Math.abs(a.rating - kuratiertMittel) - Math.abs(b.rating - kuratiertMittel) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  )
  const perPiece = {}
  const vorrat = []
  for (const c of sorted) {
    if (vorrat.length >= world.endlessCount) break
    if ((perPiece[c.hero] ?? 0) >= world.endlessMaxPerPiece) continue
    perPiece[c.hero] = (perPiece[c.hero] ?? 0) + 1
    vorrat.push(c)
  }
  return { vorrat, perPiece }
}

const out = {}
const endless = {}
const problems = []
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
  out[world.id] = picked.map(toPuzzle)

  const pickedIds = new Set(picked.map((c) => c.id))
  const rest = pool.filter((c) => !pickedIds.has(c.id))
  const kuratiertMittel = mean(picked.map((c) => c.rating))
  const { vorrat, perPiece: vorratPerPiece } = endlessPoolFor(world, rest, kuratiertMittel)
  endless[world.id] = vorrat.map(toPuzzle)

  const vorratMittel = mean(vorrat.map((c) => c.rating))
  const delta = vorratMittel - kuratiertMittel
  console.error(
    `${world.id}: ${pool.length} Kandidaten, ${picked.length} kuratiert (Elo-Mittel ${kuratiertMittel.toFixed(1)}), ` +
      `${vorrat.length} Vorrat (Elo-Mittel ${vorratMittel.toFixed(1)}, Delta ${delta >= 0 ? '+' : ''}${delta.toFixed(1)}), ` +
      `Figuren-Mix ${mix(vorratPerPiece)}`,
  )
  if (vorrat.length < ENDLESS_MIN_SIZE) problems.push(`${world.id}: Vorrat ${vorrat.length} < ${ENDLESS_MIN_SIZE}`)
  if (Math.abs(delta) > ENDLESS_MAX_DELTA) problems.push(`${world.id}: |Delta| ${Math.abs(delta).toFixed(1)} > ${ENDLESS_MAX_DELTA}`)
}

mkdirSync(DATA_DIR, { recursive: true })
writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n')
console.error(`→ ${OUT}`)
for (const world of WORLDS) {
  writeFileSync(endlessOut(world.id), JSON.stringify(endless[world.id], null, 1) + '\n')
  console.error(`→ ${endlessOut(world.id)}`)
}

// Die Dateien werden in jedem Fall geschrieben; eine verletzte Qualitätsschwelle fällt laut auf.
if (problems.length) {
  console.error(`Qualitätsschwelle verletzt: ${problems.join('; ')}`)
  process.exitCode = 1
}
