import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import PageState from '../components/ui/PageState'
import BrandTriangles from '../components/ui/BrandTriangles'
import { useSection } from '../features/catalog/useCatalog'
import { useSetAlternates } from '../lib/useAlternates'
import { createBreadcrumbJsonLd, useSeo } from '../lib/useSeo'

export default function Section() {
  const { lang, sectionSlug } = useParams()
  const { t, i18n } = useTranslation()
  const { data: section, isPending, error, refetch, isFetching } = useSection(lang, sectionSlug)
  useSetAlternates(section?.alternates)
  useSeo({ title: `${section?.meta?.title || section?.title || t('pages.productSection')} | AKAM`, description: section?.meta?.description || section?.text || '', alternates: section?.alternates, jsonLd: section ? createBreadcrumbJsonLd([{ name: t('products.home'), path: `/${lang}` }, { name: t('products.title'), path: `/${lang}/products` }, { name: section.title, path: `/${lang}/products/${sectionSlug}` }]) : null })
  const Arrow = i18n.dir() === 'rtl' ? ArrowUpLeft : ArrowUpRight

  return (
    <section className="container-page py-8 md:py-12">
      <nav aria-label={t('products.breadcrumbLabel')} className="mb-8 text-sm text-base-content/60">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link className="hover:text-primary" to={`/${lang}`}>{t('products.home')}</Link></li><li>/</li>
          <li><Link className="hover:text-primary" to={`/${lang}/products`}>{t('products.title')}</Link></li><li>/</li>
          <li className="font-semibold text-base-content">{section?.short || section?.title || sectionSlug}</li>
        </ol>
      </nav>
      <PageState isLoading={isPending} error={error} isEmpty={!isPending && !error && !section} onRetry={refetch} isRetrying={isFetching} skeleton="text" skeletonCount={4} loader="both" loadingLabel={t('states.loaders.catalog')}>
        {section && <>
          <header className="mb-10 max-w-4xl">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">{t('products.sectionEyebrow')}</p>
              {section.export_only && <span className="badge badge-warning font-bold">{t('products.exportBadge')}</span>}
            </div>
            <h1 className="text-3xl font-extrabold leading-tight text-primary md:text-5xl">{section.title}</h1>
            <p className="mt-5 text-base-content/75 md:text-lg md:leading-9">{section.text}</p>
            {section.export_only && <p className="mt-4 border-s-4 border-secondary ps-4 font-medium leading-8 text-base-content/80">{t('products.exportDescription')}</p>}
          </header>
          <PageState isEmpty={(section.items || []).length === 0} emptyTitle={t('products.noItemsTitle')} emptyText={t('products.noItemsText')}>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {(section.items || []).map((item, index) => <Link key={item.id || item.slug} to={`/${lang}/products/${section.slug}/${item.slug}`} className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                <article className="brand-card brand-card-col h-full">
                  <BrandTriangles seed={index + 3} zoom={2} className="text-white" />
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-1.5 bg-white/10"><span className="block h-full w-1/6 bg-linear-to-r from-secondary to-primary transition-[width] duration-700 ease-out group-hover:w-full" /></span>
                  <div className="relative z-10 flex flex-1 flex-col gap-2 p-6 pt-8 md:p-8 md:pt-10">
                    <span className="text-xs font-bold tracking-widest text-secondary">{String(index + 1).padStart(2, '0')}</span>
                    <h2 className="text-xl font-extrabold text-primary">{item.title}</h2>
                    <p className="text-sm leading-7 text-white/75">{item.text}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-3 text-sm font-bold text-secondary">{t('products.viewSubcategory')} <Arrow size={17} /></span>
                  </div>
                </article>
              </Link>)}
            </div>
          </PageState>
        </>}
      </PageState>
    </section>
  )
}
