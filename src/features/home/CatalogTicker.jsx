import { useTranslation } from 'react-i18next'
import Marquee from '../../components/ui/Marquee'
import { getVisibleCatalog } from '../../config/catalog'

// Ticker under the hero: the short name of each main section.
export default function CatalogTicker() {
  const { t } = useTranslation()
  const items = getVisibleCatalog().map(({ id }) => t(`catalog.sections.${id}.short`))
  return <Marquee items={items} />
}
