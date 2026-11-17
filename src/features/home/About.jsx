import { Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Reveal from '../../components/motion/Reveal'
import TextReveal from '../../components/motion/TextReveal'

export default function About() {
  const { t } = useTranslation()
  return (
    <section id="about" className="section">
      <div className="container-page flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <TextReveal as="h2" text={t('about.title')} className="mb-4 block text-3xl font-extrabold text-primary md:text-5xl" />
          <Reveal delay={0.25} y={24}>
            <p className="text-2xl font-semibold leading-snug md:text-4xl">{t('about.text')}</p>
          </Reveal>
        </div>
        <Reveal delay={0.4} y={16}>
          <a href="#services" className="group inline-flex items-center gap-3 font-semibold">
            <Play size={36} className="text-primary transition-transform duration-300 group-hover:scale-125" />
            {t('about.cta')}
          </a>
        </Reveal>
      </div>
    </section>
  )
}
