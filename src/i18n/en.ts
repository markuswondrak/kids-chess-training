/**
 * Englisch ist die Quelle der Wahrheit: Dieses Wörterbuch definiert alle
 * Schlüssel (`MessageKey`) und dient zugleich als Rückfall, wenn in einer
 * anderen Sprache ein Eintrag fehlt (FR-008).
 */
export const en = {
  'app.title': 'Adventure Chess',
  'app.description': 'A chess adventure for little knights: kid-friendly chess puzzles with Sir Kuno for ages 5 to 10.',
  'brand.tagline': "The Knight's Journey",

  'common.stars.one': '{count} star',
  'common.stars.other': '{count} stars',

  'map.world': 'World {n}',
  'map.nextWorld': 'World {n}',
  'map.stars': '{got} of {max} stars',
  'map.stone': 'Puzzle {n}',
  'map.stoneStars': 'Puzzle {n}, {stars}',
  'map.stoneLocked': 'Puzzle {n}, still locked',
  'map.chestOpen': 'Treasure chest (open)',
  'map.chestReady': 'Open the treasure chest!',
  'map.chestLocked': 'Treasure chest – solve all the puzzles',
  'map.openMe': 'Open me!',
  'map.soon': 'soon!',
  'map.playerKnight': 'Your knight',

  'coach.name': 'Sir Kuno',

  'puzzle.back': 'Back to the map',
  'puzzle.mapButton': 'Map',
  'puzzle.level': 'Puzzle {n}',
  'puzzle.levelTotal': ' / {total}',
  'puzzle.liveStars.one': '{count} star',
  'puzzle.liveStars.other': '{count} stars',
  'puzzle.side': 'You play {side}',
  'puzzle.hint': 'Hint',
  'puzzle.opponentFirst': 'Watch out – {side} moves first…',
  'puzzle.yourTurn': 'Your turn! You play {side}. {task}',
  'puzzle.opponentReplied': '{side} replied. Find the next move!',
  'puzzle.good': "Right! Let's see what the opponent does now…",
  'puzzle.hintMessage': 'Psst… the glowing piece is your hero! Where should it go?',
  'puzzle.solved': 'Done! Great job!',
  'puzzle.solvedMate': 'Checkmate! Great job!',
  'puzzle.wrong.1': 'Hmm, not quite! Take another close look.',
  'puzzle.wrong.2': 'Almost! Try a different move.',
  'puzzle.wrong.3': 'The king can still escape – keep searching!',
  'puzzle.wrong.4': "Don't give up, brave knight! Try again.",

  'result.3.title': 'Perfect!',
  'result.3.subtitle': 'All three stars – without any help!',
  'result.2.title': 'Great!',
  'result.2.subtitle': "Two stars! You're getting stronger.",
  'result.1.title': 'Done!',
  'result.1.subtitle': 'One star! Try again for more stars.',
  'result.again': 'Again',
  'result.continue': 'Continue',
  'result.chest.title': 'World complete!',
  'result.chest.subtitle': 'You collected {got} of {max} stars. The journey continues soon to {world}!',
  'result.chest.next': 'Off to {world}!',
  'result.chest.subtitleNext': 'You collected {got} of {max} stars. Your journey goes on to {world}!',
  'result.chest.button': 'Hooray!',
  'endless.tag': 'Endless',
  'endless.button': 'Play endless',
  'endless.next': 'Next puzzle',
  'endless.toMap': 'Back to the map',
  'endless.solved.title': 'Well done!',
  'endless.solved.subtitle': 'Do you want another puzzle?',
  'endless.unavailable': 'To keep playing you need an internet connection. Try again later!',

  'board.label': 'Chessboard',
  'board.square': 'Square {square}, {side} {piece}',
  'board.empty': 'Square {square}, empty',

  'piece.p': 'pawn',
  'piece.n': 'knight',
  'piece.b': 'bishop',
  'piece.r': 'rook',
  'piece.q': 'queen',
  'piece.k': 'king',

  'side.w': 'White',
  'side.b': 'Black',

  'world.burgdorf.name': 'Castleton',
  'world.burgdorf.subtitle': 'Mate in 1',
  'world.finsterwald.name': 'Darkwood',
  'world.finsterwald.subtitle': 'Undefended pieces',
  'world.nebelsumpf.name': 'Misty Marsh',
  'world.nebelsumpf.subtitle': 'Forks',
  'world.frostgipfel.name': 'Frostpeak',
  'world.frostgipfel.subtitle': 'Mate in 2',
  'world.glutvulkan.name': 'Ember Volcano',
  'world.wolkeninseln.name': 'Cloud Isles',
  'world.geisterruine.name': 'Ghost Ruins',
  'world.drachenburg.name': 'Dragon Castle',

  'task.mateIn1': 'Checkmate the king with a single move!',
  'task.mateIn2': 'Checkmate the king in 2 moves!',
  'task.hanging': 'Grab the undefended piece!',
  'task.fork': 'Attack two pieces at once with one piece!',
  'task.generic': 'Win a piece!',

  'misc.sound.on': 'Turn sound on',
  'misc.sound.off': 'Turn sound off',
  'misc.footer.code': 'Source code on GitHub',
  'misc.language.label': 'Language',
} as const

export type MessageKey = keyof typeof en

/** Ein Wörterbuch ordnet jedem Schlüssel einen Anzeigetext zu. */
export type Messages = Record<MessageKey, string>
