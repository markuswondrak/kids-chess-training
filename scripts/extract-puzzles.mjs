#!/usr/bin/env node
/**
 * Zieht kindgerechte Puzzles aus der Lichess-Puzzle-Datenbank (CC0) und
 * schreibt sie nach src/data/puzzles.json (12 kuratierte Aufgaben je Welt)
 * sowie nach src/data/endless.<worldId>.json (Vorrat für den Endlosmodus).
 * Ein Lauf erzeugt beides (contracts/endless-pool.md, contracts/puzzle-data.md).
 *
 * Die komplette Datenbank (~6 M Zeilen) wird gelesen. Die Welten mit engem Filter
 * (z. B. Finsterwald, research.md R8) haben in einem Teilstück zu wenige Kandidaten:
 *
 *   curl -s https://database.lichess.org/lichess_db_puzzle.csv.zst \
 *     | zstd -dc | node scripts/extract-puzzles.mjs
 *
 * Spalten: PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningTags
 * Achtung: FEN ist die Stellung VOR dem Gegnerzug. moves[0] ist der Gegnerzug,
 * ab moves[1] folgt die Lösung (Spieler, Gegner, Spieler, …).
 *
 * Freigegebene Welten (`released: true`) werden NICHT neu gezogen: ihre Aufgaben
 * und ihr Vorrat werden aus den committeten Dateien übernommen, nur `motif` wird
 * neu berechnet. So ändern sich ausgelieferte Welten auch bei einem neuen Lauf nicht.
 * Alle Dateien werden nur geschrieben, wenn kein fataler Fehler auftrat.
 */
import { createInterface } from 'node:readline'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Chess } from 'chess.js'

const DATA_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data')
const OUT = resolve(DATA_DIR, 'puzzles.json')
const endlessOut = (worldId) => resolve(DATA_DIR, `endless.${worldId}.json`)

/** Lichess-Themen je Motiv (contracts/puzzle-data.md). */
const MOTIF_THEMES = {
  mateIn1: ['mateIn1'],
  mateIn2: ['mateIn2'],
  hanging: ['hangingPiece'],
  fork: ['fork'],
  pin: ['pin'],
  skewer: ['skewer'],
  discovered: ['discoveredAttack', 'doubleCheck'],
}

/** Vorrang, wenn ein Puzzle mehrere Motive einer Welt trägt (vorne = vorrangig). */
const MOTIF_PRIORITY = ['mateIn1', 'mateIn2', 'fork', 'hanging', 'pin', 'skewer', 'discovered']

/**
 * Welten-Konfiguration. Neue Welten kommen oben in die Liste.
 * `released: true` = Daten sind ausgeliefert und werden gepinnt.
 */
const WORLDS = [
  {
    id: 'finsterwald',
    released: true,
    minRating: 550,
    maxRating: 700,
    motifs: ['hanging'],
    maxPlayerMoves: 2,
    excludeThemes: ['mateIn1', 'mateIn2'],
    // Hanging-Puzzles mit ≤ 2 Zügen sind selten: die Schwankungsbreite der Wertung wird etwas
    // großzügiger erlaubt (Burgdorf: 90). Ohne das gäbe es zu wenige Kandidaten (research.md R8).
    maxDeviation: 120,
    count: 12,
    maxPerPiece: 4,
    endlessCount: 100,
    endlessMaxPerPiece: 40,
  },
  {
    id: 'burgdorf',
    released: true,
    minRating: 0,
    maxRating: 650,
    motifs: ['mateIn1'],
    maxPlayerMoves: 1,
    count: 12,
    maxPerPiece: 4,
    endlessCount: 100,
    endlessMaxPerPiece: 40,
  },
]

/** Weniger Zeilen als das deuten auf einen abgeschnittenen oder leeren Stream hin. */
const MIN_ROWS = 100000

const MIN_PLAYS = 500
const MIN_POPULARITY = 85
const MAX_DEVIATION = 90

/** Qualitätsschwellen des Endlos-Vorrats (research.md Nr. 4). */
const ENDLESS_MIN_SIZE = 50
const ENDLESS_MAX_DELTA = 50

const pieceCount = (fen) => [...fen.split(' ')[0]].filter((c) => /[a-z]/i.test(c)).length

/** Motiv einer Aufgabe: das vorrangige Motiv der Welt, dessen Lichess-Thema vorliegt. */
function motifOf(themes, motifs) {
  for (const m of MOTIF_PRIORITY) {
    if (motifs.includes(m) && MOTIF_THEMES[m].some((t) => themes.includes(t))) return m
  }
  return undefined
}

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
  if (p.deviation > (world.maxDeviation ?? MAX_DEVIATION) || p.popularity < MIN_POPULARITY || p.plays < MIN_PLAYS) return null
  if ((world.excludeThemes ?? []).some((t) => p.themes.includes(t))) return null
  const motif = motifOf(p.themes, world.motifs)
  if (!motif) return null
  const playerMoves = Math.ceil((p.moves.length - 1) / 2)
  if (playerMoves > world.maxPlayerMoves) return null
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
  return { ...p, motif, hero, pieces: pieceCount(p.fen), score: p.rating + pieceCount(p.fen) * 10 }
}

/** Puzzle-Format für die Ausgabe: Meta-Themen entfernen, `motif` kommt zuletzt. */
const toPuzzle = ({ id, fen, moves, rating, themes, motif }) => ({
  id,
  fen,
  moves,
  rating,
  themes: themes.filter((t) => !['oneMove', 'short', 'mate'].includes(t)),
  motif,
})

const mean = (xs) => xs.reduce((sum, x) => sum + x, 0) / xs.length

/** Figuren-Mix als kompakte Zeichenkette, häufigste zuerst: {r:40,q:40,b:13,n:7}. */
const mix = (perPiece) =>
  `{${Object.entries(perPiece)
    .sort((a, b) => b[1] - a[1])
    .map(([piece, n]) => `${piece}:${n}`)
    .join(',')}}`

/** Vorrat: Kandidaten ohne die Kuratierten, leichteste zuerst (die Welt soll eher unten liegen). */
function endlessPoolFor(world, rest) {
  const sorted = [...rest].sort((a, b) => a.rating - b.rating || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
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

const released = WORLDS.filter((w) => w.released)
const unreleased = WORLDS.filter((w) => !w.released)

/** Fatale Fehler: führen dazu, dass gar keine Datei geschrieben wird (contracts/puzzle-data.md). */
const fatal = []
/** Qualitätshinweise des Vorrats: Dateien werden trotzdem geschrieben, der Lauf endet mit Fehlercode. */
const problems = []

function readCommitted(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (err) {
    fatal.push(`${path} nicht lesbar: ${err.message}`)
    return null
  }
}

const taken = new Set()
const curated = {}
const endless = {}

// 1) Freigegebene Welten: committete Daten übernehmen, nur das Motiv neu berechnen.
const committedCurated = released.length ? readCommitted(OUT) : {}
for (const world of released) {
  const repin = (list, label) =>
    list.map((p) => {
      const motif = motifOf(p.themes ?? [], world.motifs)
      if (!motif) fatal.push(`${world.id} ${label} ${p.id}: kein Motiv der Welt passt`)
      const { motif: _previous, ...rest } = p
      return { ...rest, motif }
    })

  const list = committedCurated?.[world.id]
  const vorrat = readCommitted(endlessOut(world.id))
  if (!Array.isArray(list)) fatal.push(`${world.id}: kuratierte Aufgaben fehlen in ${OUT}`)
  if (!Array.isArray(vorrat)) fatal.push(`${world.id}: Vorrat ${endlessOut(world.id)} fehlt`)
  if (Array.isArray(list) && Array.isArray(vorrat)) {
    curated[world.id] = repin(list, 'kuratiert')
    endless[world.id] = repin(vorrat, 'Vorrat')
    for (const p of [...curated[world.id], ...endless[world.id]]) taken.add(p.id)
    console.error(`${world.id}: freigegeben, ${list.length} kuratiert, ${vorrat.length} Vorrat (übernommen)`)
  }
}

// 2) Noch nicht freigegebene Welten: aus dem Stream ziehen.
const buckets = new Map(unreleased.map((w) => [w.id, []]))
const rl = createInterface({ input: process.stdin, crlfDelay: Infinity })
let rows = 0
let header = true
for await (const line of rl) {
  if (header) {
    header = false
    continue
  }
  if (!line) continue
  rows++
  const p = parse(line)
  for (const world of unreleased) {
    if (taken.has(p.id)) continue
    const c = candidateFor(world, p)
    if (c) buckets.get(world.id).push(c)
  }
}
if (rows < MIN_ROWS) fatal.push(`nur ${rows} Zeilen im Stream (mindestens ${MIN_ROWS} nötig)`)

for (const world of unreleased) {
  const pool = buckets
    .get(world.id)
    .filter((c) => !taken.has(c.id))
    .sort((a, b) => a.score - b.score)
  const perPiece = {}
  const picked = []
  for (const c of pool) {
    if (picked.length >= world.count) break
    if ((perPiece[c.hero] ?? 0) >= world.maxPerPiece) continue
    perPiece[c.hero] = (perPiece[c.hero] ?? 0) + 1
    picked.push(c)
  }
  if (picked.length < world.count) {
    fatal.push(`${world.id}: nur ${picked.length} von ${world.count} Aufgaben gefunden`)
    continue
  }
  picked.sort((a, b) => a.score - b.score)
  curated[world.id] = picked.map(toPuzzle)
  for (const c of picked) taken.add(c.id)

  const pickedIds = new Set(picked.map((c) => c.id))
  const rest = pool.filter((c) => !pickedIds.has(c.id))
  const kuratiertMittel = mean(picked.map((c) => c.rating))
  const { vorrat, perPiece: vorratPerPiece } = endlessPoolFor(world, rest)
  endless[world.id] = vorrat.map(toPuzzle)
  for (const c of vorrat) taken.add(c.id)

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

if (fatal.length) {
  console.error(`Abbruch – es wurde nichts geschrieben:\n - ${fatal.join('\n - ')}`)
  process.exit(1)
}

// 3) Schreiben: alle Dateien erst jetzt, und nur wenn alle Welten erfolgreich waren.
const out = {}
for (const world of WORLDS) out[world.id] = curated[world.id]
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
