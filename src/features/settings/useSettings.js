import { useQuery } from '@tanstack/react-query'
import { getSettings } from './settingsApi'

export function useSettings(lang = 'fa', options = {}) {
  return useQuery({ queryKey: ['settings', lang], queryFn: ({ signal }) => getSettings({ lang, signal }), ...options })
}
