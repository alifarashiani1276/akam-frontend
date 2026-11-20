import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Factory, MapPin, Users, Ruler, Boxes, Wrench } from 'lucide-react'
import PageState from '../components/ui/PageState'
import { usePage } from '../features/pages/usePage'
import { useSetAlternates } from '../lib/useAlternates'
import { createBreadcrumbJsonLd, useSeo } from '../lib/useSeo'

const PAGE_ALTERNATES = { fa: 'about', en: 'about', ru: 'about', ar: 'about' }

export default function About() {
  const { lang = 'fa' } = useParams()
  const { t } = useTranslation()
  const query = usePage(lang, 'about')
  const page = query.data
  const fallback = (key) => t(`staticPages.about.${key}`, { returnObjects: true })
  useSetAlternates(page?.alternates || PAGE_ALTERNATES)
  useSeo({ title: `${page?.meta?.title || page?.title || t('staticPages.about.title')} | AKAM`, description: page?.meta?.description || page?.intro || t('staticPages.about.intro'), alternates: page?.alternates || { fa: '/fa/about', en: '/en/about', ru: '/ru/about', ar: '/ar/about' }, jsonLd: createBreadcrumbJsonLd([{ name: t('nav.home'), path: `/${lang}` }, { name: page?.title || t('staticPages.about.title'), path: `/${lang}/about` }]) })

  if (query.error?.status === 404) {
    // The editorial translation remains a valid fallback when the CMS has no page record.
  } else if (query.error) {
    return <main className="container-page py-10"><PageState error={query.error} onRetry={query.refetch} isRetrying={query.isFetching} /></main>
  }

  const title = page?.title || fallback('title')
  const intro = page?.intro || fallback('intro')
  const text = page?.text || fallback('text')
  const facts = [
    { icon: Factory, label: fallback('locationLabel'), value: page?.location || fallback('location') },
    { icon: Ruler, label: fallback('workshopLabel'), value: page?.workshop || fallback('workshop') },
    { icon: Users, label: fallback('teamLabel'), value: page?.team || fallback('team') },
    { icon: MapPin, label: fallback('establishedLabel'), value: page?.established || fallback('established') },
  ]
  const capabilities = page?.capabilities || fallback('capabilities')
  const outsourcing = page?.outsourced || fallback('outsourced')

  return <main className="container-page py-8 md:py-12">
    <nav aria-label={fallback('breadcrumbLabel')} className="mb-8 text-sm text-base-content/60"><ol className="flex flex-wrap items-center gap-2"><li><Link to={`/${lang}`} className="hover:text-primary">{fallback('home')}</Link></li><li aria-hidden="true">/</li><li className="font-semibold text-base-content" aria-current="page">{title}</li></ol></nav>
    <PageState isLoading={query.isPending} skeleton="text" skeletonCount={5}>
      <header className="mb-12 max-w-4xl"><span className="mb-4 block text-xs font-bold uppercase tracking-[.22em] text-secondary">{fallback('eyebrow')}</span><h1 className="text-3xl font-black leading-tight text-primary md:text-5xl">{title}</h1><p className="mt-6 text-lg leading-9 text-base-content/75">{intro}</p></header>
      <section className="mb-14 max-w-4xl"><h2 className="mb-4 text-2xl font-extrabold text-primary">{fallback('storyTitle')}</h2><p className="whitespace-pre-line leading-9 text-base-content/75">{text}</p></section>
      {capabilities?.length > 0 && <section className="mb-14"><h2 className="mb-6 text-2xl font-extrabold text-primary">{fallback('capabilitiesTitle')}</h2><ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{capabilities.map((item, index) => <li key={index} className="flex items-start gap-3 rounded-box border border-base-300 bg-base-100 p-5"><Wrench className="mt-1 shrink-0 text-secondary" size={21}/><span className="leading-8 text-base-content/75">{item}</span></li>)}</ul></section>}
      <section className="mb-14"><h2 className="mb-6 text-2xl font-extrabold text-primary">{fallback('factsTitle')}</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{facts.map(({icon:Icon,label,value}) => <article key={label} className="rounded-box border border-base-300 bg-base-200/40 p-5"><Icon size={25} className="mb-4 text-secondary"/><p className="text-sm text-base-content/60">{label}</p><p className="mt-2 font-bold leading-7 text-primary">{value}</p></article>)}</div></section>
      {outsourcing?.length > 0 && <section className="rounded-box border border-base-300 bg-base-200/50 p-6 md:p-8"><div className="flex items-center gap-3"><Boxes className="text-secondary"/><h2 className="text-xl font-extrabold text-primary">{fallback('outsourcingTitle')}</h2></div><p className="mt-3 leading-8 text-base-content/70">{fallback('outsourcingIntro')}</p><ul className="mt-4 grid gap-3 sm:grid-cols-2">{outsourcing.map((item,index)=><li key={index} className="flex items-start gap-2 leading-8"><span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-secondary"/>{item}</li>)}</ul></section>}
    </PageState>
  </main>
}
