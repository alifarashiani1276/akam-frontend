import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'motion/react'

const toLatin = (s) =>
  s.replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - 1776).replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 1632)

const NUMBER = /\d+(?:[.,٫]\d+)?/

// Counts up the first number inside a string like "+۱۵", "98%", "2.8x" (decimals are supported).
// Strings like "24/7" stay as they are.
export default function CountUp({ value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [text, setText] = useState(value)

  const latin = toLatin(value)
  const match = latin.match(NUMBER)?.[0]
  const separator = match?.match(/[.,٫]/)?.[0]
  const decimals = separator ? match.split(separator)[1].length : 0
  const locale = /[۰-۹]/.test(value) ? 'fa' : /[٠-٩]/.test(value) ? 'ar-EG' : 'en'

  useEffect(() => {
    if (!inView || !match || latin.includes('/')) return
    const target = Number(match.replace(/[,٫]/, '.'))
    const formatter = new Intl.NumberFormat(locale, {
      useGrouping: false,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    const controls = animate(0, target, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (v) => {
        let formatted = formatter.format(v)
        if (separator === ',') formatted = formatted.replace('.', ',')
        setText(latin.replace(match, formatted))
      },
    })
    return () => controls.stop()
  }, [inView, latin, match, separator, decimals, locale])

  return <span ref={ref}>{text}</span>
}
