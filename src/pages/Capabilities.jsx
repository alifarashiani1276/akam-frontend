import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Boxes, Cable, CheckCircle2, Cog, DraftingCompass, Factory, Gauge, Hammer, Ruler, Wrench } from 'lucide-react'
import PageState from '../components/ui/PageState'
import { usePage } from '../features/pages/usePage'
import { useSetAlternates } from '../lib/useAlternates'
import { createBreadcrumbJsonLd, useSeo } from '../lib/useSeo'

const ICONS = { design: DraftingCompass, machining: Cog, steel: Factory, welding: Hammer, hydraulic: Gauge, electrical: Cable, assembly: Wrench, quality: CheckCircle2, custom: Boxes, model: Ruler }
const PAGE_ALTERNATES = { fa: 'capabilities', en: 'capabilities', ru: 'capabilities', ar: 'capabilities' }

export default function Capabilities() {
  const { lang = 'fa' } = useParams()
  const { t } = useTranslation()
  const query = usePage(lang, 'capabilities')
  const page = query.data
  const fallback = (key) => t(`staticPages.capabilities.${key}`, { returnObjects: true })
  useSetAlternates(page?.alternates || PAGE_ALTERNATES)
  useSeo({ title: `${page?.meta?.title || page?.title || t('staticPages.capabilities.title')} | AKAM`, description: page?.meta?.description || page?.intro || t('staticPages.capabilities.intro'), alternates: page?.alternates || { fa: '/fa/capabilities', en: '/en/capabilities', ru: '/ru/capabilities', ar: '/ar/capabilities' }, jsonLd: createBreadcrumbJsonLd([{ name: t('nav.home'), path: `/${lang}` }, { name: page?.title || t('staticPages.capabilities.title'), path: `/${lang}/capabilities` }]) })
  if (query.error && query.error.status !== 404) return <main className="container-page py-10"><PageState error={query.error} onRetry={query.refetch} isRetrying={query.isFetching}/></main>

  const items = page?.items?.length ? page.items : fallback('items')
  const outsourced = page?.outsourced?.length ? page.outsourced : fallback('outsourced')
  return <main className="container-page py-8 md:py-12">
    <nav aria-label={fallback('breadcrumbLabel')} className="mb-8 text-sm text-base-content/60"><ol className="flex flex-wrap items-center gap-2"><li><Link to={`/${lang}`} className="hover:text-primary">{fallback('home')}</Link></li><li aria-hidden="true">/</li><li className="font-semibold text-base-content" aria-current="page">{page?.title || fallback('title')}</li></ol></nav>
    <PageState isLoading={query.isPending} skeleton="cards" skeletonCount={6} loader="both" loadingLabel={t('states.loaders.capabilities')}>
      <header className="mb-12 max-w-4xl"><span className="mb-4 block text-xs font-bold uppercase tracking-[.22em] text-secondary">{fallback('eyebrow')}</span><h1 className="text-3xl font-black leading-tight text-primary md:text-5xl">{page?.title || fallback('title')}</h1><p className="mt-6 text-lg leading-9 text-base-content/70">{page?.intro || fallback('intro')}</p></header>
      {items.length > 0 && <section className="mb-16"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((item,index)=>{const Icon=ICONS[item.icon] || Wrench; return <article key={item.id || item.icon || index} className="rounded-box border border-base-300 bg-base-100 p-5 transition hover:-translate-y-1 hover:shadow-lg"><span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={25}/></span><h2 className="font-bold text-primary">{item.title}</h2><p className="mt-2 text-sm leading-7 text-base-content/70">{item.description || item.text}</p></article>})}</div></section>}
      {outsourced.length > 0 && <section className="rounded-box border border-base-300 bg-base-200/50 p-6 md:p-8"><h2 className="text-2xl font-extrabold text-primary">{fallback('outsourcedTitle')}</h2><p className="mt-3 max-w-3xl leading-8 text-base-content/70">{fallback('outsourcedIntro')}</p><ul className="mt-5 grid gap-3 sm:grid-cols-3">{outsourced.map((item,index)=><li key={index} className="flex items-start gap-2 rounded-lg bg-base-100 p-4 leading-7"><span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-secondary"/>{item}</li>)}</ul></section>}
    </PageState>
  </main>
}
