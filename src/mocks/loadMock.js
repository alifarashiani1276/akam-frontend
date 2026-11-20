import { HttpError } from '../lib/http'

export async function loadMock(lang, resource) {
  const language = ['fa', 'en', 'ru', 'ar'].includes(lang) ? lang : 'fa'
  const modules = {
    settings: () => import(`./${language}/settings.json`),
    catalog: () => import(`./${language}/catalog.json`),
    products: () => import(`./${language}/products.json`),
    services: () => import(`./${language}/services.json`),
    projects: () => import(`./${language}/projects.json`),
    pages: () => import(`./${language}/pages.json`),
  }
  if (!modules[resource]) throw new Error(`Unknown mock resource: ${resource}`)
  const module = await modules[resource]()
  return structuredClone(module.default)
}

export function notFound(resource, slug) {
  return new HttpError({ status: 404, message: `${resource} not found: ${slug}` })
}
