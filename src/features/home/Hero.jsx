import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import MediaPlaceholder from '../../components/ui/MediaPlaceholder'
import TrianglePattern from '../../components/ui/TrianglePattern'
import { SITE } from '../../config/site'

const EASE = [0.22, 1, 0.36, 1]

export default function Hero() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const wordY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, 140])

  return (
    <section ref={ref} className="hero-section">
      <TrianglePattern className="hero-fade absolute inset-0 -z-10 text-primary/20" />

      {/* Giant brand word, letters slide up one by one */}
      <motion.h1 dir="ltr" style={{ y: wordY }} className="hero-word" aria-label={SITE.wordmark}>
        {[...SITE.wordmark].map((letter, i) => (
          <span key={i} className="overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease: EASE }}
            >
              {letter}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      {/* Machine image overlapping the word. Set SITE.heroImage to a transparent PNG to replace the placeholder. */}
      <motion.div style={{ y: mediaY }} className="hero-media">
        <motion.div
          initial={{ opacity: 0, y: 120, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
        >
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            {SITE.heroImage ? (
              <img src={SITE.heroImage} alt="" className="mx-auto w-full" />
            ) : (
              <MediaPlaceholder />
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="container-page relative mt-12 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1, ease: EASE }}
      >
        <h2 className="hero-title mx-auto">{t('hero.title')}</h2>
        <p className="section-text mx-auto">{t('hero.text')}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="#contact" size="lg">{t('hero.primaryCta')}</Button>
          <Button href="#services" size="lg" variant="outline">{t('hero.secondaryCta')}</Button>
        </div>
      </motion.div>
    </section>
  )
}
