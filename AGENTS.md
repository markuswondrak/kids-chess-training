# Hinweise für Agents

## Oberste Regel: einfach halten

Implementierungen so einfach wie möglich. Die kleinste Lösung, die das Problem löst, gewinnt.

- Keine neuen Abhängigkeiten ohne zwingenden Grund – React, Vite und chess.js reichen.
- Kein Backend, keine Accounts, kein Netzwerk zur Laufzeit. Fortschritt und Daten liegen lokal (localStorage, gebündelte JSON-Dateien).
- Kein Feature-Creep: Nur umsetzen, was in den GitHub-Issues (Label `roadmap`) steht oder ausdrücklich gefragt wurde. Neue Ideen stattdessen als Issue anlegen.
- Lieber vorhandene Komponenten und Design-Tokens wiederverwenden, als Neues zu bauen.

## Git-Workflow

- Änderungen werden nie direkt auf `main` gepusht, sondern immer über einen Branch und einen Pull Request.
- Das gilt auch für kleine Änderungen (Fixes, Doku, Specs).

## Projekt

Schach Abenteurer (international: Adventure Chess) ist eine kindgerechte Schach-Puzzle-App für 5- bis 10-Jährige. Die Oberfläche ist auf Deutsch, Englisch und Französisch verfügbar, mobil zuerst (Handy/Tablet, Hochformat), mit Ritter Kuno als Begleiter.

- Puzzles stammen aus der Lichess-Datenbank (CC0), erzeugt von `scripts/extract-puzzles.mjs`.
- `src/data/puzzles.json` ist generiert – nicht von Hand bearbeiten.
- Designs: bestehende Tokens in `src/styles/tokens.css` nutzen; Kunststil sind rundliche Cartoon-SVGs mit Tintenumriss (`--ink`).

## Befehle

- `npm run dev` – Entwicklungsserver
- `npm run build` – Typecheck + Build; muss am Ende jeder Änderung durchlaufen
- `npm run puzzles` – Puzzles neu aus der Lichess-DB ziehen (braucht `curl` und `zstd`)

## Struktur

- `src/game/` – Daten und Logik (Welten, Fortschritt, Karten-Geometrie, Sounds)
- `src/hooks/usePuzzle.ts` – Ablauf einer Aufgabe (Gegnerzug, Zugprüfung, Sterne)
- `src/components/` – Screens und Darstellung
- `scripts/extract-puzzles.mjs` – Puzzle-Generator; neue Welten oben in `WORLDS` eintragen
- GitHub Issues mit Label `roadmap` – Backlog aller geplanten Ideen

## Spec-Kit-Artefakte

Grundsatz: Nur Projekt-Intent ist versioniert; alles von `specify init` erzeugte oder installierte Gerüst wird nach dem Clone rekonstruiert.

- Versioniert: Verfassung (`.specify/memory/constitution.md`), `.specify/integration.json`, `.specify/init-options.json` und die Ignore-Regeln in der Wurzel-`.gitignore` (bewusst dort statt in `.specify/.gitignore`, die `specify init --force` überschreibt).
- Ignoriert: `.specify/scripts/`, `.specify/templates/`, `.specify/presets/`, `.specify/workflows/`, `.specify/feature.json`, `.specify/integrations/*.manifest.json` (Install-Records mit Zeitstempel), `.opencode/` und `specs/`.
- Rekonstruktion nach frischem Clone (Scripts, Templates, der Workflow `speckit` und das Preset `lean` sind im specify-cli-Paket enthalten; CLI-Version aus `init-options.json`, derzeit 1.0.13):

  ```bash
  specify init --here --force --non-interactive --integration opencode --script sh --preset lean
  ```

  Danach ist `git status` sauber; ohne `--preset lean` entstehen die vollen statt der Lean-Kommandos.
