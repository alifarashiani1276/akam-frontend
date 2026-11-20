import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Images, MoveHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import PageState from '../components/ui/PageState'
import BrandTriangles from '../components/ui/BrandTriangles'
import InquiryForm from '../features/inquiries/InquiryForm'
import { useService } from '../features/services/useService'
import { useSetAlternates } from '../lib/useAlternates'
import { createBreadcrumbJsonLd, useSeo } from '../lib/useSeo'
import NotFound from './NotFound'

function BeforeAfterSlider({ item, index, t }) {
  const [position, setPosition] = useState(50)
  const before = item.before || item.before_image
  const after = item.after || item.after_image
  if (!before || !after) return null
  const beforeSrc = typeof before === 'string' ? before : before.src
  const afterSrc = typeof after === 'string' ? after : after.src
  const beforeAlt = item.before_alt || (typeof before === 'object' ? before.alt : '') || t('servicePage.before')
  const afterAlt = item.after_alt || (typeof after === 'object' ? after.alt : '') || t('servicePage.after')

  return (
    <article className="overflow-hidden rounded-box border border-base-300 bg-base-100">
      <div className="relative aspect-[16/9] select-none overflow-hidden bg-base-200" dir="ltr">
        <img src={beforeSrc} alt={beforeAlt} loading="lazy" draggable="false" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
          <img src={afterSrc} alt={afterAlt} loading="lazy" draggable="false" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white shadow" style={{ left: `${position}%` }}>
          <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-lg"><MoveHorizontal size={20} /></span>
        </div>
        <span className="pointer-events-none absolute bottom-3 start-3 rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-white">{t('servicePage.before')}</span>
        <span className="pointer-events-none absolute bottom-3 end-3 rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-white">{t('servicePage.after')}</span>
        <input
          type="range" min="0" max="100" value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label={t('servicePage.comparisonControl', { index: index + 1 })}
          aria-valuetext={`${position}%`}
          className="absolute inset-0 z-20 h-full w-full cursor-ew-resize touch-pan-y opacity-0 focus-visible:opacity-100 focus-visible:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        />
      </div>
      {(item.title || item.caption || item.description) && <div className="p-4">
        {item.title && <h3 className="font-bold text-primary">{item.title}</h3>}
        {(item.caption || item.description) && <p className="mt-1 text-sm leading-7 text-base-content/65">{item.caption || item.description}</p>}
      </div>}
    </article>
  )
}

function ProjectCard({ project, lang, t, index = 0 }) {
  const title = project.title || project.name
  const image = project.image || project.thumbnail
  const slug = project.slug
  const content = <article className="brand-card brand-card-col h-full">
    <BrandTriangles seed={index + 3} zoom={2} className="text-white" />
    <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-1.5 bg-white/10"><span className="block h-full w-1/6 bg-linear-to-r from-secondary to-primary transition-[width] duration-700 ease-out group-hover:w-full" /></span>
    {image && <figure className="aspect-[16/10] overflow-hidden bg-base-200"><img src={image} alt={project.image_alt || title || ''} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></figure>}
    <div className="relative z-10 flex flex-1 flex-col gap-2 p-6">
      {title && <h3 className="text-lg font-extrabold text-primary">{title}</h3>}
      {(project.summary || project.description || project.text) && <p className="text-sm leading-7 text-white/75">{project.summary || project.description || project.text}</p>}
      {slug && <span className="mt-auto pt-2 text-sm font-bold text-secondary">{t('servicePage.viewProject')} <ArrowRight size={15} className="inline" /></span>}
    </div>
  </article>
  return slug
    ? <Link to={`/${lang}/projects/${slug}`} className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{content}</Link>
    : <div className="group h-full">{content}</div>
}

export default function Service() {
  const { lang = 'fa', slug } = useParams()
  const { t } = useTranslation()
  const { data: service, isPending, error, refetch, isFetching } = useService(lang, slug)
  useSetAlternates(service?.alternates)
  useSeo({
    title: error?.status === 404 ? `${t('notFound.title')} | AKAM` : `${service?.meta?.title || service?.title || t('pages.service')} | AKAM`,
    description: error?.status === 404 ? t('notFound.text') : service?.meta?.description || service?.intro || '',
    image: service?.image,
    alternates: error?.status === 404 ? null : service?.alternates,
    jsonLd: service && error?.status !== 404 ? createBreadcrumbJsonLd([{ name: t('servicePage.home'), path: `/${lang}` }, { name: t('servicePage.services'), path: `/${lang}#services` }, { name: service.title, path: `/${lang}/service/${slug}` }]) : null,
  })

  const steps = service?.steps || service?.process || []
  const capabilities = service?.capabilities || []
  const projects = service?.projects || []
  const comparisons = service?.before_after || service?.beforeAfter || []

  if (error?.status === 404) return <NotFound />

  return (
    <main className="container-page py-8 pb-28 md:py-12 md:pb-16">
      <nav aria-label={t('servicePage.breadcrumbLabel')} className="mb-8 text-sm text-base-content/60">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link className="hover:text-primary" to={`/${lang}`}>{t('servicePage.home')}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link className="hover:text-primary" to={`/${lang}#services`}>{t('servicePage.services')}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-base-content" aria-current="page">{service?.title || slug}</li>
        </ol>
      </nav>

      <PageState isLoading={isPending} error={error} isEmpty={!isPending && !error && !service} onRetry={refetch} isRetrying={isFetching} skeleton="text" skeletonCount={6} loader="both" loadingLabel={t('states.loaders.service')}>
        {service && <>
          <header className="mb-14 max-w-4xl">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.22em] text-secondary">{t('servicePage.eyebrow')}</span>
            <h1 className="text-3xl font-black leading-tight text-primary md:text-5xl">{service.title}</h1>
            {service.intro && <p className="mt-6 text-lg leading-9 text-base-content/70">{service.intro}</p>}
          </header>

          {service.description && <section className="mb-14 max-w-4xl">
            <h2 className="mb-4 text-2xl font-extrabold text-primary">{t('servicePage.description')}</h2>
            <p className="whitespace-pre-line leading-9 text-base-content/75">{service.description}</p>
          </section>}

          {service.application_area && <section className="mb-14 rounded-box border border-base-300 bg-base-200/50 p-5 md:p-8">
            <h2 className="mb-4 text-2xl font-extrabold text-primary">{t('servicePage.applicationArea')}</h2>
            <p className="leading-9 text-base-content/75">{service.application_area}</p>
          </section>}

          {steps.length > 0 && <section className="mb-16">
            <h2 className="mb-8 text-2xl font-extrabold text-primary md:text-3xl">{t('servicePage.process')}</h2>
            <ol className="relative grid gap-7 md:grid-cols-2 md:gap-5">
              <span aria-hidden="true" className="absolute bottom-5 start-[19px] top-5 w-px bg-secondary/40 md:hidden" />
              <span aria-hidden="true" className="absolute start-5 end-5 top-5 hidden h-px bg-secondary/40 md:block" />
              {steps.map((step, index) => <li key={`${step.title}-${index}`} className="relative flex gap-4 md:flex-col md:items-start">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-secondary bg-base-100 text-sm font-black text-primary">{index + 1}</span>
                <div className="min-w-0 flex-1 rounded-box border border-base-300 bg-base-100 p-5 md:w-full">
                  {step.title && <h3 className="text-lg font-bold text-primary">{step.title}</h3>}
                  {(step.text || step.description) && <p className="mt-2 leading-8 text-base-content/70">{step.text || step.description}</p>}
                </div>
              </li>)}
            </ol>
          </section>}

          {capabilities.length > 0 && <section className="mb-16">
            <h2 className="mb-6 text-2xl font-extrabold text-primary md:text-3xl">{t('servicePage.capabilities')}</h2>
            <ul className="grid gap-4 md:grid-cols-2">
              {capabilities.map((item, index) => <li key={index} className="flex gap-3 rounded-box bg-base-200/50 p-5 leading-8"><span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />{typeof item === 'string' ? item : <div>{item.title && <h3 className="mb-1 font-bold text-primary">{item.title}</h3>}{item.text || item.description}</div>}</li>)}
            </ul>
          </section>}

          {projects.length > 0 && <section className="mb-16">
            <h2 className="mb-6 text-2xl font-extrabold text-primary md:text-3xl">{t('servicePage.projects')}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{projects.map((project, index) => <ProjectCard key={project.id || project.slug || index} index={index} project={project} lang={lang} t={t} />)}</div>
          </section>}

          {comparisons.length > 0 && <section className="mb-16">
            <h2 className="mb-3 flex items-center gap-2 text-2xl font-extrabold text-primary md:text-3xl"><Images className="text-secondary" />{t('servicePage.beforeAfter')}</h2>
            <p className="mb-6 text-sm leading-7 text-base-content/60">{t('servicePage.sliderHint')}</p>
            <div className="grid gap-5 lg:grid-cols-2">{comparisons.map((item, index) => <BeforeAfterSlider key={item.id || index} item={item} index={index} t={t} />)}</div>
          </section>}

          <section id="service-inquiry" className="scroll-mt-24">
            <InquiryForm type="consultation" serviceId={service.id} />
          </section>
        </>}
      </PageState>
    </main>
  )
}
