<div align="center">

# Burgensturm

**Schach-Puzzles für kleine Ritter und Ritterinnen (5–10 Jahre)**

<p>
  <img src="docs/screenshot-karte.png" width="280" alt="Karte von Burgdorf mit Ritter Kuno auf dem Weg zur Burg" />
  <img src="docs/screenshot-aufgabe.png" width="280" alt="Aufgabe 1: Schachbrett mit einer Matt-in-1-Stellung" />
</p>

Auf der Karte reist Ritter Kuno von Aufgabe zu Aufgabe. Für jedes gelöste Puzzle
rückt er einen Schritt näher an die Burg – und an die Schatztruhe am Ende der Welt.

</div>

## Was drin ist

- **Welt 1 „Burgdorf“:** 12 Aufgaben vom Typ „Matt in 1“, echte Stellungen aus der
  [Lichess-Puzzle-Datenbank](https://database.lichess.org/) (CC0, Elo ~400–800)
- **Kinderleichte Bedienung:** Figur antippen, Zielfeld antippen. Der Gegner zieht
  automatisch, falsche Züge wackeln.
- **3-Sterne-System:** drei Sterne ohne Hilfe, ein Stern mit Hinweis
- **Ritter Kuno begleitet jede Aufgabe** mit einem kurzen Auftrag in kindgerechter Sprache
- **Ton und Musik** über Web Audio, mit Stummschalt-Knopf
- **Kein Backend, keine Konten:** der Fortschritt liegt lokal im `localStorage`

## Loslegen

```bash
npm install
npm run dev
```

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Entwicklungsserver starten |
| `npm run build` | Typecheck + Produktions-Build nach `dist/` |
| `npm run puzzles` | Puzzles neu aus der Lichess-DB ziehen (braucht `curl` und `zstd`) |

## Wie es aufgebaut ist

```
src/game/            Welten, Fortschritt, Karten-Geometrie, Sounds
src/hooks/usePuzzle.ts   Ablauf einer Aufgabe (Gegnerzug, Zugprüfung, Sterne)
src/components/      Screens und die Cartoon-SVGs (Figuren, Ritter Kuno, Karte)
src/data/puzzles.json    generierte Puzzle-Daten – nicht von Hand bearbeiten
scripts/extract-puzzles.mjs   erzeugt puzzles.json aus der Lichess-DB
```

Eine neue Welt entsteht in drei Schritten: Welt oben in `scripts/extract-puzzles.mjs`
eintragen, `npm run puzzles` ausführen, in `src/game/worlds.ts` registrieren.

## Technik

React 19, Vite und [chess.js](https://github.com/jhlywa/chess.js) – mehr braucht es
nicht. Alles läuft im Browser, die App ist mobil zuerst gebaut (Handy und Tablet,
Hochformat).

## Ausblick

Wie die Reise weitergeht – Welt 2 „Finsterwald“, Endlos-Modus, Offline-fähig als
PWA, Ränge und ein anpassbarer Ritter-Avatar – steht in den
[Issues](https://github.com/markuswondrak/kids-chess-training/issues?q=label%3Aroadmap).

---

Die Puzzle-Daten stammen aus der Lichess-Puzzle-Datenbank und stehen unter CC0.
