import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import TextReveal from '../../components/motion/TextReveal'
import { SITE } from '../../config/site'

const EASE = [0.22, 1, 0.36, 1]

// Full-width photo, brand name + tagline at the start side (right in RTL).
// Animations: photo slowly zooms out on load + parallax on scroll, headline reveals word by word, text fades out while scrolling away.
// The photo is mirrored in LTR languages so the machine stays on the opposite side of the text.
export default function Hero() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '7%'])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="relative isolate flex min-h-[60vh] items-center overflow-hidden md:min-h-[75vh]">
      <motion.img
        src={SITE.heroImage}
        alt=""
        style={{ y: imageY }}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: EASE }}
        className="absolute inset-x-0 -top-[10%] -z-20 h-[120%] w-full object-cover ltr:-scale-x-100"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/10 to-black/50" />
      <motion.div style={{ y: textY, opacity: textOpacity }} className="container-page">
        <TextReveal as="h1" text={t('brand.name')} inView={false} delay={0.2} className="text-5xl font-extrabold text-white md:text-8xl" />
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          className="mt-2 text-2xl text-white md:text-5xl"
        >
          {t('hero.tagline')}
        </motion.p>
      </motion.div>
    </section>
  )
}
