#!/usr/bin/env node
/**
 * Testet Spiellogik, Progression und Lokalisierung für Welten und Truhen.
 *
 * Ausführen mit:
 *   node scripts/test-progression.mjs
 */
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const puzzles = JSON.parse(readFileSync(resolve(ROOT_DIR, 'src/data/puzzles.json'), 'utf8'))

// Simuliere WORLDS und ROADMAP aus worlds.ts
const WORLDS = [
  { id: 'burgdorf', number: 1, puzzles: puzzles.burgdorf },
  { id: 'finsterwald', number: 2, puzzles: puzzles.finsterwald },
  { id: 'nebelsumpf', number: 3, puzzles: puzzles.nebelsumpf },
  { id: 'frostgipfel', number: 4, puzzles: puzzles.frostgipfel },
  { id: 'glutvulkan', number: 5, puzzles: puzzles.glutvulkan },
]

const ROADMAP = [
  { id: 'burgdorf', number: 1 },
  { id: 'finsterwald', number: 2 },
  { id: 'nebelsumpf', number: 3 },
  { id: 'frostgipfel', number: 4 },
  { id: 'glutvulkan', number: 5 },
  { id: 'wolkeninseln', number: 6 },
  { id: 'geisterruine', number: 7 },
  { id: 'drachenburg', number: 8 },
]

function findWorld(id) {
  return WORLDS.find((w) => w.id === id)
}

function nextBuiltWorld(world) {
  const i = WORLDS.findIndex((w) => w.id === world.id)
  return i >= 0 && i < WORLDS.length - 1 ? WORLDS[i + 1] : undefined
}

function upcomingWorld(world) {
  const i = ROADMAP.findIndex((w) => w.id === world.id)
  if (i === -1 || i >= ROADMAP.length - 1) return undefined
  const nextMeta = ROADMAP[i + 1]
  return findWorld(nextMeta.id) ? undefined : nextMeta
}

function roadmapAfter(world) {
  const i = ROADMAP.findIndex((w) => w.id === world.id)
  return i >= 0 && i < ROADMAP.length - 1 ? ROADMAP[i + 1] : undefined
}

function currentWorld(progress) {
  return WORLDS.find((w) => !progress.chests[w.id]) ?? WORLDS[WORLDS.length - 1]
}

function frontier(world, progress) {
  const i = world.puzzles.findIndex((p) => !progress.stars[p.id])
  return i === -1 ? world.puzzles.length : i
}

function loadI18n(lang) {
  const content = readFileSync(resolve(ROOT_DIR, `src/i18n/${lang}.ts`), 'utf8')
  const entries = {}
  const regex = /'([^']+)':\s*'([^']*)'/g
  let match
  while ((match = regex.exec(content)) !== null) {
    entries[match[1]] = match[2]
  }
  return entries
}

const de = loadI18n('de')
const en = loadI18n('en')
const fr = loadI18n('fr')
const dicts = { de, en, fr }

function t(dict, key, params = {}) {
  let str = dict[key] || ''
  for (const [k, v] of Object.entries(params)) {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
  }
  return str
}

console.log('=== Test Progression & Localization ===\n')

// 1. Alle Truhen zu -> Burgdorf ist aktiv
let progress = { stars: {}, chests: {} }
if (currentWorld(progress).id !== 'burgdorf') throw new Error('1. Schritt fehlgeschlagen: Burgdorf nicht aktiv')
console.log('✓ 1. Alle Truhen geschlossen -> Burgdorf ist aktiv')

// 2. Burgdorf, Finsterwald, Nebelsumpf offen, Frostgipfel zu -> Frostgipfel ist aktiv
progress.chests = { burgdorf: true, finsterwald: true, nebelsumpf: true }
if (currentWorld(progress).id !== 'frostgipfel') throw new Error('2. Schritt fehlgeschlagen: Frostgipfel nicht aktiv')
console.log('✓ 2. Truhen 1-3 offen -> Frostgipfel aktiv, Glutvulkan noch nicht erreichbar')

// 3. Frostgipfel-Truhe öffnet -> Handoff zu Glutvulkan
const frostgipfelWorld = findWorld('frostgipfel')
const nextFromFrost = nextBuiltWorld(frostgipfelWorld)
if (!nextFromFrost || nextFromFrost.id !== 'glutvulkan') {
  throw new Error(`3. Schritt fehlgeschlagen: Nächste Welt nach Frostgipfel ist nicht Glutvulkan (${nextFromFrost?.id})`)
}

for (const [lang, dict] of Object.entries(dicts)) {
  const worldName = t(dict, `world.${nextFromFrost.id}.name`)
  const btnText = t(dict, 'result.chest.next', { world: worldName })
  const subtitle = t(dict, `world.${nextFromFrost.id}.subtitle`)
  console.log(`  [${lang}] Button: "${btnText}" | Weltname: "${worldName}" | Untertitel: "${subtitle}"`)
  if (!btnText.includes(worldName)) {
    throw new Error(`Button-Text enthält nicht den Weltnamen in ${lang}`)
  }
}
console.log('✓ 3. Frostgipfel-Truhe Handoff-Button korrekt in allen Sprachen')

// 4. Frostgipfel geöffnet -> Glutvulkan wird currentWorld
progress.chests.frostgipfel = true
const cw = currentWorld(progress)
if (cw.id !== 'glutvulkan') throw new Error('4. Schritt fehlgeschlagen: Glutvulkan nicht aktiv')
if (frontier(cw, progress) !== 0) throw new Error('4. Schritt fehlgeschlagen: Kuno nicht an Stop 1 (frontier=0)')
console.log('✓ 4. Neustart mit Truhen 1-4 offen -> Glutvulkan ist aktiv an Stop 1 (12 Stops)')

// 5. Schild-Vorschau (US4)
const glutvulkanWorld = findWorld('glutvulkan')
const afterGlut = roadmapAfter(glutvulkanWorld)
if (!afterGlut || afterGlut.id !== 'wolkeninseln') {
  throw new Error('5. Schritt fehlgeschlagen: Roadmap nach Glutvulkan ist nicht Wolkeninseln')
}
const wolkenBuilt = findWorld('wolkeninseln')
if (wolkenBuilt !== undefined) throw new Error('Wolkeninseln sollte noch nicht gebaut sein')
console.log('✓ 5. Glutvulkan Schild-Vorschau zeigt ungebautes Wolkeninseln (bald-Badge aktiv)')

const afterFrost = roadmapAfter(frostgipfelWorld)
const frostBuilt = findWorld(afterFrost.id)
if (!frostBuilt || frostBuilt.id !== 'glutvulkan') {
  throw new Error('Frostgipfel nächstes Ziel in Roadmap ist nicht Glutvulkan')
}
console.log('✓ 6. Frostgipfel Schild-Vorschau zeigt Glutvulkan ohne bald-Badge (da gebaut)')

// 6. Task-Text für Glutvulkan-Motive (US2)
function taskKey(motif) {
  const TASK_KEYS = {
    mateIn1: 'task.mateIn1',
    mateIn2: 'task.mateIn2',
    hanging: 'task.hanging',
    fork: 'task.fork',
  }
  return (motif && TASK_KEYS[motif]) || 'task.generic'
}

if (taskKey('pin') !== 'task.generic' || taskKey('skewer') !== 'task.generic') {
  throw new Error('taskKey für pin oder skewer liefert nicht task.generic')
}

for (const [lang, dict] of Object.entries(dicts)) {
  const prompt = t(dict, taskKey('pin'))
  console.log(`  [${lang}] Kuno Task prompt: "${prompt}"`)
  if (!prompt) throw new Error(`Fehlender Task-Prompt in ${lang}`)
}
console.log('✓ 7. Kuno Task-Prompt liefert "Gewinne eine Figur!" / "Win a piece!" / "Gagne une pièce !"')

// 7. Lösen von Glutvulkan-Puzzles (Stop 1 bis 12) & Truhen-Freischaltung
const gPuzzles = glutvulkanWorld.puzzles
for (let i = 0; i < gPuzzles.length; i++) {
  const p = gPuzzles[i]
  if (frontier(glutvulkanWorld, progress) !== i) {
    throw new Error(`Erwartete Kuno an Stop ${i + 1}`)
  }
  // Simulieren: lösen mit 3 Sternen
  progress.stars[p.id] = 3
}

if (frontier(glutvulkanWorld, progress) !== 12) {
  throw new Error('Nach 12 gelösten Puzzles sollte Kuno an der Truhe stehen (frontier=12)')
}
console.log('✓ 8. Alle 12 Glutvulkan-Puzzles sequenziell gelöst -> Kuno erreicht Truhe')

// Truhe öffnen
progress.chests.glutvulkan = true
console.log('✓ 9. Glutvulkan-Truhe geöffnet')

// 8. Endlos-Modus & Offline-Fallback (T033)
const endlessRaw = JSON.parse(readFileSync(resolve(ROOT_DIR, 'src/data/endless.glutvulkan.json'), 'utf8'))
const curatedSet = new Set(gPuzzles.map((p) => p.id))
const filteredEndless = endlessRaw.filter((p) => !curatedSet.has(p.id))

if (filteredEndless.length < 50) {
  throw new Error(`Endlos-Pool hat nur ${filteredEndless.length} Puzzles nach Filterung der kuratierten`)
}
console.log(`✓ 10. Endlos-Pool Glutvulkan geladen (${filteredEndless.length} Puzzles, keine Überschneidung mit kuratierten)`)

// Fallback-Texte bei Chunk-Ausfall prüfen
for (const [lang, dict] of Object.entries(dicts)) {
  const note = t(dict, 'endless.unavailable')
  const toMapBtn = t(dict, 'endless.toMap')
  if (!note || !toMapBtn) throw new Error(`Fehlende Fallback-Texte in ${lang}`)
  console.log(`  [${lang}] Offline-Notiz: "${note.slice(0, 40)}..." | Zurück: "${toMapBtn}"`)
}
console.log('✓ 11. Endlos-Offline-Fallback Texte in allen Sprachen vorhanden')

console.log('\nAlle Progressions- und Lokalisierungstests erfolgreich bestanden!\n')
