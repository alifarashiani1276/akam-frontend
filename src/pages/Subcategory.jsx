import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'
import PageState from '../components/ui/PageState'
import BrandTriangles from '../components/ui/BrandTriangles'
import { useSubcategory } from '../features/catalog/useCatalog'
import { useSetAlternates } from '../lib/useAlternates'
import { createBreadcrumbJsonLd, useSeo } from '../lib/useSeo'

const PAGE_SIZE = 6

function ListingCard({ item, kind, lang, t, fallbackImage, index = 0 }) {
  const slug = item.slug
  const title = item.name || item.title
  const summary = item.intro || item.text || item.meta?.description || ''
  const href = `/${lang}/${kind === 'product' ? 'product' : 'service'}/${slug}`
  return <div className="group h-full"><article className="brand-card brand-card-col h-full">
    <BrandTriangles seed={index + 3} zoom={2} className="text-white" />
    <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-1.5 bg-white/10"><span className="block h-full w-1/6 bg-linear-to-r from-secondary to-primary transition-[width] duration-700 ease-out group-hover:w-full" /></span>
    <figure className="relative h-48 overflow-hidden bg-base-200">
      <img src={item.image || fallbackImage} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <span className="badge badge-neutral absolute bottom-3 start-3">{kind === 'product' ? t('products.productType') : t('products.serviceType')}</span>
    </figure>
    <div className="relative z-10 flex flex-1 flex-col gap-2 p-6">
      <h3 className="text-lg font-extrabold text-primary">{title}</h3>
      <p className="line-clamp-3 min-h-18 text-sm leading-7 text-white/75">{summary}</p>
      <div className="mt-auto pt-3">
        <Button href={href} size="sm">{t('products.viewDetails')}</Button>
      </div>
    </div>
  </article></div>
}

export default function Subcategory() {
  const { lang, sectionSlug, subSlug } = useParams()
  const { t, i18n } = useTranslation()
  const [pageState, setPageState] = useState({ slug: subSlug, page: 1 })
  const page = pageState.slug === subSlug ? pageState.page : 1
  const setPage = (nextPage) => setPageState({ slug: subSlug, page: nextPage })
  const { data, isPending, error, refetch, isFetching } = useSubcategory(lang, subSlug, { page, perPage: PAGE_SIZE })
  useSetAlternates(data?.alternates)
  useSeo({ title: `${data?.meta?.title || data?.title || t('pages.productSubcategory')} | AKAM`, description: data?.meta?.description || data?.text || '', alternates: data?.alternates, jsonLd: data ? createBreadcrumbJsonLd([{ name: t('products.home'), path: `/${lang}` }, { name: t('products.title'), path: `/${lang}/products` }, { name: data.section_title || sectionSlug, path: `/${lang}/products/${sectionSlug}` }, { name: data.title, path: `/${lang}/products/${sectionSlug}/${subSlug}` }]) : null })

  const items = useMemo(() => [
    ...(data?.products || []).map((item) => ({ ...item, kind: 'product' })),
    ...(data?.services || []).map((item) => ({ ...item, kind: 'service' })),
  ], [data])
  const totalPages = Math.max(1, Math.ceil((data?.pagination?.total || 0) / PAGE_SIZE))
  const Prev = i18n.dir() === 'rtl' ? ArrowRight : ArrowLeft
  const Next = i18n.dir() === 'rtl' ? ArrowLeft : ArrowRight

  return <section className="container-page py-8 md:py-12">
    <nav aria-label={t('products.breadcrumbLabel')} className="mb-8 text-sm text-base-content/60">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link className="hover:text-primary" to={`/${lang}`}>{t('products.home')}</Link></li><li>/</li>
        <li><Link className="hover:text-primary" to={`/${lang}/products`}>{t('products.title')}</Link></li><li>/</li>
        <li><Link className="hover:text-primary" to={`/${lang}/products/${sectionSlug}`}>{data?.section_title || sectionSlug}</Link></li><li>/</li>
        <li className="font-semibold text-base-content">{data?.title || subSlug}</li>
      </ol>
    </nav>
    <PageState isLoading={isPending} error={error} isEmpty={!isPending && !error && !data} onRetry={refetch} isRetrying={isFetching} skeleton="text" skeletonCount={4}>
      {data && <>
        <header className="mb-9 max-w-4xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-secondary">{t('products.subcategoryEyebrow')}</p>
          <h1 className="text-3xl font-extrabold text-primary md:text-5xl">{data.title}</h1>
          <p className="mt-4 leading-8 text-base-content/70">{data.text}</p>
        </header>
        <PageState isEmpty={items.length === 0} emptyTitle={t('products.noItemsTitle')} emptyText={t('products.noItemsText')}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => <ListingCard key={`${item.kind}-${item.id || item.slug}`} index={index} item={item} kind={item.kind} lang={lang} t={t} fallbackImage={data.section_image || '/images/card-1.webp'} />)}
          </div>
          {totalPages > 1 && <nav aria-label={t('products.pagination')} className="mt-10 flex items-center justify-center gap-4">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}><Prev size={16} />{t('products.previous')}</button>
            <span className="text-sm tabular-nums text-base-content/70">{t('products.pageOf', { page, total: totalPages })}</span>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>{t('products.next')}<Next size={16} /></button>
          </nav>}
        </PageState>
      </>}
    </PageState>
  </section>
}
