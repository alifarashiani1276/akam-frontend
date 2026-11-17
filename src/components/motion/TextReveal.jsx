import { motion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1]
const WORD = { hidden: { y: '110%' }, visible: { y: 0, transition: { duration: 0.8, ease: EASE } } }

// Movora-style headline: every word slides up from behind a mask, one after another.
// Splits by WORDS only (never letters) so Persian/Arabic letter joining is not broken.
// inView=true: plays when scrolled into view. inView=false: plays on load (use for the hero).
export default function TextReveal({ text, as = 'span', className = '', delay = 0, stagger = 0.06, inView = true }) {
  const Tag = motion[as]
  const words = text.split(' ')
  const trigger = inView ? { whileInView: 'visible', viewport: { once: true, margin: '-80px' } } : { animate: 'visible' }
  return (
    <Tag className={className} aria-label={text} initial="hidden" {...trigger} transition={{ staggerChildren: stagger, delayChildren: delay }}>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          <span className="inline-block overflow-hidden py-[0.12em] align-bottom">
            <motion.span className="inline-block" variants={WORD}>
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  )
}
