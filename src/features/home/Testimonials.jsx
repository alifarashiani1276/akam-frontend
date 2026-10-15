import { useTranslation } from 'react-i18next'
import SectionHeading from '../../components/ui/SectionHeading'
import SectionBackground from '../../components/ui/SectionBackground'

export default function Testimonials() {
  const { t } = useTranslation()
  const items = t('testimonials.items', { returnObjects: true })
  return (
    <section className="section bg-base-200">
      <SectionBackground seed={6} />
      <div className="container-page">
        <SectionHeading label={t('testimonials.label')} title={t('testimonials.title')} />
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.name} className="card border border-base-300 bg-base-100">
              <div className="card-body gap-6">
                <p className="text-xl">“{item.quote}”</p>
                <div className="flex items-center gap-3">
                  <div className="avatar avatar-placeholder">
                    <div className="w-12 rounded-full bg-primary text-primary-content">
                      <span>{item.name[0]}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-base-content/60">{item.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
