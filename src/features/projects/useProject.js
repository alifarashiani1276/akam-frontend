import { useQuery } from '@tanstack/react-query'
import { getProject, getProjects } from './projectsApi'

export function useProject(lang = 'fa', slug, options = {}) {
  return useQuery({ queryKey: ['projects', lang, slug], queryFn: ({ signal }) => getProject({ lang, slug, signal }), enabled: Boolean(slug), ...options })
}
export function useProjects(lang = 'fa', options = {}) {
  return useQuery({ queryKey: ['projects', lang], queryFn: ({ signal }) => getProjects({ lang, signal }), ...options })
}
