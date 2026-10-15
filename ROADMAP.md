# Roadmap / Backlog

Stand: Welt 1 „Burgdorf“ (12 × Matt in 1) ist fertig – Karte mit Ritter-Lauf, 3-Sterne-System, Hinweis-Knopf, Schatztruhe und Fortschritt im localStorage.

## Geplant

### Weitere Welten (2–8, hoch bis Elo 1200)

- [ ] Welt 2 „Finsterwald“ (~500–600), danach ca. alle 100 Elo-Punkte eine neue Welt
- [ ] je Welt ~12 Puzzles; Themen ergeben sich aus den Lichess-Tags (später auch Gabel, Fesselung)
- [ ] ab Welt ~5 auch mehrmalige Aufgaben (Matt in 2): `maxSolutionMoves` im Skript hochsetzen
- [ ] technisch: in `scripts/extract-puzzles.mjs` neue Welten eintragen → `npm run puzzles` → in `src/game/worlds.ts` registrieren
- [ ] ab 2 Welten: Welten-Auswahl (kleine Weltkarte statt nur Welt 1)

### Endlos-Modus (nach Elo 1200)

- [ ] Zufalls-Puzzle passend zur Stärke des Kindes (eigene Wertung, die sich pro Aufgabe anpasst)
- [ ] Serie/Streak anzeigen, jederzeit aufhören können
- [ ] braucht größeren Puzzle-Pool: mehr Daten extrahieren und getrennt laden (nicht alles ins Start-Bundle)

### Deployment auf GitHub Pages

- [ ] `base` in `vite.config.ts` auf den Repo-Pfad setzen (z. B. `/kids-chess-training/`)
- [ ] GitHub-Actions-Workflow: bei Push bauen und `dist/` auf Pages veröffentlichen
- [ ] Hash-Routing ist schon vorhanden – kein SPA-Fallback nötig

### Offline-Modus

- [ ] App als PWA installierbar (Manifest + Service Worker, Assets werden gecacht)
- [ ] Puzzle-Daten vorab herunterladen statt alles ins Start-Bundle: Welt wird einmal geladen und ist danach offline spielbar
- [ ] Anzeige, welche Welten schon heruntergeladen sind (z. B. Häkchen an der Welt-Auswahl)
- [ ] hängt mit dem Endlos-Modus zusammen: dessen großer Puzzle-Pool darf nicht ins Start-Bundle

### Avatar-Anpassung

- [ ] Ritter-Avatar anpassen: Wappen, Farben, Rüstungsteile
- [ ] Belohnungen: neue Teile für gesammelte Sterne bzw. abgeschlossene Welten freischalten
- [ ] Auswahl-Bildschirm; der gewählte Avatar läuft auf der Karte (heute: fest blau-goldener Ritter)

### Ränge

- [ ] Knappe → Ritter → Burgherr → König
- [ ] Aufstieg über gesammelte Sterne
- [ ] Rang-Abzeichen anzeigen (z. B. in der Kopfzeile der Karte)

### Mehrsprachigkeit (i18n)

- [ ] Oberfläche zusätzlich auf Englisch und Französisch (mindestens)
- [ ] Sprache automatisch aus der Browser-Einstellung, umschaltbar in der App
- [ ] Texte als einfaches Wörterbuch je Sprache sammeln – auch Kunos Sprüche und aria-labels; kein i18n-Paket nötig
- [ ] Puzzle-Daten sind sprachneutral (Lichess), es geht nur um die Oberfläche

## Ideen (später)

- [ ] Spielerprofile für Geschwister (mehrere Speicherstände im localStorage)

## Bewusst nicht (Stand heute)

- Vorlesen der Texte (Sprachausgabe)
- Freier Übungsplatz mit FEN-Eingabe
- Gemischter Trainingsplatz (Wiederholung alter Aufgaben)
- Boss-Level / Spiel gegen einen Computer
