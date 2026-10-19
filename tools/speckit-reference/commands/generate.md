---
description: "Build rendered visual reference prototypes, target screenshots, and art-guide.md for the active feature plan"
---

# speckit.reference.generate

Prototypes the visual layer of a feature **during planning** against the real app components and stylesheets, renders target screenshots (`360 px`, DPR 2), writes `art-guide.md`, and binds the reference into `plan.md` and `spec.md` so `/speckit.tasks` and `/speckit.implement` port the reference rather than inventing flat art from prose.

## User Input

```text
$ARGUMENTS
```

Accepts:
- Feature identifier (e.g. `004-finsterwald-darkwood-groundwork` or `004`)
- No args — uses active feature from `.specify/feature.json` or current branch

## Workflow

### 1. Resolve feature context

1. Locate `FEATURE_DIR` (`specs/<NNN>-<slug>/`). Require `spec.md` and `plan.md`.
2. Read `spec.md`, `plan.md`, `.specify/memory/constitution.md`, `src/styles/tokens.css`, and the existing reference world (`src/components/MapArt.tsx`, `src/components/Decor.tsx`) to match the project's craft bar:
   - Rounded cartoon SVGs with `--ink` (`#2F2420`) outlines (2–2.8 px), ground shadow, white highlight
   - Two-level token model in `src/styles/tokens.css` (palette tokens + `--world-*` role tokens; no hex/rgba literals in other stylesheets)
   - Deterministic placement via `seeded(n)` from `src/game/mapPath.ts`
   - Animations on `transform`/`opacity` only, all added to `@media (prefers-reduced-motion: reduce)`

If the feature has no visual/world/UI scope that benefits from a rendered prototype, tell the user and stop cleanly.

### 2. Create `FEATURE_DIR/reference/`

Build self-contained, working prototypes that import the real project modules via relative paths (`../../../src/...`):

1. **Scene / UI component(s)** (e.g. `reference/MapArt<World>.tsx`, `reference/<World>Frame.tsx`) — complete, working TSX ready to be ported 1:1 into `src/components/` (only adjusting import paths). Cover every parity row (P1) and unique detail (P2) from `plan.md`.
2. **Stylesheet** (`reference/<world>.css`) — header comment explicitly mapping each section to its target file (`src/styles/tokens.css`, `base.css`, `screens.css`, `board.css`), with `:root` palette tokens, role tokens (`--world-sky`, `--world-ribbon`, `--world-ribbon-sub`, `--world-ring`, `--world-ring-glow`, `--world-locked-face`), per-world override `.app[data-world='<id>']`, keyframes, and reduced-motion rules.
3. **Preview harness** (`reference/preview.tsx`) — Node script using `react-dom/server` (`renderToStaticMarkup`) against the **real** `MapScreen`, `PuzzleScreen`, `ResultBanner` and `src/styles/{tokens,base,board,screens}.css` + `<world>.css`, emitting static `preview-*.html` files (baseline Burgdorf + new world map, puzzle, banner).

### 3. Render & capture screenshots (`reference/shots/*.png`)

1. Bundle and run the harness:
   ```bash
   npx rolldown <FEATURE_DIR>/reference/preview.tsx --format esm --platform node -o /tmp/speckit-ref-preview.mjs
   (cd <FEATURE_DIR>/reference && node /tmp/speckit-ref-preview.mjs)
   rm -f /tmp/speckit-ref-preview.mjs
   ```
2. Capture PNGs at `360 px` width, DPR `2` into `reference/shots/` using an available headless browser (`chrome-headless-shell`, `chromium`, `google-chrome`, or `firefox --headless`):
   - `map-burgdorf.png`, `map-<world>.png`, `compare-map.png`
   - `puzzle-burgdorf.png`, `puzzle-<world>.png`, `compare-puzzle.png`
   - `banner-<world>.png`
   - `detail-*.png` crops for key landmarks / animations
3. Inspect the rendered PNGs with `read` to verify legibility, contrast, stone/path clarity, and pivot alignment. Fix prototype issues and re-render before continuing.

### 4. Write `FEATURE_DIR/art-guide.md`

Document the binding visual contract:
- **§1 What to port, and where** (table mapping `reference/*` → `src/*` + screenshot table)
- **§2 Palette** (two-level token table: palette tokens + role tokens)
- **§3 Craft recipes** (blob outlines, shadow+outline+highlight, depth/haze layers, radial-gradient glows without `feGaussianBlur`, stone legibility, deterministic `seeded(n)`)
- **§4 Animation rules** (table of classes, cycles, wrapper-`<g>` transform rule, pivot points, reduced-motion)
- **§5 Per-world skin**
- **§6 Don'ts**
- **§7 Verification steps** (dev server + headless screenshot commands + `preview.tsx` re-run snippet)

### 5. Bind into `plan.md` and `spec.md`

1. In `plan.md`:
   - Add `art-guide.md` and `reference/` to the Documentation tree under `## Project Structure`.
   - Add/update the **Binding visual reference** callout pointing to `art-guide.md`, `reference/*.tsx`, `reference/*.css`, and `reference/shots/*.png` (*"Port the reference code. Refining is allowed; simplifying or dropping elements is not."*).
   - Ensure P1 (parity table), P2 (unique details), P3 (craft & token rules), and P4 (screenshot diff DoD) are present.
2. In `spec.md`:
   - Ensure a functional requirement binds the implementation to the supplied reference assets (`art-guide.md`, `reference/*`, `reference/shots/*.png`).

## Done When

- [ ] `reference/*.tsx`, `reference/*.css`, and `reference/preview.tsx` exist and execute cleanly via `rolldown` + `node`
- [ ] `reference/shots/*.png` are rendered and visually inspected
- [ ] `art-guide.md` is written
- [ ] `plan.md` (and `spec.md`) reference the artifacts as binding constraints for `/speckit.tasks` and `/speckit.implement`
