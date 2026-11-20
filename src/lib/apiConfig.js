export const API_VERSION = 'v1'
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export function apiPath(lang, resource, suffix = '') {
  const code = ['fa', 'en', 'ru', 'ar'].includes(lang) ? lang : 'fa'
  return `${API_VERSION}/${code}/${resource}${suffix ? `/${encodeURIComponent(suffix)}` : ''}`
}
