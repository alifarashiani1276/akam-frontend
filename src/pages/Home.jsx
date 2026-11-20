import Reveal from '../components/motion/Reveal'
import { HOME_SECTIONS } from '../features/home/sections'
import { createBreadcrumbJsonLd, useSeo } from '../lib/useSeo'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// The sections and their order live in features/home/sections.js.
export default function Home() {
  const { lang = 'fa' } = useParams()
  const { t } = useTranslation()
  useSeo({
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: { fa: '/fa', en: '/en', ru: '/ru', ar: '/ar' },
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'Organization', name: 'AKAM Machine', url: window.location.origin, logo: `${window.location.origin}/logo.svg` },
      createBreadcrumbJsonLd([{ name: t('nav.home'), path: `/${lang}` }]),
    ],
  })
  return (
    <>
      {HOME_SECTIONS.map(({ id, Component, reveal }) =>
        reveal ? (
          <Reveal key={id}>
            <Component />
          </Reveal>
        ) : (
          <Component key={id} />
        ),
      )}
    </>
  )
}
