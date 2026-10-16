import { LANG_NAMES, type Lang, useI18n } from '../i18n'

const LANGS = Object.keys(LANG_NAMES) as Lang[]

/** Drei Chips in Muttersprachennamen – ein Tipp wechselt und speichert (FR-003). */
export function LanguageSwitch() {
  const { lang, setLang, t } = useI18n()
  return (
    <div className="lang-switch" role="group" aria-label={t('misc.language.label')}>
      {LANGS.map((id) => (
        <button
          key={id}
          type="button"
          className={id === lang ? 'lang-chip lang-chip--on' : 'lang-chip'}
          aria-pressed={id === lang}
          onClick={() => setLang(id)}
        >
          {LANG_NAMES[id]}
        </button>
      ))}
    </div>
  )
}
