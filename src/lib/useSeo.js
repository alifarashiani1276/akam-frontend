import { useEffect, useId, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { DEFAULT_LANG, LANGUAGES } from '../config/languages'
import { SITE } from '../config/site'
import { useAlternates } from './useAlternates'

const OG_LOCALES = { fa: 'fa_IR', en: 'en_US', ru: 'ru_RU', ar: 'ar_AR' }

function absoluteUrl(value, origin) {
  if (!value) return undefined
  try { return new URL(value, origin).href } catch { return undefined }
}

function pagePathForLanguage(currentPath, lang, alternate) {
  if (typeof alternate === 'string' && alternate.startsWith('/')) return alternate
  const parts = currentPath.split('/').filter(Boolean)
  if (parts.length === 0) return `/${lang}`
  parts[0] = lang
  if (typeof alternate === 'string' && alternate) parts[parts.length - 1] = alternate
  return `/${parts.join('/')}`
}

function setMeta(selector, attributes, content) {
  let element = document.head.querySelector(selector)
  if (!content) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('meta')
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setLink(rel, href, hreflang) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`
  let element = document.head.querySelector(selector)
  if (!href) { element?.remove(); return }
  if (!element) {
    element = document.createElement('link')
    element.rel = rel
    if (hreflang) element.hreflang = hreflang
    document.head.appendChild(element)
  }
  element.href = href
}

export function createBreadcrumbJsonLd(items = []) {
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.filter((item) => item?.name).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path, origin) } : {}),
    })),
  }
}

/** Updates document metadata, canonical/hreflang links and optional JSON-LD. */
export function useSeo(options = {}) {
  const { title, description, image, alternates, path, jsonLd } = options
  const location = useLocation()
  const { lang = DEFAULT_LANG } = useParams()
  const contextAlternates = useAlternates()
  const scriptId = `akam-seo-${useId().replace(/:/g, '')}`
  const currentPath = path || location.pathname
  const jsonLdText = jsonLd ? JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : ''
  const jsonLdRef = useRef(jsonLd)
  const languageAlternates = Object.hasOwn(options, 'alternates') ? alternates : contextAlternates

  useEffect(() => {
    jsonLdRef.current = jsonLd
  }, [jsonLd])

  useEffect(() => {
    const origin = window.location.origin
    const canonical = absoluteUrl(currentPath, origin)
    const pageTitle = title || 'AKAM Machine'
    const pageDescription = description || ''
    const imageUrl = absoluteUrl(image || SITE.ogImage || SITE.heroImage, origin)

    document.title = pageTitle
    document.documentElement.lang = lang
    document.documentElement.dir = LANGUAGES[lang]?.dir || 'ltr'
    setMeta('meta[name="description"]', { name: 'description' }, pageDescription)
    setLink('canonical', canonical)

    setMeta('meta[property="og:title"]', { property: 'og:title' }, pageTitle)
    setMeta('meta[property="og:description"]', { property: 'og:description' }, pageDescription)
    setMeta('meta[property="og:locale"]', { property: 'og:locale' }, OG_LOCALES[lang] || OG_LOCALES[DEFAULT_LANG])
    setMeta('meta[property="og:type"]', { property: 'og:type' }, 'website')
    setMeta('meta[property="og:url"]', { property: 'og:url' }, canonical)
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, 'AKAM Machine')
    setMeta('meta[property="og:image"]', { property: 'og:image' }, imageUrl)
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, imageUrl ? 'summary_large_image' : 'summary')
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, pageTitle)
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, pageDescription)
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, imageUrl)

    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((node) => node.remove())
    const entries = Object.entries(languageAlternates || {}).filter(([code, value]) => LANGUAGES[code] && value)
    entries.forEach(([code, value]) => {
      const href = absoluteUrl(pagePathForLanguage(currentPath, code, value), origin)
      if (href) {
        const link = document.createElement('link')
        link.rel = 'alternate'
        link.hreflang = code
        link.href = href
        document.head.appendChild(link)
      }
    })
    const defaultAlternate = languageAlternates?.[DEFAULT_LANG]
    const defaultPath = defaultAlternate
      ? pagePathForLanguage(currentPath, DEFAULT_LANG, defaultAlternate)
      : pagePathForLanguage(currentPath, DEFAULT_LANG)
    const xDefault = document.createElement('link')
    xDefault.rel = 'alternate'
    xDefault.hreflang = 'x-default'
    xDefault.href = absoluteUrl(defaultPath, origin)
    document.head.appendChild(xDefault)

    const script = document.getElementById(scriptId)
    if (jsonLdRef.current) {
      const node = script || document.createElement('script')
      node.id = scriptId
      node.type = 'application/ld+json'
      node.textContent = jsonLdText
      if (!script) document.head.appendChild(node)
    } else {
      script?.remove()
    }

    return () => {
      document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((node) => node.remove())
      document.getElementById(scriptId)?.remove()
    }
  }, [title, description, image, lang, currentPath, languageAlternates, jsonLdText, scriptId])
}
