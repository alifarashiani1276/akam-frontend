import { useTranslation } from 'react-i18next'
import SectionHeading from '../../components/ui/SectionHeading'
import SectionBackground from '../../components/ui/SectionBackground'

export default function Faq() {
  const { t } = useTranslation()
  const items = t('faq.items', { returnObjects: true })
  return (
    <section id="faq" className="section">
      <SectionBackground seed={7} />
      <div className="container-page grid gap-12 lg:grid-cols-3">
        <SectionHeading label={t('faq.label')} title={t('faq.title')} />
        <div className="space-y-3 lg:col-span-2">
          {items.map((item, i) => (
            <div key={item.q} className="collapse collapse-plus border border-base-300 bg-base-200">
              <input type="radio" name="faq" defaultChecked={i === 0} aria-label={item.q} />
              <div className="collapse-title font-semibold">{item.q}</div>
              <div className="collapse-content text-base-content/70">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
