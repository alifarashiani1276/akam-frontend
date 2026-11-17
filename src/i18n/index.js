import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANG, isSupportedLang } from '../config/languages'

// Every file src/i18n/locales/<lang>/<name>.json is merged into ONE bundle for <lang>.
// So you can split texts by feature (common.json, home.json, catalog.json, blog.json ...)
// and components keep using plain keys: t('hero.title'). No imports to register.
// Top-level keys must be unique across the files of one language (a warning is logged in dev).
const files = import.meta.glob('./locales/*/*.json', { eager: true, import: 'default' })

const resources = {}
for (const [path, content] of Object.entries(files)) {
  const [, lang] = path.match(/\.\/locales\/([^/]+)\//)
  if (!isSupportedLang(lang)) {
    console.warn(`[i18n] locales/${lang} ignored: add "${lang}" to src/config/languages.js`)
    continue
  }
  const bundle = (resources[lang] ??= { translation: {} }).translation
  for (const key of Object.keys(content)) {
    if (key in bundle) console.warn(`[i18n] duplicate top-level key "${key}" in ${path}`)
  }
  Object.assign(bundle, content)
}

// Start in the language from the URL (/fa, /en ...) to avoid a flash of the wrong language.
const urlLang = window.location.pathname.split('/')[1]

i18n.use(initReactI18next).init({
  resources,
  lng: isSupportedLang(urlLang) ? urlLang : DEFAULT_LANG,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  // Dev only: see which keys are missing in a language (English is the fallback).
  saveMissing: import.meta.env.DEV,
  missingKeyHandler: (langs, ns, key) => console.warn(`[i18n] missing "${key}" in ${langs.join(', ')}`),
})

export default i18n
