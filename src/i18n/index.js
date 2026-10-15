import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANG, isSupportedLang } from '../config/languages'
import fa from './locales/fa.json'
import ar from './locales/ar.json'
import ru from './locales/ru.json'
import en from './locales/en.json'

// Start in the language from the URL (/fa, /en ...) to avoid a flash of the wrong language.
const urlLang = window.location.pathname.split('/')[1]

i18n.use(initReactI18next).init({
  resources: {
    fa: { translation: fa },
    ar: { translation: ar },
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: isSupportedLang(urlLang) ? urlLang : DEFAULT_LANG,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
