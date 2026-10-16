import type { Messages } from './en'

/** Deutsch. Unvollständige Einträge fallen zur Laufzeit auf Englisch zurück. */
export const de: Partial<Messages> = {
  'app.title': 'Schach Abenteurer',
  'app.description':
    'Schach-Abenteuer für kleine Ritter: kindgerechte Schachaufgaben mit Ritter Kuno für Kinder von 5 bis 10 Jahren.',
  'brand.tagline': 'Die Reise des Ritters',

  'common.stars.one': '{count} Stern',
  'common.stars.other': '{count} Sterne',

  'map.world': 'Welt {n}',
  'map.nextWorld': 'Welt {n}',
  'map.stars': '{got} von {max} Sternen',
  'map.stone': 'Aufgabe {n}',
  'map.stoneStars': 'Aufgabe {n}, {stars}',
  'map.stoneLocked': 'Aufgabe {n}, noch gesperrt',
  'map.chestOpen': 'Schatztruhe (geöffnet)',
  'map.chestReady': 'Schatztruhe öffnen!',
  'map.chestLocked': 'Schatztruhe – löse alle Aufgaben',
  'map.openMe': 'Öffne mich!',
  'map.soon': 'bald!',
  'map.playerKnight': 'Dein Ritter',

  'coach.name': 'Ritter Kuno',

  'puzzle.back': 'Zurück zur Karte',
  'puzzle.mapButton': 'Karte',
  'puzzle.level': 'Aufgabe {n}',
  'puzzle.levelTotal': ' / {total}',
  'puzzle.liveStars.one': '{count} Stern',
  'puzzle.liveStars.other': '{count} Sterne',
  'puzzle.side': 'Du bist {side}',
  'puzzle.hint': 'Hinweis',
  'puzzle.opponentFirst': 'Pass auf – {side} zieht zuerst …',
  'puzzle.yourTurn': 'Jetzt du! Du spielst {side}. {task}',
  'puzzle.opponentReplied': '{side} hat geantwortet. Finde den nächsten Zug!',
  'puzzle.good': 'Richtig! Mal sehen, was der Gegner jetzt macht …',
  'puzzle.hintMessage': 'Psst … die leuchtende Figur ist dein Held! Wohin muss sie?',
  'puzzle.solved': 'Geschafft! Großartig gemacht!',
  'puzzle.solvedMate': 'Schachmatt! Großartig gemacht!',
  'puzzle.wrong.1': 'Hmm, nicht ganz! Schau nochmal genau hin.',
  'puzzle.wrong.2': 'Fast! Probier einen anderen Zug.',
  'puzzle.wrong.3': 'Der König kann da noch entwischen – such weiter!',
  'puzzle.wrong.4': 'Nicht aufgeben, tapferer Ritter! Versuch es nochmal.',

  'result.3.title': 'Perfekt!',
  'result.3.subtitle': 'Alle drei Sterne – ganz ohne Hilfe!',
  'result.2.title': 'Super!',
  'result.2.subtitle': 'Zwei Sterne! Du wirst immer stärker.',
  'result.1.title': 'Geschafft!',
  'result.1.subtitle': 'Ein Stern! Probier es nochmal für mehr Sterne.',
  'result.again': 'Nochmal',
  'result.continue': 'Weiter',
  'result.chest.title': 'Welt geschafft!',
  'result.chest.subtitle': 'Du hast {got} von {max} Sternen gesammelt. Bald geht die Reise weiter nach {world}!',
  'result.chest.button': 'Hurra!',

  'board.label': 'Schachbrett',
  'board.square': 'Feld {square}, {side} {piece}',
  'board.empty': 'Feld {square}, leer',

  'piece.p': 'Bauer',
  'piece.n': 'Springer',
  'piece.b': 'Läufer',
  'piece.r': 'Turm',
  'piece.q': 'Dame',
  'piece.k': 'König',

  'side.w': 'Weiß',
  'side.b': 'Schwarz',

  'world.burgdorf.name': 'Burgdorf',
  'world.burgdorf.subtitle': 'Matt in 1',
  'world.burgdorf.task': 'Setze den König mit einem einzigen Zug schachmatt!',
  'world.finsterwald.name': 'Finsterwald',
  'world.finsterwald.subtitle': 'Welt 2',

  'misc.sound.on': 'Ton einschalten',
  'misc.sound.off': 'Ton ausschalten',
  'misc.footer.code': 'Quellcode auf GitHub',
  'misc.language.label': 'Sprache',
}
