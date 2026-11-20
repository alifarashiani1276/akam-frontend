import { http } from '../../lib/http'
import { apiPath, USE_MOCK } from '../../lib/apiConfig'
import { loadMock, notFound } from '../../mocks/loadMock'

export async function getCatalog({ lang = 'fa', signal } = {}) {
  if (USE_MOCK) return loadMock(lang, 'catalog')
  return http.get(apiPath(lang, 'catalog'), { signal })
}

export async function getSection({ lang = 'fa', slug, signal } = {}) {
  if (USE_MOCK) {
    const catalog = await loadMock(lang, 'catalog')
    const found = catalog.find((item) => item.slug === slug || item.alternates?.[lang] === slug)
    if (!found) throw notFound('Section', slug)
    return found
  }
  return http.get(apiPath(lang, 'sections', slug), { signal })
}

export async function getSubcategory({ lang = 'fa', slug, page = 1, perPage = 12, signal } = {}) {
  if (USE_MOCK) {
    const [catalog, products, services] = await Promise.all([
      loadMock(lang, 'catalog'), loadMock(lang, 'products'), loadMock(lang, 'services'),
    ])
    const section = catalog.find((entry) => entry.items?.some((item) => item.slug === slug || item.alternates?.[lang] === slug))
    const item = section?.items.find((entry) => entry.slug === slug || entry.alternates?.[lang] === slug)
    if (!item) throw notFound('Subcategory', slug)

    // Associate entries by their own localized slug or explicit subcategory id.
    // Do not list every product in a section under every one of its subcategories.
    const matchingProducts = products.filter((product) =>
      product.subcategory_id === item.id || product.subcategory_ids?.includes(item.id)
    )
    const matchingServices = services.filter((service) =>
      service.subcategory_id === item.id || service.subcategory_ids?.includes(item.id)
    )
    const all = [
      ...matchingProducts.map((entry) => ({ ...entry, _kind: 'product' })),
      ...matchingServices.map((entry) => ({ ...entry, _kind: 'service' })),
    ]
    const start = Math.max(0, (page - 1) * perPage)
    const paged = all.slice(start, start + perPage)
    return {
      ...item,
      section_id: section.id,
      section_slug: section.slug,
      section_title: section.title,
      section_image: section.image,
      products: paged.filter((entry) => entry._kind === 'product').map((entry) => { const copy = { ...entry }; delete copy._kind; return copy }),
      services: paged.filter((entry) => entry._kind === 'service').map((entry) => { const copy = { ...entry }; delete copy._kind; return copy }),
      pagination: { page, per_page: perPage, total: all.length, total_pages: Math.ceil(all.length / perPage) },
    }
  }
  return http.get(apiPath(lang, 'subcategories', slug), { params: { page, per_page: perPage }, signal })
}
