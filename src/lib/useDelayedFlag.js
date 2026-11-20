import { useEffect, useRef, useState } from 'react'

// Delays brief loading indicators and keeps a visible indicator mounted long enough to avoid flicker.
export default function useDelayedFlag(active, delay = 200, minDuration = 400) {
  const [visible, setVisible] = useState(false)
  const shownAt = useRef(0)

  useEffect(() => {
    let timer
    if (active) {
      if (!visible) {
        timer = window.setTimeout(() => {
          shownAt.current = Date.now()
          setVisible(true)
        }, delay)
      }
    } else if (visible) {
      const remaining = Math.max(0, minDuration - (Date.now() - shownAt.current))
      timer = window.setTimeout(() => setVisible(false), remaining)
    }
    return () => window.clearTimeout(timer)
  }, [active, delay, minDuration, visible])

  return visible
}
