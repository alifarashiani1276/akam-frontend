import { http } from '../../lib/http'
import { apiPath, USE_MOCK } from '../../lib/apiConfig'
import { loadMock } from '../../mocks/loadMock'

export async function getSettings({ lang = 'fa', signal } = {}) {
  if (USE_MOCK) return loadMock(lang, 'settings')
  return http.get(apiPath(lang, 'settings'), { signal })
}
