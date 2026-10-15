import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import MediaPlaceholder from '../../components/ui/MediaPlaceholder'
import SectionHeading from '../../components/ui/SectionHeading'

export default function About() {
  const { t } = useTranslation()
  const points = t('about.points', { returnObjects: true })
  return (
    <section id="about" className="section">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading label={t('about.label')} title={t('about.title')} />
          <p className="section-text">{t('about.text')}</p>
          <ul className="mb-8 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <Check size={20} className="text-primary" />
                {point}
              </li>
            ))}
          </ul>
          <Button href="#services" variant="outline">{t('about.cta')}</Button>
        </div>
        <MediaPlaceholder />
      </div>
    </section>
  )
}
