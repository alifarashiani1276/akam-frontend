import { useEffect, useRef } from 'react'
import { Menu } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NAV_ITEMS } from '../../config/site'
import { useCatalog } from '../../features/catalog/useCatalog'
import Button from '../ui/Button'
import LanguageSwitcher from './LanguageSwitcher'
import NavItem from './NavItem'

function CatalogDropdown({ lang, t, mobile = false }) {
  const dropdownRef = useRef(null)
  const { data: catalog = [] } = useCatalog(lang)

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      const dropdown = dropdownRef.current
      if (dropdown?.open && !dropdown.contains(event.target)) dropdown.open = false
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [])
  const sections = Array.isArray(catalog) ? catalog : catalog?.data ?? []

  if (mobile) {
    return (
      <li>
        <details ref={dropdownRef}>
          <summary>{t('nav.products')}</summary>
          <ul className="bg-base-300/50 p-2">
            <li><Link to={`/${lang}/products`}>{t('nav.allProducts')}</Link></li>
            {sections.map((section) => (
              <li key={section.id || section.slug}>
                <Link to={`/${lang}/products/${section.slug}`}>{section.short || section.title}</Link>
              </li>
            ))}
          </ul>
        </details>
      </li>
    )
  }

  return (
    <li>
      <details ref={dropdownRef} className="dropdown dropdown-hover">
        <summary className="flex cursor-pointer items-center gap-1">{t('nav.products')}</summary>
        <ul className="menu dropdown-content z-50 mt-3 w-72 rounded-box bg-base-200 p-2 shadow-xl">
          <li><Link to={`/${lang}/products`}>{t('nav.allProducts')}</Link></li>
          {sections.map((section) => (
            <li key={section.id || section.slug}>
              <Link to={`/${lang}/products/${section.slug}`}>{section.short || section.title}</Link>
            </li>
          ))}
        </ul>
      </details>
    </li>
  )
}

export default function Navbar() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const renderLinks = (mobile) => NAV_ITEMS.map((item) => (
    item.dropdown === 'catalog'
      ? <CatalogDropdown key={item.id} lang={lang} t={t} mobile={mobile} />
      : <li key={item.id}><NavItem item={item}>{t(`nav.${item.id}`)}</NavItem></li>
  ))

  return (
    <header className="site-header">
      <nav className="navbar container-page">
        <div className="navbar-start gap-2">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-square" aria-label={t('common.menu')}>
              <Menu />
            </div>
            <ul tabIndex={0} className="menu dropdown-content mt-3 w-64 rounded-box bg-base-200 p-2 shadow">
              {renderLinks(true)}
            </ul>
          </div>
          <Link to={`/${lang}`}>
            <img src="/images/logo-akam.webp" alt={t('brand.name')} className="h-10 w-auto" />
          </Link>
        </div>

        <ul className="menu menu-horizontal navbar-center hidden lg:flex">{renderLinks(false)}</ul>

        <div className="navbar-end gap-2">
          <LanguageSwitcher />
          <Button href={`/${lang}/contact`} size="sm" variant="dark" className="hidden sm:inline-flex">
            {t('common.getQuote')}
          </Button>
        </div>
      </nav>
    </header>
  )
}
