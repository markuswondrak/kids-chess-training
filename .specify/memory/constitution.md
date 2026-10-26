<!--
Sync Impact Report
==================
Version change: 2.0.0 → 2.0.1 (PATCH: SVG-Szenenwerte präzisiert)
Modified principles: IV. Wiederverwendung von Design und Komponenten – die
Token-Regel gilt für CSS und wiederverwendete/geteilte Komponentenwerte.
Szenenspezifische SVG-Füllungen dürfen weiterhin als Literale in der jeweiligen
Szenenkomponente stehen. Dies dokumentiert die bestehende Konvention der
Art-Guides; gemeinsame SVG- und CSS-Werte bleiben Tokens.
Modified workflow: keine
Added sections: keine
Removed sections: keine
Templates requiring updates: keine
Follow-up: Die Art-Guides von 004 und 005 entsprechen der präzisierten Regel
bereits; keine Portierungs- oder Referenzänderung nötig.
-->

# Burgensturm Constitution

## Core Principles

### I. Einfachheit zuerst

Die kleinste Lösung, die das Problem löst, gewinnt.

- Neue Abhängigkeiten sind nur mit zwingendem Grund zulässig; React, Vite und
  chess.js reichen für dieses Projekt.
- Kein Feature-Creep: Umgesetzt wird nur, was für dieses Projekt vereinbart
  oder ausdrücklich angefragt wurde. Neue Ideen werden zuerst abgestimmt.
- Vorhandene Komponenten und Muster wiederverwenden, statt Neues zu bauen.

Rationale: Eine einfache Codebasis bleibt von einer kleinen Zielgruppe auf
einfachen Geräten wartbar und schnell.

### II. Nur Browser, keine Server

Die App läuft vollständig im Browser (statisches Build).

- Kein Backend, keine Konten, keine Aufrufe an fremde Dienste zur Laufzeit.
  Die App DARF sich nicht auf eine Serverkomponente und nicht auf einen
  Drittanbieter verlassen.
- Eigene statische Assets der Auslieferung DÜRFEN bedarfsgerecht nachgeladen
  werden – etwa um den ersten Start klein zu halten. Ein solches Nachladen
  MUSS ausfallen dürfen, ohne die App unbenutzbar zu machen: statt Fehler- oder
  Leerbildschirm gibt es eine kindgerechte Rückmeldung mit einem Weg zurück
  (Kindgerechte Bedienung, Prinzip III).
- Offline-Verfügbarkeit nachgeladener Daten ist ein eigenes Vorhaben
  (Roadmap-Issue #4, PWA) und DARF NICHT stillschweigend vorausgesetzt werden.
- Fortschritt und Nutzerdaten liegen ausschließlich lokal (`localStorage`) oder
  in eigenen JSON-Dateien der Auslieferung.
- Puzzle-Daten MÜSSEN aus der Lichess-Puzzle-Datenbank (CC0) stammen; der
  Lizenzhinweis bleibt erhalten.

Rationale: Ohne Server gibt es keine Betriebskosten, keine Datenschutzfragen
und keine Ausfälle – Kinder können jederzeit spielen. Ein statisches Build darf
seine eigenen Dateien trotzdem bei Bedarf holen; entscheidend ist, dass keine
Serverlogik und kein fremder Dienst nötig ist und dass ein fehlgeschlagenes
Nachladen die App nicht blockiert.

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

- Farben, Radien, Schatten und Abstände in CSS sowie wiederverwendete oder
  zwischen Komponenten geteilte Werte kommen aus den Design-Tokens in
  `src/styles/tokens.css`. Ausschließlich szenenspezifische SVG-Füllungen
  dürfen als Literale in der betreffenden Szenenkomponente stehen; Werte, die
  auch in CSS verwendet werden, MÜSSEN Tokens sein.
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
- Sprache: TypeScript; keine Server- oder Fremddienst-Aufrufe zur Laufzeit,
  keine Datenbank. Eigene statische Assets DÜRFEN bedarfsgerecht nachgeladen
  werden (Prinzip II).
- Repository-Struktur: `src/game/` (Logik und Daten), `src/components/`
  (Screens und Darstellung), `src/hooks/` (Abläufe wie `usePuzzle.ts`),
  `scripts/` (Datengenerierung).

## Entwicklungsworkflow

- Jede Änderung endet mit erfolgreichem `npm run build`.
- GitHub-Issues dienen als Backlog; ihre Priorisierung wird je Vorhaben
  entschieden.
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

**Version**: 2.0.1 | **Ratified**: 2026-10-15 | **Last Amended**: 2026-10-19
