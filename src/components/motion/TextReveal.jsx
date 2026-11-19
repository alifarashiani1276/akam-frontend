import { motion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1]
const WORD = { hidden: { y: '110%' }, visible: { y: 0, transition: { duration: 0.8, ease: EASE } } }
const LETTER = { hidden: { opacity: 0, y: '45%' }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }
const ARABIC_SCRIPT = /[\u0600-\u06FF]/

// Movora-style headline: every word slides up from behind a mask, one after another.
// Splits by WORDS by default (Persian/Arabic letters must stay joined).
// letters: every LETTER fades in one after another (the big "Process" title). Only for Latin/Cyrillic text,
// Persian/Arabic text automatically falls back to words.
// inView=true: plays when scrolled into view. inView=false: plays on load (use for the hero).
export default function TextReveal({ text, as = 'span', className = '', delay = 0, stagger = 0.06, inView = true, letters = false }) {
  const Tag = motion[as]
  const byLetter = letters && !ARABIC_SCRIPT.test(text)
  const words = text.split(' ')
  const trigger = inView ? { whileInView: 'visible', viewport: { once: true, margin: '-80px' } } : { animate: 'visible' }
  return (
    <Tag key={text} className={className} aria-label={text} initial="hidden" {...trigger} transition={{ staggerChildren: byLetter ? 0.035 : stagger, delayChildren: delay }}>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          {byLetter ? (
            <span className="inline-block whitespace-nowrap">
              {[...word].map((char, j) => (
                <motion.span key={j} className="inline-block" variants={LETTER}>
                  {char}
                </motion.span>
              ))}
            </span>
          ) : (
            <span className="inline-block overflow-hidden py-[0.12em] align-bottom">
              <motion.span className="inline-block" variants={WORD}>
                {word}
              </motion.span>
            </span>
          )}
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  )
}
