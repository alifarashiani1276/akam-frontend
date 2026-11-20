import { Globe } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { LANGUAGES } from '../../config/languages'
import { useAlternates } from '../../lib/useAlternates'

const FIXED_ROUTES = new Set(['about', 'capabilities', 'contact', 'projects', 'products', 'blog'])

function getLanguagePath(pathname, targetLang, alternates) {
  const segments = pathname.split('/').filter(Boolean).slice(1)
  if (!segments.length) return `/${targetLang}`

  const dynamicSlug = segments[0] === 'product' || segments[0] === 'service'
    || (segments[0] === 'projects' && segments.length > 1)
    || (segments[0] === 'products' && segments.length > 1)
    || (segments[0] === 'blog' && segments.length > 1)

  if (dynamicSlug) {
    const translatedSlug = alternates?.[targetLang]
    if (translatedSlug) return `/${targetLang}/${segments.slice(0, -1).join('/')}/${translatedSlug}`
    return `/${targetLang}`
  }

  if (FIXED_ROUTES.has(segments[0])) return `/${targetLang}/${segments.join('/')}`
  return `/${targetLang}`
}

export default function LanguageSwitcher() {
  const { lang } = useParams()
  const { pathname, hash } = useLocation()
  const alternates = useAlternates()

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
        <Globe size={18} />
        {lang.toUpperCase()}
      </div>
      <ul tabIndex={0} className="menu dropdown-content mt-3 w-40 rounded-box bg-base-200 p-2 shadow">
        {Object.entries(LANGUAGES).map(([code, { label }]) => (
          <li key={code}>
            <Link
              to={`${getLanguagePath(pathname, code, alternates)}${hash}`}
              className={code === lang ? 'menu-active' : ''}
              onClick={() => document.activeElement?.blur()}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
