<!--
Sync Impact Report
==================
Version change: 1.0.0 → 1.1.0 (MINOR: Prinzip III neu gefasst, abwärtskompatibel)
Modified principles: III. Kindgerechte Bedienung – die Sprachfestlegung
(„die Oberfläche ist auf Deutsch“) entfällt. Prinzip III regelt nur noch die
kindgerechte Bedienung; den Sprachumfang steuern Roadmap-Issues und Specs.
Added sections: keine
Removed sections: keine
Templates requiring updates: keine
Begründung: Issue #7 – die Oberfläche wird mehrsprachig (Deutsch, Englisch,
Französisch). Eine Sprachliste in der Verfassung müsste bei jeder weiteren
Sprache erneut geändert werden und gehört daher nicht hierher.
Follow-up: Der Sprachhinweis in AGENTS.md („Die Oberfläche ist auf Deutsch“)
wird mit Feature 002-i18n (Task T022) angeglichen.
-->

# Burgensturm Constitution

## Core Principles

### I. Einfachheit zuerst

Die kleinste Lösung, die das Problem löst, gewinnt.

- Neue Abhängigkeiten sind nur mit zwingendem Grund zulässig; React, Vite und
  chess.js reichen für dieses Projekt.
- Kein Feature-Creep: Umgesetzt wird ausschließlich, was als Roadmap-Issue
  (Label `roadmap`) existiert oder ausdrücklich gefragt wurde. Neue Ideen werden
  zuerst als Issue angelegt.
- Vorhandene Komponenten und Muster wiederverwenden, statt Neues zu bauen.

Rationale: Eine einfache Codebasis bleibt von einer kleinen Zielgruppe auf
einfachen Geräten wartbar und schnell.

### II. Nur Browser, keine Server

Die App läuft vollständig im Browser (statisches Build).

- Kein Backend, keine Konten, keine Netzwerkaufrufe zur Laufzeit.
- Fortschritt und Nutzerdaten liegen ausschließlich lokal (`localStorage`) oder
  in gebündelten JSON-Dateien.
- Puzzle-Daten MÜSSEN aus der Lichess-Puzzle-Datenbank (CC0) stammen; der
  Lizenzhinweis bleibt erhalten.

Rationale: Ohne Server gibt es keine Betriebskosten, keine Datenschutzfragen und
keine Ausfälle – Kinder können jederzeit spielen.

### III. Kindgerechte Bedienung

Die Zielgruppe sind Kinder von 5 bis 10 Jahren.

- Mobile zuerst: Handy und Tablet im Hochformat; Bedienung durch Antippen
  (kein Drag & Drop-Zwang).
- Jede Interaktion MUSS sofortiges, kindgerechtes Feedback geben (z. B. Figur
  wackelt bei falschem Zug), ohne zu bestrafen.
- Texte sind kurz und in kindgerechter Sprache; Ritter Kuno begleitet jede
  Aufgabe.
- Ein erfolgreicher Abschluss MUSS erreichbar sein, auch mit Hilfe
  (Sterne-System statt Sackgassen).

Rationale: Kinder, die noch nicht sicher lesen, müssen die App ohne Erklärung
spielen können.

### IV. Wiederverwendung von Design und Komponenten

Das Erscheinungsbild bleibt konsistent.

- Farben, Radien, Schatten und Abstände kommen aus den Design-Tokens in
  `src/styles/tokens.css`; keine frei gewählten Werte.
- Der Kunststil sind rundliche Cartoon-SVGs mit Tintenumriss (`--ink`); neue
  Grafiken MÜSSEN diesem Stil folgen.
- Vor neuen Bausteinen: bestehende Komponenten prüfen und erweitern.

Rationale: Ein einheitlicher Stil wirkt für Kinder vertraut und senkt die
Kosten jeder neuen Welt.

### V. Generierte Daten und geprüfte Qualität

- `src/data/puzzles.json` ist generiert und DARF NICHT von Hand bearbeitet
  werden. Änderungen entstehen ausschließlich über
  `scripts/extract-puzzles.mjs` und `npm run puzzles`.
- Am Ende jeder Änderung MUSS `npm run build` (Typecheck + Produktions-Build)
  fehlerfrei durchlaufen.

Rationale: Generierte Daten bleiben reproduzierbar, und der Build ist das
einzige verlässliche Qualitätstor dieses Projekts.

## Technischer Rahmen

- Stack: React 19, Vite und chess.js – nichts darüber hinaus.
- Sprache: TypeScript; keine Laufzeit-Netzwerkzugriffe, keine Datenbank.
- Neue Welten entstehen in drei Schritten: Welt in `WORLDS` in
  `scripts/extract-puzzles.mjs` eintragen, `npm run puzzles` ausführen, in
  `src/game/worlds.ts` registrieren.
- Repository-Struktur: `src/game/` (Logik und Daten), `src/components/`
  (Screens und Darstellung), `src/hooks/` (Abläufe wie `usePuzzle.ts`),
  `scripts/` (Datengenerierung).

## Entwicklungsworkflow

- Jede Änderung endet mit erfolgreichem `npm run build`.
- Der Backlog sind die GitHub-Issues mit Label `roadmap`; nichts anderes wird
  umgesetzt.
- Änderungen bleiben klein und fokussiert; bestehende Konventionen des
  Projekts haben Vorrang vor persönlichem Stil.
- Änderungen an generierten Dateien sind nie manuell, sondern immer über den
  Generator.

## Governance

Diese Verfassung hat Vorrang vor allen anderen Praktiken des Projekts.

- Änderungen werden über `/speckit.constitution` eingebracht und benötigen eine
  dokumentierte Begründung (Sync Impact Report, Versionsbump).
- Versionierung folgt SemVer: MAJOR bei inkompatiblen Grundsatzänderungen oder
  -entfernungen, MINOR bei neuen Grundsätzen oder materiellen Erweiterungen,
  PATCH bei Klarstellungen und Formulierungen.
- Jeder Plan und jede Umsetzung MÜSSEN mit den Prinzipien vereinbar sein;
  Abweichungen MÜSSEN begründet und mit dem Maintainer abgestimmt werden.
- Laufzeit-Hinweise für den Entwicklungsalltag stehen in `AGENTS.md`; bei
  Konflikt gilt diese Verfassung.

**Version**: 1.1.0 | **Ratified**: 2026-10-15 | **Last Amended**: 2026-10-16
