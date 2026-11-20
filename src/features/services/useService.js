import { useQuery } from '@tanstack/react-query'
import { getService, getServices } from './servicesApi'

export function useService(lang = 'fa', slug, options = {}) {
  return useQuery({ queryKey: ['services', lang, slug], queryFn: ({ signal }) => getService({ lang, slug, signal }), enabled: Boolean(slug), ...options })
}
export function useServices(lang = 'fa', options = {}) {
  return useQuery({ queryKey: ['services', lang], queryFn: ({ signal }) => getServices({ lang, signal }), ...options })
}
