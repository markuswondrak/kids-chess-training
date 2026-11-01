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
const PIECES = new Set(['p', 'n', 'b', 'r', 'q', 'k'])

/**
 * Welten-Konfiguration. Neue Welten kommen oben in die Liste.
 * `released: true` = Daten sind ausgeliefert und werden gepinnt.
 */
const WORLDS = [
  {
    id: 'wolkeninseln',
    released: true,
    minRating: 950,
    maxRating: 1100,
    motifs: ['discovered'],
    maxPlayerMoves: 2,
    excludeThemes: ['mateIn1', 'mateIn2'],
    count: 12,
    maxPerPiece: 4,
    endlessCount: 100,
    endlessMaxPerPiece: 40,
  },
  {
    id: 'glutvulkan',
    released: true,
    minRating: 850,
    maxRating: 1000,
    motifs: ['pin', 'skewer'],
    maxPlayerMoves: 2,
    excludeThemes: ['mateIn1', 'mateIn2'],
    count: 12,
    maxPerPiece: 4,
    endlessCount: 100,
    endlessMaxPerPiece: 40,
  },
  {
    id: 'frostgipfel',
    released: true,
    minRating: 750,
    maxRating: 900,
    motifs: ['mateIn2'],
    maxPlayerMoves: 2,
    count: 12,
    maxPerPiece: 4,
    endlessCount: 100,
    endlessMaxPerPiece: 40,
  },
  {
    id: 'nebelsumpf',
    released: true,
    minRating: 650,
    maxRating: 800,
    motifs: ['fork'],
    maxPlayerMoves: 2,
    excludeThemes: ['mateIn1', 'mateIn2'],
    maxDeviation: 120,
    count: 12,
    groups: [
      { piece: 'n', count: 6, maxPerPiece: 6 },
      { notPiece: 'n', count: 6, maxPerPiece: 2 },
    ],
    endlessCount: 100,
    endlessMaxPerPiece: 40,
  },
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

/**
 * Spielt eine Puzzle-Lösung nach und findet den ersten Spielerzug, der mindestens
 * zwei gegnerische Figuren (den König eingeschlossen) angreift.
 */
function replay(p) {
  let hero
  let forkPiece
  try {
    const game = new Chess(p.fen)
    const playerColor = game.turn() === 'w' ? 'b' : 'w'
    for (let i = 0; i < p.moves.length; i++) {
      const uci = p.moves[i]
      const move = game.move({ from: uci.slice(0, 2), to: uci.slice(2, 4) })
      if (i === 1) hero = move.piece
      if (i % 2 === 1 && !forkPiece) {
        let targets = 0
        for (const row of game.board()) {
          for (const target of row) {
            if (target && target.color !== playerColor && game.attackers(target.square, playerColor).includes(move.to)) targets++
          }
        }
        if (targets >= 2) forkPiece = move.piece
      }
    }
  } catch {
    return null
  }
  return { hero, forkPiece }
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

  const line = replay(p)
  if (!line || (world.motifs.includes('fork') && !line.forkPiece)) return null
  return {
    ...p,
    motif,
    hero: line.hero,
    forkPiece: line.forkPiece,
    pieces: pieceCount(p.fen),
    score: p.rating + pieceCount(p.fen) * 10,
  }
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
const compareRatingId = (a, b) => a.rating - b.rating || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
const pieceFor = (candidate) => candidate.forkPiece ?? candidate.hero

/** Figuren-Mix als kompakte Zeichenkette: {r:40,q:40,b:13,n:7}. */
const mix = (perPiece) =>
  `{${Object.entries(perPiece)
    .sort((a, b) => b[1] - a[1])
    .map(([piece, n]) => `${piece}:${n}`)
    .join(',')}}`

/** Vorrat: Kandidaten ohne die Kuratierten, leichteste zuerst. */
function endlessPoolFor(world, rest) {
  const sorted = [...rest].sort(compareRatingId)
  const perPiece = {}
  const vorrat = []
  for (const c of sorted) {
    if (vorrat.length >= world.endlessCount) break
    const piece = pieceFor(c)
    if ((perPiece[piece] ?? 0) >= world.endlessMaxPerPiece) continue
    perPiece[piece] = (perPiece[piece] ?? 0) + 1
    vorrat.push(c)
  }
  return { vorrat, perPiece }
}

/** Fatale Fehler: führen dazu, dass gar keine Datei geschrieben wird. */
const fatal = []
/** Qualitätshinweise des Vorrats; sie werden vor dem Schreiben zu fatalen Fehlern. */
const problems = []

function validateWorldConfig(world) {
  if (!Number.isInteger(world.count) || world.count < 1) fatal.push(`${world.id}: count ist ungültig`)
  if (!world.groups) return
  let sum = 0
  for (const [index, group] of world.groups.entries()) {
    const hasPiece = group.piece !== undefined
    const hasNotPiece = group.notPiece !== undefined
    if (hasPiece === hasNotPiece) fatal.push(`${world.id}: Gruppe ${index + 1} muss genau piece oder notPiece enthalten`)
    const selectedPiece = group.piece ?? group.notPiece
    if (!PIECES.has(selectedPiece)) fatal.push(`${world.id}: Gruppe ${index + 1} enthält eine ungültige Figur`)
    if (!Number.isInteger(group.count) || group.count < 1) fatal.push(`${world.id}: Gruppe ${index + 1} hat count < 1`)
    const cap = group.maxPerPiece ?? world.maxPerPiece
    if (!Number.isInteger(cap) || cap < 1) fatal.push(`${world.id}: Gruppe ${index + 1} hat maxPerPiece < 1`)
    sum += group.count
  }
  if (sum !== world.count) fatal.push(`${world.id}: Gruppen ergeben ${sum}, erwartet ${world.count}`)
}

for (const world of WORLDS) validateWorldConfig(world)

const released = WORLDS.filter((w) => w.released)
const unreleased = WORLDS.filter((w) => !w.released)

function readCommitted(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (err) {
    fatal.push(`${path} nicht lesbar: ${err.message}`)
    return null
  }
}

/** Prüft die Gruppen-Invariante eines bereits veröffentlichten curated-Blocks. */
function validateGroups(world, list) {
  if (list.length !== world.count) fatal.push(`${world.id}: kuratierte Liste hat ${list.length} statt ${world.count} Aufgaben`)
  const ids = new Set()
  let offset = 0
  for (const [index, group] of (world.groups ?? []).entries()) {
    const segment = list.slice(offset, offset + group.count)
    if (segment.length !== group.count) {
      fatal.push(`${world.id}: Gruppe ${index + 1} hat ${segment.length} statt ${group.count} Aufgaben`)
      offset += group.count
      continue
    }
    const perPiece = {}
    for (let i = 0; i < segment.length; i++) {
      const puzzle = segment[i]
      if (!puzzle || typeof puzzle !== 'object' || typeof puzzle.id !== 'string') {
        fatal.push(`${world.id}: Gruppe ${index + 1} enthält ungültige Daten`)
        continue
      }
      if (ids.has(puzzle.id)) fatal.push(`${world.id}: Puzzle ${puzzle.id} ist doppelt`)
      ids.add(puzzle.id)
      if (i > 0 && compareRatingId(segment[i - 1], puzzle) > 0) {
        fatal.push(`${world.id}: Gruppe ${index + 1} ist nicht nach rating/id sortiert`)
      }
      const line = replay(puzzle)
      const forkPiece = line?.forkPiece
      if (!forkPiece) {
        fatal.push(`${world.id}: ${puzzle.id} hat keinen erkennbaren Fork`)
        continue
      }
      if (group.piece !== undefined && forkPiece !== group.piece) {
        fatal.push(`${world.id}: ${puzzle.id} gehört nicht in Gruppe ${index + 1}`)
      }
      if (group.notPiece !== undefined && forkPiece === group.notPiece) {
        fatal.push(`${world.id}: ${puzzle.id} gehört nicht in Gruppe ${index + 1}`)
      }
      perPiece[forkPiece] = (perPiece[forkPiece] ?? 0) + 1
    }
    const cap = group.maxPerPiece ?? world.maxPerPiece
    for (const [piece, count] of Object.entries(perPiece)) {
      if (count > cap) fatal.push(`${world.id}: Gruppe ${index + 1} überschreitet maxPerPiece für ${piece}`)
    }
    offset += group.count
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
      if (
        !p ||
        typeof p !== 'object' ||
        typeof p.id !== 'string' ||
        typeof p.fen !== 'string' ||
        !Array.isArray(p.moves) ||
        !p.moves.every((move) => typeof move === 'string') ||
        !Number.isFinite(p.rating) ||
        !Array.isArray(p.themes)
      ) {
        fatal.push(`${world.id} ${label}: ungültige Puzzle-Daten`)
        return p
      }
      if (p.moves.some((move) => move.length > 4)) fatal.push(`${world.id} ${label} ${p.id}: Umwandlung nicht erlaubt`)
      const motif = motifOf(p.themes, world.motifs)
      if (!motif) fatal.push(`${world.id} ${label} ${p.id}: kein Motiv der Welt passt`)
      const line = replay(p)
      if (!line) fatal.push(`${world.id} ${label} ${p?.id ?? '?'}: Lösung nicht spielbar`)
      if (world.motifs.includes('fork') && !line?.forkPiece) fatal.push(`${world.id} ${label} ${p?.id ?? '?'}: kein erkennbarer Fork`)
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
    if (world.groups) validateGroups(world, list)
    for (const p of [...curated[world.id], ...endless[world.id]]) {
      if (!p || typeof p.id !== 'string') {
        fatal.push(`${world.id}: Puzzle ohne gültige ID`)
        continue
      }
      if (taken.has(p.id)) fatal.push(`Puzzle-ID doppelt über Welten hinweg: ${p.id}`)
      taken.add(p.id)
    }
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
    .sort((a, b) => a.score - b.score || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  const groups = world.groups ?? [{ count: world.count, maxPerPiece: world.maxPerPiece }]
  const picked = []
  const pickedIds = new Set()
  const blockSizes = []

  for (const group of groups) {
    const cap = group.maxPerPiece ?? world.maxPerPiece
    const perPiece = {}
    const groupPicked = []
    for (const c of pool) {
      if (groupPicked.length >= group.count) break
      if (pickedIds.has(c.id)) continue
      const piece = pieceFor(c)
      const matches = group.piece !== undefined ? c.forkPiece === group.piece : c.forkPiece !== group.notPiece
      if (!matches || (perPiece[piece] ?? 0) >= cap) continue
      perPiece[piece] = (perPiece[piece] ?? 0) + 1
      groupPicked.push(c)
    }
    if (groupPicked.length < group.count) {
      fatal.push(`${world.id}: Gruppe liefert nur ${groupPicked.length} von ${group.count} Aufgaben`)
      blockSizes.push(groupPicked.length)
      continue
    }
    // Ungrouped worlds keep the 004 score ordering; grouped worlds use the
    // contract's ascending rating/id order inside each configured block.
    groupPicked.sort(world.groups ? compareRatingId : (a, b) => a.score - b.score || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    for (const c of groupPicked) {
      picked.push(c)
      pickedIds.add(c.id)
    }
    blockSizes.push(groupPicked.length)
  }

  if (picked.length < world.count) continue
  curated[world.id] = picked.map(toPuzzle)
  for (const c of picked) {
    if (taken.has(c.id)) fatal.push(`Puzzle-ID doppelt über Welten hinweg: ${c.id}`)
    taken.add(c.id)
  }

  const rest = pool.filter((c) => !pickedIds.has(c.id))
  const kuratiertMittel = mean(picked.map((c) => c.rating))
  const { vorrat, perPiece: vorratPerPiece } = endlessPoolFor(world, rest)
  endless[world.id] = vorrat.map(toPuzzle)
  for (const c of vorrat) {
    if (taken.has(c.id)) fatal.push(`Puzzle-ID doppelt über Welten hinweg: ${c.id}`)
    taken.add(c.id)
  }

  const vorratMittel = mean(vorrat.map((c) => c.rating))
  const delta = vorratMittel - kuratiertMittel
  const blocks = world.groups ? `, Gruppen ${blockSizes.join('/')}` : ''
  console.error(
    `${world.id}: ${pool.length} Kandidaten, ${picked.length} kuratiert${blocks} (Elo-Mittel ${kuratiertMittel.toFixed(1)}), ` +
      `${vorrat.length} Vorrat (Elo-Mittel ${vorratMittel.toFixed(1)}, Delta ${delta >= 0 ? '+' : ''}${delta.toFixed(1)}), ` +
      `Figuren-Mix ${mix(vorratPerPiece)}`,
  )
  if (vorrat.length < ENDLESS_MIN_SIZE) problems.push(`${world.id}: Vorrat ${vorrat.length} < ${ENDLESS_MIN_SIZE}`)
  if (Math.abs(delta) > ENDLESS_MAX_DELTA) problems.push(`${world.id}: |Delta| ${Math.abs(delta).toFixed(1)} > ${ENDLESS_MAX_DELTA}`)
}

if (problems.length) fatal.push(...problems)
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
