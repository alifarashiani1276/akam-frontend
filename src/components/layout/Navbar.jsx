import { useEffect, useRef } from 'react'
import { Menu } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NAV_ITEMS } from '../../config/site'
import { useCatalog } from '../../features/catalog/useCatalog'
import Button from '../ui/Button'
import LanguageSwitcher from './LanguageSwitcher'
import NavItem from './NavItem'
import Loader from '../ui/Loader'
import useDelayedFlag from '../../lib/useDelayedFlag'

function CatalogDropdown({ lang, t, mobile = false }) {
  const dropdownRef = useRef(null)
  const { pathname } = useLocation()
  const { data: catalog = [], isPending } = useCatalog(lang)
  const showCatalogLoader = useDelayedFlag(isPending)
  const closeDropdown = () => {
    if (dropdownRef.current) dropdownRef.current.open = false
    if (mobile) {
      dropdownRef.current?.closest('.dropdown')?.querySelector('[role="button"]')?.blur()
    }
  }

  useEffect(() => {
    if (dropdownRef.current?.open) dropdownRef.current.open = false
  }, [pathname])

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
            <li><Link to={`/${lang}/products`} onClick={closeDropdown}>{t('nav.allProducts')}</Link></li>
            {(isPending || showCatalogLoader) && <li className="px-3 py-2"><Loader layout="inline" size="sm" label={t('states.loaders.catalog')} /></li>}
            {sections.map((section) => (
              <li key={section.id || section.slug}>
                <Link to={`/${lang}/products/${section.slug}`} onClick={closeDropdown}>{section.short || section.title}</Link>
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
          <li><Link to={`/${lang}/products`} onClick={closeDropdown}>{t('nav.allProducts')}</Link></li>
          {(isPending || showCatalogLoader) && <li className="px-3 py-2"><Loader layout="inline" size="sm" label={t('states.loaders.catalog')} /></li>}
          {sections.map((section) => (
            <li key={section.id || section.slug}>
              <Link to={`/${lang}/products/${section.slug}`} onClick={closeDropdown}>{section.short || section.title}</Link>
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
  const { pathname } = useLocation()
  const mobileMenuRef = useRef(null)

  useEffect(() => {
    const menu = mobileMenuRef.current
    if (!menu) return

    menu.querySelectorAll('details[open]').forEach((details) => {
      details.open = false
    })
    menu.querySelector('[role="button"]')?.blur()
  }, [pathname])
  const renderLinks = (mobile) => NAV_ITEMS.map((item) => (
    item.dropdown === 'catalog'
      ? <CatalogDropdown key={item.id} lang={lang} t={t} mobile={mobile} />
      : <li key={item.id}><NavItem item={item}>{t(`nav.${item.id}`)}</NavItem></li>
  ))

  return (
    <header className="site-header">
      <nav className="navbar container-page">
        <div className="navbar-start gap-2">
          <div ref={mobileMenuRef} className="dropdown lg:hidden">
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
