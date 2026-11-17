import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import Reveal from '../../components/motion/Reveal'
import TextReveal from '../../components/motion/TextReveal'
import BrandTriangles from '../../components/ui/BrandTriangles'
import { getVisibleCatalog } from '../../config/catalog'

const EASE = [0.22, 1, 0.36, 1]
const ITEM = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }
const VIEW = { once: true, margin: '-80px' }

// One card per main section. Ids + image: config/catalog.js, texts: locales/<lang>/catalog.json.
// Card look: .brand-card / .brand-list in index.css (Brand Guidelines 2024).
// Animations: card slides up, yellow bar draws across, photo zooms out, title reveals by word, list items appear one by one.
// The photo is cut into a triangle that points at the text (mirrored automatically in LTR).
export default function Services() {
  const { t } = useTranslation()
  return (
    <section id="services" className="relative scroll-mt-20 py-10 md:py-16">
      <div className="container-page space-y-8">
        {getVisibleCatalog().map(({ id, items, image }, i) => {
          const base = `catalog.sections.${id}`
          return (
            <Reveal key={id}>
              <article className="brand-card transition-transform duration-500 hover:-translate-y-1">
                <BrandTriangles seed={i + 3} className="text-white" />
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 z-10 h-1.5 origin-left bg-linear-to-r from-secondary to-primary rtl:origin-right"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={VIEW}
                  transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
                />
                <div className="relative min-h-56 overflow-hidden md:min-h-0 md:w-2/5 md:shrink-0 md:[clip-path:polygon(100%_50%,0_0,0_100%)] md:rtl:[clip-path:polygon(0_50%,100%_0,100%_100%)]">
                  <motion.img
                    src={image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ scale: 1.3 }}
                    whileInView={{ scale: 1 }}
                    viewport={VIEW}
                    transition={{ duration: 1.6, ease: EASE }}
                  />
                </div>
                <div className="flex-1 p-6 md:p-10">
                  <TextReveal as="h3" text={t(`${base}.title`)} delay={0.15} className="mb-4 block text-2xl font-extrabold uppercase text-primary md:text-4xl" />
                  <motion.ul
                    className="brand-list space-y-2 text-sm text-base-content/80 md:text-base"
                    initial="hidden"
                    whileInView="visible"
                    viewport={VIEW}
                    transition={{ staggerChildren: 0.09, delayChildren: 0.4 }}
                  >
                    {items.map((item) => (
                      <motion.li key={item} variants={ITEM}>
                        {t(`${base}.items.${item}`)}
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
