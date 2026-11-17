import { useTranslation } from 'react-i18next'
import Reveal from '../../components/motion/Reveal'
import TextReveal from '../../components/motion/TextReveal'
import { formatIndex } from '../../utils/format'

// Yellow band with the title and gray boxes (image/content slots from the mockup).
export default function Process() {
  const { t, i18n } = useTranslation()
  const steps = t('process.steps', { returnObjects: true })
  return (
    <section id="process" className="section bg-primary text-primary-content">
      <div className="container-page">
        <TextReveal as="h2" text={t('process.title')} className="mb-12 block text-center text-4xl font-black md:text-6xl" />
        <div className="mx-auto grid max-w-3xl gap-8">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.12}>
              <div className="flex min-h-48 flex-col justify-center bg-accent p-6 transition-transform duration-500 hover:-translate-y-1 md:p-8">
                <span className="font-display text-3xl">{formatIndex(i + 1, i18n.language)}</span>
                <h3 className="text-xl font-extrabold">{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
