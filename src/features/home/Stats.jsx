import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import CountUp from '../../components/motion/CountUp'

const EASE = [0.22, 1, 0.36, 1]

// Four bordered cards under the Quality photo (2x2 on desktop, 1 column on mobile). Texts: stats.items in locales/<lang>/home.json.
// Animations: each card fades + slides up when it enters the screen (the second card of a row follows slightly later),
// the border fades out downwards (.fade-border in index.css) and the number counts up.
export default function Stats() {
  const { t } = useTranslation()
  const items = t('stats.items', { returnObjects: true })
  return (
    <section id="stats" className="relative bg-base-100 py-16 md:py-24">
      <div className="container-page grid gap-5 md:grid-cols-2">
        {items.map((stat, i) => (
          <motion.div
            key={i}
            className="stat-card flex flex-col gap-3 p-5"
            initial={{ opacity: 0, y: 56 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: (i % 2) * 0.15, ease: EASE }}
          >
            <h3 className="font-sans text-lg font-medium text-white md:text-xl">{stat.label}</h3>
            <p className="font-sans text-5xl font-extrabold leading-tight tracking-tight text-primary md:text-6xl">
              <span dir="ltr" className="inline-block">
                <CountUp value={stat.value} />
              </span>
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
