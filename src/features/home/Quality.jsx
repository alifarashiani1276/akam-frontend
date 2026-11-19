import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import TextReveal from '../../components/motion/TextReveal'

const EASE = [0.22, 1, 0.36, 1]
const ITEM = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }
const LINE = { hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.9, ease: EASE } } }

// Full-width photo (parallax on scroll). The text sits at the start side (left in LTR, right in RTL) on the empty part
// of the photo; the photo is mirrored in RTL so the machine is always on the opposite side.
// key={i18n.language} remounts the list on language change so its entrance animation plays again (otherwise new items stay hidden).
// Each list item fades in and its underline draws across.
export default function Quality() {
  const { t, i18n } = useTranslation()
  const items = t('quality.items', { returnObjects: true })
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <section ref={ref} id="quality" className="relative isolate flex min-h-[40rem] scroll-mt-20 md:min-h-[125svh] items-center overflow-hidden py-16">
      <motion.img
        src="/images/quality.webp"
        alt=""
        loading="lazy"
        style={{ y: imageY }}
        className="absolute inset-x-0 -top-[10%] -z-20 h-[120%] w-full object-cover rtl:-scale-x-100"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/60 via-black/20 to-transparent rtl:bg-linear-to-l" />
      <div className="container-page flex justify-start">
        <div className="max-w-xs md:ms-12 xl:ms-24">
          <TextReveal as="h2" text={t('quality.title')} className="mb-8 block text-4xl font-extrabold leading-snug text-primary md:text-5xl" />
          <motion.ul
            key={i18n.language}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ staggerChildren: 0.12, delayChildren: 0.3 }}
          >
            {items.map((item) => (
              <motion.li key={item} variants={ITEM} className="relative py-2 text-sm font-semibold text-white">
                {item}
                <motion.span variants={LINE} className="absolute inset-x-0 bottom-0 h-px origin-left bg-white/70 rtl:origin-right" />
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
