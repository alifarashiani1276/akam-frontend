import { useEffect } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DEFAULT_LANG, LANGUAGES, isSupportedLang } from '../../config/languages'
import Navbar from './Navbar'
import Footer from './Footer'

// Wraps every page: validates the :lang param, syncs i18n + <html lang/dir>.
export default function MainLayout() {
  const { lang } = useParams()
  const { i18n } = useTranslation()
  const supported = isSupportedLang(lang)

  useEffect(() => {
    if (!supported) return
    i18n.changeLanguage(lang)
    document.documentElement.lang = lang
    document.documentElement.dir = LANGUAGES[lang].dir
  }, [lang, supported, i18n])

  if (!supported) return <Navigate to={`/${DEFAULT_LANG}`} replace />

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
