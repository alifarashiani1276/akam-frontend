import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Reveal from '../components/motion/Reveal'
import TextReveal from '../components/motion/TextReveal'
import BrandTriangles from '../components/ui/BrandTriangles'
import PageState from '../components/ui/PageState'
import { useCatalog } from '../features/catalog/useCatalog'
import { useSetAlternates } from '../lib/useAlternates'
import { createBreadcrumbJsonLd, useSeo } from '../lib/useSeo'
import { TRIANGLE_TIP_LEFT, TRIANGLE_TIP_RIGHT } from '../utils/roundedTriangle'

const EASE = [0.22, 1, 0.36, 1]
const VIEW = { once: true, margin: '-80px' }

function Breadcrumb({ lang, t }) {
  return (
    <nav aria-label={t('products.breadcrumbLabel')} className="container-page pt-6 text-sm text-base-content/60">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link className="transition-colors hover:text-primary" to={`/${lang}`}>{t('products.home')}</Link></li>
        <li aria-hidden="true">/</li>
        <li className="font-semibold text-base-content">{t('products.title')}</li>
      </ol>
    </nav>
  )
}

export default function Products() {
  const { lang } = useParams()
  const { t, i18n } = useTranslation()
  const { data, isPending, error, refetch, isFetching } = useCatalog(lang)
  const sections = Array.isArray(data) ? data : data?.data ?? []
  const Arrow = i18n.dir() === 'rtl' ? ArrowUpLeft : ArrowUpRight
  useSetAlternates(null)
  useSeo({ title: `${t('products.title')} | AKAM`, description: t('products.intro'), alternates: { fa: '/fa/products', en: '/en/products', ru: '/ru/products', ar: '/ar/products' }, jsonLd: createBreadcrumbJsonLd([{ name: t('products.home'), path: `/${lang}` }, { name: t('products.title'), path: `/${lang}/products` }]) })

  return (
    <section className="py-8 md:py-12">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="products-tri-rtl" clipPathUnits="objectBoundingBox"><path d={TRIANGLE_TIP_LEFT} /></clipPath>
          <clipPath id="products-tri-ltr" clipPathUnits="objectBoundingBox"><path d={TRIANGLE_TIP_RIGHT} /></clipPath>
        </defs>
      </svg>
      <Breadcrumb lang={lang} t={t} />
      <div className="container-page mb-10 mt-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-secondary">{t('products.eyebrow')}</p>
        <h1 className="text-3xl font-extrabold text-primary md:text-5xl">{t('products.title')}</h1>
        <p className="mt-4 max-w-3xl text-base-content/70 md:text-lg">{t('products.intro')}</p>
      </div>
      <div className="container-page space-y-8">
        <PageState isLoading={isPending} error={error} isEmpty={!isPending && !error && sections.length === 0} onRetry={refetch} isRetrying={isFetching} skeleton="cards" skeletonCount={4}>
          {sections.map((section, index) => (
            <Reveal key={section.id || section.slug}>
              <Link to={`/${lang}/products/${section.slug}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                <article className="brand-card">
                  <BrandTriangles seed={index + 3} className="text-white" />
                  <motion.span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-1.5 origin-left bg-linear-to-r from-secondary to-primary rtl:origin-right" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={VIEW} transition={{ duration: 1.1, delay: 0.15, ease: EASE }} />
                  <div className="relative h-56 w-full overflow-hidden md:m-8 md:h-72 md:w-64 md:shrink-0 md:self-center md:[clip-path:url(#products-tri-ltr)] md:rtl:[clip-path:url(#products-tri-rtl)]">
                    <motion.img src={section.image || '/images/card-1.webp'} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" initial={{ scale: 1.2 }} whileInView={{ scale: 1 }} viewport={VIEW} transition={{ duration: 1.4, ease: EASE }} />
                  </div>
                  <div className="relative z-10 flex-1 p-6 md:p-10">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <TextReveal as="h2" text={section.title || section.short} delay={0.1} className="block text-2xl font-extrabold text-primary md:text-3xl" />
                      {section.export_only && <span className="badge badge-warning font-bold">{t('products.exportBadge')}</span>}
                    </div>
                    <p className="max-w-3xl leading-8 text-white/75">{section.text}</p>
                    {section.export_only && <p className="mt-3 text-sm font-semibold text-secondary">{t('products.exportShort')}</p>}
                    <p className="mt-5 text-sm font-bold text-secondary">{t('products.viewSection')} <Arrow className="inline-block" size={17} aria-hidden="true" /></p>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </PageState>
      </div>
    </section>
  )
}
