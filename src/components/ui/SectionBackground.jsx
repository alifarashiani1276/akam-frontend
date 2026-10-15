import TrianglePattern from './TrianglePattern'

// Subtle living triangle background for a section. Use a different seed per section for a different layout.
export default function SectionBackground({ seed = 1 }) {
  return <TrianglePattern seed={seed} className="section-bg" />
}
