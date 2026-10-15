import { useTranslation } from 'react-i18next'

// Replace /public/logo.svg with the official logo (keep this component as is).
export default function Logo({ className = 'h-9 w-auto' }) {
  const { t } = useTranslation()
  return <img src="/logo.svg" alt={t('brand.name')} className={className} />
}
