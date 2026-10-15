import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'motion/react'

const toLatin = (s) =>
  s.replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - 1776).replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 1632)

// Counts up the first number inside a string like "+۱۵", "98%". Strings like "24/7" stay as they are.
export default function CountUp({ value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [text, setText] = useState(value)

  const latin = toLatin(value)
  const digits = latin.match(/\d+/)?.[0]
  const locale = /[۰-۹]/.test(value) ? 'fa' : /[٠-٩]/.test(value) ? 'ar-EG' : 'en'

  useEffect(() => {
    if (!inView || !digits || latin.includes('/')) return
    const controls = animate(0, Number(digits), {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) =>
        setText(latin.replace(digits, new Intl.NumberFormat(locale, { useGrouping: false }).format(Math.round(v)))),
    })
    return () => controls.stop()
  }, [inView, latin, digits, locale])

  return <span ref={ref}>{text}</span>
}
