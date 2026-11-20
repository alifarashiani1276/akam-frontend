import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SAMPLE_POSTS } from '../src/features/blog/samplePosts.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const LANGS = ['fa', 'en', 'ru', 'ar']
const SITE_URL = (process.env.SITE_URL || '').replace(/\/+$/, '')

if (!SITE_URL || !/^https?:\/\//i.test(SITE_URL)) {
  console.error('Set SITE_URL to the deployed site origin, e.g. SITE_URL=https://www.example.com npm run sitemap')
  process.exit(1)
}

async function readMock(lang, name) {
  const content = await readFile(path.join(ROOT, 'src', 'mocks', lang, `${name}.json`), 'utf8')
  return JSON.parse(content)
}

function url(pathname) {
  return new URL(pathname.startsWith('/') ? pathname : `/${pathname}`, `${SITE_URL}/`).href
}

function xmlEscape(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}

const localizedSets = new Map()
function addLocalized(key, lang, pathname) {
  if (!pathname) return
  const set = localizedSets.get(key) || {}
  set[lang] = url(pathname)
  localizedSets.set(key, set)
}

for (const lang of LANGS) {
  for (const page of ['home', 'products', 'about', 'capabilities', 'projects', 'contact', 'blog']) {
    const paths = {
      home: `/${lang}`,
      products: `/${lang}/products`,
      about: `/${lang}/about`,
      capabilities: `/${lang}/capabilities`,
      projects: `/${lang}/projects`,
      contact: `/${lang}/contact`,
      blog: `/${lang}/blog`,
    }
    addLocalized(`static:${page}`, lang, paths[page])
  }

  const [catalog, products, services, projects] = await Promise.all([
    readMock(lang, 'catalog'), readMock(lang, 'products'), readMock(lang, 'services'), readMock(lang, 'projects'),
  ])

  for (const section of catalog) {
    addLocalized(`section:${section.id}`, lang, `/${lang}/products/${section.slug}`)
    for (const sub of section.items || []) {
      addLocalized(`subcategory:${sub.id}`, lang, `/${lang}/products/${section.slug}/${sub.slug}`)
    }
  }
  for (const product of products) addLocalized(`product:${product.id}`, lang, `/${lang}/product/${product.slug}`)
  for (const service of services) addLocalized(`service:${service.id}`, lang, `/${lang}/service/${service.slug}`)
  for (const project of projects) addLocalized(`project:${project.id}`, lang, `/${lang}/projects/${project.slug}`)
  for (const post of SAMPLE_POSTS) addLocalized(`blog:${post.id}`, lang, `/${lang}/blog/${post.slug}`)
}

const entries = [...localizedSets.values()].flatMap((paths) => Object.entries(paths).map(([lang, loc]) => ({ lang, loc, alternates: paths })))
const body = entries.map(({ loc, alternates }) => {
  const links = Object.entries(alternates).map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${xmlEscape(href)}" />`).join('\n')
  const xDefault = alternates.fa ? `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(alternates.fa)}" />` : ''
  return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n${links}${xDefault ? `\n${xDefault}` : ''}\n  </url>`
}).join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`
await mkdir(path.join(ROOT, 'public'), { recursive: true })
await writeFile(path.join(ROOT, 'public', 'sitemap.xml'), sitemap, 'utf8')

const robotsPath = path.join(ROOT, 'public', 'robots.txt')
let robots = await readFile(robotsPath, 'utf8').catch(() => 'User-agent: *\nAllow: /\n')
robots = robots.replace(/^Sitemap:\s*.*\r?\n?/gim, '').trimEnd()
robots += `\nSitemap: ${url('/sitemap.xml')}\n`
await writeFile(robotsPath, robots, 'utf8')
console.log(`Generated ${entries.length} localized sitemap URLs at public/sitemap.xml`)
