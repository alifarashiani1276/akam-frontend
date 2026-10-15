import { useEffect, useMemo, useRef } from 'react'

// Animated brand "super graphic" drawn on ONE <canvas> (instead of hundreds of DOM elements),
// so it stays light. Every triangle drifts, rotates and fades on its own.
const W = 1280
const H = 640
const CELL = 36 // grid size: smaller = more triangles
const SKIP = 0.2 // share of empty cells
const FPS = 30

// Small seeded random generator so the pattern is identical on every render.
const seeded = (seed) => {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Color comes from the text color: className="text-primary/20". Use a different seed for a different layout.
export default function TrianglePattern({ className = '', seed = 7 }) {
  const canvasRef = useRef(null)

  const triangles = useMemo(() => {
    const rand = seeded(seed)
    const list = []
    for (let r = 0; r < H / CELL; r++) {
      for (let c = 0; c < W / CELL; c++) {
        if (rand() < SKIP) continue
        list.push({
          cx: c * CELL + rand() * 10,
          cy: r * CELL + rand() * 10,
          s: 5 + rand() * 7, // triangle size
          dx: (rand() - 0.5) * 8,
          dy: (rand() - 0.5) * 8,
          rot: ((rand() - 0.5) * 70 * Math.PI) / 180,
          dur: 3 + rand() * 4, // seconds per cycle
          phase: rand(),
        })
      }
    }
    return list
  }, [seed])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let last = 0
    let w = 0
    let h = 0
    let color = ''

    const draw = (time) => {
      if (!w || !h) return
      ctx.clearRect(0, 0, w, h)
      const scale = Math.max(w / W, h / H) // same as SVG "slice": cover the box
      const ox = (w - W * scale) / 2
      const oy = (h - H * scale) / 2
      ctx.strokeStyle = color
      ctx.lineWidth = 0.9
      for (const t of triangles) {
        const p = reduceMotion ? 0 : 0.5 - 0.5 * Math.cos(2 * Math.PI * (time / 1000 / t.dur + t.phase))
        ctx.globalAlpha = 0.4 + 0.6 * p
        ctx.save()
        ctx.translate(ox + (t.cx + t.dx * p) * scale, oy + (t.cy + t.dy * p) * scale)
        ctx.rotate(t.rot * p)
        ctx.scale(scale, scale)
        ctx.beginPath()
        ctx.moveTo(-t.s / 3, -0.6 * t.s)
        ctx.lineTo(-t.s / 3, 0.6 * t.s)
        ctx.lineTo((2 * t.s) / 3, 0)
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      color = getComputedStyle(canvas).color
      draw(performance.now())
    }

    const loop = (time) => {
      frame = requestAnimationFrame(loop)
      if (time - last < 1000 / FPS) return
      last = time
      draw(time)
    }
    const start = () => {
      if (!frame && !reduceMotion) frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    // Animate only while the pattern is on screen
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    const sizing = new ResizeObserver(resize)
    visibility.observe(canvas)
    sizing.observe(canvas)
    return () => {
      stop()
      visibility.disconnect()
      sizing.disconnect()
    }
  }, [triangles])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%' }}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    />
  )
}
