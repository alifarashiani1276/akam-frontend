import { Play, Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Reveal from '../../components/motion/Reveal'
import TextReveal from '../../components/motion/TextReveal'
import { formatIndex } from '../../utils/format'

const EASE = [0.22, 1, 0.36, 1]
const BG = '#121212'

// Closed item: white border, strong at the top and fading out downwards (like the other dark sections).
const CLOSED = {
  border: '1px solid transparent',
  background: `linear-gradient(${BG}, ${BG}) padding-box, linear-gradient(to bottom, rgb(255 255 255 / 0.9), rgb(255 255 255 / 0) 100%) border-box`,
}
// Open item: solid white border all around.
const OPEN = { border: '1px solid #fff', backgroundColor: BG }

function FaqItem({ index, item, open, onToggle, lang }) {
  const id = useId()
  return (
    <div style={open ? OPEN : CLOSED}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-answer`}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-6 p-5 text-start md:p-6"
      >
        <span className="font-sans text-base font-medium text-white md:text-xl">
          {formatIndex(index + 1, lang)}. {item.q}
        </span>
        {/* "+" when closed, turns into a yellow "x" when open */}
        <Plus size={20} aria-hidden="true" className={`shrink-0 transition-all duration-300 ${open ? 'rotate-45 text-primary' : 'text-white'}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-answer`}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-6 text-sm font-semibold leading-relaxed text-white/90 md:px-6 md:text-base">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Dark FAQ section (Movora reference): spinning-triangle label, big centered title, one-open-at-a-time accordion.
// Texts: faq.* in locales/<lang>/faq.json ({ label, title, items: [{ q, a }] }). Add/remove questions there only.
// The first question is open at the start. Click the open one again to close it.
export default function Faq() {
  const { t, i18n } = useTranslation()
  const items = t('faq.items', { returnObjects: true })
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section
      id="faq"
      className="relative isolate scroll-mt-20 overflow-hidden pb-8 pt-16 md:pb-12 md:pt-24"
      style={{
        backgroundColor: BG,
        backgroundImage: 'repeating-linear-gradient(172deg, rgb(255 255 255 / 0.035) 0 46px, transparent 46px 110px)',
      }}
    >
      {/* Fades the diagonal stripes out at the top and bottom so the section blends with its neighbours */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-[#121212] via-transparent to-[#121212]" />
      <div className="container-page flex flex-col items-center">
        <span className="mb-5 inline-flex items-center gap-2 text-sm font-semibold uppercase text-primary">
          <Play size={22} className="animate-[spin_2.5s_linear_infinite] [transform-origin:44.4%_50%] motion-reduce:animate-none" aria-hidden="true" />
          {t('faq.label')}
        </span>
        <TextReveal
          as="h2"
          text={t('faq.title')}
          className="mb-12 block max-w-5xl text-center font-sans text-5xl font-extrabold uppercase leading-[0.9] tracking-tight text-white md:mb-16 md:text-7xl lg:text-8xl rtl:leading-snug"
        />
        <Reveal className="w-full max-w-3xl">
          <div className="space-y-2">
            {items.map((item, i) => (
              <FaqItem key={item.q} index={i} item={item} lang={i18n.language} open={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
