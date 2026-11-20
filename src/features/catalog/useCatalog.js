import { useQuery } from '@tanstack/react-query'
import { getCatalog, getSection, getSubcategory } from './catalogApi'

export function useCatalog(lang = 'fa', options = {}) {
  return useQuery({ queryKey: ['catalog', lang], queryFn: ({ signal }) => getCatalog({ lang, signal }), ...options })
}
export function useSection(lang = 'fa', slug, options = {}) {
  return useQuery({ queryKey: ['catalog', lang, 'section', slug], queryFn: ({ signal }) => getSection({ lang, slug, signal }), enabled: Boolean(slug), ...options })
}
export function useSubcategory(lang = 'fa', slug, params = {}, options = {}) {
  return useQuery({ queryKey: ['catalog', lang, 'subcategory', slug, params], queryFn: ({ signal }) => getSubcategory({ lang, slug, ...params, signal }), enabled: Boolean(slug), ...options })
}
