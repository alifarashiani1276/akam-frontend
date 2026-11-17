import { MapPin, Phone } from 'lucide-react'
import { motion } from 'motion/react'
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
        <svg viewBox="0 0 80 80" className="hidden h-24 w-24 shrink-0 sm:block ltr:-scale-x-100" aria-hidden="true">
          <motion.polygon
            points="70,8 70,72 12,40"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      </div>
    </section>
  )
}
