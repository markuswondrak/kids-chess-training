#!/usr/bin/env node
/**
 * Prüft Integrität und Invarianten der generierten Puzzle-Daten:
 * 1. Kuratierte Puzzles (src/data/puzzles.json)
 * 2. Endlos-Puzzles (src/data/endless.<worldId>.json)
 * 3. Globale Eindeutigkeit aller IDs
 * 4. Schachregeln & Replay via chess.js (keine unzulässigen Züge, keine Promotion)
 * 5. Optionaler Snapshot-Vergleich mit /tmp/*.before.json
 *
 * Verwendung:
 *   node scripts/audit-puzzles.mjs [--compare-snapshots]
 */
import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Chess } from 'chess.js'

const DATA_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data')
const PUZZLES_PATH = resolve(DATA_DIR, 'puzzles.json')

const compareSnapshots = process.argv.includes('--compare-snapshots')

const WORLD_RULES = {
  burgdorf: {
    minRating: 0,
    maxRating: 650,
    maxPlayerMoves: 1,
    motifs: ['mateIn1'],
    curatedCount: 12,
    maxPerPiece: 4,
    endlessMinCount: 50,
    endlessTarget: 100,
    endlessMaxPerPiece: 40,
  },
  finsterwald: {
    minRating: 550,
    maxRating: 700,
    maxPlayerMoves: 2,
    motifs: ['hanging'],
    excludeThemes: ['mateIn1', 'mateIn2'],
    curatedCount: 12,
    maxPerPiece: 4,
    endlessMinCount: 50,
    endlessTarget: 100,
    endlessMaxPerPiece: 40,
  },
  nebelsumpf: {
    minRating: 650,
    maxRating: 800,
    maxPlayerMoves: 2,
    motifs: ['fork'],
    excludeThemes: ['mateIn1', 'mateIn2'],
    curatedCount: 12,
    endlessMinCount: 50,
    endlessTarget: 100,
    endlessMaxPerPiece: 40,
  },
  frostgipfel: {
    minRating: 750,
    maxRating: 900,
    maxPlayerMoves: 2,
    motifs: ['mateIn2'],
    curatedCount: 12,
    maxPerPiece: 4,
    endlessMinCount: 50,
    endlessTarget: 100,
    endlessMaxPerPiece: 40,
  },
  glutvulkan: {
    minRating: 850,
    maxRating: 1000,
    maxPlayerMoves: 2,
    motifs: ['pin', 'skewer'],
    excludeThemes: ['mateIn1', 'mateIn2'],
    curatedCount: 12,
    maxPerPiece: 4,
    endlessMinCount: 50,
    endlessTarget: 100,
    endlessMaxPerPiece: 40,
  },
  wolkeninseln: {
    minRating: 950,
    maxRating: 1100,
    maxPlayerMoves: 2,
    motifs: ['discovered'],
    excludeThemes: ['mateIn1', 'mateIn2'],
    curatedCount: 12,
    maxPerPiece: 4,
    endlessMinCount: 50,
    endlessTarget: 100,
    endlessMaxPerPiece: 40,
  },
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

console.log('=== Burgensturm Puzzle Audit ===\n')

const puzzles = loadJson(PUZZLES_PATH)
const allSeenIds = new Map() // id -> world / pool description

function validatePuzzle(p, worldId, poolName, rules) {
  if (!p.id) throw new Error(`[${worldId}:${poolName}] Puzzle fehlt ID`)
  if (allSeenIds.has(p.id)) {
    throw new Error(`[${worldId}:${poolName}] Doppelte ID ${p.id} (zuvor gesehen in ${allSeenIds.get(p.id)})`)
  }
  allSeenIds.set(p.id, `${worldId}:${poolName}`)

  if (p.rating < rules.minRating || p.rating > rules.maxRating) {
    throw new Error(`[${worldId}:${poolName}] Puzzle ${p.id} Rating ${p.rating} außerhalb [${rules.minRating}, ${rules.maxRating}]`)
  }

  if (!rules.motifs.includes(p.motif)) {
    throw new Error(`[${worldId}:${poolName}] Puzzle ${p.id} Motiv '${p.motif}' nicht in [${rules.motifs.join(', ')}]`)
  }

  if (rules.excludeThemes) {
    for (const forbidden of rules.excludeThemes) {
      if (p.themes?.includes(forbidden)) {
        throw new Error(`[${worldId}:${poolName}] Puzzle ${p.id} enthält ausgeschlossenes Theme '${forbidden}'`)
      }
    }
  }

  if (!Array.isArray(p.moves) || p.moves.length < 2) {
    throw new Error(`[${worldId}:${poolName}] Puzzle ${p.id} hat ungültige Züge: ${JSON.stringify(p.moves)}`)
  }

  const playerMoves = Math.ceil((p.moves.length - 1) / 2)
  if (playerMoves > rules.maxPlayerMoves) {
    throw new Error(`[${worldId}:${poolName}] Puzzle ${p.id} hat ${playerMoves} Spielerzüge (max: ${rules.maxPlayerMoves})`)
  }

  // Chess.js Replay
  const chess = new Chess(p.fen)
  for (const m of p.moves) {
    const from = m.slice(0, 2)
    const to = m.slice(2, 4)
    const promotion = m.slice(4)
    if (promotion) {
      throw new Error(`[${worldId}:${poolName}] Puzzle ${p.id} enthält Bauernumwandlung: ${m}`)
    }
    const moveRes = chess.move({ from, to })
    if (!moveRes) {
      throw new Error(`[${worldId}:${poolName}] Puzzle ${p.id} ungültiger Zug ${m} in Stellung ${chess.fen()}`)
    }
  }

  // Erster Spielerzug Figur ermitteln
  const chessReplay = new Chess(p.fen)
  chessReplay.move({ from: p.moves[0].slice(0, 2), to: p.moves[0].slice(2, 4) })
  const piece = chessReplay.get(p.moves[1].slice(0, 2))
  return piece ? piece.type : 'unknown'
}

let totalAudited = 0

for (const [worldId, rules] of Object.entries(WORLD_RULES)) {
  const curated = puzzles[worldId]
  if (!curated) {
    console.log(`⚠️  Welt '${worldId}' noch nicht in puzzles.json vorhanden. Überspringe.`)
    continue
  }

  if (curated.length !== rules.curatedCount) {
    throw new Error(`[${worldId}:curated] Erwartet ${rules.curatedCount} Puzzles, erhalten: ${curated.length}`)
  }

  const curatedPieceCounts = {}
  for (const p of curated) {
    const pt = validatePuzzle(p, worldId, 'curated', rules)
    curatedPieceCounts[pt] = (curatedPieceCounts[pt] || 0) + 1
  }
  totalAudited += curated.length

  if (rules.maxPerPiece) {
    for (const [pt, count] of Object.entries(curatedPieceCounts)) {
      if (count > rules.maxPerPiece) {
        throw new Error(`[${worldId}:curated] Zu viele Züge mit Figur '${pt}': ${count} (max: ${rules.maxPerPiece})`)
      }
    }
  }

  console.log(`✓ ${worldId} kuratiert: ${curated.length} Puzzles (Figuren: ${JSON.stringify(curatedPieceCounts)})`)

  // Endlos-Pool
  const endlessFile = resolve(DATA_DIR, `endless.${worldId}.json`)
  if (!existsSync(endlessFile)) {
    console.log(`⚠️  ${endlessFile} existiert nicht.`)
    continue
  }

  const endless = loadJson(endlessFile)
  if (endless.length < rules.endlessMinCount) {
    throw new Error(`[${worldId}:endless] Pool hat nur ${endless.length} Puzzles (Minimum: ${rules.endlessMinCount})`)
  }

  const endlessPieceCounts = {}
  for (const p of endless) {
    const pt = validatePuzzle(p, worldId, 'endless', rules)
    endlessPieceCounts[pt] = (endlessPieceCounts[pt] || 0) + 1
  }
  totalAudited += endless.length

  if (rules.endlessMaxPerPiece) {
    for (const [pt, count] of Object.entries(endlessPieceCounts)) {
      if (count > rules.endlessMaxPerPiece) {
        throw new Error(`[${worldId}:endless] Zu viele Züge mit Figur '${pt}': ${count} (max: ${rules.endlessMaxPerPiece})`)
      }
    }
  }

  console.log(`✓ ${worldId} endlos: ${endless.length} Puzzles (Figuren: ${JSON.stringify(endlessPieceCounts)})`)
}

console.log(`\nGesamt geprüft: ${totalAudited} Puzzles ohne Fehler, alle IDs eindeutig.\n`)

// Snapshot-Vergleich
if (compareSnapshots) {
  console.log('=== Snapshot-Vergleich mit /tmp/*.before.json ===\n')
  const snapshotPuzzles = '/tmp/puzzles.before.json'
  if (!existsSync(snapshotPuzzles)) {
    throw new Error(`Snapshot-Datei nicht gefunden: ${snapshotPuzzles}`)
  }

  const beforePuzzles = loadJson(snapshotPuzzles)
  for (const worldId of ['burgdorf', 'finsterwald', 'nebelsumpf', 'frostgipfel']) {
    const beforeList = beforePuzzles[worldId]
    const currentList = puzzles[worldId]
    if (!beforeList || !currentList) {
      throw new Error(`Fehlende Daten für Welt ${worldId} im Snapshot-Vergleich`)
    }
    if (JSON.stringify(beforeList) !== JSON.stringify(currentList)) {
      throw new Error(`Abweichung in puzzles.json für freigegebene Welt '${worldId}'!`)
    }

    const beforeEndlessPath = `/tmp/endless.${worldId}.before.json`
    if (!existsSync(beforeEndlessPath)) {
      throw new Error(`Snapshot-Datei nicht gefunden: ${beforeEndlessPath}`)
    }
    const beforeEndless = readFileSync(beforeEndlessPath, 'utf8')
    const currentEndless = readFileSync(resolve(DATA_DIR, `endless.${worldId}.json`), 'utf8')
    if (beforeEndless !== currentEndless) {
      throw new Error(`Abweichung in endless.${worldId}.json für freigegebene Welt '${worldId}'!`)
    }
    console.log(`✓ Welt '${worldId}' stimmt 100% mit Snapshot überein (gepinnt)`)
  }
  console.log('\nAlle freigegebenen Welten sind unverändert!\n')
}
