import { useTranslation } from 'react-i18next'
import { NAV_ITEMS, SITE } from '../../config/site'
import Logo from '../ui/Logo'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-base-200 pb-8 pt-16">
      <div className="container-page grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-base-content/70">{t('footer.tagline')}</p>
        </div>

        <nav>
          <h6 className="footer-title">{t('footer.quickLinks')}</h6>
          <ul className="space-y-2">
            {NAV_ITEMS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className="link link-hover">
                  {t(`nav.${id}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h6 className="footer-title">{t('footer.contact')}</h6>
          <ul className="space-y-2">
            <li dir="ltr" className="text-start">{SITE.phone}</li>
            <li dir="ltr" className="text-start">{SITE.email}</li>
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
        {t('footer.rights')}
      </p>
    </footer>
  )
}
