import { http } from '../../lib/http'
import { apiPath, USE_MOCK } from '../../lib/apiConfig'
import { loadMock, notFound } from '../../mocks/loadMock'

export async function getService({ lang = 'fa', slug, signal } = {}) {
  if (USE_MOCK) {
    const records = await loadMock(lang, 'services')
    const record = records.find((item) => item.slug === slug || item.alternates?.[lang] === slug)
    if (!record) throw notFound('Service', slug)
    return record
  }
  return http.get(apiPath(lang, 'services', slug), { signal })
}

export async function getServices({ lang = 'fa', signal } = {}) {
  if (USE_MOCK) return loadMock(lang, 'services')
  return http.get(apiPath(lang, 'services'), { signal })
}
