import { Triangle } from 'lucide-react'

// Endless ticker. dir="ltr" keeps the scroll direction the same in every language.
export default function Marquee({ items }) {
  const loop = [...items, ...items]
  return (
    <div dir="ltr" className="marquee">
      <div className="marquee-track">
        {loop.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
            <Triangle size={14} className="fill-primary text-primary" />
          </span>
        ))}
      </div>
    </div>
  )
}
