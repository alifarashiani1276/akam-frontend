import { http } from '../../lib/http'
import { API_VERSION, USE_MOCK } from '../../lib/apiConfig'

const MOCK_DELAY = 450

export async function createInquiry({ lang = 'fa', ...payload } = {}) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
    // Never persist submitted personal data in the mock layer.
    return { accepted: true, mock: true, id: `mock-${Date.now()}`, type: payload.type, lang }
  }
  return http.post(`${API_VERSION}/inquiries`, { ...payload, lang })
}
