import { useTranslation } from 'react-i18next'
import { NAV_ITEMS, SITE, getVisibleContacts } from '../../config/site'
import Logo from '../ui/Logo'
import NavItem from './NavItem'
import SectionBackground from '../ui/SectionBackground'

export default function Footer() {
  const { t, i18n } = useTranslation()
  const year = new Intl.NumberFormat(i18n.language, { useGrouping: false }).format(new Date().getFullYear())
  const contacts = getVisibleContacts()

  return (
    <footer className="relative isolate overflow-hidden bg-base-200 pb-8 pt-16">
      <SectionBackground seed={9} />
      <div className="container-page grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-base-content/70">{t('footer.tagline')}</p>
        </div>

        <nav>
          <h6 className="footer-title">{t('footer.quickLinks')}</h6>
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <NavItem item={item} className="link link-hover">
                  {t(`nav.${item.id}`)}
                </NavItem>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h6 className="footer-title">{t('footer.contact')}</h6>
          <ul className="space-y-2">
            {contacts.map((c) => (
              <li key={c.id}>
                {t(`contactLabels.${c.id}`)}: <span dir="ltr">{c.number}</span>
              </li>
            ))}
            {SITE.email && (
              <li dir="ltr" className="text-start">{SITE.email}</li>
            )}
            <li>{t('footer.address')}</li>
            <li>
              {t('footer.postalCode')}: <span dir="ltr">{SITE.postalCode}</span>
            </li>
            {SITE.social.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="link link-hover">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="container-page mt-12 border-t border-base-300 pt-6 text-center text-sm text-base-content/60">
        {t('footer.rights', { year })}
      </p>
    </footer>
  )
}
