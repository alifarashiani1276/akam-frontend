import { useTranslation } from 'react-i18next'
import Reveal from '../../components/motion/Reveal'
import SectionHeading from '../../components/ui/SectionHeading'
import { formatIndex } from '../../utils/format'

export default function Process() {
  const { t, i18n } = useTranslation()
  const steps = t('process.steps', { returnObjects: true })
  return (
    <section id="process" className="section">
      <div className="container-page">
        <SectionHeading label={t('process.label')} title={t('process.title')} />
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.15} className="card bg-base-200">
              <div className="card-body">
                <span className="index-number">{formatIndex(i + 1, i18n.language)}</span>
                <h3 className="card-title font-display text-2xl uppercase">{step.title}</h3>
                <p className="text-base-content/70">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
