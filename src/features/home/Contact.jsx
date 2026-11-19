import { MapPin, Phone, Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import TextReveal from '../../components/motion/TextReveal'
import Button from '../../components/ui/Button'
import { SITE, getVisibleContacts } from '../../config/site'

// Yellow pattern band. Only confirmed channels from config/site.js are shown. An inquiry form can be added later.
export default function Contact() {
  const { t } = useTranslation()
  const contacts = getVisibleContacts()
  return (
    <section id="contact" className="relative isolate scroll-mt-20 overflow-hidden bg-primary py-16 text-primary-content md:py-24">
      <img src="/images/pattern.webp" alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="container-page flex items-center justify-between gap-8">
        <div>
          <TextReveal as="h2" text={t('contact.title')} className="mb-4 block text-4xl font-black md:text-6xl" />
          <p className="mb-8 text-lg">{t('contact.text')}</p>
          <div className="flex flex-wrap gap-3">
            {contacts.map((c) => (
              <Button key={c.id} href={`tel:${c.number}`} variant="dark" icon={false}>
                <Phone size={18} />
                <span>{t(`contactLabels.${c.id}`)}</span>
                <span dir="ltr">{c.number}</span>
              </Button>
            ))}
            {SITE.email && (
              <Button href={`mailto:${SITE.email}`} variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                {t('contact.cta')}
              </Button>
            )}
          </div>
          <p className="mt-6 flex items-start gap-2">
            <MapPin size={18} className="mt-1 shrink-0" />
            {t('footer.address')}
          </p>
        </div>
        {/* Big rounded triangle (same lucide "Play" shape as About/Process), spinning around its center. Size: change size={96}. */}
        <Play
          size={96}
          strokeWidth={1.5}
          aria-hidden="true"
          className="hidden shrink-0 animate-[spin_2.5s_linear_infinite] [transform-origin:44.4%_50%] motion-reduce:animate-none sm:block"
        />
      </div>
    </section>
  )
}
