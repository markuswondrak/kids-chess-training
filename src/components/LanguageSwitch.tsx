import { useEffect, useRef, useState } from 'react'
import { LANG_NAMES, type Lang, useI18n } from '../i18n'
import { GlobeIcon } from './icons'

const LANGS = Object.keys(LANG_NAMES) as Lang[]

// Farben entsprechen den Design-Tokens; explizit, weil SVG-Attribute kein var() lesen.
const INK = '#2F2420'
const GULES = '#C9372C'
const OR = '#F3B630'
const AZURE = '#2F62A8'
const AZURE_DEEP = '#22487D'
const WHITE = '#FFF8EA'

/** Kleine Cartoon-Flaggen im Stil der übrigen Kunst (Tintenumriss). */
function FlagIcon({ lang }: { lang: Lang }) {
  const clip = `flag-clip-${lang}`
  return (
    <svg className="lang-flag" viewBox="0 0 24 16" aria-hidden="true">
      <clipPath id={clip}>
        <rect x="1" y="1" width="22" height="14" rx="3" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        {lang === 'de' && (
          <>
            <rect x="1" y="1" width="22" height="4.7" fill={INK} />
            <rect x="1" y="5.7" width="22" height="4.7" fill={GULES} />
            <rect x="1" y="10.4" width="22" height="4.6" fill={OR} />
          </>
        )}
        {lang === 'fr' && (
          <>
            <rect x="1" y="1" width="7.33" height="14" fill={AZURE} />
            <rect x="8.33" y="1" width="7.34" height="14" fill={WHITE} />
            <rect x="15.67" y="1" width="7.33" height="14" fill={GULES} />
          </>
        )}
        {lang === 'en' && (
          <>
            <rect x="1" y="1" width="22" height="14" fill={AZURE_DEEP} />
            <path d="M1 1 L23 15 M23 1 L1 15" stroke={WHITE} strokeWidth="4.4" />
            <path d="M1 1 L23 15 M23 1 L1 15" stroke={GULES} strokeWidth="1.8" />
            <rect x="8.6" y="1" width="6.8" height="14" fill={WHITE} />
            <rect x="1" y="4.6" width="22" height="6.8" fill={WHITE} />
            <rect x="10.1" y="1" width="3.8" height="14" fill={GULES} />
            <rect x="1" y="6.1" width="22" height="3.8" fill={GULES} />
          </>
        )}
      </g>
      <rect x="1" y="1" width="22" height="14" rx="3" fill="none" stroke={INK} strokeWidth="2" />
    </svg>
  )
}

/** Weltkugel-Knopf (immer erreichbar in der Kopfzeile) mit Liste aus Flagge + Sprachname. */
export function LanguageSwitch() {
  const { lang, setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="lang-picker" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="btn btn--icon"
        aria-label={t('misc.language.label')}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <GlobeIcon />
      </button>
      {open && (
        <div className="lang-menu" aria-label={t('misc.language.label')}>
          {LANGS.map((id) => (
            <button
              key={id}
              type="button"
              className={id === lang ? 'lang-item lang-item--on' : 'lang-item'}
              aria-pressed={id === lang}
              onClick={() => {
                setLang(id)
                setOpen(false)
              }}
            >
              <FlagIcon lang={id} />
              {LANG_NAMES[id]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
