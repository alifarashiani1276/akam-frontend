import { useTranslation } from 'react-i18next'
import { roundedPolygonPath } from '../../utils/roundedTriangle'
import useDelayedFlag from '../../lib/useDelayedFlag'

const OUTER_TRIANGLE = roundedPolygonPath([[0.5, 0.04], [0.96, 0.91], [0.04, 0.91]], 0.12)
const INNER_TRIANGLE = roundedPolygonPath([[0.5, 0.22], [0.82, 0.82], [0.18, 0.82]], 0.12)

export default function Loader({ label, size = 'md', layout = 'block', className = '', delay = 200, minDuration = 400 }) {
  const { t } = useTranslation()
  const visible = useDelayedFlag(true, delay, minDuration)
  const text = label || t('states.loading')

  if (!visible) return null

  return (
    <div className={`loader loader-${layout} loader-${size} ${className}`.trim()} role="status" aria-live="polite" aria-busy="true">
      <svg className="loader-triangle" viewBox="0 0 1 1" fill="none" aria-hidden="true">
        <path className="loader-triangle-outer" d={OUTER_TRIANGLE} />
        <path className="loader-triangle-inner" d={INNER_TRIANGLE} />
      </svg>
      <span className="loader-label">{text}</span>
    </div>
  )
}
