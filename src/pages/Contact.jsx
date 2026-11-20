import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, MapPin, Phone, Printer } from 'lucide-react'
import PageState from '../components/ui/PageState'
import InquiryForm from '../features/inquiries/InquiryForm'
import { useSettings } from '../features/settings/useSettings'
import { createBreadcrumbJsonLd, useSeo } from '../lib/useSeo'

export default function ContactPage() {
  const { lang = 'fa' } = useParams()
  const { t } = useTranslation()
  const settings = useSettings(lang)
  useSeo({ title: `${t('contactPage.title')} | AKAM`, description: t('contactPage.description'), alternates: { fa: '/fa/contact', en: '/en/contact', ru: '/ru/contact', ar: '/ar/contact' }, jsonLd: createBreadcrumbJsonLd([{ name: t('nav.home'), path: `/${lang}` }, { name: t('contactPage.title'), path: `/${lang}/contact` }]) })
  const data = settings.data
  const phones = (data?.phones ?? []).filter((phone) => phone.confirmed && phone.number)
  const hasDetails = phones.length > 0 || data?.address || data?.postalCode || data?.email

  return (
    <main className="container-page py-14 md:py-20">
      <header className="mb-10 max-w-3xl">
        <span className="section-label">{t('contactPage.eyebrow')}</span>
        <h1 className="section-title">{t('contactPage.title')}</h1>
        <p className="max-w-2xl text-base leading-8 text-base-content/65">{t('contactPage.description')}</p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-5">
          {settings.isPending ? (
            <PageState isLoading={settings.isPending} skeleton="list" skeletonCount={3} loader="both" loadingLabel={t('states.loaders.contact')} />
          ) : settings.error ? (
            <PageState error={settings.error} onRetry={settings.refetch} isRetrying={settings.isFetching} />
          ) : !hasDetails ? (
            <PageState isEmpty emptyTitle={t('contactPage.noDetails')} emptyText={t('contactPage.noDetailsText')} />
          ) : (
            <div className="space-y-5">
              {phones.length > 0 && (
                <section className="rounded-box border border-base-300 bg-base-200/50 p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><Phone size={19} className="text-primary" />{t('contactPage.phones')}</h2>
                  <ul className="space-y-4">
                    {phones.map((phone) => (
                      <li key={phone.id} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-sm text-base-content/65">{phone.label || t(`contactLabels.${phone.id}`, { defaultValue: phone.id })}</span>
                        <a className="font-semibold text-primary" href={`tel:${phone.number}`} dir="ltr">{phone.number}{phone.ext ? ` ${t('contactPage.extension')} ${phone.ext}` : ''}</a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {data?.email && (
                <section className="rounded-box border border-base-300 bg-base-200/50 p-5">
                  <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><Mail size={19} className="text-primary" />{t('contactPage.email')}</h2>
                  <a href={`mailto:${data.email}`} dir="ltr" className="text-primary">{data.email}</a>
                </section>
              )}
              {(data?.address || data?.postalCode) && (
                <section className="rounded-box border border-base-300 bg-base-200/50 p-5">
                  <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><MapPin size={19} className="text-primary" />{t('contactPage.address')}</h2>
                  {data.address && <p className="text-sm leading-7 text-base-content/70">{data.address}</p>}
                  {data.postalCode && <p className="mt-3 text-sm text-base-content/65"><Printer size={15} className="me-2 inline" />{t('contactPage.postalCode')}: <b dir="ltr">{data.postalCode}</b></p>}
                </section>
              )}
            </div>
          )}
        </aside>
        <InquiryForm type="contact" />
      </div>
    </main>
  )
}
