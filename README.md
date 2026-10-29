<div align="center">

# Adventure Chess

**Chess puzzles for little knights (ages 5–10)**

<p>
  <img src="docs/screenshot-karte.png" width="280" alt="Map of Burgdorf with Knight Kuno on his way to the castle" />
  <img src="docs/screenshot-aufgabe.png" width="280" alt="Puzzle 1: chessboard with a mate-in-1 position" />
</p>

On the map, Knight Kuno travels from puzzle to puzzle. Every solved puzzle brings
him one step closer to the castle – and to the treasure chest at the end of the world.

</div>

## What's inside

- **World 1 "Burgdorf":** 12 mate-in-1 puzzles, real positions from the
  [Lichess puzzle database](https://database.lichess.org/) (CC0, Elo ~400–800)
- **World 2 "Finsterwald" (Darkwood):** 12 hanging-piece puzzles ("Grab the undefended
  piece!", Elo 550–700) in a dusk forest with its own map, board frame and colours
- **World 3 "Nebelsumpf" (Misty Marsh):** 12 fork puzzles ("Attack two pieces at once
  with one piece!", Elo 650–800) in a friendly foggy marsh with reeds, pools and a willow
- **World 4 "Frostgipfel" (Frostpeak):** 12 mate-in-2 puzzles ("Checkmate the king in
  2 moves!", Elo 750–900) on a snowy alpine ascent with an ice palace, frozen lake and a
  volcanic teaser for world 5
- **World 5 "Glutvulkan" (Ember Volcano):** 12 pin and skewer puzzles ("Win a piece!",
  Elo 850–1000) inside a warm volcanic caldera with a smelting forge, bubbling lava lake and a
  teaser for World 6 (Cloud Isles)
- **World 6 "Wolkeninseln" (Cloud Isles):** 12 discovered attack and double check puzzles
  ("Win a piece!", Elo 950–1100) on floating sky islands with a cloud citadel, sky beacon
  and a teaser for World 7 (Ghost Ruins)
- **Worlds in order:** the next world opens with the treasure chest of the previous one;
  the map previews the next planned world
- **Kid-friendly controls:** tap a piece, tap a target square. The opponent moves
  automatically, wrong moves wobble.
- **3-star system:** three stars without help, one star with a hint
- **Knight Kuno accompanies every puzzle** with a short mission in child-friendly language
- **Sound and music** via Web Audio, with a mute button
- **No backend, no accounts:** progress is stored locally in `localStorage`

## Getting started

The app is publicly playable at **[kids-chess.wondrax.cloud](https://kids-chess.wondrax.cloud/)** – just open it in your browser, no installation needed.

For local development:

```bash
npm install
npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run puzzles` | Re-fetch puzzles from the Lichess DB (requires `curl` and `zstd`) |

## How it's built

```
src/game/            worlds, progress, map geometry, sounds
src/game/endless.ts  endless mode: loads the pool of a world, shuffled runs
src/hooks/usePuzzle.ts   the flow of one puzzle (opponent move, move checks, stars)
src/components/      screens and the cartoon SVGs (pieces, Knight Kuno, map)
src/data/puzzles.json    generated puzzle data – do not edit by hand
src/data/endless.burgdorf.json   generated endless-mode pool – do not edit by hand
src/data/endless.finsterwald.json   generated endless-mode pool – do not edit by hand
src/data/endless.nebelsumpf.json    generated endless-mode pool – do not edit by hand
src/data/endless.frostgipfel.json   generated endless-mode pool – do not edit by hand
src/data/endless.glutvulkan.json    generated endless-mode pool – do not edit by hand
src/data/endless.wolkeninseln.json  generated endless-mode pool – do not edit by hand
scripts/extract-puzzles.mjs   generates puzzles.json and the endless pools from the Lichess DB
```

A new world takes these steps:

1. Add it at the top of `WORLDS` in `scripts/extract-puzzles.mjs` (Elo band, motifs,
   `maxPlayerMoves`, `excludeThemes`, `count`). Build it with `released: false`, run
   `npm run puzzles`, check the output, then set `released: true` and run it again: the
   released data is then pinned and a re-run must not change it.
2. Register it in `WORLDS` in `src/game/worlds.ts` and add its loader in `src/game/endless.ts`
   (the type `Record<WorldId, …>` enforces it). Its planned entry in `ROADMAP` already exists.
3. Add `world.{id}.name` and `world.{id}.subtitle` in all three dictionaries in `src/i18n/`.
4. Draw its map scene and board frame (`src/components/MapArt.tsx` dispatches by world id;
   `src/styles/tokens.css` holds the per-world colours).

The map preview then moves on to the next planned world by itself.

## Tech

React 19, Vite and [chess.js](https://github.com/jhlywa/chess.js) – nothing more
is needed. Everything runs in the browser; the app is built mobile-first (phone and
tablet, portrait).

## Roadmap

Where the journey goes next – worlds 6 to 8, offline support as a PWA, ranks, and a
customizable knight avatar – is tracked in the
[issues](https://github.com/markuswondrak/kids-chess-training/issues).

---

The puzzle data comes from the Lichess puzzle database and is licensed under CC0.
