import { Menu } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NAV_ITEMS } from '../../config/site'
import Button from '../ui/Button'
import LanguageSwitcher from './LanguageSwitcher'
import NavItem from './NavItem'

export default function Navbar() {
  const { t } = useTranslation()
  const { lang } = useParams()

  const links = NAV_ITEMS.map((item) => (
    <li key={item.id}>
      <NavItem item={item}>{t(`nav.${item.id}`)}</NavItem>
    </li>
  ))

  return (
    <header className="site-header">
      <nav className="navbar container-page">
        <div className="navbar-start gap-2">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-square" aria-label={t('common.menu')}>
              <Menu />
            </div>
            <ul tabIndex={0} className="menu dropdown-content mt-3 w-56 rounded-box bg-base-200 p-2 shadow">
              {links}
            </ul>
          </div>
          <Link to={`/${lang}`}>
            <img src="/images/logo-akam.webp" alt={t('brand.name')} className="h-10 w-auto" />
          </Link>
        </div>

        <ul className="menu menu-horizontal navbar-center hidden lg:flex">{links}</ul>

        <div className="navbar-end gap-2">
          <LanguageSwitcher />
          <Button href="#contact" size="sm" variant="dark" className="hidden sm:inline-flex">
            {t('common.getQuote')}
          </Button>
        </div>
      </nav>
    </header>
  )
}
