// Builds an SVG path with rounded corners for a polygon given in 0..1 box coordinates
// (used with clipPathUnits="objectBoundingBox"). t = how much of each edge is used for rounding (0.1 = subtle, 0.25 = very round).
export function roundedPolygonPath(points, t = 0.17) {
  const lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]
  const f = (n) => +n.toFixed(4)
  const n = points.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const v = points[i]
    const a = lerp(v, points[(i + n - 1) % n], t)
    const b = lerp(v, points[(i + 1) % n], t)
    d += `${i === 0 ? 'M' : 'L'}${f(a[0])} ${f(a[1])}Q${f(v[0])} ${f(v[1])} ${f(b[0])} ${f(b[1])}`
  }
  return `${d}Z`
}

// Small play-button-like triangle: tip points toward the text. Base on the image side.
export const TRIANGLE_TIP_LEFT = roundedPolygonPath([[0, 0.5], [1, 0], [1, 1]]) // RTL: image on the right
export const TRIANGLE_TIP_RIGHT = roundedPolygonPath([[1, 0.5], [0, 0], [0, 1]]) // LTR: image on the left
