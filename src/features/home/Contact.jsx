import { Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import TrianglePattern from '../../components/ui/TrianglePattern'
import { SITE } from '../../config/site'

// Simple call-to-action for now. A contact/inquiry form can replace the buttons later.
export default function Contact() {
  const { t } = useTranslation()
  return (
    <section id="contact" className="section">
      <div className="container-page">
        <div className="cta-box">
          <TrianglePattern className="absolute inset-0 text-black/20" />
          <div className="relative max-w-2xl">
            <h2 className="section-title">{t('contact.title')}</h2>
            <p className="mb-8 text-lg">{t('contact.text')}</p>
            <div className="flex flex-wrap gap-3">
              <Button href={`mailto:${SITE.email}`} variant="dark">{t('contact.cta')}</Button>
              <Button href={`tel:${SITE.phone}`} variant="outline" icon={false} className="border-black text-black hover:bg-black hover:text-white">
                <Phone size={18} />
                <span dir="ltr">{SITE.phone}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
