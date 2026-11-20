import { http } from '../../lib/http'
import { apiPath, USE_MOCK } from '../../lib/apiConfig'
import { loadMock, notFound } from '../../mocks/loadMock'

export async function getProduct({ lang = 'fa', slug, signal } = {}) {
  if (USE_MOCK) {
    const records = await loadMock(lang, 'products')
    const record = records.find((item) => item.slug === slug || item.alternates?.[lang] === slug)
    if (!record) throw notFound('Product', slug)
    return record
  }
  return http.get(apiPath(lang, 'products', slug), { signal })
}

export async function getProducts({ lang = 'fa', signal } = {}) {
  if (USE_MOCK) return loadMock(lang, 'products')
  return http.get(apiPath(lang, 'products'), { signal })
}
