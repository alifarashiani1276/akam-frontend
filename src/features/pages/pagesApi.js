import { http } from '../../lib/http'
import { apiPath, USE_MOCK } from '../../lib/apiConfig'
import { loadMock, notFound } from '../../mocks/loadMock'

export async function getPage({ lang = 'fa', key, signal } = {}) {
  if (USE_MOCK) {
    const pages = await loadMock(lang, 'pages')
    if (!pages[key]) throw notFound('Page', key)
    return pages[key]
  }
  return http.get(apiPath(lang, 'pages', key), { signal })
}
