// Brand "super graphic": a regular lattice of outlined triangles (alternating up/down, like the brand guide)
// that shrinks, thins out and scatters into dots while fading away from one side.
// Pure function, no React: returns SVG path data grouped by opacity.

const seeded = (seed) => {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}
const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n))

// Density is highest in the bottom-left corner and dies out quickly (about a quarter of the width).
// width/height: drawing area. side: triangle side. reachX/reachY: how far the graphic reaches from the corner.
export function buildTrianglePaths({ width = 800, height = 420, side = 18, seed = 7, buckets = 4, reachX = 250, reachY = 200 } = {}) {
  const rand = seeded(seed)
  const h = side * 0.866
  const paths = Array.from({ length: buckets }, () => '')
  const rows = Math.ceil(height / h)
  const cols = Math.ceil(width / (side / 2)) + 1

  for (let r = 0; r < rows; r++) {
    for (let j = 0; j < cols; j++) {
      const up = (j + r) % 2 === 0
      const cx = j * (side / 2)
      const cy = r * h + (up ? (2 * h) / 3 : h / 3)

      const t = clamp(1 - Math.hypot(cx / reachX, (height - cy) / reachY))
      if (t <= 0 || rand() > Math.pow(t, 0.8) * 0.9) continue // sparse: fewer and fewer triangles away from the corner

      const k = 0.16 + 0.4 * Math.pow(t, 0.8) // small and delicate, tiny at the edge
      const sw = side * k
      const hh = sw * 0.866
      const d = up
        ? `M${cx} ${cy - (2 * hh) / 3}L${cx + sw / 2} ${cy + hh / 3}L${cx - sw / 2} ${cy + hh / 3}Z`
        : `M${cx} ${cy + (2 * hh) / 3}L${cx - sw / 2} ${cy - hh / 3}L${cx + sw / 2} ${cy - hh / 3}Z`
      paths[Math.min(buckets - 1, Math.floor((1 - t) * buckets))] += d.replace(/(\d+\.\d{2})\d+/g, '$1')
    }
  }
  return paths // index 0 = densest/brightest
}
