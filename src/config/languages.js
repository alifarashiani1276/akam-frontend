// Single source of truth for supported languages.
// To add a language: add it here + create the folder src/i18n/locales/<code>/ (copy en/*.json). Nothing else to register.
export const LANGUAGES = {
  fa: { label: 'فارسی', dir: 'rtl' },
  ar: { label: 'العربية', dir: 'rtl' },
  ru: { label: 'Русский', dir: 'ltr' },
  en: { label: 'English', dir: 'ltr' },
}

export const DEFAULT_LANG = 'fa'

export const isSupportedLang = (code) => Object.hasOwn(LANGUAGES, code)
