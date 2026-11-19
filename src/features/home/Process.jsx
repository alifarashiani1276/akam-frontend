import { Play } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TextReveal from '../../components/motion/TextReveal'
import { formatIndex } from '../../utils/format'

// Photo of each step (public/images). Replace with the real step photos when the client provides them.
const IMAGES = ['/images/card-1.webp', '/images/card-2.webp', '/images/card-3.webp']
// Final tilt (degrees) of every card in the stack, alternating direction. The LAST card is always straight (like the reference).
const TILTS = [-7, 6, -5, 4]
// Scroll distance used by one card to slide in (in screen heights) and the extra time the finished stack stays pinned (in "card slots").
const SCROLL_PER_CARD = 1.7
const HOLD = 0.7
// Distance of each vertical guide line from the screen edge: the cards (max 52rem wide) sit in the middle, with 3rem free space between card and line.
const LINE_OFFSET = 'calc(50% - min(26rem, 44vw) - 3rem)'

// Viewport height + "is tablet/desktop". Only re-renders when the size really changes (mobile URL bars resize while scrolling).
function useViewport() {
  const read = () => ({ h: window.innerHeight, wide: window.innerWidth >= 768 })
  const [vp, setVp] = useState(read)
  useEffect(() => {
    const onResize = () => {
      const next = read()
      setVp((prev) => (Math.abs(prev.h - next.h) > 80 || prev.wide !== next.wide ? next : prev))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return vp
}

function CardBody({ step, index, lang }) {
  return (
    <>
      <img src={IMAGES[index % IMAGES.length]} alt="" loading="lazy" className="h-44 w-full object-cover opacity-80 md:h-full md:w-5/12" />
      <div className="flex flex-1 flex-col justify-center gap-3 p-5 md:p-8">
        <span className="text-sm font-semibold text-primary">{formatIndex(index + 1, lang)}</span>
        <h3 className="font-sans text-2xl font-extrabold uppercase leading-tight md:text-4xl">{step.title}</h3>
        <p className="max-w-sm text-sm text-white/80 md:text-base">{step.text}</p>
      </div>
    </>
  )
}

const CARD_CLASS =
  'flex h-[26rem] w-[min(52rem,88vw)] flex-col overflow-hidden border border-white/40 bg-black text-white shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)] md:h-80 md:flex-row md:items-stretch'

// One card of the pinned stack. Everything is a pure function of the scroll progress (0..1) of the pinned track,
// so it works in both scroll directions and never re-renders while scrolling (motion values update the DOM directly).
// - Card 0 is already in place; card k slides in from below during its own scroll segment and tilts while arriving.
// - Card 0 tilts while card 1 arrives, every covered card shrinks slightly and sits a little higher so the layers stay visible.
function StackCard({ step, index, total, progress, vh, wide, lang }) {
  const slots = total - 1 + HOLD
  const seg = (k) => [(k - 1) / slots, k / slots]
  const last = index === total - 1
  const tilt = last ? 0 : TILTS[index % TILTS.length] * (wide ? 1 : 0.5)
  const rest = -(total - 1 - index) * (wide ? 16 : 10)
  const [s, e] = seg(Math.max(index, 1))
  const [s2, e2] = seg(index + 1)
  const offscreen = vh * 0.5 + 320

  const y = useTransform(progress, index === 0 ? [0, 1] : [s, e], index === 0 ? [rest, rest] : [offscreen, rest])
  const rotate = useTransform(progress, [s, e], [0, tilt])
  const scale = useTransform(progress, last ? [0, 1] : [s2, e2], last ? [1, 1] : [1, 0.97])

  return (
    <motion.article style={{ y, rotate, scale, zIndex: index + 1 }} className={`${CARD_CLASS} col-start-1 row-start-1 will-change-transform`}>
      <CardBody step={step} index={index} lang={lang} />
    </motion.article>
  )
}

// Tall track + sticky full-screen stage: the stage stays pinned while the cards stack, then scrolls away normally.
function StackedCards({ steps, lang }) {
  const trackRef = useRef(null)
  const { h: vh, wide } = useViewport()
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  const slots = steps.length - 1 + HOLD
  return (
    <div ref={trackRef} style={{ height: `${100 + slots * SCROLL_PER_CARD * 100}svh` }} className="relative">
      <div className="sticky top-0 grid h-svh place-items-center overflow-hidden pt-16 md:pt-20">
        {steps.map((step, i) => (
          <StackCard key={step.title} step={step} index={i} total={steps.length} progress={scrollYProgress} vh={vh} wide={wide} lang={lang} />
        ))}
      </div>
    </div>
  )
}

// prefers-reduced-motion: plain straight cards, no pinning, no movement.
function StaticCards({ steps, lang }) {
  return (
    <div className="container-page flex flex-col items-center gap-6 pb-20">
      {steps.map((step, i) => (
        <article key={step.title} className={CARD_CLASS}>
          <CardBody step={step} index={i} lang={lang} />
        </article>
      ))}
    </div>
  )
}

// Yellow band: spinning triangle + label, huge letter-by-letter title, then the scroll-driven stack of step cards.
// Careful: no ancestor of the pinned stage may have overflow hidden/auto (sticky would stop working), that is why the section uses overflow-x-clip.
export default function Process() {
  const { t, i18n } = useTranslation()
  const reduceMotion = useReducedMotion()
  const steps = t('process.steps', { returnObjects: true })
  return (
    <section id="process" className="relative isolate scroll-mt-20 overflow-x-clip bg-primary pt-20 text-primary-content md:pt-28">
      {/* Two thin vertical guide lines like the reference, the cards stay in the middle between them */}
      <div aria-hidden="true" style={{ left: LINE_OFFSET }} className="pointer-events-none absolute inset-y-0 -z-10 hidden w-px bg-black/20 md:block" />
      <div aria-hidden="true" style={{ right: LINE_OFFSET }} className="pointer-events-none absolute inset-y-0 -z-10 hidden w-px bg-black/20 md:block" />
      <div className="container-page">
        <div className="mb-10 flex flex-col items-center md:mb-14">
          <span className="mb-6 inline-flex items-center gap-2 text-sm font-semibold uppercase">
            <Play size={22} className="animate-[spin_2.5s_linear_infinite] [transform-origin:44.4%_50%] motion-reduce:animate-none" />
            {t('process.label')}
          </span>
          <TextReveal
            as="h2"
            letters
            text={t('process.title')}
            className="mx-auto block max-w-5xl text-center font-sans text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-8xl rtl:leading-snug"
          />
        </div>
      </div>
      {reduceMotion ? <StaticCards steps={steps} lang={i18n.language} /> : <StackedCards steps={steps} lang={i18n.language} />}
    </section>
  )
}
