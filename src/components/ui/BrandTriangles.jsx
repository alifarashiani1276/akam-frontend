import { useMemo } from 'react'
import { buildTrianglePaths } from '../../utils/trianglePath'

const W = 800
const H = 420

// Static brand triangle graphic (see utils/trianglePath.js): a few fine white triangles in the bottom-left corner,
// fading out quickly. Mirrored automatically in LTR. Color = text color, e.g. className="text-white". Place it inside a
// `relative isolate` parent: it fills the parent and sits behind the content.
export default function BrandTriangles({ className = '', seed = 7 }) {
  const paths = useMemo(() => buildTrianglePaths({ width: W, height: H, seed }), [seed])
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMinYMax slice"
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full ltr:-scale-x-100 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} vectorEffect="non-scaling-stroke" strokeOpacity={0.5 - i * 0.1} />
      ))}
    </svg>
  )
}
