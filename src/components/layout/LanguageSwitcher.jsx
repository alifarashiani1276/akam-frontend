import { Globe } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { LANGUAGES } from '../../config/languages'

export default function LanguageSwitcher() {
  const { lang } = useParams()
  const { pathname, hash } = useLocation()
  const rest = pathname.split('/').slice(2).join('/')

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
              to={`/${code}${rest ? `/${rest}` : ''}${hash}`}
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
