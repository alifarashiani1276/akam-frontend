export const API_VERSION = 'v1'
// Default to local preview data when no deployment setting is provided.
// Set VITE_USE_MOCK=false only when the Laravel API is ready.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export function apiPath(lang, resource, suffix = '') {
  const code = ['fa', 'en', 'ru', 'ar'].includes(lang) ? lang : 'fa'
  return `${API_VERSION}/${code}/${resource}${suffix ? `/${encodeURIComponent(suffix)}` : ''}`
}
