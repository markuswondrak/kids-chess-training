import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { de } from './de'
import { en, type MessageKey, type Messages } from './en'
import { fr } from './fr'

export type { MessageKey, Messages }

export type Lang = 'de' | 'en' | 'fr'

/** Muttersprachennamen – in jeder Sprache lesbar. */
export const LANG_NAMES: Record<Lang, string> = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
}

export const MESSAGES: Record<Lang, Partial<Messages>> = { de, en, fr }

const LANG_KEY = 'adventure-chess.lang'

/** Gespeicherte Wahl (hat Vorrang) → Browsersprache → Englisch (FR-002). */
export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'de' || saved === 'en' || saved === 'fr') return saved
  } catch {
    // Privater Modus o. Ä. – dann entscheidet nur die Browsersprache.
  }
  const primary = navigator.language?.split('-')[0].toLowerCase()
  return primary === 'de' || primary === 'fr' ? primary : 'en'
}

/**
 * Platzhalter-Werte: Text, Zahl oder Verweis auf einen anderen
 * Wörterbuch-Schlüssel (wird erst beim Rendern aufgelöst – so erscheint auch
 * eine bereits sichtbare Zeile nach dem Sprachwechsel korrekt).
 */
export type TParams = Record<string, string | number | { key: MessageKey }>

/** Schlüssel mit Ein-/Mehrzahl-Formen (`…one` / `…other`). */
export type PluralKey = 'common.stars' | 'puzzle.liveStars'

interface I18n {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: MessageKey, params?: TParams) => string
  tn: (key: PluralKey, n: number) => string
}

const LangContext = createContext<I18n | null>(null)

function interpolate(lang: Lang, key: MessageKey, params?: TParams): string {
  const text = MESSAGES[lang][key] ?? en[key]
  if (!params) return text
  return text.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = params[name]
    if (value === undefined) return ''
    return typeof value === 'object' ? interpolate(lang, value.key) : String(value)
  })
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(LANG_KEY, next)
    } catch {
      // Ohne Speicher gilt die Wahl nur für diese Sitzung.
    }
  }, [])

  const value = useMemo<I18n>(
    () => ({
      lang,
      setLang,
      t: (key, params) => interpolate(lang, key, params),
      tn: (key, n) => interpolate(lang, `${key}.${n === 1 ? 'one' : 'other'}` as MessageKey, { count: n }),
    }),
    [lang, setLang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useI18n(): I18n {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useI18n muss innerhalb von <LangProvider> verwendet werden.')
  return ctx
}
