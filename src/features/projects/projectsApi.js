import { http } from '../../lib/http'
import { apiPath, USE_MOCK } from '../../lib/apiConfig'
import { loadMock, notFound } from '../../mocks/loadMock'

export async function getProject({ lang = 'fa', slug, signal } = {}) {
  if (USE_MOCK) {
    const records = await loadMock(lang, 'projects')
    const record = records.find((item) => item.slug === slug || item.alternates?.[lang] === slug)
    if (!record) throw notFound('Project', slug)
    return record
  }
  return http.get(apiPath(lang, 'projects', slug), { signal })
}

export async function getProjects({ lang = 'fa', signal } = {}) {
  if (USE_MOCK) return loadMock(lang, 'projects')
  return http.get(apiPath(lang, 'projects'), { signal })
}
