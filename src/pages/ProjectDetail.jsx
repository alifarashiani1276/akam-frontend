import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, Images } from 'lucide-react'
import PageState from '../components/ui/PageState'
import InquiryForm from '../features/inquiries/InquiryForm'
import { useProject } from '../features/projects/useProject'
import { useProducts } from '../features/products/useProduct'
import { useServices } from '../features/services/useService'
import { useCatalog } from '../features/catalog/useCatalog'
import { useSetAlternates } from '../lib/useAlternates'
import { createBreadcrumbJsonLd, useSeo } from '../lib/useSeo'
import NotFound from './NotFound'

function Comparison({ item, t }) {
  const before = item.before || item.before_image
  const after = item.after || item.after_image
  if (!before || !after) return null
  const beforeSrc = typeof before === 'string' ? before : before.src
  const afterSrc = typeof after === 'string' ? after : after.src
  return <figure className="overflow-hidden rounded-box border border-base-300 bg-base-100"><div className="grid gap-0 sm:grid-cols-2"><div><img src={beforeSrc} alt={item.before_alt || t('staticPages.project.before')} loading="lazy" className="aspect-video w-full object-cover"/><figcaption className="p-3 text-sm font-bold">{t('staticPages.project.before')}</figcaption></div><div><img src={afterSrc} alt={item.after_alt || t('staticPages.project.after')} loading="lazy" className="aspect-video w-full object-cover"/><figcaption className="p-3 text-sm font-bold">{t('staticPages.project.after')}</figcaption></div></div>{item.caption && <p className="px-4 pb-4 text-sm leading-7 text-base-content/65">{item.caption}</p>}</figure>
}

export default function ProjectDetail() {
  const { lang = 'fa', slug } = useParams()
  const { t } = useTranslation()
  const query = useProject(lang, slug)
  const { data: products = [] } = useProducts(lang)
  const { data: services = [] } = useServices(lang)
  const { data: catalog = [] } = useCatalog(lang)
  const project = query.data
  useSetAlternates(project?.alternates)
  useSeo({
    title: query.error?.status === 404 ? `${t('notFound.title')} | AKAM` : `${project?.meta?.title || project?.title || t('pages.project')} | AKAM`,
    description: query.error?.status === 404 ? t('notFound.text') : project?.meta?.description || project?.intro || project?.summary || '',
    image: project?.image || project?.thumbnail,
    alternates: query.error?.status === 404 ? null : project?.alternates,
    jsonLd: project && query.error?.status !== 404 ? createBreadcrumbJsonLd([{ name: t('staticPages.project.home'), path: `/${lang}` }, { name: t('staticPages.project.projects'), path: `/${lang}/projects` }, { name: project.title, path: `/${lang}/projects/${slug}` }]) : null,
  })
  const section = useMemo(() => catalog.find((item)=>(project?.section_ids || []).includes(item.id)), [catalog, project])
  const relatedProduct = useMemo(() => { const value=project?.related_product; if(!value)return null; if(typeof value==='object')return value; return products.find((item)=>item.id===value || item.slug===value) || null }, [project,products])
  const relatedService = useMemo(() => { const value=project?.related_service; if(!value)return null; if(typeof value==='object')return value; return services.find((item)=>item.id===value || item.slug===value) || null }, [project,services])
  const gallery = project?.gallery || []
  const comparisons = project?.before_after || project?.beforeAfter || []
  const technical = project?.technical_info || project?.technical || []
  const operations = project?.operations || project?.operation_details
  const ArrowNext = lang === 'fa' || lang === 'ar' ? ArrowLeft : ArrowRight

  if (query.error?.status === 404) return <NotFound />
  return <main className="container-page py-8 pb-24 md:py-12">
    <nav aria-label={t('staticPages.project.breadcrumbLabel')} className="mb-8 text-sm text-base-content/60"><ol className="flex flex-wrap items-center gap-2"><li><Link to={`/${lang}`} className="hover:text-primary">{t('staticPages.project.home')}</Link></li><li aria-hidden="true">/</li><li><Link to={`/${lang}/projects`} className="hover:text-primary">{t('staticPages.project.projects')}</Link></li>{section && <><li aria-hidden="true">/</li><li>{section.short || section.title}</li></>}<li aria-hidden="true">/</li><li className="font-semibold text-base-content" aria-current="page">{project?.title || slug}</li></ol></nav>
    <PageState isLoading={query.isPending} error={query.error} isEmpty={!query.isPending && !query.error && !project} onRetry={query.refetch} isRetrying={query.isFetching} skeleton="text" skeletonCount={6} loader="both" loadingLabel={t('states.loaders.project')}>
      {project && <>
        <header className="mb-12 grid items-center gap-8 lg:grid-cols-2"> <div><span className="mb-4 block text-xs font-bold uppercase tracking-[.22em] text-secondary">{t('staticPages.project.eyebrow')}</span><h1 className="text-3xl font-black leading-tight text-primary md:text-5xl">{project.title || project.name}</h1>{(project.intro || project.summary) && <p className="mt-6 text-lg leading-9 text-base-content/70">{project.intro || project.summary}</p>}<a href="#project-inquiry" className="btn btn-primary mt-7">{t('staticPages.project.requestQuote')}<ArrowNext size={17}/></a></div>{(project.image || project.thumbnail) && <img src={project.image || project.thumbnail} alt={project.image_alt || project.title || ''} className="aspect-[16/10] w-full rounded-box object-cover"/>}</header>
        {operations && <section className="mb-14 max-w-4xl"><h2 className="mb-4 text-2xl font-extrabold text-primary">{t('staticPages.project.operations')}</h2>{Array.isArray(operations) ? <ol className="space-y-3">{operations.map((item,index)=><li key={index} className="rounded-box bg-base-200/50 p-4 leading-8">{typeof item==='string'?item:item.description || item.title}</li>)}</ol> : <p className="whitespace-pre-line leading-9 text-base-content/75">{operations}</p>}</section>}
        {Array.isArray(technical) && technical.length>0 && <section className="mb-14"><h2 className="mb-5 text-2xl font-extrabold text-primary">{t('staticPages.project.technicalInfo')}</h2><div className="overflow-x-auto rounded-box border border-base-300"><table className="table"><tbody>{technical.map((item,index)=><tr key={index}><th>{item.label || item.name}</th><td>{item.value}{item.unit ? ` ${item.unit}` : ''}</td></tr>)}</tbody></table></div></section>}
        {gallery.length>0 && <section className="mb-14"><h2 className="mb-6 flex items-center gap-2 text-2xl font-extrabold text-primary"><Images className="text-secondary"/>{t('staticPages.project.gallery')}</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{gallery.map((item,index)=>{const src=typeof item==='string'?item:item.src;return <figure key={item.id || src || index} className="overflow-hidden rounded-box bg-base-200"><img src={src} alt={(typeof item==='object' && item.alt) || project.title || ''} loading="lazy" className="aspect-[4/3] w-full object-cover"/>{typeof item==='object' && item.caption && <figcaption className="p-3 text-sm">{item.caption}</figcaption>}</figure>})}</div></section>}
        {comparisons.length>0 && <section className="mb-14"><h2 className="mb-6 text-2xl font-extrabold text-primary">{t('staticPages.project.comparison')}</h2><div className="grid gap-5 lg:grid-cols-2">{comparisons.map((item,index)=><Comparison key={item.id || index} item={item} t={t}/>)}</div></section>}
        {(relatedProduct || relatedService) && <section className="mb-14"><h2 className="mb-5 text-2xl font-extrabold text-primary">{t('staticPages.project.related')}</h2><div className="flex flex-wrap gap-3">{relatedProduct && <Link className="btn btn-outline" to={`/${lang}/product/${relatedProduct.slug}`}>{relatedProduct.name || relatedProduct.title}</Link>}{relatedService && <Link className="btn btn-outline" to={`/${lang}/service/${relatedService.slug}`}>{relatedService.title || relatedService.name}</Link>}</div></section>}
        <section id="project-inquiry" className="scroll-mt-24"><InquiryForm type="quote"/></section>
      </>}
    </PageState>
  </main>
}
