import { MapPin, Phone, Play } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TextReveal from '../../components/motion/TextReveal'
import Button from '../../components/ui/Button'
import { useSettings } from '../settings/useSettings'

export default function Contact() {
  const { t } = useTranslation()
  const { lang = 'fa' } = useParams()
  const { data } = useSettings(lang)
  const contacts = (data?.phones ?? []).filter((contact) => contact.confirmed && contact.number)

  return (
    <section id="contact" className="relative isolate scroll-mt-20 overflow-hidden bg-primary py-16 text-primary-content md:py-24">
      <img src="/images/pattern.webp" alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="container-page flex items-center justify-between gap-8">
        <div className="max-w-4xl">
          <TextReveal as="h2" text={t('contact.title')} className="mb-4 block text-4xl font-black md:text-6xl" />
          <p className="mb-8 text-lg">{t('contact.text')}</p>
          <div className="flex flex-wrap gap-3">
            {contacts.map((contact) => (
              <Button key={contact.id} href={`tel:${contact.number}`} variant="dark" icon={false}>
                <Phone size={18} />
                <span>{contact.label || t(`contactLabels.${contact.id}`, { defaultValue: contact.id })}</span>
                <span dir="ltr">{contact.number}{contact.ext ? ` · ${contact.ext}` : ''}</span>
              </Button>
            ))}
            {data?.email && <Button href={`mailto:${data.email}`} variant="outline" className="border-black text-black hover:bg-black hover:text-white">{data.email}</Button>}
            <Link to={`/${lang}/contact`} className="btn btn-neutral">{t('contactPage.openContact')}</Link>
          </div>
          {data?.address && <p className="mt-6 flex items-start gap-2"><MapPin size={18} className="mt-1 shrink-0" />{data.address}</p>}
        </div>
        <Play size={96} strokeWidth={1.5} aria-hidden="true" className="hidden shrink-0 animate-[spin_2.5s_linear_infinite] [transform-origin:44.4%_50%] motion-reduce:animate-none sm:block" />
      </div>
    </section>
  )
}
