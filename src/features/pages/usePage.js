import { useQuery } from '@tanstack/react-query'
import { getPage } from './pagesApi'

export function usePage(lang = 'fa', key, options = {}) {
  return useQuery({ queryKey: ['pages', lang, key], queryFn: ({ signal }) => getPage({ lang, key, signal }), enabled: Boolean(key), ...options })
}
