import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ChevronLeft, ChevronRight, Download, Image as ImageIcon, X } from 'lucide-react'
import PageState from '../components/ui/PageState'
import BrandTriangles from '../components/ui/BrandTriangles'
import NotFound from './NotFound'
import InquiryForm from '../features/inquiries/InquiryForm'
import { useCatalog } from '../features/catalog/useCatalog'
import { useProduct, useProducts } from '../features/products/useProduct'
import { useSetAlternates } from '../lib/useAlternates'
import { createBreadcrumbJsonLd, useSeo } from '../lib/useSeo'

function groupSpecs(specs = []) {
  return specs.reduce((groups, spec) => {
    const group = spec.group || '—'
    if (!groups[group]) groups[group] = []
    groups[group].push(spec)
    return groups
  }, {})
}

function SpecsTable({ specs, title, t }) {
  if (!Array.isArray(specs) || specs.length === 0) return null
  const groups = groupSpecs(specs)
  const showUnit = specs.some((spec) => spec.unit)
  return (
    <section className="mb-14">
      <h2 className="mb-5 text-2xl font-extrabold text-primary md:text-3xl">{title}</h2>
      <div className="space-y-6">
        {Object.entries(groups).map(([group, rows]) => (
          <div key={group}>
            {group !== '—' && <h3 className="mb-3 text-lg font-bold">{group}</h3>}
            <div className="overflow-x-auto rounded-box border border-base-300">
              <table className="table min-w-[480px]">
                <thead><tr><th>{t('productPage.specLabel')}</th><th>{t('productPage.specValue')}</th>{showUnit && <th>{t('productPage.specUnit')}</th>}</tr></thead>
                <tbody>{rows.map((spec, index) => <tr key={`${spec.label}-${index}`}><th className="font-semibold">{spec.label}</th><td>{spec.value ?? '—'}</td>{showUnit && <td>{spec.unit || '—'}</td>}</tr>)}</tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function LazyVideo({ src, poster, title, controls = false }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(controls || typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    if (visible || !ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '160px' })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [visible])
  return <video ref={ref} src={visible ? src : undefined} poster={poster} controls={controls} preload="none" playsInline className="h-full w-full bg-black object-contain" aria-label={title} />
}

function MediaLightbox({ items, index, onClose, onChange, t }) {
  const current = items[index]
  const previous = () => onChange((index - 1 + items.length) % items.length)
  const next = () => onChange((index + 1) % items.length)
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onChange((index - 1 + items.length) % items.length)
      if (event.key === 'ArrowRight') onChange((index + 1) % items.length)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [index, items.length, onClose, onChange])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal="true" aria-label={t('productPage.gallery')} onClick={onClose}>
      <button type="button" className="btn btn-circle btn-ghost absolute end-4 top-4 text-white" onClick={onClose} aria-label={t('productPage.close')}><X /></button>
      {items.length > 1 && <button type="button" className="btn btn-circle btn-ghost absolute start-3 top-1/2 -translate-y-1/2 text-white" onClick={(event) => { event.stopPropagation(); previous() }} aria-label={t('productPage.previousMedia')}><ChevronLeft size={30} /></button>}
      <div className="flex h-full max-h-[85vh] w-full max-w-6xl items-center justify-center" onClick={(event) => event.stopPropagation()}>
        {current.type === 'video'
          ? <LazyVideo src={current.src} poster={current.poster || current.thumbnail} title={current.alt || t('productPage.video')} controls />
          : <img src={current.src} alt={current.alt || ''} className="max-h-full max-w-full object-contain" />}
      </div>
      {current.caption && <p className="absolute bottom-5 text-center text-sm text-white">{current.caption}</p>}
      {items.length > 1 && <button type="button" className="btn btn-circle btn-ghost absolute end-3 top-1/2 -translate-y-1/2 text-white" onClick={(event) => { event.stopPropagation(); next() }} aria-label={t('productPage.nextMedia')}><ChevronRight size={30} /></button>}
    </div>
  )
}

function RelatedCard({ product, lang, t, index = 0 }) {
  return <Link to={`/${lang}/product/${product.slug}`} className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
    <article className="brand-card brand-card-col h-full">
      <BrandTriangles seed={index + 3} zoom={2} className="text-white" />
      <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-1.5 bg-white/10"><span className="block h-full w-1/6 bg-linear-to-r from-secondary to-primary transition-[width] duration-700 ease-out group-hover:w-full" /></span>
      <figure className="h-44 bg-base-200"><img src={product.image || '/images/card-1.webp'} alt={product.name || product.title || ''} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></figure>
      <div className="relative z-10 flex flex-1 flex-col gap-2 p-6"><h3 className="text-lg font-extrabold text-primary">{product.name || product.title}</h3><p className="line-clamp-2 text-sm leading-7 text-white/75">{product.intro || product.text}</p><span className="mt-auto pt-2 text-sm font-bold text-secondary">{t('productPage.viewProduct')} <ArrowRight size={15} className="inline" /></span></div>
    </article>
  </Link>
}

export default function Product() {
  const { lang = 'fa', slug } = useParams()
  const { t } = useTranslation()
  const { data: product, isPending, error, refetch, isFetching } = useProduct(lang, slug)
  const { data: catalog = [] } = useCatalog(lang)
  const { data: allProducts = [] } = useProducts(lang)
  const [selectedModelId, setSelectedModelId] = useState('')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useSetAlternates(product?.alternates)
  useSeo({
    title: error?.status === 404 ? `${t('notFound.title')} | AKAM` : `${product?.meta?.title || product?.name || t('pages.product')} | AKAM`,
    description: error?.status === 404 ? t('notFound.text') : product?.meta?.description || product?.intro || '',
    image: product?.image,
    alternates: error?.status === 404 ? null : product?.alternates,
    jsonLd: product && error?.status !== 404 ? [
      { '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.meta?.description || product.intro, image: product.image ? new URL(product.image, window.location.origin).href : undefined, brand: { '@type': 'Brand', name: 'AKAM Machine' } },
      createBreadcrumbJsonLd([{ name: t('productPage.home'), path: `/${lang}` }, { name: t('productPage.products'), path: `/${lang}/products` }, { name: product.name, path: `/${lang}/product/${slug}` }]),
    ] : null,
  })

  const firstSection = useMemo(() => catalog.find((section) => (product?.section_ids || []).includes(section.id)), [catalog, product])
  const selectedModel = product?.models?.find((model) => String(model.id) === String(selectedModelId)) || product?.models?.[0]
  const media = product?.gallery || []
  const relatedProducts = useMemo(() => {
    if (!product?.related?.length) return []
    return product.related.map((related) => {
      if (typeof related === 'object') return related
      return allProducts.find((item) => item.id === related || item.slug === related || item.alternates?.[lang] === related)
    }).filter((item) => item && item.slug !== product.slug)
  }, [product, allProducts, lang])

  if (error?.status === 404) return <NotFound />

  return (
    <main className="container-page py-8 pb-28 md:py-12 md:pb-32">
      <nav aria-label={t('productPage.breadcrumbLabel')} className="mb-8 text-sm text-base-content/60">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link className="hover:text-primary" to={`/${lang}`}>{t('productPage.home')}</Link></li><li aria-hidden="true">/</li>
          <li><Link className="hover:text-primary" to={`/${lang}/products`}>{t('productPage.products')}</Link></li>
          {firstSection && <><li aria-hidden="true">/</li><li><Link className="hover:text-primary" to={`/${lang}/products/${firstSection.slug}`}>{firstSection.short || firstSection.title}</Link></li></>}
          <li aria-hidden="true">/</li><li className="font-semibold text-base-content" aria-current="page">{product?.name || slug}</li>
        </ol>
      </nav>

      <PageState isLoading={isPending} error={error} isEmpty={!isPending && !error && !product} onRetry={refetch} isRetrying={isFetching} skeleton="text" skeletonCount={6}>
        {product && <>
          <header className="mb-14 grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">{t('productPage.eyebrow')}</span>
                {product.export_only && <span className="badge badge-warning font-bold">{t('productPage.exportBadge')}</span>}
              </div>
              <h1 className="text-3xl font-black leading-tight text-primary md:text-5xl">{product.name}</h1>
              {product.intro && <p className="mt-6 text-lg leading-9 text-base-content/70">{product.intro}</p>}
              {product.export_only && <p className="mt-5 border-s-4 border-secondary ps-4 text-sm leading-8 text-base-content/75">{t('productPage.exportNotice')}</p>}
              <a href="#product-inquiry" className="btn btn-primary mt-8">{t('productPage.requestQuote')}</a>
            </div>
            {product.image && <figure className="overflow-hidden rounded-box border border-base-300 bg-base-200"><img src={product.image} alt={product.name || ''} loading="lazy" className="aspect-[4/3] w-full object-cover" /></figure>}
          </header>

          {product.text && <section className="mb-14 max-w-4xl"><h2 className="mb-4 text-2xl font-extrabold text-primary">{t('productPage.introduction')}</h2><p className="leading-9 text-base-content/75">{product.text}</p></section>}

          {product.applications?.length > 0 && <section className="mb-14"><h2 className="mb-5 text-2xl font-extrabold text-primary">{t('productPage.applications')}</h2><ul className="grid gap-3 sm:grid-cols-2">{product.applications.map((item, index) => <li key={index} className="rounded-box border border-base-300 bg-base-200/50 p-4 leading-7">{item}</li>)}</ul></section>}

          {product.industries?.length > 0 && <section className="mb-14"><h2 className="mb-5 text-2xl font-extrabold text-primary">{t('productPage.industries')}</h2><div className="flex flex-wrap gap-3">{product.industries.map((item, index) => <span key={index} className="badge badge-lg badge-outline border-secondary/50 px-4 py-4">{item}</span>)}</div></section>}

          {product.advantages?.length > 0 && <section className="mb-14"><h2 className="mb-5 text-2xl font-extrabold text-primary">{t('productPage.advantages')}</h2><ul className="grid gap-4 md:grid-cols-2">{product.advantages.map((item, index) => <li key={index} className="flex gap-3 rounded-box bg-base-200/50 p-4 leading-7"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />{item}</li>)}</ul></section>}

          <SpecsTable specs={product.specs} title={t('productPage.specifications')} t={t} />

          {product.models?.length > 0 && <section className="mb-14"><h2 className="mb-5 text-2xl font-extrabold text-primary">{t('productPage.models')}</h2><label className="mb-3 block text-sm font-semibold" htmlFor="product-model-select">{t('productPage.selectModel')}</label><select id="product-model-select" className="select select-bordered mb-6 w-full max-w-md" value={selectedModel?.id ?? ''} onChange={(event) => setSelectedModelId(event.target.value)}>{product.models.map((model) => <option key={model.id} value={model.id}>{model.name}</option>)}</select>{selectedModel?.specs?.length > 0 && <SpecsTable specs={selectedModel.specs} title={selectedModel.name} t={t} />}</section>}

          {media.length > 0 && <section className="mb-14"><h2 className="mb-5 flex items-center gap-2 text-2xl font-extrabold text-primary"><ImageIcon className="text-secondary" />{t('productPage.gallery')}</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{media.map((item, index) => <button type="button" key={`${item.src}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-box border border-base-300 bg-base-200 text-start" onClick={() => setLightboxIndex(index)} aria-label={t('productPage.openMedia', { index: index + 1 })}>{item.type === 'video' ? <><LazyVideo src={item.src} poster={item.poster || item.thumbnail} title={item.alt || t('productPage.video')} /><span className="absolute bottom-3 start-3 badge badge-neutral">{t('productPage.video')}</span></> : <img src={item.src} alt={item.alt || product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}</button>)}</div></section>}

          {product.catalog_file && <section className="mb-14"><a href={typeof product.catalog_file === 'string' ? product.catalog_file : product.catalog_file.src} target="_blank" rel="noreferrer" className="btn btn-outline btn-primary"><Download size={18} />{t('productPage.downloadCatalog')}</a></section>}

          {relatedProducts.length > 0 && <section className="mb-16"><h2 className="mb-6 text-2xl font-extrabold text-primary md:text-3xl">{t('productPage.related')}</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{relatedProducts.map((item, index) => <RelatedCard key={item.id || item.slug} index={index} product={item} lang={lang} t={t} />)}</div></section>}

          <section id="product-inquiry" className="scroll-mt-24"><InquiryForm type={product.export_only ? 'export' : 'quote'} productId={product.id} /></section>
        </>}
      </PageState>

      {product && <a href="#product-inquiry" className="fixed bottom-5 end-5 z-40 btn btn-primary btn-lg shadow-xl">{t('productPage.requestQuote')}</a>}
      {lightboxIndex !== null && <MediaLightbox items={media} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onChange={setLightboxIndex} t={t} />}
    </main>
  )
}
