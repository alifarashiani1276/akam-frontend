import { Play } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import CountUp from '../../components/motion/CountUp'
import TextReveal from '../../components/motion/TextReveal'

const EASE = [0.22, 1, 0.36, 1]
const BG = '#121212'

// TEMPORARY photos (one per item in feedback.items). Replace with the real customer photos later.
const PHOTOS = ['/images/card-3.webp', '/images/card-1.webp']

// Accent color of the label (spinning triangle, same as in Process.jsx) + numbers. Brand yellow now; the reference site uses red (e.g. 'text-red-500').
const ACCENT = 'text-primary'

// White border that is strong at the top and fades out completely at the bottom (like the reference).
const fadeBorder = (strength) => ({
  border: '1px solid transparent',
  background: `linear-gradient(${BG}, ${BG}) padding-box, linear-gradient(to bottom, rgb(255 255 255 / ${strength}), rgb(255 255 255 / 0) 100%) border-box`,
})

// "Trusted delivery" section (Movora reference): label + huge title, then one bordered card per testimonial:
// photo + name/role on one side, uppercase quote + two stat boxes on the other.
// Texts: feedback.* in locales/<lang>/feedback.json. Photos: PHOTOS above.
export default function Feedback() {
  const { t } = useTranslation()
  const items = t('feedback.items', { returnObjects: true })

  return (
    <section id="feedback" className="relative scroll-mt-20 py-16 md:py-24" style={{ backgroundColor: BG }}>
      <div className="container-page">
        <span className={`mb-5 inline-flex items-center gap-2 text-sm font-semibold uppercase ${ACCENT}`}>
          <Play size={22} className="animate-[spin_2.5s_linear_infinite] [transform-origin:44.4%_50%] motion-reduce:animate-none" aria-hidden="true" />
          {t('feedback.label')}
        </span>
        <TextReveal
          as="h2"
          text={t('feedback.title')}
          className="mb-12 block max-w-4xl font-sans text-6xl font-extrabold uppercase leading-[0.9] tracking-tight text-white md:mb-20 md:text-8xl lg:text-9xl"
        />

        <div className="space-y-5">
          {items.map((item, i) => (
            <motion.article
              key={i}
              className="grid gap-8 p-5 lg:grid-cols-[30%_minmax(0,1fr)] lg:gap-10"
              style={fadeBorder(1)}
              initial={{ opacity: 0, y: 56 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <div className="flex flex-col gap-4">
                <img src={PHOTOS[i % PHOTOS.length]} alt="" loading="lazy" className="aspect-[11/9] w-full object-cover" />
                <div>
                  <p className="text-lg font-semibold uppercase text-white">{item.name}</p>
                  <p className="mt-1 text-base font-semibold uppercase text-white/90">{item.role}</p>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-10">
                <p className="font-sans text-2xl font-extrabold uppercase leading-tight text-white md:text-3xl lg:text-4xl">{item.quote}</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  {item.stats.map((stat, j) => (
                    <div key={j} className="flex min-h-36 flex-col gap-3 p-5 md:min-h-40" style={fadeBorder(0.9)}>
                      <h3 className="font-sans text-base font-medium text-white md:text-lg">{stat.label}</h3>
                      <p className={`font-sans text-5xl font-extrabold leading-tight tracking-tight md:text-6xl ${ACCENT}`}>
                        <span dir="ltr" className="inline-block">
                          <CountUp value={stat.value} />
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
