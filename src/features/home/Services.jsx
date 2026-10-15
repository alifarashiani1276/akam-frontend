import { useTranslation } from 'react-i18next'
import SectionHeading from '../../components/ui/SectionHeading'
import { formatIndex } from '../../utils/format'

export default function Services() {
  const { t, i18n } = useTranslation()
  const items = t('services.items', { returnObjects: true })
  return (
    <section id="services" className="section bg-base-200">
      <div className="container-page">
        <SectionHeading label={t('services.label')} title={t('services.title')} />
        <div>
          {items.map((item, i) => (
            <div key={item.title} className="collapse collapse-plus service-item">
              <input type="radio" name="services" defaultChecked={i === 0} aria-label={item.title} />
              <div className="collapse-title service-title">
                <span className="index-number">{formatIndex(i + 1, i18n.language)}</span>
                {item.title}
              </div>
              <div className="collapse-content">
                <p className="mb-4 max-w-2xl text-base-content/70">{item.text}</p>
                <ul className="list-disc space-y-1 ps-5 marker:text-primary">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
