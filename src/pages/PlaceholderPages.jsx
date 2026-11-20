import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useLatestPosts } from '../features/blog/useLatestPosts'
import { useSetAlternates } from '../lib/useAlternates'
import { createBreadcrumbJsonLd, useSeo } from '../lib/useSeo'

function Placeholder({ titleKey, seoTitle, seoDescription, seoImage, seoAlternates, seoJsonLd }) {
  const { t } = useTranslation()
  useSetAlternates(seoAlternates || null)
  const route = titleKey === 'pages.blog' || titleKey === 'pages.blogPost' ? 'blog' : 'products'
  useSeo({
    title: seoTitle || `${t(titleKey)} | AKAM`,
    description: seoDescription || t('meta.description'),
    image: seoImage,
    alternates: seoAlternates || { fa: `/fa/${route}`, en: `/en/${route}`, ru: `/ru/${route}`, ar: `/ar/${route}` },
    jsonLd: seoJsonLd || null,
  })
  return (
    <section className="container-page min-h-[45vh] py-20">
      <p className="mb-3 text-sm uppercase tracking-[0.2em] text-primary">AKAM</p>
      <h1 className="text-3xl font-bold md:text-5xl">{t(titleKey)}</h1>
    </section>
  )
}

export function ProductsPage() { return <Placeholder titleKey="pages.products" /> }
export function ProductSectionPage() { return <Placeholder titleKey="pages.productSection" /> }
export function ProductSubcategoryPage() { return <Placeholder titleKey="pages.productSubcategory" /> }
export function ProductPage() { return <Placeholder titleKey="pages.product" /> }
export function ServicePage() { return <Placeholder titleKey="pages.service" /> }
export function AboutPage() { return <Placeholder titleKey="nav.about" /> }
export function CapabilitiesPage() { return <Placeholder titleKey="nav.capabilities" /> }
export function ProjectsPage() { return <Placeholder titleKey="nav.projects" /> }
export function ProjectPage() { return <Placeholder titleKey="pages.project" /> }
export function ContactPage() { return <Placeholder titleKey="nav.contact" /> }
export function BlogList() {
  const { lang = 'fa' } = useParams()
  const { t } = useTranslation()
  return <Placeholder titleKey="pages.blog" seoJsonLd={createBreadcrumbJsonLd([{ name: t('nav.home'), path: `/${lang}` }, { name: t('pages.blog'), path: `/${lang}/blog` }])} />
}
export function BlogPost() {
  const { lang = 'fa', slug } = useParams()
  const { t } = useTranslation()
  const { posts } = useLatestPosts(lang, 50)
  const post = posts.find((item) => item.slug === slug)
  return <Placeholder
    titleKey="pages.blogPost"
    seoTitle={`${post?.title || 'Article'} | AKAM`}
    seoDescription={post?.excerpt || post?.title || ''}
    seoImage={post?.image}
    seoAlternates={{ fa: slug, en: slug, ru: slug, ar: slug }}
    seoJsonLd={createBreadcrumbJsonLd([{ name: t('nav.home'), path: `/${lang}` }, { name: t('pages.blog'), path: `/${lang}/blog` }, { name: post?.title || t('pages.blogPost'), path: `/${lang}/blog/${slug}` }])}
  />
}
