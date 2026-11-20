import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DEFAULT_LANG, LANGUAGES, isSupportedLang } from '../../config/languages'
import Navbar from './Navbar'
import Footer from './Footer'
import { AlternatesProvider } from '../../lib/alternates.jsx'
import { useSettings } from '../../features/settings/useSettings'

const ChatWidget = lazy(() => import('../../features/chat/ChatWidget'))

// Wraps every page: validates the :lang param, syncs i18n + <html lang/dir>.
export default function MainLayout() {
  const { lang } = useParams()
  const { i18n } = useTranslation()
  const supported = isSupportedLang(lang)
  const { data: settings } = useSettings(lang, { enabled: supported })

  useEffect(() => {
    if (!supported) return
    i18n.changeLanguage(lang)
    document.documentElement.lang = lang
    document.documentElement.dir = LANGUAGES[lang].dir
    // Page-level SEO is managed by useSeo; the layout only syncs language and direction.
  }, [lang, supported, i18n])

  if (!supported) return <Navigate to={`/${DEFAULT_LANG}`} replace />

  return (
    <AlternatesProvider>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      {settings?.chat_enabled === true && <Suspense fallback={null}><ChatWidget /></Suspense>}
    </AlternatesProvider>
  )
}
