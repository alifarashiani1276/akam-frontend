import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import PageState from '../components/ui/PageState'
import { useProjects } from '../features/projects/useProject'
import { useCatalog } from '../features/catalog/useCatalog'
import { useSetAlternates } from '../lib/useAlternates'
import { createBreadcrumbJsonLd, useSeo } from '../lib/useSeo'

const PAGE_SIZE = 6
const PAGE_ALTERNATES = { fa: 'projects', en: 'projects', ru: 'projects', ar: 'projects' }

export default function Projects() {
  const { lang = 'fa' } = useParams()
  const { t } = useTranslation()
  const query = useProjects(lang)
  const { data: catalog = [] } = useCatalog(lang)
  const [section, setSection] = useState('all')
  const [page, setPage] = useState(1)
  useSetAlternates(PAGE_ALTERNATES)
  useSeo({ title: `${t('staticPages.projects.title')} | AKAM`, description: t('staticPages.projects.intro'), alternates: { fa: '/fa/projects', en: '/en/projects', ru: '/ru/projects', ar: '/ar/projects' }, jsonLd: createBreadcrumbJsonLd([{ name: t('staticPages.projects.home'), path: `/${lang}` }, { name: t('staticPages.projects.title'), path: `/${lang}/projects` }]) })
  const projects = useMemo(() => query.data || [], [query.data])
  const filtered = useMemo(() => section === 'all' ? projects : projects.filter((item) => (item.section_ids || []).includes(section)), [projects, section])
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const changeSection = (value) => { setSection(value); setPage(1) }
  const ArrowNext = lang === 'fa' || lang === 'ar' ? ArrowLeft : ArrowRight
  const ArrowPrevious = lang === 'fa' || lang === 'ar' ? ArrowRight : ArrowLeft

  return <main className="container-page py-8 md:py-12">
    <nav aria-label={t('staticPages.projects.breadcrumbLabel')} className="mb-8 text-sm text-base-content/60"><ol className="flex flex-wrap items-center gap-2"><li><Link to={`/${lang}`} className="hover:text-primary">{t('staticPages.projects.home')}</Link></li><li aria-hidden="true">/</li><li className="font-semibold text-base-content" aria-current="page">{t('staticPages.projects.title')}</li></ol></nav>
    <header className="mb-10"><span className="mb-4 block text-xs font-bold uppercase tracking-[.22em] text-secondary">{t('staticPages.projects.eyebrow')}</span><h1 className="text-3xl font-black text-primary md:text-5xl">{t('staticPages.projects.title')}</h1><p className="mt-5 max-w-3xl leading-8 text-base-content/70">{t('staticPages.projects.intro')}</p></header>
    <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label={t('staticPages.projects.filterLabel')}><button type="button" onClick={()=>changeSection('all')} aria-pressed={section==='all'} className={`btn btn-sm ${section==='all'?'btn-primary':'btn-outline'}`}>{t('staticPages.projects.all')}</button>{catalog.map((item)=><button type="button" key={item.id} onClick={()=>changeSection(item.id)} aria-pressed={section===item.id} className={`btn btn-sm ${section===item.id?'btn-primary':'btn-outline'}`}>{item.short || item.title}</button>)}</div>
    <PageState isLoading={query.isPending} error={query.error} isEmpty={!query.isPending && !query.error && visible.length===0} onRetry={query.refetch} isRetrying={query.isFetching} skeleton="cards" skeletonCount={6} emptyTitle={t('staticPages.projects.emptyTitle')} emptyText={t('staticPages.projects.emptyText')}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((project)=><Link key={project.id || project.slug} to={`/${lang}/projects/${project.slug}`} className="group card overflow-hidden border border-base-300 bg-base-100 transition hover:-translate-y-1 hover:shadow-xl">{(project.image || project.thumbnail) && <figure className="aspect-[16/10] overflow-hidden bg-base-200"><img src={project.image || project.thumbnail} alt={project.image_alt || project.title || ''} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/></figure>}<div className="card-body"><h2 className="card-title text-lg text-primary">{project.title || project.name}</h2><p className="text-sm leading-7 text-base-content/65">{project.summary || project.intro || project.text}</p><span className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-primary">{t('staticPages.projects.viewProject')} <ArrowNext size={16}/></span></div></Link>)}</div>
      {pageCount>1 && <nav aria-label={t('staticPages.projects.paginationLabel')} className="mt-10 flex items-center justify-center gap-4"><button type="button" className="btn btn-outline btn-sm" onClick={()=>setPage((n)=>Math.max(1,n-1))} disabled={page===1}><ArrowPrevious size={16}/>{t('staticPages.projects.previous')}</button><span className="text-sm tabular-nums">{t('staticPages.projects.pageOf',{page,total:pageCount})}</span><button type="button" className="btn btn-outline btn-sm" onClick={()=>setPage((n)=>Math.min(pageCount,n+1))} disabled={page===pageCount}>{t('staticPages.projects.next')}<ArrowNext size={16}/></button></nav>}
    </PageState>
  </main>
}
