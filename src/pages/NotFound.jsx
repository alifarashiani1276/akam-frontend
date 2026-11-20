import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DEFAULT_LANG } from '../config/languages'
import { useSetAlternates } from '../lib/useAlternates'
import { useSeo } from '../lib/useSeo'

export default function NotFound() {
  const { lang } = useParams()
  const { t } = useTranslation()
  useSetAlternates(null)
  useSeo({ title: `${t('notFound.title')} | AKAM`, description: t('notFound.text'), alternates: null })
  return (
    <section className="container-page flex min-h-[55vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-semibold tracking-[0.25em] text-primary">404</p>
      <h1 className="mt-4 text-3xl font-bold md:text-5xl">{t('notFound.title')}</h1>
      <p className="mt-4 max-w-xl text-base-content/70">{t('notFound.text')}</p>
      <Link className="btn btn-primary mt-8" to={`/${lang || DEFAULT_LANG}`}>{t('notFound.home')}</Link>
    </section>
  )
}
