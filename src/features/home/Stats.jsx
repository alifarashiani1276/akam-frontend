import { useTranslation } from 'react-i18next'
import CountUp from '../../components/motion/CountUp'
import SectionBackground from '../../components/ui/SectionBackground'

export default function Stats() {
  const { t } = useTranslation()
  const items = t('stats.items', { returnObjects: true })
  return (
    <section className="section">
      <SectionBackground seed={4} />
      <div className="container-page">
        <div className="stats stats-vertical w-full border border-base-300 lg:stats-horizontal">
          {items.map((stat) => (
            <div key={stat.label} className="stat">
              <div className="stat-value font-display text-primary">
                <CountUp value={stat.value} />
              </div>
              <div className="stat-title">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
